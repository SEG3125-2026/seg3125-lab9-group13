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

export function logout() {
  clearAuthData()
}