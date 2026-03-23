import StatsCard from '../components/StatsCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { games } from '../data/games.js'
import { useResponsive } from '../utils/useResponsive.js'

const salesTrend = [
  { month: 'Jan', value: 8200 },
  { month: 'Feb', value: 9100 },
  { month: 'Mar', value: 10400 },
  { month: 'Apr', value: 9800 },
  { month: 'May', value: 12100 },
  { month: 'Jun', value: 13400 },
]

const topGames = [
  { name: 'Chrono Blaster DX', sales: 148 },
  { name: 'Neon Ninja Zero', sales: 131 },
  { name: 'Pixel Kart 94', sales: 118 },
  { name: 'Galaxy Striker', sales: 96 },
]

const genreData = [
  { label: 'Shooter', value: 30, color: '#7c3aed' },
  { label: 'Adventure', value: 24, color: '#06b6d4' },
  { label: 'Racing', value: 18, color: '#ec4899' },
  { label: 'Sports', value: 16, color: '#f59e0b' },
  { label: 'Other', value: 12, color: '#10b981' },
]

const userRows = [
  { name: 'Alex Carter', email: 'alex@email.com', purchases: 14, lastLogin: 'Today' },
  { name: 'Jamie Kim', email: 'jamie@email.com', purchases: 8, lastLogin: 'Yesterday' },
  { name: 'Morgan Lee', email: 'morgan@email.com', purchases: 11, lastLogin: '2 days ago' },
  { name: 'Taylor Ross', email: 'taylor@email.com', purchases: 5, lastLogin: '3 days ago' },
]

