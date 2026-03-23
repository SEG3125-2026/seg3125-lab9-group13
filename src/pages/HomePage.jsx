import { Link } from 'react-router'
import GameCard from '../components/GameCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import {
  bestSellerGames,
  featuredGames,
  newReleaseGames,
  trendingGames,
} from '../data/games.js'
import { useResponsive } from '../utils/useResponsive.js'

function HomePage() {
  const featuredGame = featuredGames[0]
  const { isMobile, isTablet } = useResponsive()

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
          <span style={styles.badge}>Classic Games. Modern Experience.</span>
          <h1 style={heroTitleStyle}>Relive the golden age of gaming.</h1>
          <p style={styles.heroDescription}>
            Browse beloved retro titles, discover new favorites, and bring the
            arcade home with a clean shopping experience built for every player.
          </p>

          <div style={styles.heroActions}>
            <Link to="/catalog" className="pixel-button">
              Browse Collection
            </Link>

            <a href="#best-sellers" className="ghost-button">
              View Best Sellers
            </a>
          </div>
        </div>

        {featuredGame && (
          <div style={heroCardStyle}>
            <p style={styles.heroCardLabel}>Featured Drop</p>
            <h2 style={styles.heroCardTitle}>{featuredGame.title}</h2>
            <p style={styles.heroCardText}>{featuredGame.shortDescription}</p>

            <div style={styles.heroMetaRow}>
              <span style={styles.price}>${featuredGame.price.toFixed(2)}</span>
              <span className="tag">Top Rated</span>
            </div>
          </div>
        )}
      </section>

      <HomeSection
        title="Trending Games"
        description="Popular titles players are checking out this week."
        items={trendingGames}
      />

      <HomeSection
        title="New Releases"
        description="Fresh arrivals with retro style and modern polish."
        items={newReleaseGames}
      />

      <HomeSection
        id="best-sellers"
        title="Best Sellers"
        description="Fan-favorite classics and must-have collector picks."
        items={bestSellerGames}
      />

      <section style={ctaSectionStyle}>
        <div style={styles.ctaContent}>
          <p style={styles.ctaEyebrow}>Join the arcade club</p>
          <h2 style={styles.ctaTitle}>
            Create an account and keep your cart, favorites, and orders in one
            place.
          </h2>
        </div>

        <Link to="/login" className="pixel-button" style={ctaButtonStyle}>
          Create Account
        </Link>
      </section>
    </AppLayout>
  )
}

function HomeSection({ id, title, description, items }) {
  const { isMobile } = useResponsive()

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
          See All
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
    background: 'linear-gradient(180deg, #13091f 0%, #28114a 100%)',
    color: '#ffffff',
    boxShadow: '0 18px 45px rgba(91, 33, 182, 0.18)',
  },
  heroCardLabel: {
    margin: 0,
    color: '#67e8f9',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  heroCardTitle: {
    margin: '1rem 0 0.75rem',
    fontSize: '2rem',
    lineHeight: 1.1,
  },
  heroCardText: {
    margin: 0,
    color: '#dbd4f7',
    lineHeight: 1.7,
  },
  heroMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
  },
  section: {
    marginTop: '2rem',
    scrollMarginTop: '110px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  sectionHeading: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.4rem',
  },
  sectionDescription: {
    margin: '0.45rem 0 0',
    color: '#6d6289',
    lineHeight: 1.6,
  },
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
  price: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  ctaSection: {
    marginTop: '2rem',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, #ffffff, #eefbff)',
    border: '1px solid rgba(6, 182, 212, 0.14)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    boxShadow: '0 14px 34px rgba(6, 182, 212, 0.08)',
  },
  ctaContent: {
    maxWidth: '760px',
  },
  ctaEyebrow: {
    margin: 0,
    color: '#06b6d4',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '0.85rem',
  },
  ctaTitle: {
    margin: '0.7rem 0 0',
    color: '#140f24',
    fontSize: '1.35rem',
    lineHeight: 1.45,
  },
}

export default HomePage