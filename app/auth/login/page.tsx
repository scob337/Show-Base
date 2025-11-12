"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const showConfirmMsg = searchParams?.get("confirm") === "true"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError

      // After login, ensure profile exists (create on first login)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Unable to get authenticated user after login.")

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (!existingProfile) {
        const fullName = (user.user_metadata as any)?.full_name ?? ""
        const userType = (user.user_metadata as any)?.user_type ?? "provider"
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          user_type: userType,
        })
        if (profileError) throw profileError
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl"> Log in</CardTitle>
          <CardDescription> Enter your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {showConfirmMsg && (
            <div className="mb-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
              Please confirm your email address to activate your account, then log in.
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email"> Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password"> Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? " Loading..." : " Login"}
            </Button>

            <p className="text-center text-sm">
                don`t have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                 Register now!
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