function AdminPage() {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const maxSalesValue = Math.max(...salesTrend.map((item) => item.value))
  const maxTopGameSales = Math.max(...topGames.map((item) => item.sales))

  const adminLayoutStyle = {
    ...styles.adminLayout,
    gridTemplateColumns: isDesktop ? '240px minmax(0, 1fr)' : '1fr',
  }

  const sidebarStyle = {
    ...styles.adminSidebar,
    position: isDesktop ? 'sticky' : 'static',
    top: isDesktop ? '96px' : 'auto',
  }

  const analyticsGridStyle = {
    ...styles.analyticsGrid,
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  }

  const headerStyle = {
    ...styles.adminHeader,
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'start',
  }

  const snapshotGridStyle = {
    ...styles.snapshotGrid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  }

  const barChartStyle = {
    ...styles.barChart,
    gap: isMobile ? '0.55rem' : '0.9rem',
  }

  const tableHeaderStyle = {
    ...styles.tableRowHeader,
    gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1.4fr 1fr 1fr',
  }

  return (
    <AppLayout>
      <section style={adminLayoutStyle}>
        <aside style={sidebarStyle}>
          <h2 style={styles.adminSidebarTitle}>Dashboard</h2>
          <div style={styles.adminNavItemActive}>Overview</div>
          <div style={styles.adminNavItem}>Revenue</div>
          <div style={styles.adminNavItem}>Users</div>
          <div style={styles.adminNavItem}>Games</div>
          <div style={styles.adminNavItem}>Orders</div>
          <div style={styles.adminNavItem}>Settings</div>
        </aside>

        <div style={styles.adminContent}>
          <div style={headerStyle}>
            <div>
              <h1 style={styles.pageTitle}>Admin Analytics</h1>
              <p style={styles.pageText}>
                Monitor store performance, user activity, and top-selling games.
              </p>
            </div>

            <button className="ghost-button" type="button">
              Export Report
            </button>
          </div>

          <div style={styles.statsGrid}>
            <StatsCard label="Total Revenue" value="$18,420" detail="+12.5% this month" />
            <StatsCard label="Total Users" value="1,284" detail="+84 new users" />
            <StatsCard label="Total Games" value={String(games.length)} detail="Mock inventory data" />
            <StatsCard label="Purchases" value="742" detail="Average order $24.80" />
          </div>

          <div style={analyticsGridStyle}>
            <div style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Sales Trends</h2>
                  <p style={styles.cardText}>Revenue growth over the last 6 months</p>
                </div>
                <span className="tag">Revenue</span>
              </div>

              <div style={barChartStyle}>
                {salesTrend.map((item) => (
                  <div key={item.month} style={styles.barColumn}>
                    <div style={styles.barTrack}>
                      <div
                        style={{
                          ...styles.barFill,
                          height: `${(item.value / maxSalesValue) * 100}%`,
                        }}
                      />
                    </div>
                    <span style={styles.barLabel}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Top Selling Games</h2>
                  <p style={styles.cardText}>Best performing titles this month</p>
                </div>
                <span className="tag">Games</span>
              </div>

              <div style={styles.listChart}>
                {topGames.map((item) => (
                  <div key={item.name} style={styles.listRow}>
                    <div style={styles.listRowTop}>
                      <span style={styles.listLabel}>{item.name}</span>
                      <span style={styles.listValue}>{item.sales}</span>
                    </div>

                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${(item.sales / maxTopGameSales) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Genre Distribution</h2>
                  <p style={styles.cardText}>Popularity by genre</p>
                </div>
                <span className="tag">Genres</span>
              </div>

              <div style={styles.genreList}>
                {genreData.map((item) => (
                  <div key={item.label} style={styles.genreRow}>
                    <div style={styles.genreLabelWrap}>
                      <span
                        style={{
                          ...styles.genreDot,
                          background: item.color,
                        }}
                      />
                      <span style={styles.genreLabel}>{item.label}</span>
                    </div>

                    <div style={styles.genreValueWrap}>
                      <div style={styles.genreTrack}>
                        <div
                          style={{
                            ...styles.genreFill,
                            width: `${item.value}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <span style={styles.genreValue}>{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Store Snapshot</h2>
                  <p style={styles.cardText}>Quick operational overview</p>
                </div>
                <span className="tag">Overview</span>
              </div>

              <div style={snapshotGridStyle}>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Conversion Rate</span>
                  <strong style={styles.snapshotValue}>4.8%</strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Avg. Session</span>
                  <strong style={styles.snapshotValue}>6m 42s</strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Refund Rate</span>
                  <strong style={styles.snapshotValue}>1.2%</strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Repeat Buyers</span>
                  <strong style={styles.snapshotValue}>38%</strong>
                </div>
              </div>
            </div>

            <div style={styles.chartCardWide}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>User Analytics</h2>
                  <p style={styles.cardText}>Recent active users and purchase activity</p>
                </div>
                <span className="tag">Users</span>
              </div>

              <div style={styles.tablePlaceholder}>
                <div style={tableHeaderStyle}>
                  <span>Name</span>
                  <span>Email</span>
                  {!isMobile && <span>Total Purchases</span>}
                  {!isMobile && <span>Last Login</span>}
                </div>

                {userRows.map((user) => (
                  <div
                    key={user.email}
                    style={{
                      ...styles.tableRow,
                      gridTemplateColumns: isMobile ? '1fr 1fr' : '1.2fr 1.4fr 1fr 1fr',
                    }}
                  >
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    {!isMobile && <span>{user.purchases}</span>}
                    {!isMobile && <span>{user.lastLogin}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

const styles = {
  pageTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '2rem',
  },
  pageText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
  adminLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  adminSidebar: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  adminSidebarTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  adminNavItem: {
    marginTop: '0.85rem',
    color: '#4c4168',
    fontWeight: 700,
  },
  adminNavItemActive: {
    marginTop: '0.85rem',
    color: '#7c3aed',
    fontWeight: 800,
  },
  adminContent: {
    minWidth: 0,
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  analyticsGrid: {
    display: 'grid',
    gap: '1rem',
    marginTop: '1rem',
  },
  chartCard: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  chartCardWide: {
    gridColumn: '1 / -1',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  chartTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  cardText: {
    margin: '0.45rem 0 0',
    color: '#6d6289',
    lineHeight: 1.6,
  },
  barChart: {
    minHeight: '260px',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    alignItems: 'end',
  },
  barColumn: {
    display: 'grid',
    justifyItems: 'center',
    gap: '0.65rem',
  },
  barTrack: {
    width: '100%',
    height: '210px',
    borderRadius: '18px',
    background: '#f6f4ff',
    padding: '0.35rem',
    display: 'flex',
    alignItems: 'end',
  },
  barFill: {
    width: '100%',
    borderRadius: '14px',
    background: 'linear-gradient(180deg, #06b6d4, #7c3aed)',
  },
  barLabel: {
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  listChart: {
    display: 'grid',
    gap: '1rem',
  },
  listRow: {
    display: 'grid',
    gap: '0.5rem',
  },
  listRowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  listLabel: {
    color: '#24163c',
    fontWeight: 700,
  },
  listValue: {
    color: '#7c3aed',
    fontWeight: 800,
  },
  progressTrack: {
    width: '100%',
    height: '12px',
    borderRadius: '999px',
    background: '#f1edff',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
  },
  genreList: {
    display: 'grid',
    gap: '0.9rem',
  },
  genreRow: {
    display: 'grid',
    gap: '0.45rem',
  },
  genreLabelWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  genreDot: {
    width: '12px',
    height: '12px',
    borderRadius: '999px',
  },
  genreLabel: {
    color: '#24163c',
    fontWeight: 700,
  },
  genreValueWrap: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0.75rem',
    alignItems: 'center',
  },
  genreTrack: {
    width: '100%',
    height: '10px',
    borderRadius: '999px',
    background: '#f1edff',
    overflow: 'hidden',
  },
  genreFill: {
    height: '100%',
    borderRadius: '999px',
  },
  genreValue: {
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  snapshotGrid: {
    display: 'grid',
    gap: '0.9rem',
  },
  snapshotItem: {
    background: '#f8f7ff',
    border: '1px solid rgba(124, 58, 237, 0.08)',
    borderRadius: '18px',
    padding: '1rem',
    display: 'grid',
    gap: '0.45rem',
  },
  snapshotLabel: {
    color: '#7a6d95',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  snapshotValue: {
    color: '#140f24',
    fontSize: '1.2rem',
  },
  tablePlaceholder: {
    marginTop: '1rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
    borderRadius: '18px',
    overflow: 'hidden',
  },
  tableRowHeader: {
    display: 'grid',
    gap: '1rem',
    padding: '0.9rem 1rem',
    background: '#f6f4ff',
    color: '#4c4168',
    fontWeight: 800,
    fontSize: '0.9rem',
  },
  tableRow: {
    display: 'grid',
    gap: '1rem',
    padding: '0.95rem 1rem',
    borderTop: '1px solid rgba(124, 58, 237, 0.08)',
    color: '#5f547a',
  },
}

export default AdminPage