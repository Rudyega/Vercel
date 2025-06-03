"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-3xl text-[#3a2e1c] hover:opacity-60 transition w-fit mb-4"
    >
      ←
    </button>
  );
}