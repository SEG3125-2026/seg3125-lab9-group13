import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import GameCard from '../components/GameCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { games } from '../data/games.js'
import AppLayout from '../layouts/AppLayout.jsx'
import { useResponsive } from '../utils/useResponsive.js'

const GENRE_ALL = 'ALL'
const PLATFORM_ALL = 'ALL'
const RATING_ANY = 'ANY'
const RATING_45 = '4.5'
const RATING_40 = '4.0'
const RATING_35 = '3.5'
const SORT_POPULARITY = 'POPULARITY'
const SORT_PRICE_ASC = 'PRICE_ASC'
const SORT_PRICE_DESC = 'PRICE_DESC'
const SORT_RELEASE_DATE = 'RELEASE_DATE'
const SORT_TITLE = 'TITLE'

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [genre, setGenre] = useState(GENRE_ALL)
  const [platform, setPlatform] = useState(PLATFORM_ALL)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [rating, setRating] = useState(RATING_ANY)
  const [sortBy, setSortBy] = useState(SORT_POPULARITY)

  const stats = useMemo(() => {
    const prices = games.map((g) => g.price)
    const years = games.map((g) => g.year)

    return {
      minP: Math.min(...prices),
      maxP: Math.max(...prices),
      minY: Math.min(...years),
      maxY: Math.max(...years),
    }
  }, [])

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || ''
    setSearchTerm(queryFromUrl)
  }, [searchParams])

  const genreOptions = useMemo(() => {
    return [GENRE_ALL, ...new Set(games.map((game) => game.genre))]
  }, [])

  const platformOptions = useMemo(() => {
    return [PLATFORM_ALL, ...new Set(games.map((game) => game.platform))]
  }, [])

  const sortOptions = useMemo(() => {
    return [
      { value: SORT_POPULARITY, label: t('catalogPage.popularity') },
      { value: SORT_PRICE_ASC, label: t('catalogPage.priceLowToHigh') },
      { value: SORT_PRICE_DESC, label: t('catalogPage.priceHighToLow') },
      { value: SORT_RELEASE_DATE, label: t('catalogPage.releaseDate') },
      { value: SORT_TITLE, label: t('catalogPage.titleSort') },
    ]
  }, [t])

  const ratingOptions = useMemo(() => {
    return [
      { value: RATING_ANY, label: t('catalogPage.anyRating') },
      { value: RATING_45, label: '4.5+' },
      { value: RATING_40, label: '4.0+' },
      { value: RATING_35, label: '3.5+' },
    ]
  }, [t])

  const filteredGames = useMemo(() => {
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)
    const yearMin = startYear === '' ? null : Number(startYear)
    const yearMax = endYear === '' ? null : Number(endYear)

    let items = games.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGenre = genre === GENRE_ALL || game.genre === genre
      const matchesPlatform = platform === PLATFORM_ALL || game.platform === platform
      const matchesMinPrice = min === null || game.price >= min
      const matchesMaxPrice = max === null || game.price <= max
      const matchesStartYear = yearMin === null || game.year >= yearMin
      const matchesEndYear = yearMax === null || game.year <= yearMax

      let matchesRating = true
      if (rating === RATING_45) matchesRating = game.rating >= 4.5
      if (rating === RATING_40) matchesRating = game.rating >= 4.0
      if (rating === RATING_35) matchesRating = game.rating >= 3.5

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPlatform &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesStartYear &&
        matchesEndYear &&
        matchesRating
      )
    })

    items = [...items].sort((a, b) => {
      if (sortBy === SORT_PRICE_ASC) return a.price - b.price
      if (sortBy === SORT_PRICE_DESC) return b.price - a.price
      if (sortBy === SORT_RELEASE_DATE) return b.year - a.year
      if (sortBy === SORT_TITLE) return a.title.localeCompare(b.title)
      return b.rating - a.rating
    })

    return items
  }, [searchTerm, genre, platform, minPrice, maxPrice, startYear, endYear, rating, sortBy])

  function handleSearchChange(event) {
    const value = event.target.value
    setSearchTerm(value)

    if (value.trim()) {
      setSearchParams({ q: value })
      return
    }

    setSearchParams({})
  }

  function resetFilters() {
    setSearchTerm('')
    setGenre(GENRE_ALL)
    setPlatform(PLATFORM_ALL)
    setMinPrice('')
    setMaxPrice('')
    setStartYear('')
    setEndYear('')
    setRating(RATING_ANY)
    setSortBy(SORT_POPULARITY)
    setSearchParams({})
  }

  const catalogLayoutStyle = {
    ...styles.catalogLayout,
    gridTemplateColumns: isMobile || isTablet ? '1fr' : '280px minmax(0, 1fr)',
  }

  const filterPanelStyle = {
    ...styles.filterPanel,
    position: isDesktop ? 'sticky' : 'static',
    top: isDesktop ? '96px' : 'auto',
    padding: isMobile ? '1rem' : '1.25rem',
  }

  const filterHeaderStyle = {
    ...styles.filterHeader,
    alignItems: isMobile ? 'stretch' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
  }

  const resetButtonStyle = {
    ...styles.resetButton,
    width: isMobile ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const toolbarStyle = {
    ...styles.catalogToolbar,
    alignItems: isMobile ? 'stretch' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
  }

  const sortSelectStyle = {
    ...styles.sortSelect,
    maxWidth: isMobile ? '100%' : '240px',
    width: isMobile ? '100%' : 'auto',
  }

  const cardGridStyle = {
    ...styles.cardGrid,
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(2, minmax(0, 1fr))'
        : 'repeat(auto-fit, minmax(220px, 1fr))',
  }

  return (
    <AppLayout>
      <section style={styles.pageIntro}>
        <h1 style={styles.pageTitle}>{t('catalogPage.title')}</h1>
        <p style={styles.pageText}>{t('catalogPage.description')}</p>
      </section>

      <section style={catalogLayoutStyle}>
        <aside style={filterPanelStyle}>
          <div style={filterHeaderStyle}>
            <h2 style={styles.filterTitle}>{t('catalogPage.filters')}</h2>

            <button
              type="button"
              className="ghost-button"
              style={resetButtonStyle}
              onClick={resetFilters}
            >
              {t('common.reset')}
            </button>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.search')}</label>
            <input
              className="field"
              placeholder={t('common.searchRetroGames')}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.genre')}</label>
            <select className="field" value={genre} onChange={(event) => setGenre(event.target.value)}>
              {genreOptions.map((option) => (
                <option key={option} value={option}>
                  {option === GENRE_ALL ? t('catalogPage.allGenres') : option}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.platform')}</label>
            <select
              className="field"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              {platformOptions.map((option) => (
                <option key={option} value={option}>
                  {option === PLATFORM_ALL ? t('catalogPage.allPlatforms') : option}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.minimumPrice')}</label>
            <input
              className="field"
              type="number"
              min={stats.minP}
              max={maxPrice || stats.maxP}
              placeholder={String(stats.minP)}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.maximumPrice')}</label>
            <input
              className="field"
              type="number"
              min={minPrice || stats.minP}
              max={stats.maxP}
              placeholder={String(stats.maxP)}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.startYear')}</label>
            <input
              className="field"
              type="number"
              min={stats.minY}
              max={endYear || stats.maxY}
              placeholder={String(stats.minY)}
              value={startYear}
              onChange={(event) => setStartYear(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.endYear')}</label>
            <input
              className="field"
              type="number"
              min={startYear || stats.minY}
              max={stats.maxY}
              placeholder={String(stats.maxY)}
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t('catalogPage.minimumRating')}</label>
            <select className="field" value={rating} onChange={(event) => setRating(event.target.value)}>
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div style={styles.catalogContent}>
          <div style={toolbarStyle}>
            <p style={styles.resultsText}>
              {filteredGames.length} {t('catalogPage.resultsFound')}
            </p>

            <div style={styles.sortWrap}>
              <label style={styles.sortLabel}>{t('catalogPage.sortBy')}</label>
              <select
                className="field"
                style={sortSelectStyle}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={cardGridStyle}>
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

const styles = {
  pageIntro: {
    marginBottom: '1.5rem',
  },
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
  catalogLayout: {
    display: 'grid',
    gap: '1.25rem',
    alignItems: 'start',
  },
  filterPanel: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  filterTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  resetButton: {},
  filterGroup: {
    marginTop: '1rem',
  },
  filterLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  catalogContent: {
    display: 'grid',
    gap: '1rem',
  },
  catalogToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  resultsText: {
    margin: 0,
    color: '#6d6289',
    fontWeight: 700,
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  sortLabel: {
    color: '#4c4168',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  sortSelect: {},
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
}

export default CatalogPage