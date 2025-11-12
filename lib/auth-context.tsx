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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("portfolioUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("portfolioUser")
      }
    }
    setIsLoading(false)
  }, [])

  const register = async (name: string, email: string, password: string, userType: "provider" | "seeker") => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("portfolioUsers") || "[]")
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

    // Store user credentials
    users.push({ email, password })
    localStorage.setItem("portfolioUsers", JSON.stringify(users))

    const allProfiles = JSON.parse(localStorage.getItem("portfolioProfiles") || "[]")
    allProfiles.push(newUser)
    localStorage.setItem("portfolioProfiles", JSON.stringify(allProfiles))

    // Set current user
    localStorage.setItem("portfolioUser", JSON.stringify(newUser))
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("portfolioUsers") || "[]")
    const userCredentials = users.find((u: any) => u.email === email)

    if (!userCredentials || userCredentials.password !== password) {
      throw new Error("Invalid email or password")
    }

    // Find user profile
    const allProfiles = JSON.parse(localStorage.getItem("portfolioProfiles") || "[]")
    const userProfile = allProfiles.find((p: any) => p.email === email)

    if (!userProfile) {
      throw new Error("User profile not found")
    }

    localStorage.setItem("portfolioUser", JSON.stringify(userProfile))
    setUser(userProfile)
  }

  const logout = () => {
    localStorage.removeItem("portfolioUser")
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = { ...user, ...updates }
    localStorage.setItem("portfolioUser", JSON.stringify(updatedUser))

    const allProfiles = JSON.parse(localStorage.getItem("portfolioProfiles") || "[]")
    const index = allProfiles.findIndex((p: any) => p.id === user.id)
    if (index !== -1) {
      allProfiles[index] = updatedUser
      localStorage.setItem("portfolioProfiles", JSON.stringify(allProfiles))
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
