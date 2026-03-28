import { useState } from 'react'
import { useNavigate } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
import {
  apiFetch,
  setAuthToken,
  setAuthUser,
} from '../utils/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('login')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [signUpForm, setSignUpForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function clearFeedback() {
    setMessage('')
    setError('')
  }

  function handleLoginChange(event) {
    const { name, value } = event.target

    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSignUpChange(event) {
    const { name, value } = event.target

    setSignUpForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    clearFeedback()
    setLoading(true)

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      setAuthToken(data.token)
      setAuthUser(data.user)

      setMessage('Login successful.')

      if (data.user.role === 'admin') {
        navigate('/admin')
        return
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUpSubmit(event) {
    event.preventDefault()
    clearFeedback()

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError(t('loginPage.passwordsDoNotMatch'))
      return
    }

    setLoading(true)

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: signUpForm.email,
          password: signUpForm.password,
          displayName: signUpForm.displayName,
        }),
      })

      setMessage(t('loginPage.registerSuccess'))
      setActiveTab('login')
      setLoginForm({
        email: signUpForm.email,
        password: '',
      })
      setSignUpForm({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <section style={styles.loginWrapper}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <span style={styles.badge}>{t('loginPage.badge')}</span>
            <h1 style={styles.loginTitle}>
              {activeTab === 'login' ? t('loginPage.loginTitle') : t('loginPage.signupTitle')}
            </h1>
            <p style={styles.loginText}>
              {activeTab === 'login'
                ? t('loginPage.loginText')
                : t('loginPage.signupText')}
            </p>
          </div>

          <div style={styles.tabRow}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login')
                clearFeedback()
              }}
              style={getTabStyle(activeTab === 'login')}
            >
              {t('common.login')}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup')
                clearFeedback()
              }}
              style={getTabStyle(activeTab === 'signup')}
            >
              {t('loginPage.signUp')}
            </button>
          </div>

          {error ? <p style={styles.errorText}>{error}</p> : null}
          {message ? <p style={styles.successText}>{message}</p> : null}

          {activeTab === 'login' ? (
            <LoginForm
              formData={loginForm}
              onChange={handleLoginChange}
              onSubmit={handleLoginSubmit}
              loading={loading}
            />
          ) : (
            <SignUpForm
              formData={signUpForm}
              onChange={handleSignUpChange}
              onSubmit={handleSignUpSubmit}
              loading={loading}
            />
          )}
        </div>
      </section>
    </AppLayout>
  )
}

function LoginForm({ formData, onChange, onSubmit, loading }) {
  const { t } = useLanguage()

  return (
    <form style={styles.formArea} onSubmit={onSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.email')}</label>
        <input
          className="field"
          type="email"
          name="email"
          placeholder="player@example.com"
          value={formData.email}
          onChange={onChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.password')}</label>
        <input
          className="field"
          type="password"
          name="password"
          placeholder={t('loginPage.enterPassword')}
          value={formData.password}
          onChange={onChange}
        />
      </div>

      <button className="pixel-button" style={styles.fullButton} type="submit" disabled={loading}>
        {loading ? t('common.loading') : t('loginPage.loginButton')}
      </button>

      <p style={styles.helperText}>{t('loginPage.newHere')}</p>
    </form>
  )
}

function SignUpForm({ formData, onChange, onSubmit, loading }) {
  const { t } = useLanguage()

  return (
    <form style={styles.formArea} onSubmit={onSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.username')}</label>
        <input
          className="field"
          type="text"
          name="displayName"
          placeholder="RetroPlayer13"
          value={formData.displayName}
          onChange={onChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.email')}</label>
        <input
          className="field"
          type="email"
          name="email"
          placeholder="player@example.com"
          value={formData.email}
          onChange={onChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.password')}</label>
        <input
          className="field"
          type="password"
          name="password"
          placeholder={t('loginPage.createPassword')}
          value={formData.password}
          onChange={onChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>{t('loginPage.confirmPassword')}</label>
        <input
          className="field"
          type="password"
          name="confirmPassword"
          placeholder={t('loginPage.confirmPassword')}
          value={formData.confirmPassword}
          onChange={onChange}
        />
      </div>

      <button className="pixel-button" style={styles.fullButton} type="submit" disabled={loading}>
        {loading ? t('common.loading') : t('loginPage.createAccountButton')}
      </button>

      <p style={styles.helperText}>{t('loginPage.alreadyHaveAccount')}</p>
    </form>
  )
}

function getTabStyle(isActive) {
  return {
    flex: 1,
    border: isActive ? '1px solid rgba(124, 58, 237, 0.18)' : '1px solid rgba(124, 58, 237, 0.1)',
    background: isActive ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : '#ffffff',
    color: isActive ? '#ffffff' : '#31224f',
    borderRadius: '14px',
    padding: '0.85rem 1rem',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 10px 24px rgba(124, 58, 237, 0.18)' : 'none',
  }
}

const styles = {
  loginWrapper: {
    minHeight: '72vh',
    display: 'grid',
    placeItems: 'center',
  },
  loginCard: {
    width: '100%',
    maxWidth: '520px',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '28px',
    padding: '2rem',
    boxShadow: '0 18px 45px rgba(91, 33, 182, 0.08)',
  },
  loginHeader: {
    marginBottom: '1.25rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.45rem 0.75rem',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.08)',
    color: '#7c3aed',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  loginTitle: {
    margin: '1rem 0 0.7rem',
    color: '#140f24',
    fontSize: '1.9rem',
    lineHeight: 1.15,
  },
  loginText: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.7,
  },
  tabRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '1.25rem',
    marginBottom: '0.5rem',
  },
  formArea: {
    marginTop: '1rem',
  },
  formGroup: {
    marginTop: '1rem',
  },
  filterLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  fullButton: {
    width: '100%',
    marginTop: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    margin: '1rem 0 0',
    textAlign: 'center',
    color: '#6d6289',
    lineHeight: 1.7,
    fontSize: '0.95rem',
  },
  errorText: {
    margin: '1rem 0 0',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#b91c1c',
    fontWeight: 700,
  },
  successText: {
    margin: '1rem 0 0',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#047857',
    fontWeight: 700,
  },
}

export default LoginPage