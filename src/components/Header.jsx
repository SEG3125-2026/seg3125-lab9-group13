import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { getCartCount } from '../utils/cart.js'

function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

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

  function handleSearchSubmit(event) {
    event.preventDefault()

    const trimmedValue = searchTerm.trim()

    if (!trimmedValue) {
      navigate('/catalog')
      return
    }

    navigate(`/catalog?q=${encodeURIComponent(trimmedValue)}`)
  }

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/" style={styles.logoLink}>
          <img src="/favicon.svg" alt="P2 Logo" style={styles.logoIcon} />
          <div>
            <p style={styles.logoTitle}>Player 2: Parlor</p>
            <p style={styles.logoSubtitle}>Retro Game Storefront</p>
          </div>
        </NavLink>

        <form style={styles.searchWrap} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search retro games..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <nav style={styles.nav}>
          <NavLink to="/" style={({ isActive }) => getNavLinkStyle(isActive)}>
            Home
          </NavLink>

          <NavLink to="/catalog" style={({ isActive }) => getNavLinkStyle(isActive)}>
            Catalog
          </NavLink>

          <NavLink to="/admin" style={({ isActive }) => getNavLinkStyle(isActive)}>
            Admin
          </NavLink>
        </nav>

        <div style={styles.actions}>
          <NavLink to="/login" style={styles.secondaryButton}>
            Login
          </NavLink>

          <NavLink to="/cart" style={styles.cartButton}>
            <span>Cart</span>
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
  logoBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: '1rem',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    boxShadow: '0 10px 24px rgba(124, 58, 237, 0.22)',
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
    gap: '0.75rem',
    marginLeft: 'auto',
  },
  secondaryButton: {
    textDecoration: 'none',
    color: '#31224f',
    fontWeight: 700,
    border: '1px solid rgba(124, 58, 237, 0.15)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    background: '#ffffff',
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
}

export default Header
