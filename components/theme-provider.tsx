'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // default to class strategy so dark mode toggles by adding `dark` class to <html>
  return (
    <NextThemesProvider attribute="class" enableSystem={true} {...props}>
      {children}
    </NextThemesProvider>
  )
}
