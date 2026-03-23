import Header from '../components/Header.jsx'

function AppLayout({ children }) {
  return (
    <div style={styles.app}>
      <Header />
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f6f4ff',
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1.25rem 3rem',
  },
}

export default AppLayout