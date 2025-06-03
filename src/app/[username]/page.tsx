import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { BackButton } from "@/components/BackButton";
import { UserHeader } from "@/components/UserHeader";
import ImportVK from '@/components/ImportVK'

type Post = {
  _id: string;
  title: string;
  imageUrl: string;
};

type User = {
  _id: string;
  username: string;
  email: string;
  image?: string;
};

type Collection = {
  _id: string;
  name: string;
  postIds: Post[];
};

type Props = {
  params: { username: string };
};

export default async function UserPage({ params }: Props) {
  const res = await fetch(`http://localhost:5000/api/users/${params.username}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const { user, posts, collections }: { user: User; posts: Post[]; collections: Collection[] } = await res.json();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="absolute left-4 top-4 z-10">
                  <BackButton />
                </div>
      <UserHeader
      userId={user._id}
      username={user.username}
      email={user.email}
      image={user.image}
      />
      <ImportVK />
  {collections.length > 0 && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">Коллекции</h2>
    <div className="flex flex-wrap gap-4">
      {collections.map((col) => (
        <Link
          key={col._id}
          href={`/${user.username}/${encodeURIComponent(col.name)}`}
          className="bg-[#f5e1c9] px-4 py-2 rounded-lg text-[#3a2e1c] hover:bg-[#e9cfae] transition"
        >
          {col.name}
        </Link>
      ))}
    </div>
  </div>
)}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post._id} _id={post._id} imageUrl={post.imageUrl} title={post.title} />
        ))}
      </div>
    </div>
  );
}
