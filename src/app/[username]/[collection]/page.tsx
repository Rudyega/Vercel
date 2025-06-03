import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";


type Post = {
  _id: string;
  title: string;
  imageUrl: string;
};

type Collection = {
  _id: string;
  name: string;
  postIds: Post[];
};

type Props = {
  params: {
    username: string;
    collection: string;
  };
};

export default async function CollectionPage({ params }: Props) {
  const res = await fetch(`http://localhost:5000/api/collections/username/${params.username}/${params.collection}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const collection: Collection = await res.json();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Коллекция: {collection.name}</h1>
        <Link
          href={`/upload?collectionId=${collection._id}&collectionName=${encodeURIComponent(collection.name)}&username=${params.username}`}
          className="bg-yellow-400 hover:bg-yellow-300 text-white rounded-full p-2 shadow transition-colors"
          title="Добавить пост в коллекцию"
        >
        <Plus className="w-5 h-5" />
        </Link>
      </div>

      {collection.postIds.length === 0 ? (
        <p className="text-gray-500">В этой коллекции пока нет изображений.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collection.postIds.map((post) => (
            <Link href={`/post/${post._id}`} key={post._id} className="group">
              <div className="rounded-lg overflow-hidden shadow">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover w-full h-40 group-hover:opacity-80 transition"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
