'use client';

import { useState } from 'react';

type Props = {
  userId: string;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateCollectionModal({ userId, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, userId }),
      });

      if (res.ok) {
        onCreated?.();
        onClose();
      } else {
        alert("Ошибка при создании коллекции");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-[#3a2e1c]">Новая коллекция</h2>
        <input
          type="text"
          placeholder="Название коллекции"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#e0d1bc] p-2 rounded mb-4 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Отмена
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#f5e1c9] hover:bg-[#e9cfae] text-[#3a2e1c] font-medium text-sm"
          >
            {loading ? "Создание..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
