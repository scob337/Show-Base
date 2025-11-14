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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/browse")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(email, password)
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
          <CardTitle className="text-xl sm:text-2xl">Log in</CardTitle>
          <CardDescription className="text-sm sm:text-base">Enter your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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

            {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>

            <p className="text-center text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Register now!
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
