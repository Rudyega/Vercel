'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')

    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push('/login?success=1')
    } else {
      setError(data.error || 'Ошибка регистрации')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-md p-8 bg-white border rounded-xl shadow space-y-4">

        <Link href="/" className="text-sm text-blue-500 hover:underline">
          ← На главную
        </Link>

        <h1 className="text-2xl font-bold">Регистрация</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Имя пользователя"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          className="w-full border p-2 rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-4 rounded"
        >
          Зарегистрироваться
        </button>

        <div className="text-center text-sm text-gray-500">ИЛИ</div>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Войти через Google аккаунт
        </button>
      </div>
    </div>
  )
}
