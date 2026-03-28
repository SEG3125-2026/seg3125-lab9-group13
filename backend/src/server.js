import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testDbConnection } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/orders', orderRoutes)

async function startServer() {
  try {
    await testDbConnection()
    console.log('Database connected.')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()