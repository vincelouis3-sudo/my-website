import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
  BarChart, Bar, LineChart, Line
} from 'recharts'
import { executiveData } from '../data/executiveData.js'

const PIE_COLORS_REV = ['#3B82F6', '#8B5CF6', '#10B981']
const PIE_COLORS_CLI = ['#F59E0B', '#3B82F6', '#8B5CF6', '#6B7280']

const priorityColors = {
  High:   'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
  Medium: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
  Low:    'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
}

const categoryColors = {
  Growth:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  Risk:      'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  Retention: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  Talent:    'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Market:    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
}

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

const SORT_OPTIONS = ['aum', 'ytdRevenue', 'netNewAssets']
const SORT_LABELS = { aum: 'AUM', ytdRevenue: 'Revenue', netNewAssets: 'Net New Assets' }
const AUM_PERIODS = ['1Y', '3Y', '5Y']

const sparklineData = {
  'Total AUM': [3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2],
  'Total Clients': [1780, 1795, 1810, 1820, 1830, 1840, 1847],
  'Net New Assets MTD': [22, 28, 31, 35, 37, 38, 38],
  'Avg Advisor AUM': [40, 41, 41.5, 42, 42.3, 42.6, 42.8],
  'YTD Revenue': [1.2, 2.4, 3.6, 5.0, 6.2, 7.4, 8.4],
  'Client Retention': [96.8, 96.7, 96.5, 96.4, 96.3, 96.2, 96.2],
}

const AreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.stroke }}>{p.name}: ${p.value}B</p>
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
      <p style={{ color: d.payload.fill }}>{d.value}%</p>
    </div>
  )
}

export default function ExecutiveSnapshot() {
  const { executive, kpis, aumHistory, advisorLeaderboard, businessMix, riskCompliance, geoDistribution, executiveAlerts } = executiveData

  const [aumPeriod, setAumPeriod] = useState('1Y')
  const [leaderSort, setLeaderSort] = useState('aum')
  const [expandedKpi, setExpandedKpi] = useState(null)

  const sortedLeaders = [...advisorLeaderboard].sort((a, b) => b[leaderSort] - a[leaderSort])

  const score = executive.healthScore
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
  const scoreRing = score >= 80 ? 'border-emerald-400' : score >= 60 ? 'border-amber-400' : 'border-red-400'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dark Header — fine in both modes */}
      <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-blue-300 text-sm mb-1">{executive.firm}</p>
            <h1 className="text-3xl font-bold">{executive.name}</h1>
            <p className="text-blue-200 text-sm mt-1">{executive.title}</p>
            <p className="text-blue-300 text-xs mt-2">Last updated: {executive.lastUpdated}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-blue-300 text-xs mb-2 uppercase tracking-wide">Business Health</p>
              <div className={`w-24 h-24 rounded-full border-4 ${scoreRing} flex flex-col items-center justify-center bg-white/5`}>
                <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-blue-300 text-xs">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => {
          const isExpanded = expandedKpi === kpi.label
          const spData = (sparklineData[kpi.label] || []).map((v, idx) => ({ v, idx }))
          return (
            <div
              key={kpi.label}
              className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isExpanded ? 'border-blue-300 dark:border-blue-600 ring-1 ring-blue-200 dark:ring-blue-700' : 'border-gray-100 dark:border-gray-700'
              } ${i === 5 ? 'lg:col-span-1' : ''}`}
              onClick={() => setExpandedKpi(isExpanded ? null : kpi.label)}
            >
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 leading-tight">{kpi.label}</p>
              <p className="text-xl font-bold text-[#1e3a5f] dark:text-blue-300">{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                <span>{kpi.trend === 'up' ? '↑' : '↓'}</span>
                <span>{Math.abs(kpi.change)}%</span>
              </div>
              {isExpanded && spData.length > 0 && (
                <div className="mt-3 -mx-1">
                  <ResponsiveContainer width="100%" height={48}>
                    <LineChart data={spData} margin={{ top: 2, right: 4, bottom: 2, left: 4 }}>
                      <Line type="monotone" dataKey="v" stroke={kpi.trend === 'up' ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* AUM Area Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Firm AUM vs Benchmark</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">In billions USD</p>
          </div>
          <div className="flex gap-1">
            {AUM_PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setAumPeriod(p)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  aumPeriod === p
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
          <AreaChart data={aumHistory[aumPeriod]} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} domain={['auto', 'auto']} width={52} />
            <Tooltip content={<AreaTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="aum" name="Pinnacle AUM" stroke="#3B82F6" strokeWidth={2.5} fill="url(#aumGrad)" dot={false} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="benchmark" name="Industry Benchmark" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="url(#benchGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Advisor Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Advisor Leaderboard</h2>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setLeaderSort(opt)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  leaderSort === opt
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {SORT_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {['Rank', 'Advisor', 'AUM', 'Clients', 'Net New Assets', 'YTD Revenue', 'vs Target'].map((h) => (
                  <th key={h} className={`text-left py-2 px-3 font-semibold text-gray-500 dark:text-gray-400 ${h === 'vs Target' ? 'min-w-32' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedLeaders.map((a, i) => {
                const pct = a.targetPct
                const barColor = pct >= 100 ? 'bg-emerald-500' : pct >= 80 ? 'bg-amber-400' : 'bg-red-400'
                return (
                  <tr key={a.name} className={`border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/30'}`}>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-100">{a.name}</td>
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{fmt(a.aum)}</td>
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{a.clients}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-medium">{fmt(a.netNewAssets)}</td>
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{fmt(a.ytdRevenue)}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 min-w-16">
                          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-semibold ${pct >= 100 ? 'text-emerald-600' : pct >= 80 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Mix Pies + Risk & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-bold text-[#1e3a5f] dark:text-blue-300 mb-3">Revenue by Business Line</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={businessMix.revenue} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {businessMix.revenue.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS_REV[i % PIE_COLORS_REV.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {businessMix.revenue.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS_REV[i] }} />
                  <span className="text-gray-600 dark:text-gray-300">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-bold text-[#1e3a5f] dark:text-blue-300 mb-3">Client Segments</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={businessMix.clients} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {businessMix.clients.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS_CLI[i % PIE_COLORS_CLI.length]} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {businessMix.clients.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS_CLI[i] }} />
                  <span className="text-gray-600 dark:text-gray-300">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-base font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Risk & Compliance</h2>
          <div className="space-y-3">
            {riskCompliance.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.status === 'good'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status === 'good' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
                </div>
                <span className={`text-lg font-bold ${item.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Geographic Distribution — Top States by Client Count</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={geoDistribution} layout="vertical" margin={{ top: 5, right: 40, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="state" tick={{ fontSize: 12 }} width={28} />
            <Tooltip formatter={(value) => [value, 'Clients']} contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="clients" name="Clients" fill="#3B82F6" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, fill: '#6B7280' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Executive Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Executive Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executiveAlerts.map((alert, i) => (
            <div key={i} className={`border rounded-xl p-4 ${priorityColors[alert.priority]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[alert.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {alert.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  alert.priority === 'High' ? 'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300'
                  : alert.priority === 'Medium' ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                  : 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                }`}>
                  {alert.priority}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
