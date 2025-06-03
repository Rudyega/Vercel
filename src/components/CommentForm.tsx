'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function CommentForm({ postId }: { postId: string }) {

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // эт важно
        body: JSON.stringify({ postId, text, userId }),
      });

      if (res.ok) {
        setText('');
        router.refresh(); //Обновит серверный компонент и список комментариев
      } else {
        console.error("Ошибка при отправке комментария:", await res.text());
      }
    } catch (err) {
      console.error("Ошибка сети при отправке комментария:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <textarea
        name="text"
        required
        placeholder="Оставьте комментарий..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded-md resize-none text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="self-end bg-[#5e4a32] text-white px-4 py-1 rounded-md hover:bg-[#4b3b27]"
      >
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}
