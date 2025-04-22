'use client'

import { useState } from 'react'
import Login from '@/components/Login'
import Register from '@/components/Register'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true) // Default Login

  return (
    <div className="h-screen w-full flex items-center justify-center gap-32">
      <div className="flex flex-col text-center">
        <h1 className="text-5xl font-bold">Lorem Ipsum</h1>
        <p className="text-lg italic">- dolor sit amet -</p>
      </div>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Register setIsLogin={setIsLogin} />
      )}
    </div>
  )
}
