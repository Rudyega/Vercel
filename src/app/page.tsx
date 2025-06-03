"use client";

import { useEffect, useState } from "react";
import { ImageCard } from "@/components/ImageCard";
import ImportVK from '@/components/ImportVK'


type Post = {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  userId?: {
    username?: string; // для npm run build
    name?:string;
  };
};



export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="p-6">
        <ImportVK />
        <h1 className="text-3xl font-bold text-[#3a2e1c] mb-6">
          Лента изображений
        </h1>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {posts.map((post) => (
            <ImageCard
              key={post._id}
              id={post._id}
              url={post.imageUrl} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}
