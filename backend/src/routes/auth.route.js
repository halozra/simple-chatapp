import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, fullName, email } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  // Validasi panjang password (minimal 6 karakter)
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hash, fullName, email })
    await user.save()
    res.status(201).json({ message: 'User registered' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Server error during registration', error: err.message })
  }
})

// LOGIN
// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    // Generate JWT token with user details
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // Expire in 7 days
    )

    // Return the token to the client
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message })
  }
})

export default router
