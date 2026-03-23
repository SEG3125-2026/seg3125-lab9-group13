import { Link, useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { games } from '../data/games.js'
import { addToCart } from '../utils/cart.js'
import { useResponsive } from '../utils/useResponsive.js'

const reviewSeed = {
  'chrono-blaster-dx': [
    {
      id: 1,
      name: 'Alex',
      rating: 5,
      comment: 'Fast gameplay, strong soundtrack, and great retro arcade energy.',
    },
    {
      id: 2,
      name: 'Jamie',
      rating: 4,
      comment: 'Challenging bosses and fun replay value. A strong pick for shooter fans.',
    },
  ],
  'pixel-kart-94': [
    {
      id: 3,
      name: 'Morgan',
      rating: 5,
      comment: 'Super fun racing game with colorful tracks and easy controls.',
    },
    {
      id: 4,
      name: 'Taylor',
      rating: 4,
      comment: 'Great for quick sessions and local competition.',
    },
  ],
}

function GameDetailPage() {
  const { slug } = useParams()
  const { isMobile, isTablet } = useResponsive()

  const game = games.find((item) => item.slug === slug)

  const initialReviews = useMemo(() => {
    return reviewSeed[slug] || [
      {
        id: 101,
        name: 'RetroFan',
        rating: 4,
        comment: 'A solid retro title with a clean presentation and fun gameplay loop.',
      },
      {
        id: 102,
        name: 'PixelPlayer',
        rating: 5,
        comment: 'I enjoyed the style, pacing, and overall arcade feel of this game.',
      },
    ]
  }, [slug])

  const [reviews, setReviews] = useState(initialReviews)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewComment, setReviewComment] = useState('')
  const [coverFailed, setCoverFailed] = useState(false)
  const [failedScreenshots, setFailedScreenshots] = useState({})

  useEffect(() => {
    setReviews(initialReviews)
  }, [initialReviews])

  useEffect(() => {
    setCoverFailed(false)
    setFailedScreenshots({})
  }, [slug])

  function handleAddToCart() {
    if (!game) return

    addToCart(game)
    window.alert(`${game.title} was added to your cart.`)
  }

  function handleReviewSubmit(event) {
    event.preventDefault()

    const trimmedName = reviewName.trim()
    const trimmedComment = reviewComment.trim()

    if (!trimmedName || !trimmedComment) {
      window.alert('Please complete your name and review before submitting.')
      return
    }

    const newReview = {
      id: Date.now(),
      name: trimmedName,
      rating: Number(reviewRating),
      comment: trimmedComment,
    }

    setReviews((currentReviews) => [newReview, ...currentReviews])
    setReviewName('')
    setReviewRating('5')
    setReviewComment('')
  }

  function handleScreenshotError(index) {
    setFailedScreenshots((current) => ({
      ...current,
      [index]: true,
    }))
  }

  if (!game) {
    return (
      <AppLayout>
        <section style={styles.notFound}>
          <h1 style={styles.notFoundTitle}>Game not found</h1>
          <p style={styles.notFoundText}>
            The game you are looking for could not be found.
          </p>
          <Link to="/catalog" className="pixel-button">
            Back to Catalog
          </Link>
        </section>
      </AppLayout>
    )
  }

  const relatedGames = games
    .filter((item) => item.id !== game.id && item.genre === game.genre)
    .slice(0, 4)

  const screenshotSlots =
    game.screenshots && game.screenshots.length > 0
      ? game.screenshots
      : [null, null, null]

  const detailLayoutStyle = {
    ...styles.detailLayout,
    gridTemplateColumns:
      isMobile || isTablet
        ? '1fr'
        : 'minmax(0, 1.05fr) minmax(320px, 0.95fr)',
  }

  const mediaCardStyle = {
    ...styles.mediaCard,
    padding: isMobile ? '1rem' : '1.25rem',
  }

  const infoCardStyle = {
    ...styles.infoCard,
    padding: isMobile ? '1.1rem' : '1.5rem',
  }

  const titleStyle = {
    ...styles.title,
    fontSize: isMobile ? '1.9rem' : '2.3rem',
  }

  const metaGridStyle = {
    ...styles.metaGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  }

  const actionRowStyle = {
    ...styles.actionRow,
    flexDirection: isMobile ? 'column' : 'row',
  }

  const primaryActionStyle = {
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const secondaryActionStyle = {
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const relatedHeaderStyle = {
    ...styles.relatedHeader,
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'end',
  }

  const browseMoreStyle = {
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const cardGridStyle = {
    ...styles.cardGrid,
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(2, minmax(0, 1fr))'
        : 'repeat(auto-fit, minmax(220px, 1fr))',
  }

  const galleryGridStyle = {
    ...styles.galleryGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
  }

  const reviewLayoutStyle = {
    ...styles.reviewLayout,
    gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.1fr 0.9fr',
  }

  return (
    <AppLayout>
      <section style={styles.breadcrumbRow}>
        <Link to="/" style={styles.breadcrumbLink}>Home</Link>
        <span style={styles.breadcrumbDivider}>/</span>
        <Link to="/catalog" style={styles.breadcrumbLink}>Catalog</Link>
        <span style={styles.breadcrumbDivider}>/</span>
        <span style={styles.breadcrumbCurrent}>{game.title}</span>
      </section>

      <section style={detailLayoutStyle}>
        <div style={mediaCardStyle}>
          <div style={styles.coverArea}>
            {game.coverImage && !coverFailed ? (
              <img
                src={game.coverImage}
                alt={game.title}
                style={styles.detailCoverImage}
                onError={() => setCoverFailed(true)}
              />
            ) : (
              <span style={styles.coverLabel}>Pixel Cover</span>
            )}
          </div>

          <div style={galleryGridStyle}>
            {screenshotSlots.map((shot, index) => (
              <div key={`${game.slug}-shot-${index + 1}`} style={styles.galleryItem}>
                {shot && !failedScreenshots[index] ? (
                  <img
                    src={shot}
                    alt={`${game.title} screenshot ${index + 1}`}
                    style={styles.galleryImage}
                    onError={() => handleScreenshotError(index)}
                  />
                ) : (
                  <span>Screenshot {index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={infoCardStyle}>
          <span className="tag">{game.genre}</span>

          <h1 style={titleStyle}>{game.title}</h1>

          <p style={styles.shortDescription}>{game.shortDescription}</p>

          <div style={metaGridStyle}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Platform</span>
              <span style={styles.metaValue}>{game.platform}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Release Year</span>
              <span style={styles.metaValue}>{game.year}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Developer</span>
              <span style={styles.metaValue}>{game.developer || 'Unknown Studio'}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Rating</span>
              <span style={styles.metaValue}>★ {game.rating}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Price</span>
              <span style={styles.price}>${game.price.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.descriptionBlock}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.descriptionText}>{game.description}</p>
          </div>

          <div style={actionRowStyle}>
            <button
              className="pixel-button"
              type="button"
              onClick={handleAddToCart}
              style={primaryActionStyle}
            >
              Add to Cart
            </button>

            <Link to="/cart" className="ghost-button" style={secondaryActionStyle}>
              Go to Cart
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.reviewSection}>
        <div style={styles.reviewSectionHeader}>
          <div>
            <h2 style={styles.sectionHeading}>Player Reviews</h2>
            <p style={styles.sectionText}>
              Read feedback from other players and share your own opinion.
            </p>
          </div>
        </div>

        <div style={reviewLayoutStyle}>
          <div style={styles.reviewListCard}>
            {reviews.map((review) => (
              <article key={review.id} style={styles.reviewItem}>
                <div style={styles.reviewTopRow}>
                  <div>
                    <h3 style={styles.reviewName}>{review.name}</h3>
                    <p style={styles.reviewStars}>{'★'.repeat(review.rating)}</p>
                  </div>
                </div>

                <p style={styles.reviewComment}>{review.comment}</p>
              </article>
            ))}
          </div>

          <form style={styles.reviewFormCard} onSubmit={handleReviewSubmit}>
            <h3 style={styles.reviewFormTitle}>Leave a Review</h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Name</label>
              <input
                className="field"
                type="text"
                placeholder="Your name"
                value={reviewName}
                onChange={(event) => setReviewName(event.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Rating</label>
              <select
                className="field"
                value={reviewRating}
                onChange={(event) => setReviewRating(event.target.value)}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Review</label>
              <textarea
                className="field"
                placeholder="Share your thoughts about this game..."
                rows="5"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                style={styles.textarea}
              />
            </div>

            <button type="submit" className="pixel-button" style={styles.submitButton}>
              Submit Review
            </button>
          </form>
        </div>
      </section>

      <section style={styles.relatedSection}>
        <div style={relatedHeaderStyle}>
          <div>
            <h2 style={styles.sectionHeading}>Related Games</h2>
            <p style={styles.sectionText}>
              More titles in the {game.genre} category.
            </p>
          </div>

          <Link to="/catalog" className="ghost-button" style={browseMoreStyle}>
            Browse More
          </Link>
        </div>

        <div style={cardGridStyle}>
          {relatedGames.map((item) => (
            <GameCard key={item.id} game={item} />
          ))}
        </div>
      </section>
    </AppLayout>
  )
}

const styles = {
  breadcrumbRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.25rem',
  },
  breadcrumbLink: {
    color: '#7c3aed',
    fontWeight: 700,
    textDecoration: 'none',
  },
  breadcrumbDivider: {
    color: '#8f84ab',
  },
  breadcrumbCurrent: {
    color: '#4c4168',
    fontWeight: 700,
  },
  detailLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  mediaCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '28px',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  coverArea: {
    minHeight: '360px',
    borderRadius: '22px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #1b1030, #7c3aed)',
    overflow: 'hidden',
  },
  detailCoverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  coverLabel: {
    color: '#ffffff',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },
  galleryGrid: {
    marginTop: '1rem',
    display: 'grid',
    gap: '0.75rem',
  },
  galleryItem: {
    minHeight: '92px',
    borderRadius: '16px',
    display: 'grid',
    placeItems: 'center',
    background: '#f6f4ff',
    color: '#6d6289',
    fontWeight: 700,
    border: '1px solid rgba(124, 58, 237, 0.08)',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  infoCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '28px',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  title: {
    margin: '1rem 0 0.7rem',
    color: '#140f24',
    lineHeight: 1.1,
  },
  shortDescription: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.8,
    fontSize: '1rem',
  },
  metaGrid: {
    display: 'grid',
    gap: '0.9rem',
    marginTop: '1.25rem',
  },
  metaItem: {
    background: '#f8f7ff',
    border: '1px solid rgba(124, 58, 237, 0.08)',
    borderRadius: '18px',
    padding: '0.95rem 1rem',
    display: 'grid',
    gap: '0.35rem',
  },
  metaLabel: {
    color: '#7a6d95',
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  metaValue: {
    color: '#181028',
    fontWeight: 800,
  },
  price: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  descriptionBlock: {
    marginTop: '1.5rem',
  },
  sectionTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  descriptionText: {
    margin: '0.85rem 0 0',
    color: '#5f547a',
    lineHeight: 1.8,
  },
  actionRow: {
    display: 'flex',
    gap: '0.85rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem',
  },
  reviewSection: {
    marginTop: '2rem',
  },
  reviewSectionHeader: {
    marginBottom: '1rem',
  },
  reviewLayout: {
    display: 'grid',
    gap: '1rem',
    alignItems: 'start',
  },
  reviewListCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
    display: 'grid',
    gap: '1rem',
  },
  reviewItem: {
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(124, 58, 237, 0.08)',
  },
  reviewTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  reviewName: {
    margin: 0,
    color: '#181028',
    fontSize: '1rem',
  },
  reviewStars: {
    margin: '0.35rem 0 0',
    color: '#f59e0b',
    fontWeight: 800,
  },
  reviewComment: {
    margin: '0.75rem 0 0',
    color: '#5f547a',
    lineHeight: 1.7,
  },
  reviewFormCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  reviewFormTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  formGroup: {
    marginTop: '1rem',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '120px',
  },
  submitButton: {
    width: '100%',
    marginTop: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedSection: {
    marginTop: '2rem',
  },
  relatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  sectionHeading: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.45rem',
  },
  sectionText: {
    margin: '0.45rem 0 0',
    color: '#6d6289',
    lineHeight: 1.6,
  },
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
  notFound: {
    minHeight: '70vh',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  notFoundTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '2rem',
  },
  notFoundText: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default GameDetailPage