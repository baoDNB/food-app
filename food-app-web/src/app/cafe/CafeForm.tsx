'use client';

import React, { useState, useEffect } from 'react';

interface CafeFormProps {
    initialData?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CafeForm({ initialData, onClose, onSuccess }: CafeFormProps) {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || "");

    // Khởi tạo formData từ initialData truyền xuống
    const getInitialCategories = () => {
        if (!initialData?.category) return [];
        if (Array.isArray(initialData.category)) return initialData.category;
        if (typeof initialData.category === 'string') {
            return initialData.category.split(',').filter(Boolean);
        }
        return [];
    };
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        address: initialData?.address || "",
        description: initialData?.description || "",
        opening_hours: initialData?.opening_hours || "08:00",
        closing_hours: initialData?.closing_hours || "22:00",
        vibe_sound: initialData?.vibe_sound || 50,
        vibe_density: initialData?.vibe_density || 50,
        vibe_fit: initialData?.vibe_fit || 50,
        category: getInitialCategories(),
    });

    const [checklist, setChecklist] = useState({
        is_visited: !!initialData?.experience?.is_visited,
        tried_signature: !!initialData?.experience?.tried_signature,
        took_photo: !!initialData?.experience?.took_photo,
        will_return: !!initialData?.experience?.will_return,
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChecklistChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const payload = {
                ...formData,
                category: formData.category.join(','),
                experience: {
                    is_visited: checklist.is_visited ? 1 : 0,
                    tried_signature: checklist.tried_signature ? 1 : 0,
                    took_photo: checklist.took_photo ? 1 : 0,
                    will_return: checklist.will_return ? 1 : 0,
                },
                _method: 'PUT'
            };
            // Sử dụng Method Spoofing cho Laravel (_method: 'PUT')
            const res = await fetch(`${apiUrl}/api/places/${initialData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    category: formData.category.join(','),
                    _method: 'PUT'
                }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const err = await res.json();
                alert("Lỗi: " + (err.message || "Không thể lưu"));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CỘT TRÁI: Ảnh và thông tin cơ bản */}
            <div className="lg:col-span-5 space-y-6">
                <div className="relative bg-white p-3 shadow-sm rounded-2xl rotate-1 border-2 border-dashed border-[#e1bfb5] overflow-hidden">
                    <div className="aspect-[4/5] bg-[#fbf2ed] flex flex-col items-center justify-center rounded-xl overflow-hidden relative">
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <span className="material-symbols-outlined text-4xl text-[#e1bfb5]">add_a_photo</span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tên quán..."
                        className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35] font-bold"
                    />
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ..."
                        className="w-full bg-[#fbf2ed] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm"
                    />

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Mở cửa</label>
                        <input
                            type="time"
                            name="opening_hours"
                            value={formData.opening_hours}
                            onChange={handleInputChange}
                            className="w-full bg-[#fbf2ed] rounded-xl p-3 outline-none text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Đóng cửa</label>
                        <input
                            type="time"
                            name="closing_hours"
                            value={formData.closing_hours}
                            onChange={handleInputChange}
                            className="w-full bg-[#fbf2ed] rounded-xl p-3 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: Checklist & Vibe (Style giấy tập) */}
            <div className="lg:col-span-7 space-y-8 p-1 rounded-2xl" style={{ backgroundImage: 'radial-gradient(#d1cfcd 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

                {/* Checklist */}
                <section>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#ab3500]">
                        <span className="material-symbols-outlined">task_alt</span> Trải nghiệm
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.keys(checklist).map((key) => (
                            <label key={key} className="flex items-center gap-3 p-3 bg-white/80 border border-[#efe6e2] rounded-xl cursor-pointer hover:bg-white transition-all">
                                <input
                                    type="checkbox"
                                    checked={checklist[key as keyof typeof checklist]}
                                    onChange={() => handleChecklistChange(key as keyof typeof checklist)}
                                    className="w-4 h-4 accent-[#ab3500]"
                                />
                                <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Vibe Scales */}
                <section className="space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-[#ab3500]">
                        <span className="material-symbols-outlined">tune</span> Không gian
                    </h2>
                    {[
                        { id: 'vibe_sound', left: 'Yên tĩnh', right: 'Ồn ào' },
                        { id: 'vibe_density', left: 'Thoáng', right: 'Đông đúc' },
                        { id: 'vibe_fit', left: 'Cá nhân', right: 'Đi nhóm' }
                    ].map((scale) => (
                        <div key={scale.id}>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                                <span>{scale.left}</span>
                                <span>{scale.right}</span>
                            </div>
                            <input
                                name={scale.id}
                                type="range"
                                min="0"
                                max="100"
                                value={formData[scale.id as keyof typeof formData] as number}
                                onChange={handleInputChange}
                                className="w-full h-1.5 bg-[#e9e1dc] rounded-lg appearance-none accent-[#ab3500] cursor-pointer"
                            />
                        </div>
                    ))}
                </section>

                {/* Description */}
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ghi chú thêm về cảm nhận của bạn..."
                    className="w-full bg-[#fbf2ed] p-4 rounded-xl outline-none text-sm border-l-4 border-[#ab3500]"
                />

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 bg-[#ab3500] text-white rounded-xl font-bold shadow-lg hover:bg-[#8e2c00] transition-all disabled:bg-gray-300"
                    >
                        {loading ? "Đang lưu..." : "Cập nhật thay đổi"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-gray-400 font-bold hover:text-black transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}