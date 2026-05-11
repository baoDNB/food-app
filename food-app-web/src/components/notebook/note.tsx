"use client";

import { useState } from 'react';
import { StickyNote, Plus, Trash2, Send } from "lucide-react";

export default function QuickNotesPage() {
    const [notes, setNotes] = useState<{id: number, text: string, color: string}[]>([]);
    const [input, setInput] = useState("");

    const colors = ["bg-yellow-100", "bg-blue-100", "bg-pink-100", "bg-green-100", "bg-purple-100"];

    const addNote = () => {
        if (!input.trim()) return;
        const newNote = {
            id: Date.now(),
            text: input,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        setNotes([newNote, ...notes]);
        setInput("");
    };

    const deleteNote = (id: number) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-black text-zinc-800 flex items-center gap-3">
                        <StickyNote className="text-orange-500" size={32} />
                        Quick Notes
                    </h1>
                    <p className="text-zinc-800">Lưu nhanh những quán bạn vừa nghe tên</p>
                </div>
            </div>

            {/* Thanh nhập ghi chú */}
            <div className="relative mb-12">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Tên quán, địa chỉ hoặc món ăn..."
                    className="w-full p-6 pr-16 bg-white border-2 border-orange-100 rounded-3xl shadow-sm focus:outline-none focus:border-orange-400 font-medium"
                />
                <button 
                    onClick={addNote}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center hover:bg-orange-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Danh sách Note dạng lưới */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {notes.map((note) => (
                    <div 
                        key={note.id} 
                        className={`${note.color} p-6 rounded-br-[3rem] shadow-md relative group hover:-rotate-1 transition-transform`}
                    >
                        <button 
                            onClick={() => deleteNote(note.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            <Trash2 size={14} />
                        </button>
                        <p className="font-['Caveat',cursive] text-2xl text-zinc-800 leading-tight">
                            {note.text}
                        </p>
                    </div>
                ))}

                {notes.length === 0 && (
                    <div className="col-span-full py-20 text-center border-4 border-dashed border-zinc-100 rounded-[3rem]">
                        <p className="text-zinc-600 font-bold">Chưa có ghi chú nào...</p>
                    </div>
                )}
            </div>
        </main>
    );
}