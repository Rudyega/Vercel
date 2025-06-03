'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyComponent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const params = useSearchParams();
  const token = params.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      {status === 'loading' && (
        <div className="text-gray-500 animate-pulse">Проверка токена...</div>
      )}

      {status === 'success' && (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-green-600">Email подтверждён ✅</h1>
          <p className="text-gray-600 mb-4">Теперь вы можете войти в аккаунт.</p>
          <Link
            href="/login"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-4 rounded"
          >
            Перейти к входу
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Ошибка ❌</h1>
          <p className="text-gray-600 mb-4">
            Невозможно подтвердить email. Возможно, ссылка устарела.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
          >
            Вернуться на главную
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Загрузка...</div>}>
      <VerifyComponent />
    </Suspense>
  );
}
