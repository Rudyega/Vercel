'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const VKAuthPage = () => {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))

    const accessToken = params.get('access_token')
    const userId = params.get('user_id')

    if (accessToken && userId) {
      fetch('/api/vk/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, userId }),
      })
        .then(() => {
          // После привязки возвращаем на профиль
          router.push('/me') // или '/[username]' если динамический маршрут
        })
        .catch((err) => {
          console.error('Ошибка при сохранении токена VK:', err)
        })
    } else {
      console.warn('Не удалось получить access_token из URL')
    }
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen text-xl text-gray-600">
      Завершается авторизация через VK...
    </div>
  )
}

export default VKAuthPage
