import { useState } from 'react'
import AppLayout from '../layouts/AppLayout.jsx'

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <AppLayout>
      <section style={styles.loginWrapper}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <span style={styles.badge}>Player Access</span>
            <h1 style={styles.loginTitle}>
              {activeTab === 'login' ? 'Login to your account' : 'Create your account'}
            </h1>
            <p style={styles.loginText}>
              {activeTab === 'login'
                ? 'Access your cart, order history, and favorite retro picks.'
                : 'Join Player 2: Parlor and start building your retro game collection.'}
            </p>
          </div>

          <div style={styles.tabRow}>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              style={getTabStyle(activeTab === 'login')}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              style={getTabStyle(activeTab === 'signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <SignUpForm />}
        </div>
      </section>
    </AppLayout>
  )
}

function LoginForm() {
  return (
    <div style={styles.formArea}>
      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Email</label>
        <input className="field" type="email" placeholder="player@example.com" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Password</label>
        <input className="field" type="password" placeholder="Enter your password" />
      </div>

      <button className="pixel-button" style={styles.fullButton} type="button">
        Login
      </button>

      <button className="ghost-button" style={styles.fullButton} type="button">
        Reset Password
      </button>

      <p style={styles.helperText}>
        New here? Switch to <strong>Sign Up</strong> to create an account.
      </p>
    </div>
  )
}

function SignUpForm() {
  return (
    <div style={styles.formArea}>
      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Username</label>
        <input className="field" type="text" placeholder="RetroPlayer13" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Email</label>
        <input className="field" type="email" placeholder="player@example.com" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Password</label>
        <input className="field" type="password" placeholder="Create a password" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.filterLabel}>Confirm Password</label>
        <input className="field" type="password" placeholder="Confirm your password" />
      </div>

      <button className="pixel-button" style={styles.fullButton} type="button">
        Create Account
      </button>

      <p style={styles.helperText}>
        Already have an account? Switch back to <strong>Login</strong>.
      </p>
    </div>
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
}

export default LoginPage