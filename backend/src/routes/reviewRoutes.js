import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import pool from '../config/db.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

async function refreshGameReviewStats(connection, gameId) {
  const [[result]] = await connection.query(
    `
    SELECT
      COALESCE(AVG(rating), 0) AS average_rating,
      COUNT(*) AS review_count
    FROM reviews
    WHERE game_id = ?
    `,
    [gameId]
  )

  await connection.query(
    `
    UPDATE games
    SET average_rating = ?, review_count = ?
    WHERE game_id = ?
    `,
    [Number(result.average_rating || 0), Number(result.review_count || 0), gameId]
  )
}

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const [[game]] = await pool.query(
      `
      SELECT game_id
      FROM games
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    )

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' })
    }

    const [rows] = await pool.query(
      `
      SELECT
        r.review_id,
        r.rating,
        r.body,
        r.created_at,
        u.user_id,
        u.display_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.game_id = ?
      ORDER BY r.created_at DESC
      `,
      [game.game_id]
    )

    const reviews = rows.map((row) => ({
      reviewId: row.review_id,
      rating: Number(row.rating),
      comment: row.body || '',
      createdAt: row.created_at,
      user: {
        userId: row.user_id,
        displayName: row.display_name,
      },
    }))

    return res.json(reviews)
  } catch (error) {
    console.error('Get reviews error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  }
})

router.post('/:slug', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { slug } = req.params
    const { rating, comment } = req.body

    const numericRating = Number(rating)
    const trimmedComment = String(comment || '').trim()

    if (!trimmedComment) {
      return res.status(400).json({ message: 'Review comment is required.' })
    }

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' })
    }

    const [[game]] = await connection.query(
      `
      SELECT game_id
      FROM games
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    )

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' })
    }

    await connection.beginTransaction()

    const [existingRows] = await connection.query(
      `
      SELECT review_id
      FROM reviews
      WHERE game_id = ? AND user_id = ?
      LIMIT 1
      `,
      [game.game_id, req.user.userId]
    )

    if (existingRows.length > 0) {
      await connection.query(
        `
        UPDATE reviews
        SET rating = ?, body = ?
        WHERE review_id = ?
        `,
        [numericRating, trimmedComment, existingRows[0].review_id]
      )
    } else {
      await connection.query(
        `
        INSERT INTO reviews (
          review_id,
          game_id,
          user_id,
          rating,
          title,
          body
        )
        VALUES (?, ?, ?, ?, NULL, ?)
        `,
        [uuidv4(), game.game_id, req.user.userId, numericRating, trimmedComment]
      )
    }

    await refreshGameReviewStats(connection, game.game_id)
    await connection.commit()

    return res.status(201).json({ message: 'Review saved successfully.' })
  } catch (error) {
    await connection.rollback()
    console.error('Save review error:', error.message)
    return res.status(500).json({ message: 'Server error.' })
  } finally {
    connection.release()
  }
})

export default router