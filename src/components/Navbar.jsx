import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDarkMode } from '../context/DarkModeContext.jsx'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/client', label: 'Client View' },
  { to: '/advisor', label: 'Advisor View' },
  { to: '/back-office', label: 'Back Office' },
  { to: '/executive', label: 'Executive View' },
  { to: '/crypto', label: '₿ Crypto' },
  { to: '/grid-demo', label: '🌍 Grid Demo' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggleDark } = useDarkMode()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 px-1 pb-0.5 ${
      isActive
        ? 'text-[#1e3a5f] dark:text-blue-300 font-bold border-b-2 border-[#1e3a5f] dark:border-blue-300'
        : 'text-gray-600 dark:text-gray-300 hover:text-[#1e3a5f] dark:hover:text-blue-300'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-[#1e3a5f] dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-900/30'
        : 'text-gray-700 dark:text-gray-300 hover:text-[#1e3a5f] dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1e3a5f] dark:text-blue-300 tracking-tight">
              Pinnacle Wealth
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <div className="relative group">
              <button
                onClick={toggleDark}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                {isDark ? (
                  /* Sun icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  /* Moon icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-1.5 px-2.5 py-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-lg">
                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-800 dark:bg-gray-600 rotate-45" />
              </div>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-[#1e3a5f] dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
