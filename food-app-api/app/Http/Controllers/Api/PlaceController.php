<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;
use App\Models\UserExperience; 

class PlaceController extends Controller
{
    // Hàm này xử lý yêu cầu lưu từ Next.js
    public function store(Request $request)
    {
        // 1. Kiểm tra validation cơ bản
        if (!$request->name || !$request->address) {
            return response()->json(['status' => 'error', 'message' => 'Điền thiếu tên hoặc địa chỉ rồi!'], 400);
        }

        // 2. Tìm quán cũ dựa trên Tên + Địa chỉ (hoặc chỉ cần Địa chỉ + Quận + Thành phố)
        // Mình kiểm tra cả bộ 3: address, district, city để tránh trùng lặp chính xác
        $address  = trim($request->address);
        $district = trim($request->district);
        $city     = trim($request->city);

        // Kiểm tra trùng: Phải khớp cả 3 trường mới coi là trùng
        $exists = Place::where('address', $address)
                        ->where('district', $district)
                        ->where('city', $city)
                        ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Địa chỉ này đã được lưu trong sổ tay rồi!',
            ], 422);
        }

        // 3. Xử lý Checklist (Trải nghiệm)
        $checklist = $request->checklist;
        if (is_string($checklist)) {
            $checklist = json_decode($checklist, true);
        }

        // 4. Xử lý Ảnh
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imageUrl = $this->uploadService($request->file('image'));
        }

        // --- TRƯỜNG HỢP QUÁN MỚI (VƯỢT QUA KIỂM TRA TRÙNG) ---
        // 5. Tạo địa điểm mới
        $place = Place::create([
            'name'          => $request->name,
            'address'       => $request->address,
            'category'      => $request->category,
            'description'   => $request->description,
            'vibe_sound'    => $request->vibe_sound,
            'vibe_density'  => $request->vibe_density,
            'vibe_fit'      => $request->vibe_fit,
            'image_url'     => $imageUrl,
            'opening_hours' => $request->opening_hours,
            'closing_hours' => $request->closing_hours,
            'city'          => $request->city,    
            'district'      => $request->district, 
            'visit_count'   => 1,                                      
        ]);

        // 6. Tạo ghi chú đầu tiên
        if ($request->description) {
            $place->notes()->create(['note' => $request->description]);
        }

        // 7. Tạo bản ghi trải nghiệm (Experience)
        $place->experience()->create([
            'is_visited'      => $checklist['visited'] ?? true,
            'tried_signature' => $checklist['tried_signature'] ?? false,
            'took_photo'      => $checklist['took_photo'] ?? false,
            'will_return'     => $checklist['will_return'] ?? false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm quán mới vào sổ tay!',
            'id' => $place->id
        ], 201);
    }

    // Hàm hỗ trợ upload ảnh (bạn cần bổ sung logic này)
    private function uploadService($file)
    {
        if (!$file) return null;
        $path = $file->store('places', 'public');
        return asset('storage/' . $path);
    }
    // app/Http/Controllers/Api/PlaceController.php
    public function index(Request $request)
    {
        $query = Place::with('experience');

        // Logic lọc theo Mood (Fake AI) dựa trên 3 chỉ số Vibe
        if ($request->has('vibe')) {
            $vibe = $request->vibe;

            switch ($vibe) {
                case 'deadline':
                    // Cần yên tĩnh tuyệt đối và vắng vẻ để tập trung
                    $query->where('vibe_sound', '<=', 30)   // Âm thanh thấp
                        ->where('vibe_density', '<=', 40); // Độ đông đúc thấp
                    break;

                case 'solo':
                    // Đi một mình: Cần không gian nhỏ gọn, không quá ồn
                    $query->where('vibe_fit', '<=', 30)     // Phù hợp đi 1 mình
                        ->where('vibe_sound', '<=', 50);
                    break;

                case 'group':
                    // Rủ thêm bạn bè: Cần không gian rộng, chấp nhận được tiếng ồn
                    $query->where('vibe_fit', '>=', 50  )     // Phù hợp nhóm đông
                        ->where('vibe_density', '>=', 50); // Thường là chỗ nhộn nhịp
                    break;

                case 'quiet':
                    // Cần chỗ chữa lành: Ưu tiên âm thanh cực thấp và vắng khách
                    $query->where('vibe_sound', '<=', 20)
                        ->where('vibe_density', '<=', 30);
                    break;
            }
        }

        // Logic phân tab wishlist của bạn (giữ nguyên)
        if ($request->tab == 'wishlist') {
            $query->whereHas('experience', function($q) {
                $q->where('will_return', true);
            });
        }

        // Trả về kết quả
        // Nếu là AI search thì ưu tiên ngẫu nhiên để đổi mới kết quả mỗi lần quét
        if ($request->has('vibe')) {
            return response()->json($query->inRandomOrder()->limit(6)->get());
        }

        return response()->json($query->latest()->get());
    }
    public function show($id)
    {
        // Lấy quán ăn kèm theo checklist (experience)
        $place = Place::with('experience')->find($id);

        if (!$place) {
            return response()->json(['message' => 'Không tìm thấy địa điểm'], 404);
        }

        return response()->json($place);
    }
    public function toggleFavorite(Request $request, $id)
    {
        try {
            // Log thử xem dữ liệu Next.js gửi lên có đúng không
            \Log::info("Place ID: $id - Status: " . $request->will_return);

            $experience = UserExperience::updateOrCreate(
                ['place_id' => $id], // Điều kiện để tìm bản ghi cũ
                [
                    'will_return' => $request->will_return,
                    'is_visited' => true, // Tự động đánh dấu đã đi khi thích
                    'note' => $request->will_return ? "Đã thích vào " . now()->format('d/m/Y') : null
                ]
            );

            return response()->json(['success' => true, 'data' => $experience]);

        } catch (\Exception $e) {
            // Trả về lỗi chi tiết để bạn nhìn thấy ở tab Network
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
        {
            $place = Place::find($id);
            if (!$place) {
                return response()->json(['message' => 'Không tìm thấy quán'], 404);
            }

            $place->update($request->all());
            if ($request->has('experience')) {
                $expData = $request->input('experience');
                $place->experience()->updateOrCreate(
                    ['place_id' => $id], 
                    [
                        'is_visited'      => (int)($expData['is_visited'] ?? 0),
                        'tried_signature' => (int)($expData['tried_signature'] ?? 0),
                        'took_photo'      => (int)($expData['took_photo'] ?? 0),
                        'will_return'     => (int)($expData['will_return'] ?? 0),
                    ]
                );
            }
            return response()->json([
                'message' => 'Cập nhật thành công',
                'data' => $place->load('experience') 
            ]);
        }
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}