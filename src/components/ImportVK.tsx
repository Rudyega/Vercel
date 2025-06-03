'use client'

import { useRouter } from 'next/navigation'

const ImportVK = () => {
  const VK_CLIENT_ID = '53685297'
  const REDIRECT_URI = 'https://vercel-flax-delta.vercel.app/vk-auth' // продверсия позже

  const handleClick = () => {
    const url = `https://oauth.vk.com/authorize?client_id=${VK_CLIENT_ID}&display=page&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=photos,offline&response_type=token&v=5.131`

    window.location.href = url
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition"
    >
      Добавить из VK
    </button>
  )
}

export default ImportVK
