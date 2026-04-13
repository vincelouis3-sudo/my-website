import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { backOfficeData } from '../data/backOfficeData.js'

const priorityStyles = {
  Critical: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  High: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800',
  Medium: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
}

const severityStyles = {
  Error:   { dot: 'bg-red-500',   card: 'border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20',     label: 'text-red-700 dark:text-red-400' },
  Warning: { dot: 'bg-amber-400', card: 'border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20', label: 'text-amber-700 dark:text-amber-400' },
  Info:    { dot: 'bg-blue-400',  card: 'border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20',   label: 'text-blue-700 dark:text-blue-400' },
}

const taskColorMap = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-700 dark:text-blue-300',     count: 'text-blue-600 dark:text-blue-300',     border: 'border-blue-200 dark:border-blue-800' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', count: 'text-yellow-600 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', count: 'text-orange-600 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', count: 'text-emerald-600 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',       text: 'text-red-700 dark:text-red-300',       count: 'text-red-600 dark:text-red-300',       border: 'border-red-200 dark:border-red-800' },
}

function fmtTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const PRIORITY_TABS = ['All', 'Critical', 'High', 'Medium']

export default function BackOfficeSnapshot() {
  const { user, nextBestActions: initialActions, alerts: initialAlerts, taskQueue, onboardingPipeline, recentActivity } = backOfficeData

  const [actions, setActions] = useState(initialActions)
  const [alerts, setAlerts] = useState(initialAlerts)
  const [priorityTab, setPriorityTab] = useState('All')

  const filteredActions = priorityTab === 'All' ? actions : actions.filter((a) => a.priority === priorityTab)
  const criticalCount = actions.filter((a) => a.priority === 'Critical' || a.priority === 'High').length
  const errorAlerts = alerts.filter((a) => a.severity === 'Error')
  const warningAlerts = alerts.filter((a) => a.severity === 'Warning')
  const infoAlerts = alerts.filter((a) => a.severity === 'Info')

  function markComplete(id) { setActions((prev) => prev.filter((a) => a.id !== id)) }
  function dismissAlert(id) { setAlerts((prev) => prev.filter((a) => a.id !== id)) }
  function acknowledgeAll() { setAlerts([]) }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header — dark navy, fine in both modes */}
      <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {criticalCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {criticalCount} items need attention today
                </span>
              )}
            </div>
            <p className="text-blue-200 text-sm">{user.role} · {user.team} · {user.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Task Queue */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {taskQueue.map((t) => {
          const c = taskColorMap[t.color] || taskColorMap.blue
          return (
            <div key={t.label} className={`${c.bg} border ${c.border} rounded-xl p-4 text-center`}>
              <p className={`text-3xl font-bold ${c.count}`}>{t.count}</p>
              <p className={`text-xs font-medium mt-1 ${c.text}`}>{t.label}</p>
            </div>
          )
        })}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Next Best Actions */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Next Best Actions</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">{actions.length} remaining</span>
          </div>
          <div className="flex gap-1 mb-4">
            {PRIORITY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setPriorityTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  priorityTab === tab
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="ml-1.5 opacity-70">({actions.filter((a) => a.priority === tab).length})</span>
                )}
              </button>
            ))}
          </div>

          {filteredActions.length === 0 ? (
            <div className="text-center py-16 text-emerald-600">
              <div className="text-4xl mb-2">✓</div>
              <p className="font-semibold">All clear!</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No actions in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActions.map((action) => (
                <div key={action.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${priorityStyles[action.priority]}`}>
                      {action.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">{action.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">{action.category}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Due {fmtTime(action.dueDate)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => markComplete(action.id)}
                      className="shrink-0 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">System Alerts</h2>
            {alerts.length > 0 && (
              <button onClick={acknowledgeAll} className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors">
                Acknowledge All
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-16 text-emerald-600">
              <div className="text-4xl mb-2">✓</div>
              <p className="font-semibold">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[['Error', errorAlerts], ['Warning', warningAlerts], ['Info', infoAlerts]].map(([sev, group]) =>
                group.length > 0 ? (
                  <div key={sev}>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${severityStyles[sev]?.label}`}>
                      {sev} ({group.length})
                    </p>
                    {group.map((alert) => (
                      <div key={alert.id} className={`rounded-lg p-3 mb-2 ${severityStyles[alert.severity]?.card}`}>
                        <div className="flex items-start gap-2">
                          <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${severityStyles[alert.severity]?.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{alert.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fmtTime(alert.timestamp)}</p>
                          </div>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Dismiss"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Pipeline + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Onboarding Pipeline</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={onboardingPipeline} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [value, 'Clients']} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Clients" radius={[4, 4, 0, 0]}>
                {onboardingPipeline.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3">
            {onboardingPipeline.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: stage.color }} />
                {stage.stage}: <strong>{stage.count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4">Recent Activity</h2>
          <div className="space-y-0 max-h-72 overflow-y-auto pr-1">
            {recentActivity.map((event, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div className="shrink-0 mt-0.5">
                  <span
                    className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                      event.actor === 'System'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {event.actor === 'System' ? '⚙' : event.actor.split('.')[0][0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">{event.action}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    <span className="font-medium">{event.actor}</span> · {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
