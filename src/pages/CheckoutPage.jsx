import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
import { apiFetch } from '../utils/api.js'
import { getCurrentUser, isLoggedIn } from '../utils/auth.js'
import { clearCart, getCartItems } from '../utils/cart.js'
import { useResponsive } from '../utils/useResponsive.js'

function CheckoutPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(getCartItems())
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    cardName: '',
    cardNumber: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderSummary, setOrderSummary] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isMobile, isTablet } = useResponsive()

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (currentUser?.email) {
      setFormData((current) => ({
        ...current,
        email: currentUser.email,
        fullName: current.fullName || currentUser.displayName || '',
      }))
    }
  }, [])

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const tax = subtotal * 0.12
  const total = subtotal + tax

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handlePlaceOrder(event) {
    event.preventDefault()
    setError('')

    const hasEmptyField = Object.values(formData).some((value) => !value.trim())

    if (!isLoggedIn()) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    if (hasEmptyField) {
      setError('Please complete all checkout fields before placing the order.')
      return
    }

    try {
      setLoading(true)

      const response = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          items: cartItems.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
        }),
      })

      clearCart()
      setCartItems([])
      setOrderSummary(response)
      setOrderPlaced(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const layoutStyle = {
    ...styles.layout,
    gridTemplateColumns:
      isMobile || isTablet ? '1fr' : 'minmax(0, 1.2fr) 360px',
  }

  const formGridStyle = {
    ...styles.formGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  }

  if (orderPlaced) {
    return (
      <AppLayout>
        <section style={styles.successCard}>
          <span style={styles.successBadge}>Order Complete</span>
          <h1 style={styles.successTitle}>Thank you for your purchase!</h1>
          <p style={styles.successText}>
            Your order has been saved to the database successfully.
          </p>

          {orderSummary ? (
            <div style={styles.successSummary}>
              <p style={styles.successMeta}>
                <strong>Order ID:</strong> {orderSummary.orderId}
              </p>
              <p style={styles.successMeta}>
                <strong>Total:</strong> ${Number(orderSummary.totalAmount).toFixed(2)}
              </p>
            </div>
          ) : null}

          <Link to="/" className="pixel-button" style={styles.successButton}>
            Back to Home
          </Link>
        </section>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <section style={styles.pageIntro}>
        <h1 style={styles.pageTitle}>Checkout</h1>
        <p style={styles.pageText}>
          Follow the steps below to complete your purchase.
        </p>
      </section>

      <section style={styles.stepRow}>
        <div style={styles.stepActive}>1. Review Cart</div>
        <div style={styles.stepActive}>2. Enter Details</div>
        <div style={styles.stepPending}>3. Place Order</div>
      </section>

      {!isLoggedIn() ? (
        <section style={styles.loginNotice}>
          <h2 style={styles.loginNoticeTitle}>Login Required</h2>
          <p style={styles.loginNoticeText}>
            Please log in before placing an order.
          </p>
          <Link to="/login" className="pixel-button">
            Go to Login
          </Link>
        </section>
      ) : (
        <section style={layoutStyle}>
          <form style={styles.formCard} onSubmit={handlePlaceOrder}>
            <div style={styles.sectionBlock}>
              <h2 style={styles.sectionTitle}>Shipping Information</h2>

              <div style={formGridStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Full Name</label>
                  <input
                    className="field"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Alex Carter"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    className="field"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@email.com"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Address</label>
                  <input
                    className="field"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Retro Street"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>City</label>
                  <input
                    className="field"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ottawa"
                  />
                </div>
              </div>
            </div>

            <div style={styles.sectionBlock}>
              <h2 style={styles.sectionTitle}>Payment Information</h2>

              <div style={formGridStyle}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Cardholder Name</label>
                  <input
                    className="field"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Alex Carter"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Card Number</label>
                  <input
                    className="field"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1111 2222 3333 4444"
                  />
                </div>
              </div>
            </div>

            {error ? <p style={styles.errorText}>{error}</p> : null}

            <button
              type="submit"
              className="pixel-button"
              style={styles.fullButton}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <aside style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            {cartItems.length > 0 ? (
              <div style={styles.summaryList}>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <div>
                      <p style={styles.summaryItemTitle}>{item.title}</p>
                      <p style={styles.summaryItemMeta}>
                        Qty {item.quantity} · {item.platform}
                      </p>
                    </div>
                    <span style={styles.summaryItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>Your cart is currently empty.</p>
            )}

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
          </aside>
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
  stepRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '1.25rem',
  },
  stepActive: {
    padding: '0.65rem 0.9rem',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.1)',
    color: '#7c3aed',
    fontWeight: 800,
  },
  stepPending: {
    padding: '0.65rem 0.9rem',
    borderRadius: '999px',
    background: '#f3f0ff',
    color: '#7a6d95',
    fontWeight: 700,
  },
  layout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  formCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  sectionBlock: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  formGrid: {
    display: 'grid',
    gap: '1rem',
    marginTop: '1rem',
  },
  formGroup: {
    minWidth: 0,
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  fullButton: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  summaryList: {
    display: 'grid',
    gap: '0.85rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'start',
  },
  summaryItemTitle: {
    margin: 0,
    color: '#181028',
    fontWeight: 700,
  },
  summaryItemMeta: {
    margin: '0.3rem 0 0',
    color: '#6d6289',
    fontSize: '0.9rem',
  },
  summaryItemPrice: {
    color: '#7c3aed',
    fontWeight: 800,
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
  emptyText: {
    margin: '1rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
  successCard: {
    minHeight: '60vh',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '28px',
    padding: '2rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
    display: 'grid',
    alignContent: 'center',
    justifyItems: 'center',
    textAlign: 'center',
  },
  successBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.45rem 0.75rem',
    borderRadius: '999px',
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#059669',
    fontWeight: 800,
    fontSize: '0.85rem',
  },
  successTitle: {
    margin: '1rem 0 0.75rem',
    color: '#140f24',
    fontSize: '2rem',
  },
  successText: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.8,
    maxWidth: '640px',
  },
  successSummary: {
    marginTop: '1rem',
    marginBottom: '1.25rem',
    padding: '1rem 1.25rem',
    borderRadius: '16px',
    background: '#f8f7ff',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  successMeta: {
    margin: '0.35rem 0',
    color: '#31224f',
    fontWeight: 600,
  },
  successButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    margin: '0 0 1rem',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#b91c1c',
    fontWeight: 700,
  },
  loginNotice: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
    textAlign: 'center',
  },
  loginNoticeTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.6rem',
  },
  loginNoticeText: {
    margin: '0.75rem 0 1.25rem',
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default CheckoutPage