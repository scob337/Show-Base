'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()

  // resolvedTheme gives actual applied theme when using system
  const active = resolvedTheme || theme || 'light'

  const toggle = () => {
    setTheme(active === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle light / dark"
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md border border-border px-2 py-1 bg-transparent hover:bg-accent/10 focus:outline-none focus-visible:ring-ring/50"
    >
      {active === 'dark' ? (
        <Sun className="w-4 h-4 text-foreground" />
      ) : (
        <Moon className="w-4 h-4 text-foreground" />
      )}
    </button>
  )
}
