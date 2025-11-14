"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState<"provider" | "seeker">("provider")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/browse")
    }
  }, [user, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await register(fullName, email, password, userType)
      router.push("/browse")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-background dark:to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Register</CardTitle>
          <CardDescription className="text-sm sm:text-base">Join PortfolioHub today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div>
              <Label htmlFor="userType" className="text-sm sm:text-base">Account Type</Label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value as "provider" | "seeker")}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm sm:text-base"
              >
                <option value="provider">Service Provider</option>
                <option value="seeker">Seeker</option>
              </select>
            </div>

            {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>

            <p className="text-center text-xs sm:text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}