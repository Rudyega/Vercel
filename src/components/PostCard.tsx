'use client';
//Посткард для отображения красиво постов в профиле
import Link from "next/link";


type PostCardProps = {
  _id: string;
  imageUrl: string;
  title?: string;
};

export function PostCard({ _id, imageUrl, title }: PostCardProps) {
  return (
    <Link
      href={`/post/${_id}`}
      className="group block relative rounded-xl overflow-hidden shadow-md cursor-pointer"
    >
      <img
        src={imageUrl}
        alt={title || "Пост"}
        className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-80"
      />
    </Link>
  );
}
