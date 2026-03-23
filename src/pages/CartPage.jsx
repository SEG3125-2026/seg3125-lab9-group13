import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
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
    gridTemplateColumns:
      isMobile || isTablet ? '1fr' : 'minmax(0, 1.4fr) 360px',
  }

  return (
    <AppLayout>
      <section style={styles.pageIntro}>
        <h1 style={styles.pageTitle}>Your Cart</h1>
        <p style={styles.pageText}>
          Review your selected games before checkout.
        </p>
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

              const quantityRowStyle = {
                ...styles.quantityRow,
                justifyContent: 'flex-start',
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
                      <span>Game</span>
                    )}
                  </div>

                  <div style={styles.cartBody}>
                    <h3 style={styles.cartItemTitle}>{item.title}</h3>
                    <p style={styles.cartItemText}>{item.platform}</p>

                    <div style={quantityRowStyle}>
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
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <aside style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRow}>
              <span>Items</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="pixel-button" style={styles.fullButton}>
              Proceed to Checkout
            </Link>

            <button
              className="ghost-button"
              style={styles.fullButton}
              type="button"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </aside>
        </section>
      ) : (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>
            Add some retro games to start your order.
          </p>
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
    marginTop: '0.9rem',
    flexWrap: 'wrap',
  },
  quantityButton: {
    minWidth: '42px',
    padding: '0.5rem 0.7rem',
  },
  quantityValue: {
    minWidth: '24px',
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
    color: '#d94674',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
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
    fontSize: '1.25rem',
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
    minHeight: '50vh',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    padding: '2rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  emptyTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.5rem',
  },
  emptyText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default CartPage