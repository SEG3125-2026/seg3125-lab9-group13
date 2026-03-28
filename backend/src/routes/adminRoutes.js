import express from 'express'
import pool from '../config/db.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authenticateToken, requireAdmin)

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildDateSeries(days) {
  const result = []
  const today = new Date()

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - index)
    result.push(formatDateKey(date))
  }

  return result
}

router.get('/stats', async (req, res) => {
  try {
    const [[userResult]] = await pool.query(
      `
      SELECT COUNT(*) AS totalUsers
      FROM users
      `
    )

    const [[gameResult]] = await pool.query(
      `
      SELECT COUNT(*) AS totalGames
      FROM games
      `
    )

    const [[orderResult]] = await pool.query(
      `
      SELECT
        COUNT(*) AS totalOrders,
        COALESCE(SUM(total_amount), 0) AS totalRevenue,
        COALESCE(AVG(total_amount), 0) AS averageOrderValue
      FROM orders
      `
    )

    const [[reviewResult]] = await pool.query(
      `
      SELECT COUNT(*) AS totalReviews
      FROM reviews
      `
    )

    return res.json({
      totalUsers: Number(userResult.totalUsers || 0),
      totalGames: Number(gameResult.totalGames || 0),
      totalOrders: Number(orderResult.totalOrders || 0),
      totalRevenue: Number(orderResult.totalRevenue || 0),
      averageOrderValue: Number(orderResult.averageOrderValue || 0),
      totalReviews: Number(reviewResult.totalReviews || 0),
    })
  } catch (error) {
    console.error('Get admin stats error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.get('/reports/sales-trend', async (req, res) => {
  try {
    const rawDays = Number(req.query.days || 7)
    const days = rawDays === 30 ? 30 : 7
    const dateSeries = buildDateSeries(days)
    const startDate = dateSeries[0]

    const [rows] = await pool.query(
      `
      SELECT
        DATE(created_at) AS order_date,
        COALESCE(SUM(total_amount), 0) AS total_sales,
        COUNT(*) AS order_count
      FROM orders
      WHERE DATE(created_at) >= ?
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
      `,
      [startDate]
    )

    const rowMap = rows.reduce((accumulator, row) => {
      const key = formatDateKey(new Date(row.order_date))
      accumulator[key] = {
        date: key,
        totalSales: Number(row.total_sales || 0),
        orderCount: Number(row.order_count || 0),
      }
      return accumulator
    }, {})

    const result = dateSeries.map((date) => {
      if (rowMap[date]) {
        return rowMap[date]
      }

      return {
        date,
        totalSales: 0,
        orderCount: 0,
      }
    })

    return res.json(result)
  } catch (error) {
    console.error('Get sales trend error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.get('/reports/top-games', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        g.game_id,
        g.slug,
        g.title,
        SUM(oi.quantity) AS total_quantity,
        SUM(oi.line_total) AS total_revenue
      FROM order_items oi
      JOIN games g ON oi.game_id = g.game_id
      GROUP BY g.game_id, g.slug, g.title
      ORDER BY total_quantity DESC, total_revenue DESC
      LIMIT 5
      `
    )

    const result = rows.map((row) => ({
      gameId: row.game_id,
      slug: row.slug,
      title: row.title,
      totalQuantity: Number(row.total_quantity || 0),
      totalRevenue: Number(row.total_revenue || 0),
    }))

    return res.json(result)
  } catch (error) {
    console.error('Get top games error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const [orderRows] = await pool.query(
      `
      SELECT
        o.order_id,
        o.user_id,
        o.status,
        o.total_amount,
        o.shipping_name,
        o.shipping_address,
        o.created_at,
        u.display_name,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC
      `
    )

    const [itemRows] = await pool.query(
      `
      SELECT
        oi.order_item_id,
        oi.order_id,
        oi.quantity,
        oi.unit_price,
        oi.line_total,
        g.title AS game_title,
        g.slug
      FROM order_items oi
      JOIN games g ON oi.game_id = g.game_id
      ORDER BY oi.order_id
      `
    )

    const itemsByOrderId = itemRows.reduce((accumulator, item) => {
      if (!accumulator[item.order_id]) {
        accumulator[item.order_id] = []
      }

      accumulator[item.order_id].push({
        orderItemId: item.order_item_id,
        title: item.game_title,
        slug: item.slug,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
        lineTotal: Number(item.line_total),
      })

      return accumulator
    }, {})

    const orders = orderRows.map((order) => ({
      orderId: order.order_id,
      userId: order.user_id,
      status: order.status,
      totalAmount: Number(order.total_amount),
      shippingName: order.shipping_name,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      customer: {
        displayName: order.display_name,
        email: order.email,
      },
      items: itemsByOrderId[order.order_id] || [],
    }))

    return res.json(orders)
  } catch (error) {
    console.error('Get admin orders error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT user_id, email, display_name, role, created_at
      FROM users
      ORDER BY created_at DESC
      `
    )

    return res.json(rows)
  } catch (error) {
    console.error('Get users error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }

    const [rows] = await pool.query(
      `
      SELECT user_id, role
      FROM users
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const targetUser = rows[0]

    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted here.' })
    }

    await pool.query(
      `
      DELETE FROM users
      WHERE user_id = ?
      `,
      [userId]
    )

    return res.json({ message: 'User deleted successfully.' })
  } catch (error) {
    console.error('Delete user error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

export default router