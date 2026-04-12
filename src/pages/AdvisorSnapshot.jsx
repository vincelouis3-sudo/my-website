import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { advisorData } from '../data/advisorData.js'

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}
function fmtFull(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700',
  'At Risk': 'bg-amber-100 text-amber-700',
  New: 'bg-blue-100 text-blue-700',
}

const urgencyColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-amber-100 text-amber-700 border-amber-200',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200',
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

const AumTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: {fmtFull(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function AdvisorSnapshot() {
  const { advisor, clients, aumBySegment, monthlyRevenue, atRiskClients } = advisorData

  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [expandedRow, setExpandedRow] = useState(null)
  const [revenueView, setRevenueView] = useState('Monthly')
  const [expandedRisk, setExpandedRisk] = useState(null)

  const riskProfiles = ['All', 'Conservative', 'Moderate', 'Aggressive']

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase()
    return [...clients]
      .filter((c) =>
        (riskFilter === 'All' || c.riskProfile === riskFilter) &&
        c.name.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [search, riskFilter, sortKey, sortDir])

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-[#1e3a5f] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const quarterlyRevenue = useMemo(() => {
    const quarters = [
      { quarter: 'Q2 2025', months: ['May', 'Jun', 'Jul'] },
      { quarter: 'Q3 2025', months: ['Aug', 'Sep', 'Oct'] },
      { quarter: 'Q4 2025', months: ['Nov', 'Dec', 'Jan'] },
      { quarter: 'Q1 2026', months: ['Feb', 'Mar', 'Apr'] },
    ]
    return quarters.map(({ quarter, months }) => {
      const rows = monthlyRevenue.filter((r) => months.includes(r.month))
      return {
        month: quarter,
        advisory: rows.reduce((s, r) => s + r.advisory, 0),
        planning: rows.reduce((s, r) => s + r.planning, 0),
        transaction: rows.reduce((s, r) => s + r.transaction, 0),
      }
    })
  }, [])

  const revenueData = revenueView === 'Monthly' ? monthlyRevenue : quarterlyRevenue

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm mb-1">{advisor.firm} · {advisor.advisorId}</p>
            <h1 className="text-3xl font-bold">{advisor.name}</h1>
            <p className="text-blue-200 text-sm mt-1">Financial Advisor</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HeaderStat label="Total AUM" value={fmt(advisor.totalAUM)} />
            <HeaderStat label="Clients" value={advisor.clientCount} />
            <HeaderStat label="YTD Revenue" value={fmt(advisor.ytdRevenue)} />
            <HeaderStat label="Net New Assets" value={fmt(advisor.netNewAssets)} positive />
          </div>
        </div>
      </div>

      {/* AUM + Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AUM by Segment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">AUM by Segment</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={aumBySegment} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} width={55} />
              <Tooltip content={<AumTooltip />} />
              <Bar dataKey="aum" name="AUM" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1e3a5f]">Revenue by Type</h2>
            <div className="flex gap-1">
              {['Monthly', 'Quarterly'].map((v) => (
                <button
                  key={v}
                  onClick={() => setRevenueView(v)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    revenueView === v ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} width={48} />
              <Tooltip content={<BarTooltip />} />
              <Legend />
              <Bar dataKey="advisory" name="Advisory" stackId="a" fill="#3B82F6" />
              <Bar dataKey="planning" name="Planning" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="transaction" name="Transaction" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Client Book</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {riskProfiles.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  { key: 'name', label: 'Client' },
                  { key: 'accountValue', label: 'Account Value' },
                  { key: 'ytdReturn', label: 'YTD Return' },
                  { key: 'riskProfile', label: 'Risk Profile' },
                  { key: 'lastContact', label: 'Last Contact' },
                  { key: 'status', label: 'Status' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="text-left py-2 px-3 font-semibold text-gray-500 cursor-pointer hover:text-[#1e3a5f] whitespace-nowrap select-none"
                    onClick={() => handleSort(key)}
                  >
                    {label}<SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c, i) => (
                <>
                  <tr
                    key={c.id}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-blue-50/40 transition-colors ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } ${expandedRow === c.id ? 'bg-blue-50/60' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                  >
                    <td className="py-2.5 px-3 font-medium text-gray-800">{c.name}</td>
                    <td className="py-2.5 px-3 text-gray-700">{fmtFull(c.accountValue)}</td>
                    <td className={`py-2.5 px-3 font-semibold ${c.ytdReturn >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {c.ytdReturn >= 0 ? '+' : ''}{c.ytdReturn}%
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{c.riskProfile}</td>
                    <td className="py-2.5 px-3 text-gray-500">{c.lastContact}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === c.id && (
                    <tr key={`${c.id}-exp`} className="bg-blue-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs mb-0.5">Account Value</p>
                            <p className="font-semibold text-gray-800">{fmtFull(c.accountValue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-0.5">YTD Return</p>
                            <p className={`font-semibold ${c.ytdReturn >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {c.ytdReturn >= 0 ? '+' : ''}{c.ytdReturn}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-0.5">Risk Profile</p>
                            <p className="font-semibold text-gray-800">{c.riskProfile}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-0.5">Last Contact</p>
                            <p className="font-semibold text-gray-800">{c.lastContact}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="text-xs bg-[#1e3a5f] text-white px-3 py-1.5 rounded-lg hover:bg-[#16304f] transition-colors">
                            Schedule Review
                          </button>
                          <button className="text-xs bg-white text-[#1e3a5f] border border-[#1e3a5f] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                            View Portfolio
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filteredClients.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No clients match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-Risk Clients */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⚠️</span>
          <h2 className="text-lg font-bold text-amber-800">At-Risk Clients</h2>
          <span className="ml-auto bg-amber-200 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {atRiskClients.length} clients
          </span>
        </div>
        <div className="space-y-3">
          {atRiskClients.map((c) => (
            <div
              key={c.id}
              className={`border rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-md bg-white ${urgencyColors[c.urgency]}`}
              onClick={() => setExpandedRisk(expandedRisk === c.id ? null : c.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyColors[c.urgency]}`}>
                    {c.urgency}
                  </span>
                  <span className="font-semibold text-gray-800">{c.name}</span>
                </div>
                <span className="text-sm text-gray-500">{fmtFull(c.accountValue)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 ml-16">{c.reason}</p>
              {expandedRisk === c.id && (
                <div className="mt-3 ml-16 flex gap-2">
                  <button className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors">
                    Contact Now
                  </button>
                  <button className="text-xs bg-white text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                    View Account
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeaderStat({ label, value, positive }) {
  return (
    <div className="bg-white/10 rounded-xl p-3 text-center">
      <p className="text-blue-300 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${positive ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
