'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddNewPlacePage() {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Hàm tiện ích để hiện và tự ẩn thông báo
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // Tự ẩn sau 3 giây
    };
    const router = useRouter();
    const [menuFile, setMenuFile] = useState<File | null>(null);
    // 1. Quản lý trạng thái Form
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        category: [] as string[],
        vibe_sound: 50,
        vibe_density: 50,
        vibe_fit: 50,
        description: '',
        opening_hours: '08:00',
        closing_hours: '22:00',
    });
    const categoryOptions = [
        { label: 'Chill một mình', icon: '🍃' },
        { label: 'Hẹn hò', icon: '❤️' },
        { label: 'Sống ảo', icon: '📸' },
        { label: 'Tụ tập bạn bè', icon: '🍻' },
        { label: 'Học bài', icon: '📚' },
    ];
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/').then(res => setProvinces(res.data));
    }, []);
    const [checklist, setChecklist] = useState({
        visited: false,
        tried_signature: false,
        took_photo: false,
        will_return: false,
    });

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    // 2. Xử lý thay đổi Input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChecklistChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setSelectedProvince(code);
        setSelectedDistrict(''); // Reset quận khi đổi tỉnh
        axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
            .then(res => setDistricts(res.data.districts));
    };
    const toggleCategory = (cat: string) => {
        setFormData(prev => ({
            ...prev,
            category: prev.category.includes(cat)
                ? prev.category.filter(c => c !== cat)
                : [...prev.category, cat]
        }));
    };
    const handleSubmit = async (e: React.MouseEvent | React.FormEvent) => {
        e.preventDefault();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            showToast("Lỗi: NEXT_PUBLIC_API_URL chưa được thiết lập!", "error");
            return;
        }

        const provinceName = provinces.find(p => String(p.code) === String(selectedProvince))?.name || "";
        const districtName = districts.find(d => String(d.code) === String(selectedDistrict))?.name || "";

        setLoading(true);
        const data = new FormData();
        data.append('city', provinceName);
        data.append('district', districtName);

        // 2. TÁCH CATEGORY RA KHỎI VÒNG LẶP
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'category') {
                data.append(key, value.toString());
            }
        });

        data.append('category', JSON.stringify(formData.category));
        data.append('checklist', JSON.stringify(checklist));
        data.append('tags', JSON.stringify(selectedTags));

        if (imageFile) {
            data.append('image', imageFile);
        }

        // ... phần fetch giữ nguyên ...

        try {
            const res = await fetch(`${apiUrl}/api/places`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // Lưu ý: KHÔNG set 'Content-Type' khi dùng FormData, trình duyệt sẽ tự tạo boundary
                },
                body: data,
            });

            const responseData = await res.json();

            if (res.ok) {
                showToast("Đã lưu vào sổ tay thành công!", "success");
                router.push(`/cafe/${responseData.id || ''}`);
                router.refresh();
            } else {
                console.error("Server Error:", responseData);
                const errorMessage = responseData.message || JSON.stringify(responseData.errors);
                showToast(`Lỗi từ Server: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            showToast("Không thể kết nối đến Server. Hãy kiểm tra xem Laravel đã chạy (php artisan serve) chưa.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fff8f5] min-h-screen font-['Be_Vietnam_Pro'] text-[#1e1b18] pb-20">
            <main className="pt-16 pb-20">
                <div className="max-w-7xl mx-auto px-4">

                    <div className="mb-10">
                        <span className="inline-block bg-[#7fa55d] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 -rotate-3 shadow-sm">
                            New Entry
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1e1b18] mb-2">Hôm nay ăn gì?</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        <div className="lg:col-span-5 space-y-6">
                            <div
                                className="relative bg-white p-4 shadow-sm rounded-2xl rotate-1 border-2 border-dashed border-[#e1bfb5] cursor-pointer hover:border-[#ab3500] transition-all overflow-hidden"
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <div className="aspect-[4/5] bg-[#fbf2ed] flex flex-col items-center justify-center rounded-xl overflow-hidden relative">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-5xl text-[#e1bfb5] mb-4">add_a_photo</span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#594139]">Tap to add image</span>
                                        </>
                                    )}
                                </div>
                                <input id="fileInput" type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Shop Name"
                                    className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35]"
                                />
                                <div className="flex flex-wrap gap-2 py-2">
                                    {categoryOptions.map((item) => (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() => toggleCategory(item.label)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${formData.category.includes(item.label)
                                                ? 'bg-[#ab3500] text-white shadow-md scale-105'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none"
                                        onChange={handleProvinceChange}
                                        value={selectedProvince}
                                    >
                                        <option value="">Chọn Tỉnh/TP</option>
                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>
                                    <select
                                        className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none"
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                    </select>
                                </div>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Thông tin chi tiết (địa chỉ, đường đi,...)"
                                    className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35]"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Giờ mở cửa</label>
                                        <input
                                            type="time"
                                            name="opening_hours"
                                            value={formData.opening_hours}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Giờ đóng cửa</label>
                                        <input
                                            type="time"
                                            name="closing_hours"
                                            value={formData.closing_hours}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35]"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-sm relative" style={{ backgroundImage: 'radial-gradient(#d1cfcd 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#456827]">task_alt</span> Experience Checklist
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.keys(checklist).map((key) => (
                                        <label key={key} className="flex items-center gap-3 p-4 bg-[#efe6e2]/80 rounded-2xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checklist[key as keyof typeof checklist]}
                                                onChange={() => handleChecklistChange(key as keyof typeof checklist)}
                                                className="w-5 h-5 text-[#456827] accent-[#456827]"
                                            />
                                            <span className="capitalize">{key.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#615e54]">tune</span> Vibe Scales
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        { id: 'vibe_sound', left: 'Quiet', right: 'Noisy' },
                                        { id: 'vibe_density', left: 'Chill', right: 'Crowded' },
                                        { id: 'vibe_fit', left: 'Individual', right: 'Group' }
                                    ].map((scale) => (
                                        <div key={scale.id}>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span>{scale.left}</span>
                                                <span>{scale.right}</span>
                                            </div>
                                            <input
                                                name={scale.id}
                                                type="range"
                                                onChange={handleInputChange}
                                                className="w-full h-2 bg-[#e9e1dc] rounded-lg appearance-none accent-[#ab3500]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Write down your thoughts..."
                                className="w-full bg-[#fbf2ed] p-6 rounded-2xl outline-none mb-8"
                            />

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-10 py-4 bg-[#ab3500] text-white rounded-xl font-bold shadow-lg disabled:bg-gray-400 hover:bg-[#8e2c00] transition-colors"
                                >
                                    {loading ? "Saving..." : "Save to Notebook"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-10 py-4 text-gray-500 font-bold hover:text-black transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            {toast && (
                <div className={`fixed bottom-10 left-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 animate-bounce-in-left ${toast.type === 'success' ? 'bg-[#456827] text-white' :
                        toast.type === 'error' ? 'bg-[#ab3500] text-white' :
                            'bg-[#f4a261] text-white'
                    }`}>
                    <span className="material-symbols-outlined">
                        {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'warning'}
                    </span>
                    <p className="font-bold text-sm">{toast.message}</p>
                    <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}
        </div>
    );
}