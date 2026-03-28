import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { fullName, address, city, items } = req.body

    if (!fullName || !address || !city) {
      return res.status(400).json({ message: 'Shipping information is required.' })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required.' })
    }

    const normalizedItems = items.map((item) => ({
      slug: String(item.slug || '').trim(),
      quantity: Number(item.quantity || 0),
    }))

    const invalidItem = normalizedItems.find(
      (item) => !item.slug || !Number.isInteger(item.quantity) || item.quantity <= 0
    )

    if (invalidItem) {
      return res.status(400).json({ message: 'Invalid cart items.' })
    }

    const uniqueSlugs = [...new Set(normalizedItems.map((item) => item.slug))]
    const placeholders = uniqueSlugs.map(() => '?').join(', ')

    const [games] = await connection.query(
      `
      SELECT game_id, slug, title, price, stock
      FROM games
      WHERE slug IN (${placeholders})
      `,
      uniqueSlugs
    )

    if (games.length !== uniqueSlugs.length) {
      return res.status(400).json({ message: 'One or more games were not found.' })
    }

    const gameMap = new Map(games.map((game) => [game.slug, game]))

    for (const item of normalizedItems) {
      const matchedGame = gameMap.get(item.slug)

      if (!matchedGame) {
        return res.status(400).json({ message: 'One or more games were not found.' })
      }

      if (matchedGame.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${matchedGame.title}.` })
      }
    }

    const orderId = uuidv4()
    const shippingAddress = `${address}, ${city}`

    const orderItems = normalizedItems.map((item) => {
      const matchedGame = gameMap.get(item.slug)
      const unitPrice = Number(matchedGame.price)
      const lineTotal = unitPrice * item.quantity

      return {
        orderItemId: uuidv4(),
        orderId,
        gameId: matchedGame.game_id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      }
    })

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineTotal, 0)

    await connection.beginTransaction()

    await connection.query(
      `
      INSERT INTO orders (
        order_id,
        user_id,
        status,
        total_amount,
        shipping_name,
        shipping_address
      )
      VALUES (?, ?, 'pending', ?, ?, ?)
      `,
      [orderId, req.user.userId, totalAmount, fullName.trim(), shippingAddress]
    )

    for (const item of orderItems) {
      await connection.query(
        `
        INSERT INTO order_items (
          order_item_id,
          order_id,
          game_id,
          quantity,
          unit_price,
          line_total
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          item.orderItemId,
          item.orderId,
          item.gameId,
          item.quantity,
          item.unitPrice,
          item.lineTotal,
        ]
      )
    }

    for (const item of normalizedItems) {
      const matchedGame = gameMap.get(item.slug)

      await connection.query(
        `
        UPDATE games
        SET stock = stock - ?
        WHERE game_id = ?
        `,
        [item.quantity, matchedGame.game_id]
      )
    }

    await connection.commit()

    return res.status(201).json({
      message: 'Order created successfully.',
      orderId,
      totalAmount,
    })
  } catch (error) {
    await connection.rollback()
    console.error('Create order error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  } finally {
    connection.release()
  }
})

export default router