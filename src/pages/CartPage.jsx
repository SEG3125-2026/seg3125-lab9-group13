import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { games } from '../data/games.js'
import {
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from '../utils/cart.js'
import { useResponsive } from '../utils/useResponsive.js'

function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [failedImages, setFailedImages] = useState({})
  const { isMobile, isTablet } = useResponsive()
  const { t } = useLanguage()

  useEffect(() => {
    setCartItems(getCartItems())

    function syncCart() {
      setCartItems(getCartItems())
    }

    window.addEventListener('cart-updated', syncCart)

    return () => {
      window.removeEventListener('cart-updated', syncCart)
    }
  }, [])

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const tax = subtotal * 0.12
  const total = subtotal + tax

  const gameLookup = useMemo(() => {
    return Object.fromEntries(games.map((game) => [game.id, game]))
  }, [])

  function handleDecrease(item) {
    updateCartQuantity(item.id, item.quantity - 1)
    setCartItems(getCartItems())
  }

  function handleIncrease(item) {
    updateCartQuantity(item.id, item.quantity + 1)
    setCartItems(getCartItems())
  }

  function handleRemove(itemId) {
    removeFromCart(itemId)
    setCartItems(getCartItems())
  }

  function handleClearCart() {
    clearCart()
    setCartItems(getCartItems())
  }

  function handleImageError(itemId) {
    setFailedImages((current) => ({
      ...current,
      [itemId]: true,
    }))
  }

  const cartLayoutStyle = {
    ...styles.cartLayout,
    gridTemplateColumns: isMobile || isTablet ? '1fr' : 'minmax(0, 1.4fr) 360px',
  }

  return (
    <AppLayout>
      <section style={styles.pageIntro}>
        <h1 style={styles.pageTitle}>{t('cartPage.title')}</h1>
        <p style={styles.pageText}>{t('cartPage.description')}</p>
      </section>

      {cartItems.length > 0 ? (
        <section style={cartLayoutStyle}>
          <div style={styles.cartList}>
            {cartItems.map((item) => {
              const matchedGame = gameLookup[item.id]
              const coverImage = matchedGame?.coverImage

              const cartCardStyle = {
                ...styles.cartCard,
                gridTemplateColumns: isMobile ? '1fr' : '92px minmax(0, 1fr) auto',
                alignItems: isMobile ? 'stretch' : 'center',
              }

              const cartSideStyle = {
                ...styles.cartSide,
                justifyItems: isMobile ? 'start' : 'end',
              }

              return (
                <div key={item.id} style={cartCardStyle}>
                  <div style={styles.cartThumb}>
                    {coverImage && !failedImages[item.id] ? (
                      <img
                        src={coverImage}
                        alt={item.title}
                        style={styles.cartImage}
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <span>{t('common.pixelCover')}</span>
                    )}
                  </div>

                  <div style={styles.cartBody}>
                    <h3 style={styles.cartItemTitle}>{item.title}</h3>
                    <p style={styles.cartItemText}>{item.platform}</p>

                    <div style={styles.quantityRow}>
                      <button
                        type="button"
                        className="ghost-button"
                        style={styles.quantityButton}
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>

                      <span style={styles.quantityValue}>{item.quantity}</span>

                      <button
                        type="button"
                        className="ghost-button"
                        style={styles.quantityButton}
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={cartSideStyle}>
                    <span style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => handleRemove(item.id)}
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <aside style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>{t('cartPage.orderSummary')}</h2>

            <div style={styles.summaryRow}>
              <span>{t('common.items')}</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>{t('common.subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>{t('common.tax')}</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>{t('common.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="pixel-button" style={styles.fullButton}>
              {t('common.proceedToCheckout')}
            </Link>

            <button
              className="ghost-button"
              style={styles.fullButton}
              type="button"
              onClick={handleClearCart}
            >
              {t('common.clearCart')}
            </button>
          </aside>
        </section>
      ) : (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>{t('cartPage.emptyTitle')}</h2>
          <p style={styles.emptyText}>{t('cartPage.emptyText')}</p>
        </section>
      )}
    </AppLayout>
  )
}

const styles = {
  pageIntro: {
    marginBottom: '1.5rem',
  },
  pageTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '2rem',
  },
  pageText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
  cartLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  cartList: {
    display: 'grid',
    gap: '1rem',
  },
  cartCard: {
    gap: '1rem',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '22px',
    padding: '1rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  cartThumb: {
    height: '92px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    color: '#ffffff',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #21103b, #7c3aed)',
    overflow: 'hidden',
  },
  cartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cartBody: {
    minWidth: 0,
  },
  cartItemTitle: {
    margin: 0,
    color: '#181028',
    fontSize: '1.05rem',
  },
  cartItemText: {
    margin: '0.45rem 0 0',
    color: '#6d6289',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginTop: '0.85rem',
  },
  quantityButton: {
    minWidth: '42px',
    padding: '0.55rem 0.7rem',
  },
  quantityValue: {
    minWidth: '28px',
    textAlign: 'center',
    color: '#140f24',
    fontWeight: 800,
  },
  cartSide: {
    display: 'grid',
    gap: '0.75rem',
  },
  itemPrice: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  removeButton: {
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    fontWeight: 700,
    padding: 0,
    textAlign: 'left',
  },
  summaryCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  summaryTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
    color: '#4c4168',
    fontWeight: 600,
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(124, 58, 237, 0.1)',
    color: '#140f24',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
  fullButton: {
    width: '100%',
    marginTop: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  emptyTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.6rem',
  },
  emptyText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default CartPage