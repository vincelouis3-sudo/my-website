import { useState } from 'react'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function getWeatherStyle(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return { gradient: 'from-gray-800 via-purple-900 to-gray-900', emoji: '⛈️', label: 'Thunderstorm' }
  if (weatherId >= 300 && weatherId < 400) return { gradient: 'from-slate-600 via-blue-700 to-slate-700', emoji: '🌦️', label: 'Drizzle' }
  if (weatherId >= 500 && weatherId < 600) return { gradient: 'from-blue-800 via-blue-700 to-slate-800', emoji: '🌧️', label: 'Rain' }
  if (weatherId >= 600 && weatherId < 700) return { gradient: 'from-blue-100 via-slate-200 to-blue-200', emoji: '❄️', label: 'Snow' }
  if (weatherId >= 700 && weatherId < 800) return { gradient: 'from-gray-400 via-gray-500 to-gray-600', emoji: '🌫️', label: 'Fog' }
  if (weatherId === 800) return { gradient: 'from-sky-400 via-blue-500 to-orange-400', emoji: '☀️', label: 'Clear' }
  if (weatherId === 801) return { gradient: 'from-sky-400 via-blue-400 to-slate-400', emoji: '🌤️', label: 'Few Clouds' }
  if (weatherId >= 802 && weatherId < 900) return { gradient: 'from-slate-400 via-gray-500 to-slate-600', emoji: '☁️', label: 'Cloudy' }
  return { gradient: 'from-[#1e3a5f] via-blue-700 to-[#1e3a5f]', emoji: '🌡️', label: 'Weather' }
}

function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[90px]">
      <span className="text-xl">{icon}</span>
      <span className="text-white/70 text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className="text-white font-bold text-sm">{value}</span>
    </div>
  )
}

export default function WeatherWidget() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle')
  const [weather, setWeather] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function fetchWeather() {
    if (!query.trim()) return
    setStatus('loading')
    setWeather(null)
    setErrorMsg('')

    if (!API_KEY) {
      setStatus('error')
      setErrorMsg('No OpenWeather API key found. Add VITE_OPENWEATHER_API_KEY to your .env file.')
      return
    }

    try {
      const isZip = /^\d{5}$/.test(query.trim())
      const param = isZip
        ? `zip=${encodeURIComponent(query.trim())},US`
        : `q=${encodeURIComponent(query.trim())}`

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${param}&appid=${API_KEY}&units=imperial`
      )
      const data = await res.json()

      if (!res.ok || data.cod !== 200) throw new Error(data.message || 'Location not found')

      setWeather(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') fetchWeather()
  }

  const style = weather ? getWeatherStyle(weather.weather[0].id) : null

  return (
    <section className="bg-white dark:bg-gray-800 py-20 px-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-blue-300 mb-3">Live Weather</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Enter a city, state, or zip code to pull current conditions.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. New York, NY  or  10001"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
          />
          <button
            onClick={fetchWeather}
            disabled={status === 'loading' || !query.trim()}
            className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#16304f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors duration-150 text-sm whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Load Weather
              </>
            )}
          </button>
        </div>

        {status === 'success' && weather && (
          <div className={`rounded-2xl bg-gradient-to-br ${style.gradient} shadow-2xl overflow-hidden`}>
            <div className="px-8 pt-8 pb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">
                  {style.emoji} {style.label}
                </p>
                <h3 className="text-white text-3xl font-bold leading-tight">
                  {weather.name}{weather.sys?.country ? `, ${weather.sys.country}` : ''}
                </h3>
                <p className="text-white/60 text-sm mt-1 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-16 h-16 drop-shadow-lg"
                />
              </div>
            </div>
            <div className="px-8 pb-2">
              <div className="text-white font-black leading-none" style={{ fontSize: '5rem' }}>
                {Math.round(weather.main.temp)}°
                <span className="text-3xl font-bold text-white/70 ml-1">F</span>
              </div>
              <p className="text-white/60 text-sm mt-1">
                Feels like {Math.round(weather.main.feels_like)}°F
                &nbsp;·&nbsp;
                H:{Math.round(weather.main.temp_max)}° &nbsp;L:{Math.round(weather.main.temp_min)}°
              </p>
            </div>
            <div className="px-8 py-6">
              <div className="flex flex-wrap gap-3">
                <StatPill icon="💧" label="Humidity" value={`${weather.main.humidity}%`} />
                <StatPill icon="🌬️" label="Wind" value={`${Math.round(weather.wind.speed)} mph ${getWindDirection(weather.wind.deg)}`} />
                <StatPill icon="🔵" label="Pressure" value={`${weather.main.pressure} hPa`} />
                {weather.visibility != null && (
                  <StatPill icon="👁️" label="Visibility" value={`${(weather.visibility / 1609).toFixed(1)} mi`} />
                )}
                {weather.clouds != null && (
                  <StatPill icon="☁️" label="Cloud Cover" value={`${weather.clouds.all}%`} />
                )}
              </div>
            </div>
            <div className="px-8 py-3 bg-black/20 text-white/50 text-xs flex justify-between">
              <span>Data via OpenWeatherMap</span>
              <span>Updated just now</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border-2 border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20 overflow-hidden shadow-md text-center">
            <div className="relative h-48 overflow-hidden bg-red-100 dark:bg-red-900/30">
              <img
                src="https://placedog.net/600/300?id=23"
                alt="Sad dog"
                className="w-full h-full object-cover opacity-80"
                onError={(e) => { e.target.src = 'https://placedog.net/600/300?random' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-50 dark:from-red-900/20 via-transparent to-transparent" />
            </div>
            <div className="px-8 py-6">
              <p className="text-4xl mb-3">😟</p>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Uh oh, something went wrong.</h3>
              <p className="text-red-500 dark:text-red-400 text-sm mb-1">Please refresh or try again later.</p>
              {errorMsg && (
                <p className="text-red-400 dark:text-red-300 text-xs mt-3 font-mono bg-red-100 dark:bg-red-900/40 rounded px-3 py-2 inline-block">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">
            <span className="text-2xl block mb-2">🌤️</span>
            Enter a location above and hit <strong>Load Weather</strong> to get started.
          </div>
        )}
      </div>
    </section>
  )
}
