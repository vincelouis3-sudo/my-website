import { useState, useEffect, useMemo, useCallback } from 'react'

const ALL_COLUMNS = [
  { key: 'flag',        label: 'Flag',          locked: true },
  { key: 'commonName',  label: 'Common Name',   locked: true },
  { key: 'officialName',label: 'Official Name', locked: false },
  { key: 'region',      label: 'Region',        locked: false },
  { key: 'subregion',   label: 'Subregion',     locked: false },
  { key: 'capital',     label: 'Capital',       locked: false },
  { key: 'population',  label: 'Population',    locked: false, align: 'right' },
  { key: 'area',        label: 'Area km²',      locked: false, align: 'right' },
  { key: 'languages',   label: 'Languages',     locked: false },
  { key: 'currencies',  label: 'Currencies',    locked: false },
  { key: 'timezones',   label: 'Timezones',     locked: false },
  { key: 'independent', label: 'Independent',   locked: false },
  { key: 'unMember',    label: 'UN Member',     locked: false },
  { key: 'callingCode', label: 'Calling Code',  locked: false },
  { key: 'tld',         label: 'TLD',           locked: false },
  { key: 'drivingSide', label: 'Driving Side',  locked: false },
]

// REST Countries API now enforces a max of 10 fields per request.
// We split into two parallel requests and merge on common name.
const BASE = 'https://restcountries.com/v3.1/all'
const BATCH_A = `${BASE}?fields=name,flags,region,subregion,capital,population,area,independent,unMember,idd`
const BATCH_B = `${BASE}?fields=name,languages,currencies,timezones,tld,car`

async function fetchCountries() {
  const [resA, resB] = await Promise.all([fetch(BATCH_A), fetch(BATCH_B)])
  if (!resA.ok) throw new Error(`HTTP ${resA.status}`)
  if (!resB.ok) throw new Error(`HTTP ${resB.status}`)
  const [dataA, dataB] = await Promise.all([resA.json(), resB.json()])

  // Index batch B by common name for O(1) merge
  const mapB = {}
  dataB.forEach(c => { mapB[c.name?.common] = c })

  return dataA.map(c => {
    const b = mapB[c.name?.common] || {}
    const idd = c.idd || {}
    const root = idd.root || ''
    const suffixes = idd.suffixes || []
    const callingCode = suffixes.length === 1 ? root + suffixes[0] : root || '—'

    return {
      flag: c.flags?.png || c.flags?.svg || '',
      flagAlt: c.flags?.alt || '',
      commonName: c.name?.common || '—',
      officialName: c.name?.official || '—',
      region: c.region || '—',
      subregion: c.subregion || '—',
      capital: (c.capital || []).join(', ') || '—',
      population: c.population ?? 0,
      area: c.area ?? 0,
      languages: Object.values(b.languages || {}).join(', ') || '—',
      currencies: Object.values(b.currencies || {}).map(cur => cur.name).join(', ') || '—',
      timezones: (b.timezones || []).join(', ') || '—',
      independent: c.independent === true ? true : c.independent === false ? false : null,
      unMember: c.unMember === true ? true : c.unMember === false ? false : null,
      callingCode,
      tld: (b.tld || []).join(', ') || '—',
      drivingSide: b.car?.side || '—',
    }
  })
}

function SortIcon({ dir }) {
  if (!dir) return <span className="ml-1 text-gray-400 text-xs">↕</span>
  return <span className="ml-1 text-[#1e3a5f] text-xs">{dir === 'asc' ? '↑' : '↓'}</span>
}

function BoolBadge({ value }) {
  if (value === true)  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Yes</span>
  if (value === false) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">No</span>
  return <span className="text-gray-400">—</span>
}

