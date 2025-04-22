'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client' // pastikan import ini sesuai versi socket.io-client kamu

interface Message {
  sender: string
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    const token = Cookies.get('token')
    const storedName = Cookies.get('username')

    if (!token) return router.push('/login')
    if (storedName) setName(storedName)

    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'],
    })

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/messages')
        setMessages(res.data)
      } catch (err) {
        setError('Failed to load messages.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    socketRef.current.on('receive-message', (msg: Message) => {
      console.log('[CLIENT] Received:', msg)
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socketRef.current?.off('receive-message')
      socketRef.current?.disconnect()
    }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Current username:', name)

    if (!name || !newMsg.trim()) return
    const msg: Message = { sender: name, content: newMsg }
    console.log('[CLIENT] Sending:', msg)
    socketRef.current?.emit('send-message', msg)
    setNewMsg('')
  }

  const logout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    router.push('/login')
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">ChatViolet 💬</h1>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded-md mb-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold text-sm text-gray-700">
                {msg.sender}:
              </span>{' '}
              <span className="text-gray-800">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            className="flex-grow px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
