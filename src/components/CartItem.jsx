function CartItem({ game }) {
  return (
    <div style={styles.cartItem}>
      <div style={styles.cartThumb}>Game</div>

      <div style={styles.cartItemBody}>
        <h3 style={styles.cartItemTitle}>{game.title}</h3>
        <p style={styles.cartItemText}>{game.platform}</p>
      </div>

      <div style={styles.cartItemPrice}>${game.price.toFixed(2)}</div>
    </div>
  )
}

const styles = {
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '92px minmax(0, 1fr) auto',
    gap: '1rem',
    alignItems: 'center',
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
  },
  cartItemBody: {
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
  cartItemPrice: {
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '1.1rem',
  },
}

export default CartItem