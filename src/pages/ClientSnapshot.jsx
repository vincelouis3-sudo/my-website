import { useState, useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { clientData } from '../data/clientData.js'

const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#6B7280']

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function fmtSmall(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

const PERIODS = ['1M', '3M', '6M', '1Y']
const txColors = { Buy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', Sell: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', Dividend: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200">{d.name}</p>
      <p style={{ color: d.payload.fill }}>{d.value}% — {fmt(d.payload.amount)}</p>
    </div>
  )
}

export default function ClientSnapshot() {
  const { client, assetAllocation, holdings, performanceHistory, benchmarkHistory, recentTransactions } = clientData

  const [period, setPeriod] = useState('1M')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const chartData = useMemo(() => {
    const perf = performanceHistory[period]
    const bench = benchmarkHistory[period]
    return perf.map((p, i) => ({ date: p.date, portfolio: p.value, benchmark: bench[i]?.value ?? null }))
  }, [period])

  const filteredHoldings = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = holdings.filter(
      (h) => h.name.toLowerCase().includes(q) || h.ticker.toLowerCase().includes(q)
    )
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [search, sortKey, sortDir])

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="text-gray-300 dark:text-gray-600 ml-1">↕</span>
    return <span className="text-[#1e3a5f] dark:text-blue-300 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Good morning,</p>
          <h1 className="text-3xl font-bold text-[#1e3a5f] dark:text-blue-300">{client.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Account: <span className="font-medium text-gray-700 dark:text-gray-200">{client.accountNumber}</span>
            <span className="mx-2">·</span>
            Last updated: <span className="font-medium text-gray-700 dark:text-gray-200">{client.lastUpdated}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Markets Open</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Portfolio Value" value={fmt(client.portfolioValue)} neutral />
        <KpiCard label="Today's Gain" value={`+${fmt(client.todayGain)}`} sub={`+${client.todayGainPct}%`} positive />
        <KpiCard label="YTD Return" value={`+${client.ytdReturn}%`} positive />
        <KpiCard label="Annualized Return" value={`+${client.annualizedReturn}%`} positive />
      </div>

      {/* Asset Allocation + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={assetAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                {assetAllocation.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {assetAllocation.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-300">{a.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800 dark:text-gray-100">{a.value}%</span>
                  <span className="text-gray-400 dark:text-gray-500">{fmt(a.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Portfolio Performance</h2>
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    period === p
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#3B82F6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="benchmark" name="S&P 500" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Holdings</h2>
          <input
            type="text"
            placeholder="Search by name or ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'ticker', label: 'Ticker' },
                  { key: 'shares', label: 'Shares' },
                  { key: 'price', label: 'Price' },
                  { key: 'marketValue', label: 'Market Value' },
                  { key: 'dayChange', label: 'Day Chg %' },
                  { key: 'totalReturn', label: 'Total Return %' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="text-left py-2 px-3 font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-[#1e3a5f] dark:hover:text-blue-300 whitespace-nowrap select-none"
                    onClick={() => handleSort(key)}
                  >
                    {label}<SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((h, i) => (
                <tr
                  key={h.ticker}
                  className={`border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors ${
                    i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/30'
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-100">{h.name}</td>
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 font-mono">{h.ticker}</td>
                  <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{h.shares}</td>
                  <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{fmtSmall(h.price)}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-100">{fmt(h.marketValue)}</td>
                  <td className={`py-2.5 px-3 font-semibold ${h.dayChange > 0 ? 'text-emerald-600' : h.dayChange < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {h.dayChange > 0 ? '+' : ''}{h.dayChange.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-3 font-semibold ${h.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {h.totalReturn >= 0 ? '+' : ''}{h.totalReturn.toFixed(1)}%
                  </td>
                </tr>
              ))}
              {filteredHoldings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 dark:text-gray-500">No holdings match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.map((tx, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <div className="flex items-start gap-3">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${txColors[tx.type] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {tx.type}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {tx.security} <span className="text-gray-400 dark:text-gray-500 font-normal">({tx.ticker})</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{fmtSmall(tx.amount)}</p>
                {tx.shares > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">{tx.shares} shares @ {fmtSmall(tx.price)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, positive, negative, neutral }) {
  const valueColor = neutral
    ? 'text-[#1e3a5f] dark:text-blue-300'
    : positive
    ? 'text-emerald-600'
    : 'text-red-500'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className={`text-sm mt-1 ${positive ? 'text-emerald-500' : 'text-red-400'}`}>{sub}</p>}
    </div>
  )
}
