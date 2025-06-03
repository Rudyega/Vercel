'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CherryIcon } from "lucide-react";
import AddToCollectionModal from "@/components/AddToCollectionModal";
import { useSession } from "next-auth/react";

type ImageCardProps = {
  url: string;
  id: string;
};

export function ImageCard({ url, id }: ImageCardProps) {
  const isAnimated = url.endsWith(".gif") || url.endsWith(".webp");

  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative group">
      <Link
        href={`/post/${id}`}
        className="block rounded-2xl overflow-hidden cursor-pointer"
      >
        <Image
          src={url}
          alt="post"
          width={600}
          height={400}
          className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-80"
          unoptimized={isAnimated}
        />
        {/* Затемнение */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
      </Link>

      {/* Вишенка */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-100 transition-opacity opacity-0 group-hover:opacity-100 z-10"
      >
        <CherryIcon className="text-red-500 w-5 h-5" />
      </button>
      {showModal && (
        <AddToCollectionModal
          postId={id}
          userId={userId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
