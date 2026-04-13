import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) return JSON.parse(saved) === true
    } catch {}
    return false   // default to light mode
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('darkMode', JSON.stringify(isDark))
  }, [isDark])

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark: () => setIsDark(d => !d) }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
