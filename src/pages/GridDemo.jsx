import { useState, useEffect, useMemo, useCallback } from 'react'

const PAGE_SIZE = 50

const ALL_COLUMNS = [
  { key: 'flag',         label: 'Flag',          locked: true,  noSort: true, noFilter: true },
  { key: 'commonName',   label: 'Common Name',   locked: true  },
  { key: 'officialName', label: 'Official Name', locked: false },
  { key: 'region',       label: 'Region',        locked: false },
  { key: 'subregion',    label: 'Subregion',     locked: false },
  { key: 'capital',      label: 'Capital',       locked: false },
  { key: 'population',   label: 'Population',    locked: false, align: 'right' },
  { key: 'area',         label: 'Area km²',      locked: false, align: 'right' },
  { key: 'languages',    label: 'Languages',     locked: false },
  { key: 'currencies',   label: 'Currencies',    locked: false },
  { key: 'timezones',    label: 'Timezones',     locked: false },
  { key: 'independent',  label: 'Independent',   locked: false, bool: true },
  { key: 'unMember',     label: 'UN Member',     locked: false, bool: true },
  { key: 'callingCode',  label: 'Calling Code',  locked: false },
  { key: 'tld',          label: 'TLD',           locked: false },
  { key: 'drivingSide',  label: 'Driving Side',  locked: false },
]

// REST Countries API enforces a 10-field max per request.
// Two parallel requests merged by common name.
const BASE    = 'https://restcountries.com/v3.1/all'
const BATCH_A = `${BASE}?fields=name,flags,region,subregion,capital,population,area,independent,unMember,idd`
const BATCH_B = `${BASE}?fields=name,languages,currencies,timezones,tld,car`

async function fetchCountries() {
  const [resA, resB] = await Promise.all([fetch(BATCH_A), fetch(BATCH_B)])
  if (!resA.ok) throw new Error(`HTTP ${resA.status}`)
  if (!resB.ok) throw new Error(`HTTP ${resB.status}`)
  const [dataA, dataB] = await Promise.all([resA.json(), resB.json()])

  const mapB = {}
  dataB.forEach(c => { mapB[c.name?.common] = c })

  return dataA.map(c => {
    const b   = mapB[c.name?.common] || {}
    const idd = c.idd || {}
    const root     = idd.root     || ''
    const suffixes = idd.suffixes || []
    const callingCode = suffixes.length === 1 ? root + suffixes[0] : root || '—'

    return {
      flag:         c.flags?.png || c.flags?.svg || '',
      flagAlt:      c.flags?.alt || '',
      commonName:   c.name?.common   || '—',
      officialName: c.name?.official || '—',
      region:       c.region    || '—',
      subregion:    c.subregion || '—',
      capital:      (c.capital  || []).join(', ') || '—',
      population:   c.population ?? 0,
      area:         c.area       ?? 0,
      languages:    Object.values(b.languages  || {}).join(', ') || '—',
      currencies:   Object.values(b.currencies || {}).map(cu => cu.name).join(', ') || '—',
      timezones:    (b.timezones || []).join(', ') || '—',
      independent:  c.independent === true ? true : c.independent === false ? false : null,
      unMember:     c.unMember    === true ? true : c.unMember    === false ? false : null,
      callingCode,
      tld:          (b.tld || []).join(', ') || '—',
      drivingSide:  b.car?.side || '—',
    }
  })
}

// Return the lowercase string used for per-column filtering
function filterStr(colKey, row) {
  switch (colKey) {
    case 'flag':        return ''
    case 'population':  return row.population.toLocaleString()
    case 'area':        return row.area.toLocaleString()
    case 'independent': return row.independent === true ? 'yes' : row.independent === false ? 'no' : ''
    case 'unMember':    return row.unMember    === true ? 'yes' : row.unMember    === false ? 'no' : ''
    default:            return String(row[colKey] ?? '').toLowerCase()
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ dir }) {
  if (!dir) return <span className="ml-1 opacity-40 text-xs">↕</span>
  return <span className="ml-1 text-xs">{dir === 'asc' ? '↑' : '↓'}</span>
}

