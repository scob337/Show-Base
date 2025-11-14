"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  userType: "provider" | "seeker"
  specialty?: string
  bio?: string
  avatar?: string
  skills?: string[]
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  register: (name: string, email: string, password: string, userType: "provider" | "seeker") => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions for cookies
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length))
    }
  }
  return null
}

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from cookies on mount
  useEffect(() => {
    const storedUserCookie = getCookie("portfolioUser")
    if (storedUserCookie) {
      try {
        setUser(JSON.parse(storedUserCookie))
      } catch (error) {
        console.error("Failed to parse user cookie:", error)
        removeCookie("portfolioUser")
      }
    }
    setIsLoading(false)
  }, [])

  const register = async (name: string, email: string, password: string, userType: "provider" | "seeker") => {
    // Check if user already exists in cookie storage
    const usersCookie = getCookie("portfolioUsers")
    const users = usersCookie ? JSON.parse(usersCookie) : []
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Email already registered")
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      userType,
      createdAt: new Date().toISOString(),
    }

    // Store user credentials in cookie
    users.push({ email, password })
    setCookie("portfolioUsers", JSON.stringify(users), 7)

    const allProfilesCookie = getCookie("portfolioProfiles")
    const allProfiles = allProfilesCookie ? JSON.parse(allProfilesCookie) : []
    allProfiles.push(newUser)
    setCookie("portfolioProfiles", JSON.stringify(allProfiles), 7)

    // Set current user in cookie
    const userString = JSON.stringify(newUser)
    setCookie("portfolioUser", userString, 7)
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    const usersCookie = getCookie("portfolioUsers")
    const users = usersCookie ? JSON.parse(usersCookie) : []
    const userCredentials = users.find((u: any) => u.email === email)

    if (!userCredentials || userCredentials.password !== password) {
      throw new Error("Invalid email or password")
    }

    // Find user profile from cookie
    const allProfilesCookie = getCookie("portfolioProfiles")
    const allProfiles = allProfilesCookie ? JSON.parse(allProfilesCookie) : []
    const userProfile = allProfiles.find((p: any) => p.email === email)

    if (!userProfile) {
      throw new Error("User profile not found")
    }

    const userString = JSON.stringify(userProfile)
    setCookie("portfolioUser", userString, 7)
    setUser(userProfile)
  }

  const logout = () => {
    removeCookie("portfolioUser")
    removeCookie("portfolioUsers")
    removeCookie("portfolioProfiles")
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = { ...user, ...updates }
    const userString = JSON.stringify(updatedUser)
    setCookie("portfolioUser", userString, 7)

    const allProfilesCookie = getCookie("portfolioProfiles")
    const allProfiles = allProfilesCookie ? JSON.parse(allProfilesCookie) : []
    const index = allProfiles.findIndex((p: any) => p.id === user.id)
    if (index !== -1) {
      allProfiles[index] = updatedUser
      setCookie("portfolioProfiles", JSON.stringify(allProfiles), 7)
    }

    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
