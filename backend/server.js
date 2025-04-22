import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.route.js'
import Message from './src/models/message.model.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authRoutes)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

// Get chat history
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' })
  }
})

// POST endpoint to send message (optional)
app.post('/send-message', async (req, res) => {
  const { sender, content } = req.body
  if (!sender || !content) {
    return res.status(400).json({ message: 'Sender and content are required.' })
  }

  try {
    const message = new Message({ sender, content })
    await message.save()

    // Emit message to all connected clients
    io.emit('receive-message', message)

    res.status(200).json(message)
  } catch (err) {
    res.status(500).json({ message: 'Error saving the message.' })
  }
})

// Socket.IO
io.on('connection', (socket) => {
  console.log('📡 User connected:', socket.id)

  socket.on('send-message', async (msg) => {
    console.log('📨 Received message from client:', msg)
    const message = new Message(msg)
    await message.save()
    io.emit('receive-message', message)
  })

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id)
  })
})

server.listen(5000, () => {
  console.log('🚀 Server listening on http://localhost:5000')
})
