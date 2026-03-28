import { useEffect, useMemo, useState } from 'react'
import StatsCard from '../components/StatsCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { apiFetch } from '../utils/api.js'
import { useResponsive } from '../utils/useResponsive.js'

function AdminPage() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const { language, t } = useLanguage()

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
  const [activeSection, setActiveSection] = useState('overview')

  const locale = language === 'zh' ? 'zh-CN' : 'en-CA'

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CAD',
    })
  }, [locale])

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

  useEffect(() => {
    const sectionIds = ['overview', 'sales', 'users', 'orders']

    function updateActiveSection() {
      const offset = 140
      let currentSection = 'overview'

      for (const id of sectionIds) {
        const element = document.getElementById(id)

        if (!element) {
          continue
        }

        const top = element.getBoundingClientRect().top

        if (top - offset <= 0) {
          currentSection = id
        }
      }

      setActiveSection(currentSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection)
    window.addEventListener('hashchange', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('hashchange', updateActiveSection)
    }
  }, [])

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
    const confirmed = window.confirm(`${t('adminPage.deleteUserConfirm')} ${displayName}?`)

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
      setActionMessage(t('adminPage.userDeletedSuccessfully'))
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
          <h2 style={styles.adminSidebarTitle}>{t('adminPage.dashboard')}</h2>

          <a
            href="#overview"
            style={getSidebarLinkStyle(activeSection === 'overview')}
            onClick={() => setActiveSection('overview')}
          >
            {t('adminPage.overview')}
          </a>

          <a
            href="#sales"
            style={getSidebarLinkStyle(activeSection === 'sales')}
            onClick={() => setActiveSection('sales')}
          >
            {t('adminPage.sales')}
          </a>

          <a
            href="#users"
            style={getSidebarLinkStyle(activeSection === 'users')}
            onClick={() => setActiveSection('users')}
          >
            {t('adminPage.users')}
          </a>

          <a
            href="#orders"
            style={getSidebarLinkStyle(activeSection === 'orders')}
            onClick={() => setActiveSection('orders')}
          >
            {t('adminPage.orders')}
          </a>
        </aside>

        <div style={styles.adminContent}>
          <section id="overview" style={styles.anchorSection}>
            <div style={headerStyle}>
              <div>
                <h1 style={styles.pageTitle}>{t('adminPage.pageTitle')}</h1>
                <p style={styles.pageText}>{t('adminPage.pageText')}</p>
              </div>

              <button className="ghost-button" type="button" onClick={handleRefresh}>
                {t('common.refresh')}
              </button>
            </div>

            {error ? <p style={styles.errorText}>{error}</p> : null}
            {actionMessage ? <p style={styles.successText}>{actionMessage}</p> : null}

            <div style={statsGridStyle}>
              <StatsCard
                label={t('adminPage.totalRevenue')}
                value={currencyFormatter.format(stats.totalRevenue)}
                detail={t('adminPage.liveDatabaseValue')}
              />
              <StatsCard
                label={t('adminPage.totalUsers')}
                value={String(stats.totalUsers)}
                detail={t('adminPage.registeredAccounts')}
              />
              <StatsCard
                label={t('adminPage.totalGames')}
                value={String(stats.totalGames)}
                detail={t('adminPage.gamesInCatalog')}
              />
              <StatsCard
                label={t('adminPage.ordersCount')}
                value={String(stats.totalOrders)}
                detail={t('adminPage.completedAndPending')}
              />
            </div>
          </section>

          <section id="sales" style={styles.anchorSection}>
            <section style={analyticsGridStyle}>
              <div style={styles.panelCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.chartTitle}>{t('adminPage.salesTrend')}</h2>
                    <p style={styles.cardText}>
                      {t('adminPage.salesTrendText')} {salesTrendDays} {language === 'zh' ? '天' : 'days'}.
                    </p>
                  </div>

                  <div style={styles.toggleGroup}>
                    <button
                      type="button"
                      style={getToggleStyle(salesTrendDays === 7)}
                      onClick={() => setSalesTrendDays(7)}
                    >
                      {t('adminPage.days7')}
                    </button>
                    <button
                      type="button"
                      style={getToggleStyle(salesTrendDays === 30)}
                      onClick={() => setSalesTrendDays(30)}
                    >
                      {t('adminPage.days30')}
                    </button>
                  </div>
                </div>

                {salesTrend.length === 0 ? (
                  <p style={styles.loadingText}>{t('adminPage.noSalesDataYet')}</p>
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
                    <h2 style={styles.chartTitle}>{t('adminPage.topSellingGames')}</h2>
                    <p style={styles.cardText}>{t('adminPage.topSellingGamesText')}</p>
                  </div>
                  <span className="tag">{t('adminPage.top5')}</span>
                </div>

                {topGames.length === 0 ? (
                  <p style={styles.loadingText}>{t('adminPage.noGameSalesYet')}</p>
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
                          {t('common.revenue')}: {currencyFormatter.format(item.totalRevenue)}
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
                  <h2 style={styles.chartTitle}>{t('adminPage.orderSummaryTitle')}</h2>
                  <p style={styles.cardText}>{t('adminPage.orderSummaryText')}</p>
                </div>
                <span className="tag">{t('adminPage.orders')}</span>
              </div>

              <div style={styles.snapshotGrid}>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>{t('adminPage.ordersCount')}</span>
                  <strong style={styles.snapshotValue}>{stats.totalOrders}</strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>{t('adminPage.totalRevenue')}</span>
                  <strong style={styles.snapshotValue}>
                    {currencyFormatter.format(stats.totalRevenue)}
                  </strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>{t('adminPage.averageOrderValue')}</span>
                  <strong style={styles.snapshotValue}>
                    {currencyFormatter.format(stats.averageOrderValue)}
                  </strong>
                </div>
                <div style={styles.snapshotItem}>
                  <span style={styles.snapshotLabel}>{t('adminPage.reviewsCount')}</span>
                  <strong style={styles.snapshotValue}>{stats.totalReviews}</strong>
                </div>
              </div>

              <div style={styles.recentOrdersBlock}>
                <h3 style={styles.subsectionTitle}>{t('adminPage.recentOrders')}</h3>

                {recentOrders.length === 0 ? (
                  <p style={styles.loadingText}>{t('adminPage.noRecentOrdersYet')}</p>
                ) : (
                  <div style={styles.recentOrderList}>
                    {recentOrders.map((order) => (
                      <div key={order.orderId} style={styles.recentOrderRow}>
                        <div>
                          <p style={styles.recentOrderName}>{order.customer.displayName}</p>
                          <p style={styles.recentOrderMeta}>
                            {new Date(order.createdAt).toLocaleString(locale)}
                          </p>
                        </div>

                        <div style={styles.recentOrderRight}>
                          <span style={styles.orderStatus}>{translateOrderStatus(order.status, language)}</span>
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
                  <h2 style={styles.chartTitle}>{t('adminPage.userManagement')}</h2>
                  <p style={styles.cardText}>{t('adminPage.userManagementText')}</p>
                </div>
                <span className="tag">{t('adminPage.users')}</span>
              </div>

              {loading ? (
                <p style={styles.loadingText}>{t('adminPage.loadingAdminData')}</p>
              ) : users.length === 0 ? (
                <p style={styles.loadingText}>{t('adminPage.noUsersFound')}</p>
              ) : (
                <div style={styles.tablePlaceholder}>
                  <div style={tableHeaderStyle}>
                    <span>{t('common.name')}</span>
                    <span>{t('common.email')}</span>
                    {!isMobile && <span>{t('common.role')}</span>}
                    {!isMobile && <span>{t('common.created')}</span>}
                    <span>{t('common.action')}</span>
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
                            {new Date(user.created_at).toLocaleDateString(locale)}
                          </span>
                        )}

                        <div>
                          {isAdminUser ? (
                            <span style={styles.adminBadge}>{t('common.protected')}</span>
                          ) : (
                            <button
                              type="button"
                              style={styles.deleteButton}
                              onClick={() => handleDeleteUser(user.user_id, user.display_name)}
                              disabled={deletingUserId === user.user_id}
                            >
                              {deletingUserId === user.user_id ? t('common.deleting') : t('common.delete')}
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
                  <h2 style={styles.chartTitle}>{t('adminPage.recentOrdersDetail')}</h2>
                  <p style={styles.cardText}>{t('adminPage.recentOrdersDetailText')}</p>
                </div>
                <span className="tag">{t('adminPage.orders')}</span>
              </div>

              {loading ? (
                <p style={styles.loadingText}>{t('adminPage.loadingOrderData')}</p>
              ) : orders.length === 0 ? (
                <p style={styles.loadingText}>{t('adminPage.noOrdersFound')}</p>
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
                          <span style={styles.orderStatus}>{translateOrderStatus(order.status, language)}</span>
                          <span style={styles.orderTotal}>
                            {currencyFormatter.format(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div style={styles.orderMetaGrid}>
                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>{t('common.orderId')}</span>
                          <span style={styles.orderMetaValue}>{order.orderId}</span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>{t('common.orderTime')}</span>
                          <span style={styles.orderMetaValue}>
                            {new Date(order.createdAt).toLocaleString(locale)}
                          </span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>{t('common.shippingName')}</span>
                          <span style={styles.orderMetaValue}>{order.shippingName}</span>
                        </div>

                        <div style={styles.orderMetaItem}>
                          <span style={styles.orderMetaLabel}>{t('common.shippingAddress')}</span>
                          <span style={styles.orderMetaValue}>{order.shippingAddress}</span>
                        </div>
                      </div>

                      <div style={styles.orderItemsBlock}>
                        <h4 style={styles.orderItemsTitle}>{t('common.items')}</h4>

                        <div style={styles.orderItemList}>
                          {order.items.map((item) => (
                            <div key={item.orderItemId} style={styles.orderItemRow}>
                              <div>
                                <p style={styles.orderItemTitle}>{item.title}</p>
                                <p style={styles.orderItemMeta}>
                                  {t('common.quantityShort')} {item.quantity} · {t('adminPage.qtyUnit')} {currencyFormatter.format(item.unitPrice)}
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

function translateOrderStatus(status, language) {
  const map = {
    pending: language === 'zh' ? '待处理' : 'Pending',
    paid: language === 'zh' ? '已支付' : 'Paid',
    shipped: language === 'zh' ? '已发货' : 'Shipped',
    cancelled: language === 'zh' ? '已取消' : 'Cancelled',
  }

  return map[status] || status
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

function getSidebarLinkStyle(isActive) {
  return {
    marginTop: '0.75rem',
    display: 'block',
    padding: '0.8rem 0.9rem',
    borderRadius: '14px',
    background: isActive ? 'rgba(124, 58, 237, 0.12)' : '#f8f7ff',
    color: isActive ? '#7c3aed' : '#6d6289',
    fontWeight: isActive ? 800 : 700,
    textDecoration: 'none',
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