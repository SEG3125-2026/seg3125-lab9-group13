import { Link, useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { games } from '../data/games.js'
import { addToCart } from '../utils/cart.js'
import { useResponsive } from '../utils/useResponsive.js'

const reviewSeed = {
  'chrono-trigger': [
    {
      id: 1,
      name: 'Alex',
      rating: 5,
      comment: 'Great soundtrack, memorable characters, and an excellent story.',
    },
    {
      id: 2,
      name: 'Jamie',
      rating: 4,
      comment: 'A classic JRPG that still feels fun to revisit.',
    },
  ],
  'super-mario-kart': [
    {
      id: 3,
      name: 'Morgan',
      rating: 5,
      comment: 'Fast, colorful, and perfect for short play sessions.',
    },
    {
      id: 4,
      name: 'Taylor',
      rating: 4,
      comment: 'Very fun multiplayer and great retro racing energy.',
    },
  ],
}

function GameDetailPage() {
  const { slug } = useParams()
  const { isMobile, isTablet } = useResponsive()
  const { language, t } = useLanguage()

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

    const message =
      language === 'zh'
        ? `${game.title} ${t('gameCard.addedToCartSuffix')}`
        : `${game.title} ${t('gameCard.addedToCartSuffix')}`

    window.alert(message)
  }

  function handleReviewSubmit(event) {
    event.preventDefault()

    const trimmedName = reviewName.trim()
    const trimmedComment = reviewComment.trim()

    if (!trimmedName || !trimmedComment) {
      window.alert(t('gameDetailPage.completeReviewError'))
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
          <h1 style={styles.notFoundTitle}>{t('gameDetailPage.gameNotFound')}</h1>
          <p style={styles.notFoundText}>{t('gameDetailPage.gameNotFoundText')}</p>
          <Link to="/catalog" className="pixel-button">
            {t('gameDetailPage.backToCatalog')}
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

  const relatedHeaderStyle = {
    ...styles.relatedHeader,
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'end',
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
        <Link to="/" style={styles.breadcrumbLink}>{t('common.home')}</Link>
        <span style={styles.breadcrumbDivider}>/</span>
        <Link to="/catalog" style={styles.breadcrumbLink}>{t('common.catalog')}</Link>
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
              <span style={styles.coverLabel}>{t('common.pixelCover')}</span>
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
                  <span>{t('gameDetailPage.screenshot')} {index + 1}</span>
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
              <span style={styles.metaLabel}>{t('common.platform')}</span>
              <span style={styles.metaValue}>{game.platform}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('common.releaseYear')}</span>
              <span style={styles.metaValue}>{game.year}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('common.developer')}</span>
              <span style={styles.metaValue}>{game.developer || t('gameDetailPage.unknownStudio')}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('common.rating')}</span>
              <span style={styles.metaValue}>★ {game.rating}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>{t('common.price')}</span>
              <span style={styles.price}>${game.price.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.descriptionBlock}>
            <h2 style={styles.sectionTitle}>{t('common.description')}</h2>
            <p style={styles.descriptionText}>{game.description}</p>
          </div>

          <div style={actionRowStyle}>
            <button className="pixel-button" type="button" onClick={handleAddToCart}>
              {t('common.addToCart')}
            </button>

            <Link to="/cart" className="ghost-button">
              {t('common.goToCart')}
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.reviewSection}>
        <div style={styles.reviewSectionHeader}>
          <div>
            <h2 style={styles.sectionHeading}>{t('gameDetailPage.playerReviews')}</h2>
            <p style={styles.sectionText}>{t('gameDetailPage.playerReviewsText')}</p>
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
            <h3 style={styles.reviewFormTitle}>{t('gameDetailPage.leaveReview')}</h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>{t('common.name')}</label>
              <input
                className="field"
                type="text"
                placeholder={t('loginPage.username')}
                value={reviewName}
                onChange={(event) => setReviewName(event.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>{t('common.rating')}</label>
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
              <label style={styles.formLabel}>{t('gameDetailPage.review')}</label>
              <textarea
                className="field"
                placeholder={t('gameDetailPage.reviewPlaceholder')}
                rows="5"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                style={styles.textarea}
              />
            </div>

            <button type="submit" className="pixel-button" style={styles.fullButton}>
              {t('gameDetailPage.submitReview')}
            </button>
          </form>
        </div>
      </section>

      <section style={styles.relatedSection}>
        <div style={relatedHeaderStyle}>
          <div>
            <h2 style={styles.sectionHeading}>{t('gameDetailPage.relatedGames')}</h2>
          </div>

          <Link to="/catalog" className="ghost-button">
            {t('gameDetailPage.browseMore')}
          </Link>
        </div>

        <div style={cardGridStyle}>
          {relatedGames.map((relatedGame) => (
            <GameCard key={relatedGame.id} game={relatedGame} />
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
    color: '#6d6289',
    textDecoration: 'none',
    fontWeight: 700,
  },
  breadcrumbDivider: {
    color: '#b3a4cf',
  },
  breadcrumbCurrent: {
    color: '#140f24',
    fontWeight: 800,
  },
  detailLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  mediaCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  coverArea: {
    height: '360px',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #21103b, #7c3aed)',
  },
  detailCoverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverLabel: {
    color: '#ffffff',
    fontWeight: 700,
  },
  galleryGrid: {
    display: 'grid',
    gap: '0.85rem',
    marginTop: '1rem',
  },
  galleryItem: {
    height: '120px',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
    background: '#f3f0ff',
    color: '#6d6289',
    fontWeight: 700,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  title: {
    margin: '1rem 0 0.75rem',
    color: '#140f24',
    lineHeight: 1.1,
  },
  shortDescription: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.8,
  },
  metaGrid: {
    display: 'grid',
    gap: '0.9rem',
    marginTop: '1.25rem',
  },
  metaItem: {
    background: '#f8f7ff',
    borderRadius: '16px',
    padding: '0.9rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  metaLabel: {
    display: 'block',
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  metaValue: {
    display: 'block',
    marginTop: '0.35rem',
    color: '#140f24',
    fontWeight: 700,
  },
  price: {
    display: 'block',
    marginTop: '0.35rem',
    color: '#7c3aed',
    fontWeight: 800,
  },
  descriptionBlock: {
    marginTop: '1.25rem',
  },
  sectionTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  descriptionText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
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
  sectionHeading: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.7rem',
  },
  sectionText: {
    margin: '0.55rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
  reviewLayout: {
    display: 'grid',
    gap: '1.25rem',
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
    background: '#f8f7ff',
    borderRadius: '18px',
    padding: '1rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  reviewTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  reviewName: {
    margin: 0,
    color: '#140f24',
    fontSize: '1rem',
  },
  reviewStars: {
    margin: '0.35rem 0 0',
    color: '#7c3aed',
    fontWeight: 700,
  },
  reviewComment: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
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
  },
  fullButton: {
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
  },
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
  notFound: {
    minHeight: '60vh',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
  },
  notFoundTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '2rem',
  },
  notFoundText: {
    margin: '0.75rem 0 1.25rem',
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default GameDetailPage