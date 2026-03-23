import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { addToCart } from '../utils/cart.js'

function GameCard({ game }) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [game.coverImage])

  function handleAddToCart() {
    addToCart(game)
    window.alert(`${game.title} was added to your cart.`)
  }

  return (
    <article style={styles.gameCard}>
      <div style={styles.gameThumb}>
        {game.coverImage && !imageFailed ? (
          <img
            src={game.coverImage}
            alt={game.title}
            style={styles.gameImage}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span style={styles.gameThumbLabel}>Pixel Cover</span>
        )}
      </div>

      <div style={styles.gameBody}>
        <div style={styles.gameTopRow}>
          <span className="tag">{game.genre}</span>
          <span style={styles.rating}>★ {game.rating}</span>
        </div>

        <h3 style={styles.gameTitle}>{game.title}</h3>

        <div style={styles.metaRow}>
          <span style={styles.platform}>{game.platform}</span>
          <span style={styles.year}>{game.year}</span>
        </div>

        <div style={styles.gameBottomRow}>
          <span style={styles.price}>${game.price.toFixed(2)}</span>
        </div>

        <div style={styles.actionRow}>
          <button
            type="button"
            className="pixel-button"
            style={styles.primaryAction}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <Link
            to={`/games/${game.slug}`}
            className="ghost-button"
            style={styles.secondaryAction}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

const styles = {
  gameCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '22px',
    overflow: 'hidden',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  gameThumb: {
    height: '180px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #21103b, #7c3aed)',
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  gameThumbLabel: {
    color: '#ffffff',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  gameBody: {
    padding: '1rem',
  },
  gameTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
  },
  rating: {
    color: '#7a6d95',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  gameTitle: {
    margin: '0.9rem 0 0.75rem',
    color: '#181028',
    fontSize: '1.15rem',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    color: '#6d6289',
    fontSize: '0.92rem',
    fontWeight: 600,
  },
  platform: {
    color: '#6d6289',
  },
  year: {
    color: '#7c3aed',
    fontWeight: 700,
  },
  gameBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.9rem',
  },
  price: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  actionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.65rem',
  },
  primaryAction: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryAction: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.7rem 0.85rem',
  },
}

export default GameCard