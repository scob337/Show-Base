"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Plus, Settings, MessageSquare, Briefcase, Users } from "lucide-react"

interface Profile {
  id: string
  full_name: string
  user_type: "provider" | "seeker"
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          const { data: userData } = await supabase.auth.getUser()
          
          if (userData && userData.user) {
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: userData.user.id,
                email: userData.user.email,
                full_name: userData.user.user_metadata?.full_name || "User",
                user_type: userData.user.user_metadata?.user_type || "seeker",
              })
              .select()
              .single()
              
            if (!insertError && newProfile) {
              setProfile(newProfile)
            } else {
              console.error("Error creating profile:", insertError)
              throw insertError
            }
          } else {
            throw new Error("User data not available")
          }
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error:", error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Dashboard Content */}
      <div className="container py-12">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.full_name}!</h1>
            <p className="text-neutral-600">
              {profile.user_type === "provider"
                ? "Manage your portfolio and connect with clients"
                : "Browse talented professionals and find the perfect match"}
            </p>
          </div>

          {profile.user_type === "provider" ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <CardTitle>Your Portfolio</CardTitle>
                  </div>
                  <CardDescription>Manage and showcase your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/projects" className="block">
                    <Button className="w-full bg-primary hover:bg-primary-light">View Projects</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Plus className="w-6 h-6 text-accent" />
                    <CardTitle>Add Project</CardTitle>
                  </div>
                  <CardDescription>Showcase a new piece of your work</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/projects/new" className="block">
                    <Button className="w-full bg-accent hover:bg-accent-light">Create Project</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-6 h-6 text-neutral-600" />
                    <CardTitle>Profile Settings</CardTitle>
                  </div>
                  <CardDescription>Update your professional information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/settings" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-neutral-600" />
                    <CardTitle>Messages</CardTitle>
                  </div>
                  <CardDescription>Chat with potential clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/messages" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-primary" />
                    <CardTitle>Browse Professionals</CardTitle>
                  </div>
                  <CardDescription>Find talented service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/browse" className="block">
                    <Button className="w-full bg-primary hover:bg-primary-light">Browse Now</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-neutral-600" />
                    <CardTitle>Messages</CardTitle>
                  </div>
                  <CardDescription>Chat with service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/messages" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
