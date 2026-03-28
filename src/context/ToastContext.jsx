import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)

  const hideToast = useCallback(() => {
    setToast(null)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      message,
      type,
    })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null)
      timeoutRef.current = null
    }, 2600)
  }, [])

  const value = useMemo(() => {
    return {
      showToast,
      hideToast,
    }
  }, [showToast, hideToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast ? (
        <div style={styles.wrapper}>
          <div
            style={{
              ...styles.toast,
              ...(toast.type === 'error' ? styles.errorToast : styles.successToast),
            }}
          >
            <span style={styles.message}>{toast.message}</span>

            <button type="button" onClick={hideToast} style={styles.closeButton}>
              ×
            </button>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.')
  }

  return context
}

const styles = {
  wrapper: {
    position: 'fixed',
    top: '88px',
    right: '18px',
    zIndex: 1000,
    maxWidth: '360px',
    width: 'calc(100vw - 36px)',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.9rem',
    borderRadius: '16px',
    padding: '0.95rem 1rem',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
    border: '1px solid transparent',
    backdropFilter: 'blur(10px)',
  },
  successToast: {
    background: 'rgba(236, 253, 245, 0.98)',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    color: '#065f46',
  },
  errorToast: {
    background: 'rgba(254, 242, 242, 0.98)',
    borderColor: 'rgba(239, 68, 68, 0.18)',
    color: '#991b1b',
  },
  message: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: '0.95rem',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    fontSize: '1.1rem',
    fontWeight: 800,
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
}