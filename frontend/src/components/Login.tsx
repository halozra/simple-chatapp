'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface LoginProps {
  setIsLogin: (value: boolean) => void
}

const Login = ({ setIsLogin }: LoginProps) => {
  const router = useRouter()

  interface Credentials {
    username: string
    password: string
  }

  const [formData, setFormData] = useState<Credentials>({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false) // Tambahkan loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      alert('Please fill in both username and password.')
      return
    }

    setLoading(true) // Aktifkan loading saat login dimulai

    try {
      const respon = await axios.post(
        'http://localhost:5000/auth/login',
        formData
      )
      const username = formData.username
      const token = respon.data.token
      Cookies.set('username', username)
      Cookies.set('token', token)
      alert('Login successful!')
      router.push('/')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message)
      } else {
        alert('An unexpected error occurred')
      }
    } finally {
      setLoading(false) // Matikan loading setelah proses selesai
    }
  }

  return (
    <div className=" rounded-xl w-80 h-80 flex justify-center items-center shadow-lg shadow-black p-6">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col justify-center items-center gap-4 w-full"
      >
        <p className="mb-2 text-xl font-semibold">Login Page</p>
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
          disabled={loading} // Disable tombol saat loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline ml-1"
            onClick={() => setIsLogin(false)}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
