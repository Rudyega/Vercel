'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

type Props = {
  postId: string;
  initialLikes: string[];
};

export function LikeButton({ postId, initialLikes }: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const hasLiked = userId ? likes.includes(userId) : false;

  const toggleLike = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    setLikes(data.likes.map((id: string) => id.toString())); // нормализуем
  };

  return (
    <button onClick={toggleLike} className="flex items-center gap-1 text-red-500 text-xl">
      {hasLiked ? <FaHeart /> : <FaRegHeart />}
      <span className="text-sm">{likes.length}</span>
    </button>
  );
}
