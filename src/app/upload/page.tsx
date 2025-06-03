"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { BackButton } from "@/components/BackButton";

export default function UploadPage() {
  const { data: session } = useSession();

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Добавьте изображение");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadData.secure_url) {
      alert("Ошибка при загрузке изображения в Cloudinary");
      return;
    }

    const imageUrl = uploadData.secure_url;

    const response = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        imageUrl,
        description,
        userId: session?.user?.id,
      }),
    });

    if (response.ok) {
      alert("Пост успешно создан!");
      setTitle("");
      setFile(null);
      setPreview(null);
    } else {
      alert("Ошибка при создании поста на сервере");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="absolute left-4 top-20 z-10">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-4">Загрузить изображение</h1>
      <div className="flex flex-col gap-4 w-[650px] mx-auto">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
          className={`w-[650px] h-[650px] mx-auto flex items-center justify-center rounded-xl border-2 border-dashed transition ${
            dragActive ? "border-[#3a2e1c]" : "border-[#e0d1bc]"
          } bg-[#f5e1c9] cursor-pointer`}
        >
          {preview ? (
            <Image
              src={preview}
              alt="preview"
              width={500}
              height={450}
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="text-[#5e4a32] text-center">
              Перетащите изображение<br />или нажмите для выбора
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
        </div>

        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(t) => setTitle(t.target.value)}
          className="border px-4 py-2 rounded bg-white border-[#e0d1bc] focus:outline-none"
        />

        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(d) => setDescription(d.target.value)}
          className="border px-4 py-2 rounded bg-white border-[#e0d1bc] focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="self-start px-6 py-2 bg-[#f5e1c9] text-[#3a2e1c] font-medium rounded-full hover:bg-[#e9cfae] transition"
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
}
