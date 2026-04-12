import { useState, useEffect, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_COINGECKO_API_Key
const BASE_URL = 'https://api.coingecko.com/api/v3'

const headers = {
  accept: 'application/json',
  'x-cg-demo-api-key': API_KEY,
}

// Tiny inline sparkline rendered as an SVG path
function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null
  const w = 120, h = 40
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  })
  const color = positive ? '#10b981' : '#ef4444'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function fmt(n, decimals = 2) {
  if (n == null) return '—'
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (Math.abs(n) >= 1e3) return `$${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  return `$${n.toFixed(Math.max(decimals, n < 1 ? 6 : 2))}`
}

function pct(n) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

async function fetchMarkets(params = {}) {
  const defaults = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 25,
    page: 1,
    sparkline: true,
    price_change_percentage: '24h',
  }
  const q = new URLSearchParams({ ...defaults, ...params }).toString()
  const res = await fetch(`${BASE_URL}/coins/markets?${q}`, { headers })
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  return res.json()
}

async function fetchTrending() {
  const res = await fetch(`${BASE_URL}/search/trending`, { headers })
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const data = await res.json()
  const ids = data.coins.slice(0, 25).map((c) => c.item.id).join(',')
  return fetchMarkets({ ids, order: undefined, per_page: 25 })
}

async function searchCoins(query) {
  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, { headers })
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const data = await res.json()
  if (!data.coins?.length) return []
  const ids = data.coins.slice(0, 25).map((c) => c.id).join(',')
  return fetchMarkets({ ids, order: undefined, per_page: 25 })
}

const FILTERS = [
  { key: 'top25', label: '🏆 Top 25', desc: 'By market cap' },
  { key: 'trending', label: '🔥 Trending', desc: 'Hot right now' },
  { key: 'highest-price', label: '💰 Highest Price', desc: 'Most expensive coins' },
  { key: 'top-performers', label: '🚀 Top Performers', desc: 'Best 24h gain' },
]

export default function CryptoPage() {
  const [activeFilter, setActiveFilter] = useState('top25')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(t)
  }, [searchQuery])

  const loadCoins = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let data = []
      if (debouncedQuery.trim()) {
        data = await searchCoins(debouncedQuery.trim())
      } else if (activeFilter === 'top25') {
        data = await fetchMarkets()
      } else if (activeFilter === 'trending') {
        data = await fetchTrending()
      } else if (activeFilter === 'highest-price') {
        const raw = await fetchMarkets({ per_page: 100 })
        data = raw.sort((a, b) => (b.current_price ?? 0) - (a.current_price ?? 0)).slice(0, 25)
      } else if (activeFilter === 'top-performers') {
        const raw = await fetchMarkets({ per_page: 100 })
        data = raw
          .sort((a, b) => (b.price_change_percentage_24h ?? -Infinity) - (a.price_change_percentage_24h ?? -Infinity))
          .slice(0, 25)
      }
      setCoins(data)
    } catch (err) {
      setError(err.message || 'Failed to load crypto data.')
    } finally {
      setLoading(false)
    }
  }, [activeFilter, debouncedQuery])

  useEffect(() => { loadCoins() }, [loadCoins])

  function handleFilterClick(key) {
    setActiveFilter(key)
    setSearchQuery('')
    setDebouncedQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 border-b border-white/10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">₿</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Crypto Markets
                </h1>
              </div>
              <p className="text-gray-400 text-sm">
                Live data for the top cryptocurrencies by market cap.
              </p>
            </div>
            {/* CoinGecko Attribution — required per brand guide */}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors duration-150 self-start md:self-auto"
            >
              <img
                src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d2fad96fdbfb0327600b.png"
                alt="CoinGecko"
                className="h-5 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span className="text-xs text-gray-300 font-medium whitespace-nowrap">
                Powered by CoinGecko
              </span>
            </a>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterClick(f.key)}
                disabled={!!debouncedQuery}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeFilter === f.key && !debouncedQuery
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-xs font-normal mt-0.5 ${activeFilter === f.key && !debouncedQuery ? 'text-purple-200' : 'text-gray-500'}`}>
                  {f.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-4 relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or symbol…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setDebouncedQuery('') }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-10 h-10 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-gray-400 text-sm">Loading crypto data…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-5xl">⚠️</span>
            <p className="text-red-400 font-semibold text-lg">Failed to load data</p>
            <p className="text-gray-500 text-sm font-mono bg-white/5 rounded px-4 py-2">{error}</p>
            <button onClick={loadCoins} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && coins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-white font-semibold text-lg">No results found</p>
            <p className="text-gray-400 text-sm">
              Try a different search term or select a quick filter above.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && coins.length > 0 && (
          <>
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-medium">
              {debouncedQuery ? `Search results for "${debouncedQuery}"` : FILTERS.find(f => f.key === activeFilter)?.label} — {coins.length} coins
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {coins.map((coin, i) => {
                const up = (coin.price_change_percentage_24h ?? 0) >= 0
                const sparkData = coin.sparkline_in_7d?.price ?? []
                return (
                  <a
                    key={coin.id}
                    href={`https://www.coingecko.com/en/coins/${coin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-xl hover:shadow-purple-900/20"
                  >
                    {/* Rank badge */}
                    <span className="absolute top-3 right-3 text-xs text-gray-600 font-mono">
                      #{coin.market_cap_rank ?? i + 1}
                    </span>

                    {/* Coin identity */}
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-9 h-9 rounded-full"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=7c3aed&color=fff&size=36` }}
                      />
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate leading-tight">{coin.name}</p>
                        <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">{fmt(coin.current_price)}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${up ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                        {up ? '▲' : '▼'} {pct(coin.price_change_percentage_24h)}
                      </span>
                    </div>

                    {/* Sparkline */}
                    <div className="w-full overflow-hidden h-10">
                      <Sparkline data={sparkData.slice(-48)} positive={up} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs border-t border-white/5 pt-3">
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px]">Market Cap</p>
                        <p className="text-gray-300 font-medium">{fmt(coin.market_cap)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px]">24h Volume</p>
                        <p className="text-gray-300 font-medium">{fmt(coin.total_volume)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px]">24h High</p>
                        <p className="text-gray-300 font-medium">{fmt(coin.high_24h)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px]">24h Low</p>
                        <p className="text-gray-300 font-medium">{fmt(coin.low_24h)}</p>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Bottom attribution */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-gray-600 text-xs">
              <span>Data provided by</span>
              <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 underline underline-offset-2 transition-colors">
                CoinGecko
              </a>
              <span>— prices update on page load / filter change.</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