function BoolBadge({ value }) {
  if (value === true)  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Yes</span>
  if (value === false) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">No</span>
  return <span className="text-gray-400 dark:text-gray-500">—</span>
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
      >
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        typeof p === 'string'
          ? <span key={`e${i}`} className="px-1 text-gray-400 dark:text-gray-500 text-xs select-none">…</span>
          : <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-7 h-7 text-xs rounded border transition-colors ${
                p === page
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] font-semibold'
                  : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
      >
        Next ›
      </button>
    </div>
  )
}

function DetailPanel({ country, onClose }) {
  return (
    <tr>
      <td colSpan={100} className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-0">
        <div className="p-5">
          <div className="flex items-start gap-5">
            {country.flag && (
              <img
                src={country.flag}
                alt={country.flagAlt || country.commonName}
                className="w-28 h-auto rounded shadow border border-gray-200 dark:border-gray-600 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">{country.commonName}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
                  aria-label="Close detail"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Official Name:</span> <span className="text-gray-800 dark:text-gray-200">{country.officialName}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Region:</span> <span className="text-gray-800 dark:text-gray-200">{country.region}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Subregion:</span> <span className="text-gray-800 dark:text-gray-200">{country.subregion}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Capital:</span> <span className="text-gray-800 dark:text-gray-200">{country.capital}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Population:</span> <span className="text-gray-800 dark:text-gray-200">{country.population.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Area km²:</span> <span className="text-gray-800 dark:text-gray-200">{country.area.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Languages:</span> <span className="text-gray-800 dark:text-gray-200">{country.languages}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Currencies:</span> <span className="text-gray-800 dark:text-gray-200">{country.currencies}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Timezones:</span> <span className="text-gray-800 dark:text-gray-200">{country.timezones}</span></div>
                <div className="flex items-center gap-1"><span className="text-gray-500 dark:text-gray-400 font-medium">Independent:</span> <BoolBadge value={country.independent} /></div>
                <div className="flex items-center gap-1"><span className="text-gray-500 dark:text-gray-400 font-medium">UN Member:</span> <BoolBadge value={country.unMember} /></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Calling Code:</span> <span className="text-gray-800 dark:text-gray-200">{country.callingCode}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">TLD:</span> <span className="text-gray-800 dark:text-gray-200">{country.tld}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400 font-medium">Driving Side:</span> <span className="text-gray-800 dark:text-gray-200 capitalize">{country.drivingSide}</span></div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function GridDemo() {
  const [countries,    setCountries]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [colFilters,   setColFilters]   = useState({})
  const [sort, setSort] = useState({ key: 'commonName', dir: 'asc' })
  const [page,         setPage]         = useState(1)
  const [visibleCols,  setVisibleCols]  = useState(() =>
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  )
  const [colPanelOpen, setColPanelOpen] = useState(false)
  const [expandedRow,  setExpandedRow]  = useState(null)

  // Fetch
  useEffect(() => {
    fetchCountries()
      .then(data => { setCountries(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [])

  const hasFilters = Object.values(colFilters).some(v => v !== '')

  const getFilter = (key) => colFilters[key] || ''

  const setFilter = useCallback((key, val) => {
    setColFilters(prev => ({ ...prev, [key]: val }))
    setPage(1)
    setExpandedRow(null)
  }, [])

  const clearFilters = useCallback(() => {
    setColFilters({})
    setPage(1)
    setExpandedRow(null)
  }, [])

  // Filter + sort
  const filtered = useMemo(() => {
    return countries
      .filter(row =>
        ALL_COLUMNS.every(col => {
          const fv = (colFilters[col.key] || '').toLowerCase().trim()
          if (!fv || col.noFilter) return true
          return filterStr(col.key, row).includes(fv)
        })
      )
      .sort((a, b) => {
        if (!sort.key) return 0
        const av = a[sort.key], bv = b[sort.key]
        if (typeof av === 'number' && typeof bv === 'number') {
          return sort.dir === 'asc' ? av - bv : bv - av
        }
        const as = String(av ?? '').toLowerCase()
        const bs = String(bv ?? '').toLowerCase()
        if (as < bs) return sort.dir === 'asc' ? -1 : 1
        if (as > bs) return sort.dir === 'asc' ?  1 : -1
        return 0
      })
  }, [countries, colFilters, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const startIdx   = (safePage - 1) * PAGE_SIZE
  const paginated  = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  // Cycles: no sort → asc → desc → no sort
  const handleSort = useCallback((col) => {
    if (col.noSort) return
    setSort(prev => {
      if (prev.key !== col.key) return { key: col.key, dir: 'asc' }
      if (prev.dir === 'asc')   return { key: col.key, dir: 'desc' }
      return { key: null, dir: 'asc' }   // third click clears sort
    })
    setPage(1)
    setExpandedRow(null)
  }, [])

  const handlePageChange = useCallback((p) => {
    setPage(p)
    setExpandedRow(null)
  }, [])

  const toggleCol = useCallback((key) => {
    const col = ALL_COLUMNS.find(c => c.key === key)
    if (col?.locked) return
    setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const activeCols = ALL_COLUMNS.filter(c => visibleCols[c.key])

  const renderCell = (col, row) => {
    switch (col.key) {
      case 'flag':
        return row.flag
          ? <img src={row.flag} alt={row.flagAlt || row.commonName} className="w-9 h-6 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-600" />
          : <span className="text-gray-400 dark:text-gray-500">—</span>
      case 'population':  return row.population.toLocaleString()
      case 'area':        return row.area.toLocaleString()
      case 'independent': return <BoolBadge value={row.independent} />
      case 'unMember':    return <BoolBadge value={row.unMember} />
      case 'drivingSide': return <span className="capitalize">{row.drivingSide}</span>
      default:
        return <span className="truncate block max-w-[160px]" title={row[col.key]}>{row[col.key]}</span>
    }
  }

  const renderFilterCell = (col) => {
    if (col.noFilter) return null

    const inputClass =
      'w-full bg-white/10 text-white text-xs rounded px-1.5 py-1 border border-white/20 ' +
      'focus:outline-none focus:bg-white/20 focus:border-white/50 placeholder-white/40'

    if (col.bool) {
      return (
        <select
          value={getFilter(col.key)}
          onChange={e => setFilter(col.key, e.target.value)}
          onClick={e => e.stopPropagation()}
          className={inputClass + ' cursor-pointer'}
        >
          <option value="">All</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )
    }

    return (
      <input
        type="text"
        value={getFilter(col.key)}
        onChange={e => setFilter(col.key, e.target.value)}
        onClick={e => e.stopPropagation()}
        placeholder="Filter…"
        className={inputClass}
      />
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a4a7a 100%)' }} className="px-6 py-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌍</span>
            <h1 className="text-3xl font-bold text-white">World Countries Grid</h1>
          </div>
          <p className="text-blue-200 text-sm">
            Live data from{' '}
            <a href="https://restcountries.com" target="_blank" rel="noreferrer" className="underline hover:text-white">
              REST Countries API
            </a>
            {!loading && ` · ${filtered.length.toLocaleString()} of ${countries.length.toLocaleString()} countries`}
            {!loading && filtered.length > 0 && ` · page ${safePage} of ${totalPages}`}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3 mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {hasFilters ? (
              <>
                <span className="inline-flex items-center gap-1 text-[#1e3a5f] dark:text-blue-300 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Filters active
                </span>
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs transition-colors"
                >
                  Clear all
                </button>
              </>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs">Type in any column header below to filter · click a header to sort</span>
            )}
          </div>

          {/* Column manager */}
          <div className="relative">
            <button
              onClick={() => setColPanelOpen(o => !o)}
              className="px-3 py-1.5 text-sm rounded-lg border border-[#1e3a5f] dark:border-blue-400 text-[#1e3a5f] dark:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Columns
            </button>
            {colPanelOpen && (
              <div className="absolute right-0 top-10 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 w-56">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Toggle Columns</p>
                {ALL_COLUMNS.map(col => (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2 py-1 text-sm select-none text-gray-700 dark:text-gray-300 ${col.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-[#1e3a5f] dark:hover:text-blue-300'}`}
                  >
                    <input
                      type="checkbox"
                      checked={visibleCols[col.key]}
                      onChange={() => toggleCol(col.key)}
                      disabled={col.locked}
                      className="accent-[#1e3a5f]"
                    />
                    {col.label}
                    {col.locked && <span className="text-xs text-gray-400 dark:text-gray-500">(locked)</span>}
                  </label>
                ))}
                <button
                  onClick={() => setColPanelOpen(false)}
                  className="mt-3 w-full text-xs text-center text-[#1e3a5f] dark:text-blue-300 hover:underline"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading countries…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-5xl">🌐</span>
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Failed to load countries</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">Could not reach the REST Countries API. Please check your connection and try refreshing.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16305a] transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-gray-800 dark:text-gray-200">
                <thead>
                  {/* Sort row */}
                  <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                    {activeCols.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col)}
                        onMouseEnter={e => { if (!col.noSort) e.currentTarget.style.backgroundColor = '#16305a' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1e3a5f' }}
                        onMouseDown={e =>  { if (!col.noSort) e.currentTarget.style.backgroundColor = '#142d4a' }}
                        onMouseUp={e =>    { if (!col.noSort) e.currentTarget.style.backgroundColor = '#16305a' }}
                        style={{ backgroundColor: '#1e3a5f', transition: 'background-color 100ms' }}
                        className={`px-3 pt-3 pb-1 font-semibold whitespace-nowrap select-none
                          ${col.noSort ? '' : 'cursor-pointer'}
                          ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        <span className="inline-flex items-center gap-0.5">
                          {col.label}
                          {!col.noSort && <SortIcon dir={sort.key === col.key ? sort.dir : null} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                  {/* Filter row */}
                  <tr className="bg-[#1e3a5f]">
                    {activeCols.map(col => (
                      <th key={col.key} className="px-2 pb-2 pt-0">
                        {renderFilterCell(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={100} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl">🔍</span>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">No countries match your filters</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">Edit the filter inputs above or clear them all.</p>
                          <button
                            onClick={clearFilters}
                            className="mt-1 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16305a] transition-colors"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, idx) => {
                      const isExpanded = expandedRow === row.commonName
                      const isEven     = idx % 2 === 0
                      return [
                        <tr
                          key={row.commonName}
                          onClick={() => setExpandedRow(isExpanded ? null : row.commonName)}
                          className={`cursor-pointer transition-colors duration-100 ${
                            isExpanded
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-l-[#1e3a5f]'
                              : isEven
                                ? 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                          }`}
                        >
                          {activeCols.map(col => (
                            <td
                              key={col.key}
                              className={`px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 ${col.align === 'right' ? 'text-right' : ''}`}
                            >
                              {renderCell(col, row)}
                            </td>
                          ))}
                        </tr>,
                        isExpanded && (
                          <DetailPanel
                            key={`${row.commonName}-detail`}
                            country={row}
                            onClose={() => setExpandedRow(null)}
                          />
                        ),
                      ]
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / pagination */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {filtered.length === 0 ? (
                  <>
                    <strong>0</strong> results
                    {hasFilters && ` (filtered from ${countries.length.toLocaleString()})`}
                  </>
                ) : (
                  <>
                    Rows{' '}
                    <strong>{(startIdx + 1).toLocaleString()}–{Math.min(startIdx + PAGE_SIZE, filtered.length).toLocaleString()}</strong>
                    {' '}of{' '}
                    <strong>{filtered.length.toLocaleString()}</strong>
                    {hasFilters && ` (filtered from ${countries.length.toLocaleString()})`}
                  </>
                )}
              </span>

              {filtered.length > 0 && <Pagination page={safePage} totalPages={totalPages} onChange={handlePageChange} />}

              <a
                href="https://restcountries.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-[#1e3a5f] dark:hover:text-blue-300 hover:underline"
              >
                Data: REST Countries API
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Dismiss column panel on outside click */}
      {colPanelOpen && <div className="fixed inset-0 z-10" onClick={() => setColPanelOpen(false)} />}
    </div>
  )
}
