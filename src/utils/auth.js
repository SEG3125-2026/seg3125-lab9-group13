import {
  clearAuthData,
  getAuthToken,
  getAuthUser,
} from './api.js'

export function isLoggedIn() {
  return Boolean(getAuthToken() && getAuthUser())
}

export function getCurrentUser() {
  return getAuthUser()
}

export function isAdmin() {
  const user = getAuthUser()
  return user?.role === 'admin'
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event('auth-changed'))
}

export function logout() {
  clearAuthData()
  notifyAuthChanged()
}