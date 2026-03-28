import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import GameCard from '../components/GameCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import {
  bestSellerGames,
  featuredGames,
  newReleaseGames,
  trendingGames,
} from '../data/games.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { isLoggedIn } from '../utils/auth.js'
import { useResponsive } from '../utils/useResponsive.js'

function HomePage() {
  const featuredGame = featuredGames[0]
  const { isMobile, isTablet } = useResponsive()
  const { t } = useLanguage()
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  useEffect(() => {
    function syncAuthState() {
      setLoggedIn(isLoggedIn())
    }

    syncAuthState()
    window.addEventListener('auth-changed', syncAuthState)

    return () => {
      window.removeEventListener('auth-changed', syncAuthState)
    }
  }, [])

  const heroSectionStyle = {
    ...styles.heroSection,
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? '1fr'
        : 'minmax(0, 1.35fr) minmax(320px, 0.9fr)',
  }

  const heroTextStyle = {
    ...styles.heroText,
    padding: isMobile ? '1.5rem' : '2.25rem',
  }

  const heroCardStyle = {
    ...styles.heroCard,
    padding: isMobile ? '1.5rem' : '2rem',
  }

  const heroTitleStyle = {
    ...styles.heroTitle,
    fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 5vw, 4rem)',
  }

  const ctaSectionStyle = {
    ...styles.ctaSection,
    padding: isMobile ? '1.25rem' : '1.75rem 2rem',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
  }

  const ctaButtonStyle = {
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <AppLayout>
      <section style={heroSectionStyle}>
        <div style={heroTextStyle}>
          <span style={styles.badge}>{t('home.heroBadge')}</span>
          <h1 style={heroTitleStyle}>{t('home.heroTitle')}</h1>
          <p style={styles.heroDescription}>{t('home.heroDescription')}</p>

          <div style={styles.heroActions}>
            <Link to="/catalog" className="pixel-button">
              {t('home.browseCollection')}
            </Link>

            <a href="#best-sellers" className="ghost-button">
              {t('home.viewBestSellers')}
            </a>
          </div>
        </div>

        {featuredGame && (
          <div style={heroCardStyle}>
            <p style={styles.heroCardLabel}>{t('home.featuredDrop')}</p>
            <h2 style={styles.heroCardTitle}>{featuredGame.title}</h2>
            <p style={styles.heroCardText}>{featuredGame.shortDescription}</p>

            <div style={styles.heroMetaRow}>
              <span style={styles.price}>${featuredGame.price.toFixed(2)}</span>
              <span className="tag">{t('home.topRated')}</span>
            </div>
          </div>
        )}
      </section>

      <HomeSection
        title={t('home.trendingGames')}
        description={t('home.trendingDescription')}
        items={trendingGames}
      />

      <HomeSection
        title={t('home.newReleases')}
        description={t('home.newReleasesDescription')}
        items={newReleaseGames}
      />

      <HomeSection
        id="best-sellers"
        title={t('home.bestSellers')}
        description={t('home.bestSellersDescription')}
        items={bestSellerGames}
      />

      {!loggedIn ? (
        <section style={ctaSectionStyle}>
          <div style={styles.ctaContent}>
            <p style={styles.ctaEyebrow}>{t('home.joinClub')}</p>
            <h2 style={styles.ctaTitle}>{t('home.createAccountTitle')}</h2>
          </div>

          <Link to="/login" className="pixel-button" style={ctaButtonStyle}>
            {t('home.createAccount')}
          </Link>
        </section>
      ) : null}
    </AppLayout>
  )
}

function HomeSection({ id, title, description, items }) {
  const { isMobile } = useResponsive()
  const { t } = useLanguage()

  const sectionHeaderStyle = {
    ...styles.sectionHeader,
    alignItems: isMobile ? 'stretch' : 'end',
    flexDirection: isMobile ? 'column' : 'row',
  }

  const cardGridStyle = {
    ...styles.cardGrid,
    gridTemplateColumns: isMobile
      ? '1fr'
      : 'repeat(auto-fit, minmax(220px, 1fr))',
  }

  const seeAllStyle = {
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <section id={id} style={styles.section}>
      <div style={sectionHeaderStyle}>
        <div>
          <h2 style={styles.sectionHeading}>{title}</h2>
          <p style={styles.sectionDescription}>{description}</p>
        </div>

        <Link to="/catalog" className="ghost-button" style={seeAllStyle}>
          {t('common.seeAll')}
        </Link>
      </div>

      <div style={cardGridStyle}>
        {items.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

const styles = {
  heroSection: {
    display: 'grid',
    gap: '1.5rem',
    alignItems: 'stretch',
    marginBottom: '2rem',
  },
  heroText: {
    background: 'linear-gradient(135deg, #ffffff, #f2edff)',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '28px',
    boxShadow: '0 18px 45px rgba(91, 33, 182, 0.08)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.45rem 0.75rem',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.08)',
    color: '#7c3aed',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  heroTitle: {
    margin: '1rem 0 0.8rem',
    color: '#140f24',
    lineHeight: 1.05,
  },
  heroDescription: {
    margin: 0,
    maxWidth: '680px',
    color: '#6d6289',
    fontSize: '1.05rem',
    lineHeight: 1.8,
  },
  heroActions: {
    display: 'flex',
    gap: '0.85rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem',
  },
  heroCard: {
    borderRadius: '28px',
    background: 'linear-gradient(180deg, #1b1030, #281545)',
    color: '#ffffff',
    boxShadow: '0 18px 45px rgba(91, 33, 182, 0.18)',
    display: 'grid',
    alignContent: 'start',
  },
  heroCardLabel: {
    margin: 0,
    color: '#9eeaf9',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontSize: '0.82rem',
  },
  heroCardTitle: {
    margin: '1rem 0 0.75rem',
    fontSize: '1.8rem',
    lineHeight: 1.1,
  },
  heroCardText: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.7,
  },
  heroMetaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1.4rem',
  },
  price: {
    fontSize: '1.45rem',
    fontWeight: 800,
  },
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
  },
  sectionHeading: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.7rem',
  },
  sectionDescription: {
    margin: '0.5rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
  ctaSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    background: 'linear-gradient(135deg, #1d1334, #261747)',
    borderRadius: '28px',
    color: '#ffffff',
    boxShadow: '0 18px 45px rgba(91, 33, 182, 0.14)',
  },
  ctaContent: {
    maxWidth: '720px',
  },
  ctaEyebrow: {
    margin: 0,
    color: '#67e8f9',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '0.82rem',
    letterSpacing: '0.05em',
  },
  ctaTitle: {
    margin: '0.85rem 0 0',
    fontSize: '1.6rem',
    lineHeight: 1.45,
  },
}

export default HomePage