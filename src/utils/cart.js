const CART_KEY = 'player2parlor-cart'

export function getCartItems() {
  const raw = localStorage.getItem(CART_KEY)

  if (!raw) {
    return []
  }

  try {
    const items = JSON.parse(raw)
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(game) {
  const items = getCartItems()
  const existingItem = items.find((item) => item.id === game.id)

  if (existingItem) {
    const updatedItems = items.map((item) =>
      item.id === game.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )

    saveCartItems(updatedItems)
    return updatedItems
  }

  const newItem = {
    id: game.id,
    slug: game.slug,
    title: game.title,
    platform: game.platform,
    price: game.price,
    quantity: 1,
  }

  const updatedItems = [...items, newItem]
  saveCartItems(updatedItems)
  return updatedItems
}

export function removeFromCart(gameId) {
  const items = getCartItems()
  const updatedItems = items.filter((item) => item.id !== gameId)
  saveCartItems(updatedItems)
  return updatedItems
}

export function updateCartQuantity(gameId, quantity) {
  const items = getCartItems()

  if (quantity <= 0) {
    return removeFromCart(gameId)
  }

  const updatedItems = items.map((item) =>
    item.id === gameId ? { ...item, quantity } : item
  )

  saveCartItems(updatedItems)
  return updatedItems
}

export function clearCart() {
  saveCartItems([])
}

export function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0)
}