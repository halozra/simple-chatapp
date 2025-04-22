import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface RegisterProps {
  setIsLogin: (value: boolean) => void
}
export default function Register({ setIsLogin }: RegisterProps) {
  interface Credentials {
    username: string
    password: string
    fullName: string
    email: string
  }

  const [formData, setFormData] = useState<Credentials>({
    fullName: '',
    email: '',
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const respon = await axios.post(
        'http://localhost:5000/auth/register',
        formData
      )
      alert('Register successful!')
      setIsLogin(true)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message)
      } else {
        alert('An unexpected error occurred')
      }
    }
  }

  return (
    <div className=" rounded-xl w-80 h-100 flex justify-center items-center shadow-lg shadow-black p-6">
      <form
        onSubmit={handleSumbit}
        method="post"
        className="flex flex-col justify-center items-center gap-3 w-full"
      >
        <p className="mb-2 text-xl font-semibold">Register Page</p>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Full Name"
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 text-center rounded-md shadow-sm shadow-black focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 text-center rounded-md shadow-sm shadow-black focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 text-center rounded-md shadow-sm shadow-black focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 text-center rounded-md shadow-sm shadow-black focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          Register
        </button>
        <p className="mt-4 text-sm">
          Already have an account?
          <span
            className="text-blue-500 cursor-pointer hover:underline ml-1"
            onClick={() => setIsLogin(true)}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}
