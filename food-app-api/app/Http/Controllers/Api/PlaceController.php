<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Place;
use Illuminate\Http\Request;
use App\Models\UserExperience; 

class PlaceController extends Controller
{
    // Hàm này xử lý yêu cầu lưu từ Next.js
    public function store(Request $request){
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



        // 7. Tạo bản ghi trải nghiệm (Experience)
        $place->experience()->create([
            'is_visited'      => $checklist['visited'] ?? true,
            'tried_signature' => $checklist['tried_signature'] ?? false,
            'took_photo'      => $checklist['took_photo'] ?? false,
            'will_return'     => $checklist['will_return'] ?? false,
            
        ]);

        Notification::create([
            'title' => 'Sổ tay vừa dày thêm! ✨',
            'message' => "Bạn vừa lưu thành công quán '{$place->name}' vào danh sách.",
            'type' => 'system',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thêm quán mới vào sổ tay!',
            'id' => $place->id
        ], 201);
    }
    // Hàm hỗ trợ upload ảnh 
    private function uploadService($file){
        if (!$file) return null;
        $path = $file->store('places', 'public');
        return asset('storage/' . $path);
    }
    public function index(Request $request){
        $query = Place::with('experience');

        if ($request->has('vibe')) {
            $vibe = $request->vibe;
            switch ($vibe) {
                case 'deadline':
                    $query->where('vibe_sound', '<=', 30)   
                        ->where('vibe_density', '<=', 40); 
                    break;
                case 'solo':
                    $query->where('vibe_fit', '<=', 30)    
                        ->where('vibe_sound', '<=', 50);
                    break;
                case 'group':
                    $query->where('vibe_fit', '>=', 50  )    
                        ->where('vibe_density', '>=', 50);
                    break;
                case 'quiet':
                    $query->where('vibe_sound', '<=', 20)
                        ->where('vibe_density', '<=', 30);
                    break;
            }
        }
        if ($request->tab == 'wishlist') {
            $query->whereHas('experience', function($q) {
                $q->where('will_return', true);
            });
        }

        // Trả về kết quả
        if ($request->has('vibe')) {
            return response()->json($query->inRandomOrder()->limit(6)->get());
        }

        return response()->json($query->latest()->get());
    }

    public function show($id){
        // Lấy quán ăn kèm theo checklist (experience)
        $place = Place::with('experience')->find($id);

        if (!$place) {
            return response()->json(['message' => 'Không tìm thấy địa điểm'], 404);
        }

        return response()->json($place);
    }

    public function toggleFavorite(Request $request, $id){
        try {
            // 1. Phải tìm Quán đó trước để lấy được Tên quán (cho thông báo)
            $place = Place::findOrFail($id); 

            $isFavorited = $request->will_return; // Lấy trạng thái từ Next.js gửi lên

            // 2. Cập nhật hoặc tạo mới trải nghiệm
            $experience = UserExperience::updateOrCreate(
                ['place_id' => $id],
                [
                    'will_return' => $isFavorited,
                    'is_visited' => true, 
                    'note' => $isFavorited ? "Đã thích vào " . now()->format('d/m/Y') : null
                ]
            );

            // 3. Chỉ tạo thông báo KHI họ nhấn THÍCH (true)
            if ($isFavorited) {
                Notification::create([
                    'title' => 'Món mới vào Wishlist! ❤️',
                    'message' => "Bạn vừa thêm '{$place->name}' vào danh sách quán định quay lại.",
                    'type' => 'reminder',
                ]);
            } else {
                // Tùy chọn: Thông báo khi gỡ khỏi wishlist
                Notification::create([
                    'title' => 'Nhật ký đã cập nhật! ✍️',
                    'message' => "Bạn đã gỡ '{$place->name}' khỏi danh sách yêu thích.",
                    'type' => 'system',
                ]);
            }

            return response()->json(['success' => true, 'data' => $experience]);

        } catch (\Exception $e) {
            \Log::error("Lỗi Favorite: " . $e->getMessage());
            return response()->json(['error' => "Không tìm thấy quán hoặc lỗi server"], 500);
        }
    }

    public function update(Request $request, $id){
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



    public function destroy($id) {
        $place = Place::findOrFail($id); // Tìm không thấy sẽ tự văng 404
        $place->delete();
        return response()->json(['message' => 'Xoá rồi nhé!']);
    }
}