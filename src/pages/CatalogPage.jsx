import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import GameCard from '../components/GameCard.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { games } from '../data/games.js'
import { useResponsive } from '../utils/useResponsive.js'

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const { isMobile, isTablet, isDesktop } = useResponsive()

  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [genre, setGenre] = useState('All Genres')
  const [platform, setPlatform] = useState('All Platforms')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [rating, setRating] = useState('Any Rating')
  const [sortBy, setSortBy] = useState('Popularity')

  const stats = useMemo(() => {
    if (!games || games.length === 0) return { minP: 0, maxP: 0, minY: 0, maxY: 0 };
    const prices = games.map((g) => g.price);
    const years = games.map((g) => g.year);
    return {
      minP: Math.min(...prices),
      maxP: Math.max(...prices),
      minY: Math.min(...years),
      maxY: Math.max(...years),
    };
  }, []);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || ''
    setSearchTerm(queryFromUrl)
  }, [searchParams])

  const genreOptions = useMemo(() => {
    return ['All Genres', ...new Set(games.map((game) => game.genre))]
  }, [])

  const platformOptions = useMemo(() => {
    return ['All Platforms', ...new Set(games.map((game) => game.platform))]
  }, [])

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

      const matchesGenre = genre === 'All Genres' || game.genre === genre
      const matchesPlatform =
        platform === 'All Platforms' || game.platform === platform
      const matchesMinPrice = min === null || game.price >= min
      const matchesMaxPrice = max === null || game.price <= max
      const matchesStartYear = yearMin === null || game.year >= yearMin
      const matchesEndYear = yearMax === null || game.year <= yearMax

      let matchesRating = true
      if (rating === '4.5+') matchesRating = game.rating >= 4.5
      if (rating === '4.0+') matchesRating = game.rating >= 4.0
      if (rating === '3.5+') matchesRating = game.rating >= 3.5

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
      if (sortBy === 'Price: Low to High') return a.price - b.price
      if (sortBy === 'Price: High to Low') return b.price - a.price
      if (sortBy === 'Release Date') return b.year - a.year
      if (sortBy === 'Title') return a.title.localeCompare(b.title)
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
    setGenre('All Genres')
    setPlatform('All Platforms')
    setMinPrice('')
    setMaxPrice('')
    setStartYear('')
    setEndYear('')
    setRating('Any Rating')
    setSortBy('Popularity')
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
        <h1 style={styles.pageTitle}>Game Catalog</h1>
        <p style={styles.pageText}>
          Search, filter, and sort retro titles across genres, platforms, and
          release years.
        </p>
      </section>

      <section style={catalogLayoutStyle}>
        <aside style={filterPanelStyle}>
          <div style={filterHeaderStyle}>
            <h2 style={styles.filterTitle}>Filters</h2>

            <button
              type="button"
              className="ghost-button"
              style={resetButtonStyle}
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search</label>
            <input
              className="field"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Genre</label>
            <select
              className="field"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            >
              {genreOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Platform</label>
            <select
              className="field"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              {platformOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Minimum Price</label>
            <input
              className="field"
              type="number"
              min={stats.minP}        // Lower bound from data
              max={maxPrice || stats.maxP} // Cannot exceed current max
              placeholder={stats.minP}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Maximum Price</label>
            <input
              className="field"
              type="number"
              min={minPrice || stats.minP} // Cannot be lower than current min
              max={stats.maxP}        // Upper bound from data
              placeholder={stats.maxP}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Start Year</label>
            <input
              className="field"
              type="number"
              min={stats.minY}
              max={endYear || stats.maxY}
              placeholder={stats.minY}
              value={startYear}
              onChange={(event) => setStartYear(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>End Year</label>
            <input
              className="field"
              type="number"
              min={startYear || stats.minY}
              max={stats.maxY}
              placeholder={stats.maxY}
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Rating</label>
            <select
              className="field"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option>Any Rating</option>
              <option>4.5+</option>
              <option>4.0+</option>
              <option>3.5+</option>
            </select>
          </div>

          <div style={styles.filterNote}>
            Filters update automatically as you browse.
          </div>
        </aside>

        <div style={styles.catalogContent}>
          <div style={toolbarStyle}>
            <p style={styles.resultsText}>
              Showing {filteredGames.length} of {games.length} games
            </p>

            <select
              className="field"
              style={sortSelectStyle}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Release Date</option>
              <option>Title</option>
            </select>
          </div>

          {filteredGames.length > 0 ? (
            <div style={cardGridStyle}>
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyTitle}>No games found</h3>
              <p style={styles.emptyText}>
                Try changing your search or resetting the filters.
              </p>
            </div>
          )}
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
  },
  filterTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.2rem',
  },
  resetButton: {
    padding: '0.55rem 0.85rem',
  },
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
  filterNote: {
    marginTop: '1rem',
    color: '#6d6289',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  catalogContent: {
    minWidth: 0,
  },
  catalogToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  resultsText: {
    margin: 0,
    color: '#6d6289',
    fontWeight: 600,
  },
  sortSelect: {},
  cardGrid: {
    display: 'grid',
    gap: '1rem',
  },
  emptyState: {
    minHeight: '280px',
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    borderRadius: '24px',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    padding: '2rem',
    boxShadow: '0 14px 34px rgba(91, 33, 182, 0.08)',
  },
  emptyTitle: {
    margin: 0,
    color: '#140f24',
    fontSize: '1.25rem',
  },
  emptyText: {
    margin: '0.75rem 0 0',
    color: '#6d6289',
    lineHeight: 1.7,
  },
}

export default CatalogPage
