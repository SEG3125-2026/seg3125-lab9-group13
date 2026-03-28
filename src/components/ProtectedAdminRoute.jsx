import { Navigate } from 'react-router'
import { getCurrentUser, isAdmin, isLoggedIn } from '../utils/auth.js'

function ProtectedAdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    const user = getCurrentUser()

    if (user) {
      return <Navigate to="/" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedAdminRoute