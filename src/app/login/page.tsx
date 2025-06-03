'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

const handleLogin = async () => {
  setError('');

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
    callbackUrl:"/",
  });

  if (res?.ok) {
      router.push("/")
    } else {
      setError("Неверные данные или сервер недоступен")
    }
};

const handleGoogle = () => signIn('google')

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow space-y-4">
      <Link href="/" className="text-sm text-blue-500 hover:underline">
        ← На главную
      </Link>
      <h1 className="text-2xl font-bold mb-2">Вход</h1>
      {error && <p className="text-red-600">{error}</p>}
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
        onChange={(p) => setPassword(p.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black py-2 px-4 rounded"
      >
        Войти
      </button>

      <div className="text-center text-gray-500">или</div>

      <button
        onClick={handleGoogle}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Войти через Google
      </button>
    </div>
  )
}
