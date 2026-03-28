import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { getCartCount } from '../utils/cart.js'
import { getCurrentUser, isAdmin, isLoggedIn, logout } from '../utils/auth.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import cartIconUrl from '../assets/cart_icon.svg'
import profileIconUrl from '../assets/profile_icon.svg'
import CatalogueIcon from '../assets/catalogue_icon.svg?react'
import HomeIcon from '../assets/home_icon.svg?react';

function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const navigate = useNavigate()
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()
  const { showToast } = useToast()
  const iconStyle = { width: '20px', height: '20px' }

  useEffect(() => {
    function syncCartCount() {
      setCartCount(getCartCount())
    }

    syncCartCount()
    window.addEventListener('cart-updated', syncCartCount)

    return () => {
      window.removeEventListener('cart-updated', syncCartCount)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const queryFromUrl = params.get('q') || ''

    if (location.pathname === '/catalog') {
      setSearchTerm(queryFromUrl)
      return
    }

    setSearchTerm('')
  }, [location.pathname, location.search])

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [location.pathname])

  function handleSearchSubmit(event) {
    event.preventDefault()

    const trimmedValue = searchTerm.trim()

    if (!trimmedValue) {
      navigate('/catalog')
      return
    }

    navigate(`/catalog?q=${encodeURIComponent(trimmedValue)}`)
  }

  function handleLogout() {
    logout()
    setCurrentUser(null)
    showToast('Logged out successfully!', 'success')
    navigate('/')
  }

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/" style={styles.logoLink}>
          <img src="/favicon.svg" alt="P2 Logo" style={styles.logoIcon} />
          <div>
            <p style={styles.logoTitle}>Player 2: Parlor</p>
            <p style={styles.logoSubtitle}>{t('header.storeSubtitle')}</p>
          </div>
        </NavLink>

        <form style={styles.searchWrap} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder={t('common.searchRetroGames')}
            style={styles.searchInput}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <nav style={styles.nav}>
          <NavLink to="/" style={({ isActive }) => getNavLinkStyle(isActive)}>
            <HomeIcon style={iconStyle} fill="currentColor" />
            <span>{t('common.home')}</span>
          </NavLink>

          <NavLink to="/catalog" style={({ isActive }) => getNavLinkStyle(isActive)}>
            <CatalogueIcon style={iconStyle} fill="currentColor" />
            <span>{t('common.catalog')}</span>
          </NavLink>

          {isAdmin() ? (
            <NavLink to="/admin" style={({ isActive }) => getNavLinkStyle(isActive)}>
              {t('common.admin')}
            </NavLink>
          ) : null}
        </nav>

        <div style={styles.actions}>
          <div style={styles.languageWrap}>
            <label htmlFor="language-select" style={styles.languageLabel}>
              {t('common.language')}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              style={styles.languageSelect}
            >
              <option value="en">{t('common.english')}</option>
              <option value="zh">{t('common.chineseSimplified')}</option>
            </select>
          </div>

          {isLoggedIn() && currentUser ? (
            <span style={styles.userLabel} title={currentUser.displayName}>
              {t('header.greeting')}, {currentUser.displayName}
            </span>
          ) : null}

          {isLoggedIn() ? (
            <button type="button" style={styles.secondaryButton} onClick={handleLogout}>
              <img src={profileIconUrl} alt="Login" style={{ width: '20px', height: '20px' }} />
              <span>{t('common.logout')}</span>
            </button>
          ) : (
            <NavLink to="/login" style={styles.secondaryButton}>
              <img src={profileIconUrl} alt="Login" style={{ width: '20px', height: '20px' }} />
              <span>{t('common.login')}</span>
            </NavLink>
          )}

          <NavLink to="/cart" style={styles.cartButton}>
            <img src={cartIconUrl} alt="Cart" style={{ width: '20px', height: '20px' }} />
            <span>{t('common.cart')}</span>
            <span style={styles.cartBadge}>{cartCount}</span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}

function getNavLinkStyle(isActive) {
  return {
    color: isActive ? '#7c3aed' : '#31224f',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.55rem',
  }
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255, 255, 255, 0.92)',
    borderBottom: '1px solid rgba(124, 58, 237, 0.12)',
    backdropFilter: 'blur(12px)',
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    textDecoration: 'none',
    minWidth: '220px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
  },
  logoTitle: {
    margin: 0,
    color: '#181028',
    fontWeight: 800,
    fontSize: '1rem',
  },
  logoSubtitle: {
    margin: '0.2rem 0 0',
    color: '#7a6d95',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  searchWrap: {
    flex: '1 1 260px',
    minWidth: '220px',
  },
  searchInput: {
    width: '100%',
    height: '46px',
    border: '1px solid rgba(124, 58, 237, 0.14)',
    borderRadius: '14px',
    padding: '0 1rem',
    fontSize: '0.95rem',
    color: '#24163c',
    background: '#f8f7ff',
    outline: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    rowGap: '0.6rem',
    marginLeft: 'auto',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  languageWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.35rem 0.45rem',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.12)',
  },
  languageLabel: {
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  languageSelect: {
    border: '1px solid rgba(124, 58, 237, 0.15)',
    borderRadius: '10px',
    padding: '0.5rem 0.65rem',
    background: '#ffffff',
    color: '#31224f',
    fontWeight: 600,
    maxWidth: '120px',
  },
  userLabel: {
    color: '#31224f',
    fontWeight: 700,
    fontSize: '0.95rem',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  secondaryButton: {
    textDecoration: 'none',
    color: '#31224f',
    fontWeight: 700,
    border: '1px solid rgba(124, 58, 237, 0.15)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    background: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.55rem',
  },
  cartButton: {
    textDecoration: 'none',
    color: '#ffffff',
    fontWeight: 700,
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    boxShadow: '0 10px 24px rgba(124, 58, 237, 0.22)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.55rem',
  },
  cartBadge: {
    minWidth: '24px',
    height: '24px',
    padding: '0 0.35rem',
    borderRadius: '999px',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 800,
  },
  iconMask: {
    width: '20px',
    height: '20px',
    display: 'inline-block',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  },
}

export default Header