function StatsCard({ label, value, detail }) {
  return (
    <div style={styles.statsCard}>
      <p style={styles.statsLabel}>{label}</p>
      <h3 style={styles.statsValue}>{value}</h3>
      <p style={styles.statsDetail}>{detail}</p>
    </div>
  )
}

const styles = {
  statsCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '22px',
    padding: '1.1rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  statsLabel: {
    margin: 0,
    color: '#7a6d95',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  statsValue: {
    margin: '0.75rem 0 0.45rem',
    color: '#140f24',
    fontSize: '1.8rem',
  },
  statsDetail: {
    margin: 0,
    color: '#06b6d4',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
}

export default StatsCard