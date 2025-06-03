import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import {CommentForm} from "@/components/CommentForm";
import type { Metadata } from "next";
import {LikeButton} from '@/components/LikeButton';



type Post = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId?: {
    username?: string;
    name?: string;
  };
  likes?: string[];
  comments?: Comment[];
};

type Comment = {
  _id: string;
  text: string;
  userId?: {
    username?: string;
    name?: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Просмотр поста" };
}


export default async function PostPage({ params }: { params: { id: string | number } }) {
  const id = params.id.toString(); // на всякий случай
  const post = await getPost(id);
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute right-315 top-4 z-10">
          <BackButton />
        </div>

        <div className="flex justify-start">
          <div className="relative">
            <div className="inline-block">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="rounded-2xl max-h-[200vh] max-w-[700px] object-contain"
              />
            </div>

            <div className="absolute top-0 left-full ml-6 h-full w-[450px] bg-white border-4 border-[#f5e1c9] rounded-2xl shadow-md p-6 flex flex-col">
  {/* Верхняя часть*/}
  <div className="mb-4">
    <h1 className="text-xl font-bold mb-2 break-words max-h-[120px] overflow-y-auto">
      {post.title}
    </h1>
    <p className="text-sm text-[#5e4a32] mb-2 break-words max-h-[120px] overflow-y-auto">
      {post.description}
    </p>
    <p className="text-sm text-[#5e4a32] font-medium">
      Автор: {post.userId?.username || post.userId?.name || "Анонимус"}
    </p>
  </div>

  <LikeButton
  postId={post._id}
  initialLikes={post.likes?.map((id: string) => id.toString()) ?? []}
/>

  {/* комментарии */}
  <div className="flex-1 overflow-y-auto pr-2">
    <p className="text-sm mb-2">💬 Комментарии:</p>

    <div className="flex flex-col gap-2 mb-4">
      {(post.comments ?? []).map((comment) => (
        <div key={comment._id} className="bg-white rounded-lg p-2 shadow-sm">
          <p className="font-semibold text-sm">
            {comment.userId?.username || comment.userId?.name || "Аноним"}:
          </p>
          <p className="text-sm">{comment.text}</p>
        </div>
      ))}
    </div>

    <CommentForm postId={post._id} />
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
