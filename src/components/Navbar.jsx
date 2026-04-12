import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/client', label: 'Client View' },
  { to: '/advisor', label: 'Advisor View' },
  { to: '/back-office', label: 'Back Office' },
  { to: '/executive', label: 'Executive View' },
  { to: '/crypto', label: '₿ Crypto' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 px-1 pb-0.5 ${
      isActive
        ? 'text-[#1e3a5f] font-bold border-b-2 border-[#1e3a5f]'
        : 'text-gray-600 hover:text-[#1e3a5f]'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-[#1e3a5f] font-bold bg-blue-50'
        : 'text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1e3a5f] tracking-tight">
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

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 focus:outline-none"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
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
