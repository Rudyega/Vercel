'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CreateCollectionModal from './CreateCollectionModal';


type Props = {
  userId: string;
  username: string;
  email: string;
  image?: string;
};

export function UserHeader({ userId, username, email, image }: Props) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === userId;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        {image ? (
          <img
            src={image}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#f5e1c9] flex items-center justify-center text-2xl font-bold text-[#3a2e1c]">
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">@{username}</h1>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-black font-semibold bg-[#f5e1c9] px-4 py-2 rounded-full hover:bg-[#e9cfae] transition"
          >
            ➕ Создать коллекцию
          </button>
          <Link
            href="/edit-profile"
            className="text-sm text-black font-semibold bg-[#f5e1c9] px-4 py-2 rounded-full hover:bg-[#e9cfae] transition"
          >
            ✏️ Редактировать
          </Link>
        </div>
      )}

      {showModal && (
        <CreateCollectionModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onCreated={() => window.location.reload()} // можно туут сделать router.refresh()
        />
      )}
    </div>
  );
}
