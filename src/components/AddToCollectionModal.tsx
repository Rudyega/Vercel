'use client'

import { useEffect, useState } from 'react'

type Collection = {
  _id: string
  name: string
}

type Props = {
  postId: string
  userId: string
  onClose: () => void
}

export default function AddToCollectionModal({ postId, onClose, userId }: Props) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/collections/user/${userId}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.collections) setCollections(data.collections)
      } catch (err) {
        console.error('Ошибка загрузки коллекций:', err)
      }
    }

    if (userId) loadCollections()
  }, [userId])

  const handleAdd = async (collectionId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/collections/${collectionId}/add`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      })
      if (!res.ok) throw new Error('Ошибка добавления в коллекцию')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newName,
          userId, 
        }),
      })
      const data = await res.json()
      if (!data._id) throw new Error('Коллекция не создана')

      await handleAdd(data._id)
    } catch (err) {
      console.error('Ошибка создания коллекции:', err)
    } finally {
      setNewName('')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[350px]">
        <h2 className="text-lg font-semibold mb-4">Добавить в коллекцию</h2>

        <div className="space-y-2 max-h-[200px] overflow-y-auto mb-4">
          {collections.length === 0 && (
            <p className="text-sm text-gray-500">У вас пока нет коллекций</p>
          )}
          {collections.map((col) => (
            <button
              key={col._id}
              disabled={loading}
              onClick={() => handleAdd(col._id)}
              className="w-full px-4 py-2 text-left border rounded hover:bg-[#f5e1c9] transition"
            >
              {col.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Новая коллекция"
          className="w-full px-3 py-2 border rounded mb-2"
        />

        <button
          disabled={loading}
          onClick={handleCreate}
          className="w-full bg-[#f5e1c9] hover:bg-[#e9cfae] text-[#3a2e1c] py-2 rounded font-medium"
        >
          Создать и добавить
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:underline w-full"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
