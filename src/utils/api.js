export const AUTH_TOKEN_KEY = 'player2parlor-token'
export const AUTH_USER_KEY = 'player2parlor-user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAuthUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAuthUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function removeAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY)
}

export function clearAuthData() {
  removeAuthToken()
  removeAuthUser()
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.')
  }

  return data
}