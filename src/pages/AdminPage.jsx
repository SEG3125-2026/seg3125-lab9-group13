import { useEffect, useMemo, useState } from 'react'
import StatsCard from '../components/StatsCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { apiFetch } from '../utils/api.js'
import { useResponsive } from '../utils/useResponsive.js'

function AdminPage() {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGames: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalReviews: 0,
  })
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [salesTrendDays, setSalesTrendDays] = useState(7)
  const [salesTrend, setSalesTrend] = useState([])
  const [topGames, setTopGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [deletingUserId, setDeletingUserId] = useState('')

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    })
  }, [])

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5)
  }, [orders])

  const maxTrendValue = useMemo(() => {
    const values = salesTrend.map((item) => item.totalSales)
    return values.length > 0 ? Math.max(...values, 1) : 1
  }, [salesTrend])

  const maxTopGameQuantity = useMemo(() => {
    const values = topGames.map((item) => item.totalQuantity)
    return values.length > 0 ? Math.max(...values, 1) : 1
  }, [topGames])

  useEffect(() => {
    loadAdminData()
  }, [])

  useEffect(() => {
    loadSalesTrend(salesTrendDays)
  }, [salesTrendDays])

  async function loadAdminData() {
    try {
      setLoading(true)
      setError('')
      setActionMessage('')

      const [statsData, usersData, ordersData, topGamesData] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/users'),
        apiFetch('/admin/orders'),
        apiFetch('/admin/reports/top-games'),
      ])

      setStats(statsData)
      setUsers(usersData)
      setOrders(ordersData)
      setTopGames(topGamesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadSalesTrend(days) {
    try {
      const trendData = await apiFetch(`/admin/reports/sales-trend?days=${days}`)
      setSalesTrend(trendData)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRefresh() {
    await Promise.all([loadAdminData(), loadSalesTrend(salesTrendDays)])
  }

  async function handleDeleteUser(userId, displayName) {
    const confirmed = window.confirm(`Delete ${displayName}?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingUserId(userId)
      setError('')
      setActionMessage('')

      await apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE',
      })

      setUsers((current) => current.filter((user) => user.user_id !== userId))
      setStats((current) => ({
        ...current,
        totalUsers: Math.max(0, current.totalUsers - 1),
      }))
      setActionMessage('User deleted successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingUserId('')
    }
  }

  const adminLayoutStyle = {
    ...styles.adminLayout,
    gridTemplateColumns: isDesktop ? '240px minmax(0, 1fr)' : '1fr',
  }

  const sidebarStyle = {
    ...styles.adminSidebar,
    position: isDesktop ? 'sticky' : 'static',
    top: isDesktop ? '96px' : 'auto',
  }

  const headerStyle = {
    ...styles.adminHeader,
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'start',
  }

  const statsGridStyle = {
    ...styles.statsGrid,
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(2, minmax(0, 1fr))'
        : 'repeat(4, minmax(0, 1fr))',
  }

  const analyticsGridStyle = {
    ...styles.analyticsGrid,
    gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  }

  const tableHeaderStyle = {
    ...styles.tableRowHeader,
    gridTemplateColumns: isMobile
      ? '1.2fr 1fr'
      : '1.4fr 1.6fr 0.9fr 1fr auto',
  }

  return (
    <AppLayout>
      <section style={adminLayoutStyle}>
        <aside style={sidebarStyle}>
          <h2 style={styles.adminSidebarTitle}>Dashboard</h2>

          <a href="#overview" style={styles.adminNavItemActive}>
            Overview
          </a>

          <a href="#sales" style={styles.adminNavItem}>
            Sales
          </a>

          <a href="#users" style={styles.adminNavItem}>
            Users
          </a>

          <a href="#orders" style={styles.adminNavItem}>
            Orders
          </a>
        </aside>

        <div style={styles.adminContent}>
          <section id="overview" style={styles.anchorSection}>
            <div style={headerStyle}>
              <div>
                <h1 style={styles.pageTitle}>Admin Dashboard</h1>
                <p style={styles.pageText}>
                  View live store statistics, sales reports, user accounts, and recent orders.
                </p>
              </div>

              <button className="ghost-button" type="button" onClick={handleRefresh}>
                Refresh
              </button>
            </div>

            {error ? <p style={styles.errorText}>{error}</p> : null}
            {actionMessage ? <p style={styles.successText}>{actionMessage}</p> : null}

            <div style={statsGridStyle}>
              <StatsCard
                label="Total Revenue"
                value={currencyFormatter.format(stats.totalRevenue)}
                detail="Live database value"
              />
              <StatsCard
                label="Total Users"
                value={String(stats.totalUsers)}
                detail="Registered accounts"
              />
              <StatsCard
                label="Total Games"
                value={String(stats.totalGames)}
                detail="Games in catalog"
              />
              <StatsCard
                label="Orders"
                value={String(stats.totalOrders)}
                detail="Completed and pending"
              />
            </div>
          </section>

          <section id="sales" style={styles.anchorSection}>
            <section style={analyticsGridStyle}>
              <div style={styles.panelCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.chartTitle}>Sales Trend</h2>
                    <p style={styles.cardText}>
                      Daily revenue for the last {salesTrendDays} days.
                    </p>
                  </div>

                  <div style={styles.toggleGroup}>
                    <button
                      type="button"
                      style={getToggleStyle(salesTrendDays === 7)}
                      onClick={() => setSalesTrendDays(7)}
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      style={getToggleStyle(salesTrendDays === 30)}
                      onClick={() => setSalesTrendDays(30)}
                    >
                      30 Days
                    </button>
                  </div>
                </div>

                {salesTrend.length === 0 ? (
                  <p style={styles.loadingText}>No sales data yet.</p>
                ) : (
                  <div style={styles.barChart}>
                    {salesTrend.map((item) => (
                      <div key={item.date} style={styles.barColumn}>
                        <div style={styles.barTrack}>
                          <div
                            style={{
                              ...styles.barFill,
                              height: `${(item.totalSales / maxTrendValue) * 100}%`,
                            }}
                            title={`${item.date} - ${currencyFormatter.format(item.totalSales)}`}
                          />
                        </div>
                        <span style={styles.barLabel}>{item.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.panelCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.chartTitle}>Top Selling Games</h2>
                    <p style={styles.cardText}>Top 5 games by quantity sold.</p>
                  </div>
                  <span className="tag">Top 5</span>
                </div>

                {topGames.length === 0 ? (
                  <p style={styles.loadingText}>No game sales yet.</p>
                ) : (
                  <div style={styles.listChart}>
                    {topGames.map((item) => (
                      <div key={item.gameId} style={styles.listRow}>
                        <div style={styles.listRowTop}>
                          <span style={styles.listLabel}>{item.title}</span>
                          <span style={styles.listValue}>{item.totalQuantity}</span>
                        </div>

                        <div style={styles.progressTrack}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${(item.totalQuantity / maxTopGameQuantity) * 100}%`,
                            }}
                          />
                        </div>

                        <p style={styles.listRevenue}>
                          Revenue: {currencyFormatter.format(item.totalRevenue)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section style={styles.panelCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Order Status / Basic Summary</h2>
                  <p style={styles.cardText}>Key order metrics and the latest orders.</p>
                </div>
                <span className="tag">Orders</span>
              </div>

              <div style={styles.snapshotGrid}>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Total Orders</span>
                  <strong style={styles.snapshotValue}>{stats.totalOrders}</strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Total Revenue</span>
                  <strong style={styles.snapshotValue}>
                    {currencyFormatter.format(stats.totalRevenue)}
                  </strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Average Order Value</span>
                  <strong style={styles.snapshotValue}>
                    {currencyFormatter.format(stats.averageOrderValue)}
                  </strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>Reviews</span>
                  <strong style={styles.snapshotValue}>{stats.totalReviews}</strong>
                </div>
              </div>

              <div style={styles.recentOrdersBlock}>
                <h3 style={styles.subsectionTitle}>Recent Orders</h3>

                {recentOrders.length === 0 ? (
                  <p style={styles.loadingText}>No recent orders yet.</p>
                ) : (
                  <div style={styles.recentOrderList}>
                    {recentOrders.map((order) => (
                      <div key={order.orderId} style={styles.recentOrderRow}>
                        <div>
                          <p style={styles.recentOrderName}>{order.customer.displayName}</p>
                          <p style={styles.recentOrderMeta}>
                            {new Date(order.createdAt).toLocaleString('en-CA')}
                          </p>
                        </div>

                        <div style={styles.recentOrderRight}>
                          <span style={styles.orderStatus}>{order.status}</span>
                          <span style={styles.recentOrderTotal}>
                            {currencyFormatter.format(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </section>

          <section id="users" style={styles.anchorSection}>
            <section style={styles.panelCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>User Management</h2>
                  <p style={styles.cardText}>Admin can review and delete customer accounts.</p>
                </div>
                <span className="tag">Users</span>
              </div>

              {loading ? (
                <p style={styles.loadingText}>Loading admin data...</p>
              ) : users.length === 0 ? (
                <p style={styles.loadingText}>No users found.</p>
              ) : (
                <div style={styles.tablePlaceholder}>
                  <div style={tableHeaderStyle}>
                    <span>Name</span>
                    <span>Email</span>
                    {!isMobile && <span>Role</span>}
                    {!isMobile && <span>Created</span>}
                    <span>Action</span>
                  </div>

                  {users.map((user) => {
                    const rowStyle = {
                      ...styles.tableRow,
                      gridTemplateColumns: isMobile
                        ? '1.2fr 1fr'
                        : '1.4fr 1.6fr 0.9fr 1fr auto',
                    }

                    const isAdminUser = user.role === 'admin'

                    return (
                      <div key={user.user_id} style={rowStyle}>
                        <span style={styles.tablePrimaryText}>{user.display_name}</span>
                        <span style={styles.tableSecondaryText}>{user.email}</span>

                        {!isMobile && <span style={styles.tableMetaText}>{user.role}</span>}

                        {!isMobile && (
                          <span style={styles.tableMetaText}>
                            {new Date(user.created_at).toLocaleDateString('en-CA')}
                          </span>
                        )}

                        <div>
                          {isAdminUser ? (
                            <span style={styles.adminBadge}>Protected</span>
                          ) : (
                            <button
                              type="button"
                              style={styles.deleteButton}
                              onClick={() => handleDeleteUser(user.user_id, user.display_name)}
                              disabled={deletingUserId === user.user_id}
                            >
                              {deletingUserId === user.user_id ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </section>

          <section id="orders" style={styles.anchorSection}>
            <section style={styles.panelCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.chartTitle}>Recent Orders Detail</h2>
                  <p style={styles.cardText}>
                    See who placed an order, when it was placed, and what was purchased.
                  </p>
                </div>
                <span className="tag">Detail</span>
              </div>

              {loading ? (
                <p style={styles.loadingText}>Loading order data...</p>
              ) : orders.length === 0 ? (
                <p style={styles.loadingText}>No orders found.</p>
              ) : (
                <div style={styles.orderList}>
                  {orders.map((order) => (
                    <article key={order.orderId} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <div>
                          <h3 style={styles.orderTitle}>{order.customer.displayName}</h3>
                          <p style={styles.orderEmail}>{order.customer.email}</p>
                        </div>

                        <div style={styles.orderHeaderRight}>
                          <span style={styles.orderStatus}>{order.status}</span>
                          <span style={styles.orderTotal}>
                            {currencyFormatter.format(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div style={styles.orderMetaGrid}>
                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>Order ID</span>
                          <span style={styles.orderMetaValue}>{order.orderId}</span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>Order Time</span>
                          <span style={styles.orderMetaValue}>
                            {new Date(order.createdAt).toLocaleString('en-CA')}
                          </span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>Shipping Name</span>
                          <span style={styles.orderMetaValue}>{order.shippingName}</span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>Shipping Address</span>
                          <span style={styles.orderMetaValue}>{order.shippingAddress}</span>
                        </div>
                      </div>

                      <div style={styles.orderItemsBlock}>
                        <h4 style={styles.orderItemsTitle}>Items</h4>

                        <div style={styles.orderItemList}>
                          {order.items.map((item) => (
                            <div key={item.orderItemId} style={styles.orderItemRow}>
                              <div>
                                <p style={styles.orderItemTitle}>{item.title}</p>
                                <p style={styles.orderItemMeta}>
                                  Qty {item.quantity} · Unit {currencyFormatter.format(item.unitPrice)}
                                </p>
                              </div>

                              <span style={styles.orderItemTotal}>
                                {currencyFormatter.format(item.lineTotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </section>
    </AppLayout>
  )
}

function getToggleStyle(isActive) {
  return {
    border: isActive ? '1px solid rgba(124, 58, 237, 0.18)' : '1px solid rgba(124, 58, 237, 0.1)',
    background: isActive ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : '#ffffff',
    color: isActive ? '#ffffff' : '#31224f',
    borderRadius: '12px',
    padding: '0.65rem 0.9rem',
    fontWeight: 800,
  }
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
    padding: '1rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  adminSidebarTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.1rem',
  },
  adminNavItemActive: {
    marginTop: '1rem',
    display: 'block',
    padding: '0.8rem 0.9rem',
    borderRadius: '14px',
    background: 'rgba(124, 58, 237, 0.12)',
    color: '#7c3aed',
    fontWeight: 800,
    textDecoration: 'none',
  },
  adminNavItem: {
    marginTop: '0.75rem',
    display: 'block',
    padding: '0.8rem 0.9rem',
    borderRadius: '14px',
    background: '#f8f7ff',
    color: '#6d6289',
    fontWeight: 700,
    textDecoration: 'none',
  },
  anchorSection: {
    scrollMarginTop: '110px',
    display: 'grid',
    gap: '1.25rem',
  },
  adminContent: {
    display: 'grid',
    gap: '1.25rem',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gap: '1rem',
  },
  analyticsGrid: {
    display: 'grid',
    gap: '1.25rem',
  },
  panelCard: {
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
    marginBottom: '1rem',
    flexWrap: 'wrap',
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
  toggleGroup: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  barChart: {
    display: 'flex',
    alignItems: 'end',
    gap: '0.6rem',
    minHeight: '260px',
    paddingTop: '1rem',
  },
  barColumn: {
    flex: 1,
    minWidth: 0,
    display: 'grid',
    gap: '0.55rem',
    justifyItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: '220px',
    borderRadius: '16px',
    background: '#f3f0ff',
    display: 'flex',
    alignItems: 'end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: '16px 16px 0 0',
    background: 'linear-gradient(180deg, #06b6d4, #7c3aed)',
    minHeight: '4px',
  },
  barLabel: {
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.78rem',
  },
  listChart: {
    display: 'grid',
    gap: '1rem',
  },
  listRow: {
    background: '#f8f7ff',
    borderRadius: '18px',
    padding: '0.9rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  listRowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
  },
  listLabel: {
    color: '#140f24',
    fontWeight: 700,
  },
  listValue: {
    color: '#7c3aed',
    fontWeight: 800,
  },
  progressTrack: {
    marginTop: '0.7rem',
    height: '12px',
    borderRadius: '999px',
    background: '#ece8ff',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
  },
  listRevenue: {
    margin: '0.6rem 0 0',
    color: '#6d6289',
    fontWeight: 600,
    fontSize: '0.92rem',
  },
  snapshotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  snapshotItem: {
    background: '#f8f7ff',
    borderRadius: '18px',
    padding: '1rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  snapshotLabel: {
    display: 'block',
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  snapshotValue: {
    display: 'block',
    marginTop: '0.5rem',
    color: '#140f24',
    fontSize: '1.35rem',
  },
  recentOrdersBlock: {
    marginTop: '1.25rem',
  },
  subsectionTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1rem',
  },
  recentOrderList: {
    display: 'grid',
    gap: '0.8rem',
    marginTop: '0.9rem',
  },
  recentOrderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '1rem',
    background: '#f8f7ff',
    borderRadius: '16px',
    padding: '0.9rem',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  recentOrderName: {
    margin: 0,
    color: '#140f24',
    fontWeight: 700,
  },
  recentOrderMeta: {
    margin: '0.35rem 0 0',
    color: '#6d6289',
    fontSize: '0.9rem',
  },
  recentOrderRight: {
    display: 'grid',
    justifyItems: 'end',
    gap: '0.45rem',
  },
  recentOrderTotal: {
    color: '#140f24',
    fontWeight: 800,
  },
  tablePlaceholder: {
    display: 'grid',
    gap: '0.75rem',
  },
  tableRowHeader: {
    display: 'grid',
    gap: '0.75rem',
    padding: '0 0.25rem',
    color: '#6d6289',
    fontWeight: 800,
    fontSize: '0.9rem',
  },
  tableRow: {
    display: 'grid',
    gap: '0.75rem',
    alignItems: 'center',
    background: '#f8f7ff',
    border: '1px solid rgba(124, 58, 237, 0.08)',
    borderRadius: '18px',
    padding: '0.95rem 1rem',
  },
  tablePrimaryText: {
    color: '#140f24',
    fontWeight: 700,
  },
  tableSecondaryText: {
    color: '#6d6289',
    overflowWrap: 'anywhere',
  },
  tableMetaText: {
    color: '#4c4168',
    fontWeight: 600,
  },
  deleteButton: {
    border: 'none',
    borderRadius: '10px',
    padding: '0.65rem 0.9rem',
    background: '#dc2626',
    color: '#ffffff',
    fontWeight: 700,
  },
  adminBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.45rem 0.7rem',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.12)',
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '0.85rem',
  },
  loadingText: {
    margin: 0,
    color: '#6d6289',
    lineHeight: 1.7,
  },
  errorText: {
    margin: 0,
    padding: '0.9rem 1rem',
    borderRadius: '14px',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#b91c1c',
    fontWeight: 700,
  },
  successText: {
    margin: 0,
    padding: '0.9rem 1rem',
    borderRadius: '14px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#047857',
    fontWeight: 700,
  },
  orderList: {
    display: 'grid',
    gap: '1rem',
  },
  orderCard: {
    background: '#f8f7ff',
    border: '1px solid rgba(124, 58, 237, 0.08)',
    borderRadius: '22px',
    padding: '1rem',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  orderHeaderRight: {
    display: 'grid',
    justifyItems: 'end',
    gap: '0.5rem',
  },
  orderTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.1rem',
  },
  orderEmail: {
    margin: '0.35rem 0 0',
    color: '#6d6289',
    overflowWrap: 'anywhere',
  },
  orderStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.4rem 0.7rem',
    borderRadius: '999px',
    background: 'rgba(124, 58, 237, 0.12)',
    color: '#7c3aed',
    fontWeight: 800,
    fontSize: '0.85rem',
  },
  orderTotal: {
    color: '#140f24',
    fontWeight: 800,
    fontSize: '1.05rem',
  },
  orderMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.85rem',
    marginTop: '1rem',
  },
  orderMetaItem: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '0.85rem',
    border: '1px solid rgba(124, 58, 237, 0.06)',
  },
  orderMetaLabel: {
    display: 'block',
    color: '#6d6289',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  orderMetaValue: {
    display: 'block',
    marginTop: '0.35rem',
    color: '#31224f',
    fontWeight: 600,
    overflowWrap: 'anywhere',
  },
  orderItemsBlock: {
    marginTop: '1rem',
  },
  orderItemsTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1rem',
  },
  orderItemList: {
    display: 'grid',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  orderItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '1rem',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '0.85rem',
    border: '1px solid rgba(124, 58, 237, 0.06)',
  },
  orderItemTitle: {
    margin: 0,
    color: '#140f24',
    fontWeight: 700,
  },
  orderItemMeta: {
    margin: '0.3rem 0 0',
    color: '#6d6289',
    fontSize: '0.9rem',
  },
  orderItemTotal: {
    color: '#7c3aed',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
}

export default AdminPage