import { Route, Routes } from 'react-router'
import AdminPage from './pages/AdminPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import GameDetailPage from './pages/GameDetailPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/games/:slug" element={<GameDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App