function DetailPanel({ country, onClose }) {
  const fields = [
    ['Flag', null],
    ['Common Name', country.commonName],
    ['Official Name', country.officialName],
    ['Region', country.region],
    ['Subregion', country.subregion],
    ['Capital', country.capital],
    ['Population', country.population.toLocaleString()],
    ['Area km²', country.area.toLocaleString()],
    ['Languages', country.languages],
    ['Currencies', country.currencies],
    ['Timezones', country.timezones],
    ['Independent', null],
    ['UN Member', null],
    ['Calling Code', country.callingCode],
    ['TLD', country.tld],
    ['Driving Side', country.drivingSide],
  ]

  return (
    <tr>
      <td colSpan={100} className="bg-blue-50 border-b border-blue-200 p-0">
        <div className="p-5">
          <div className="flex items-start gap-5">
            {country.flag && (
              <img
                src={country.flag}
                alt={country.flagAlt || country.commonName}
                className="w-28 h-auto rounded shadow border border-gray-200 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#1e3a5f]">{country.commonName}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  aria-label="Close detail"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <div><span className="text-gray-500 font-medium">Official Name:</span> <span className="text-gray-800">{country.officialName}</span></div>
                <div><span className="text-gray-500 font-medium">Region:</span> <span className="text-gray-800">{country.region}</span></div>
                <div><span className="text-gray-500 font-medium">Subregion:</span> <span className="text-gray-800">{country.subregion}</span></div>
                <div><span className="text-gray-500 font-medium">Capital:</span> <span className="text-gray-800">{country.capital}</span></div>
                <div><span className="text-gray-500 font-medium">Population:</span> <span className="text-gray-800">{country.population.toLocaleString()}</span></div>
                <div><span className="text-gray-500 font-medium">Area km²:</span> <span className="text-gray-800">{country.area.toLocaleString()}</span></div>
                <div><span className="text-gray-500 font-medium">Languages:</span> <span className="text-gray-800">{country.languages}</span></div>
                <div><span className="text-gray-500 font-medium">Currencies:</span> <span className="text-gray-800">{country.currencies}</span></div>
                <div><span className="text-gray-500 font-medium">Timezones:</span> <span className="text-gray-800">{country.timezones}</span></div>
                <div className="flex items-center gap-1"><span className="text-gray-500 font-medium">Independent:</span> <BoolBadge value={country.independent} /></div>
                <div className="flex items-center gap-1"><span className="text-gray-500 font-medium">UN Member:</span> <BoolBadge value={country.unMember} /></div>
                <div><span className="text-gray-500 font-medium">Calling Code:</span> <span className="text-gray-800">{country.callingCode}</span></div>
                <div><span className="text-gray-500 font-medium">TLD:</span> <span className="text-gray-800">{country.tld}</span></div>
                <div><span className="text-gray-500 font-medium">Driving Side:</span> <span className="text-gray-800 capitalize">{country.drivingSide}</span></div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function GridDemo() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // Filters
  const [search, setSearch]         = useState('')
  const [regionFilter, setRegion]   = useState('')
  const [subregionFilter, setSub]   = useState('')
  const [indepFilter, setIndep]     = useState('all')
  const [unFilter, setUN]           = useState('all')

  // Sort
  const [sortKey, setSortKey]   = useState('commonName')
  const [sortDir, setSortDir]   = useState('asc')

  // Column visibility
  const [visibleCols, setVisibleCols] = useState(() =>
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  )
  const [colPanelOpen, setColPanelOpen] = useState(false)

  // Expanded row
  const [expandedRow, setExpandedRow] = useState(null)

  // Fetch data — two parallel requests merged to stay within 10-field API limit
  useEffect(() => {
    fetchCountries()
      .then(data => {
        setCountries(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Derived filter options
  const regions = useMemo(() => {
    const s = new Set(countries.map(c => c.region).filter(r => r && r !== '—'))
    return [...s].sort()
  }, [countries])

  const subregions = useMemo(() => {
    const source = regionFilter ? countries.filter(c => c.region === regionFilter) : countries
    const s = new Set(source.map(c => c.subregion).filter(r => r && r !== '—'))
    return [...s].sort()
  }, [countries, regionFilter])

  const handleRegionChange = useCallback((val) => {
    setRegion(val)
    setSub('')
    setExpandedRow(null)
  }, [])

  const clearFilters = useCallback(() => {
    setSearch('')
    setRegion('')
    setSub('')
    setIndep('all')
    setUN('all')
    setExpandedRow(null)
  }, [])

  const hasFilters = search || regionFilter || subregionFilter || indepFilter !== 'all' || unFilter !== 'all'

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return countries
      .filter(c => {
        if (q && !c.commonName.toLowerCase().includes(q) && !c.officialName.toLowerCase().includes(q) && !c.capital.toLowerCase().includes(q)) return false
        if (regionFilter && c.region !== regionFilter) return false
        if (subregionFilter && c.subregion !== subregionFilter) return false
        if (indepFilter === 'yes' && c.independent !== true)  return false
        if (indepFilter === 'no'  && c.independent !== false) return false
        if (unFilter === 'yes' && c.unMember !== true)  return false
        if (unFilter === 'no'  && c.unMember !== false) return false
        return true
      })
      .sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey]
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av
        }
        av = String(av ?? '').toLowerCase()
        bv = String(bv ?? '').toLowerCase()
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ?  1 : -1
        return 0
      })
  }, [countries, search, regionFilter, subregionFilter, indepFilter, unFilter, sortKey, sortDir])

  const handleSort = useCallback((key) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        return key
      }
      setSortDir('asc')
      return key
    })
    setExpandedRow(null)
  }, [])

  const toggleCol = useCallback((key) => {
    const col = ALL_COLUMNS.find(c => c.key === key)
    if (col?.locked) return
    setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const activeCols = ALL_COLUMNS.filter(c => visibleCols[c.key])

  const renderCell = (col, country) => {
    switch (col.key) {
      case 'flag':
        return country.flag
          ? <img src={country.flag} alt={country.flagAlt || country.commonName} className="w-9 h-6 object-cover rounded shadow-sm border border-gray-200" />
          : <span className="text-gray-400">—</span>
      case 'population':
        return country.population.toLocaleString()
      case 'area':
        return country.area.toLocaleString()
      case 'independent':
        return <BoolBadge value={country.independent} />
      case 'unMember':
        return <BoolBadge value={country.unMember} />
      case 'drivingSide':
        return <span className="capitalize">{country.drivingSide}</span>
      default:
        return <span className="truncate block max-w-[160px]" title={country[col.key]}>{country[col.key]}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a4a7a 100%)' }} className="px-6 py-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌍</span>
            <h1 className="text-3xl font-bold text-white">World Countries Grid</h1>
          </div>
          <p className="text-blue-200 text-sm">
            Live data from <a href="https://restcountries.com" target="_blank" rel="noreferrer" className="underline hover:text-white">REST Countries API</a> · {loading ? '…' : `${filtered.length.toLocaleString()} of ${countries.length.toLocaleString()} countries`}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Text search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Country, capital…"
                value={search}
                onChange={e => { setSearch(e.target.value); setExpandedRow(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              />
            </div>

            {/* Region */}
            <div className="min-w-[140px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Region</label>
              <select
                value={regionFilter}
                onChange={e => handleRegionChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
              >
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Subregion */}
            <div className="min-w-[160px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Subregion</label>
              <select
                value={subregionFilter}
                onChange={e => { setSub(e.target.value); setExpandedRow(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
                disabled={!subregions.length}
              >
                <option value="">All Subregions</option>
                {subregions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Independent */}
            <div className="min-w-[130px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Independent</label>
              <select
                value={indepFilter}
                onChange={e => { setIndep(e.target.value); setExpandedRow(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* UN Member */}
            <div className="min-w-[130px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">UN Member</label>
              <select
                value={unFilter}
                onChange={e => { setUN(e.target.value); setExpandedRow(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 self-end">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}

              {/* Column manager */}
              <div className="relative">
                <button
                  onClick={() => setColPanelOpen(o => !o)}
                  className="px-3 py-2 text-sm rounded-lg border border-[#1e3a5f] text-[#1e3a5f] font-medium hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Columns
                </button>
                {colPanelOpen && (
                  <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-56">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Toggle Columns</p>
                    {ALL_COLUMNS.map(col => (
                      <label key={col.key} className={`flex items-center gap-2 py-1 text-sm cursor-pointer select-none ${col.locked ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#1e3a5f]'}`}>
                        <input
                          type="checkbox"
                          checked={visibleCols[col.key]}
                          onChange={() => toggleCol(col.key)}
                          disabled={col.locked}
                          className="accent-[#1e3a5f]"
                        />
                        {col.label}
                        {col.locked && <span className="text-xs text-gray-400">(locked)</span>}
                      </label>
                    ))}
                    <button
                      onClick={() => setColPanelOpen(false)}
                      className="mt-3 w-full text-xs text-center text-[#1e3a5f] hover:underline"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading countries…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-5xl">🌐</span>
            <h3 className="text-lg font-bold text-red-700">Failed to load countries</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Could not reach the REST Countries API. Please check your connection and try refreshing.
            </p>
            <p className="text-xs text-gray-400 font-mono">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16305a] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-gray-700">No countries match your filters</h3>
            <p className="text-gray-500 text-sm">Try adjusting or clearing your search criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16305a] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    {activeCols.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`px-3 py-3 font-semibold whitespace-nowrap cursor-pointer select-none hover:bg-[#16305a] transition-colors ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        <span className="inline-flex items-center gap-0.5">
                          {col.label}
                          <SortIcon dir={sortKey === col.key ? sortDir : null} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((country, idx) => {
                    const isExpanded = expandedRow === country.commonName
                    const isEven = idx % 2 === 0
                    return [
                      <tr
                        key={country.commonName}
                        onClick={() => setExpandedRow(isExpanded ? null : country.commonName)}
                        className={`cursor-pointer transition-colors duration-100 ${
                          isExpanded
                            ? 'bg-blue-100 border-l-4 border-l-[#1e3a5f]'
                            : isEven
                              ? 'bg-white hover:bg-blue-50'
                              : 'bg-gray-50 hover:bg-blue-50'
                        }`}
                      >
                        {activeCols.map(col => (
                          <td
                            key={col.key}
                            className={`px-3 py-2.5 border-b border-gray-100 ${col.align === 'right' ? 'text-right' : ''}`}
                          >
                            {renderCell(col, country)}
                          </td>
                        ))}
                      </tr>,
                      isExpanded && <DetailPanel key={`${country.commonName}-detail`} country={country} onClose={() => setExpandedRow(null)} />
                    ]
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>
                Showing <strong>{filtered.length.toLocaleString()}</strong> of <strong>{countries.length.toLocaleString()}</strong> countries
                {hasFilters && ' (filtered)'}
              </span>
              <a
                href="https://restcountries.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1e3a5f] hover:underline"
              >
                Data: REST Countries API
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Close column panel on outside click */}
      {colPanelOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setColPanelOpen(false)} />
      )}
    </div>
  )
}
