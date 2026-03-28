import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import pool from '../config/db.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body

    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'Email, password, and display name are required.' })
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedDisplayName = displayName.trim()

    if (!trimmedEmail || !trimmedDisplayName) {
      return res.status(400).json({ message: 'Email, password, and display name are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
    }

    const [existingUsers] = await pool.query(
      `
      SELECT user_id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [trimmedEmail]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    await pool.query(
      `
      INSERT INTO users (user_id, email, password_hash, display_name, role)
      VALUES (?, ?, ?, ?, 'customer')
      `,
      [userId, trimmedEmail, passwordHash, trimmedDisplayName]
    )

    return res.status(201).json({ message: 'Account created successfully.' })
  } catch (error) {
    console.error('Register error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const [rows] = await pool.query(
      `
      SELECT user_id, email, password_hash, display_name, role
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

export default router