"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"
import { ArrowLeft, MessageCircle } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tools: string[]
  userId: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  userType: "provider" | "seeker"
  specialty?: string
  bio?: string
  avatar?: string
  createdAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { startConversation } = useChat()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [provider, setProvider] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    const allProjectsCookie = getCookie("portfolioProjects")
    const allProjects = allProjectsCookie ? JSON.parse(allProjectsCookie) : []
    const foundProject = allProjects.find((p: Project) => p.id === projectId)

    if (!foundProject) {
      router.push("/browse")
      return
    }

    setProject(foundProject)

    const allProfilesCookie = getCookie("portfolioProfiles")
    const allProfiles = allProfilesCookie ? JSON.parse(allProfilesCookie) : []
    const foundProvider = allProfiles.find((p: User) => p.id === foundProject.userId)
    setProvider(foundProvider || null)
    setIsLoading(false)
  }, [projectId, router])

  const handleContactProvider = () => {
    if (!user || !provider) return

    // منع الـ Provider من إرسال رسالة لـ Provider آخر
    if (user.userType === "provider" && provider.userType === "provider") {
      alert("Providers can only contact seekers")
      return
    }

    // لا يمكنك إرسال رسالة لنفسك
    if (user.id === provider.id) {
      alert("You cannot message yourself")
      return
    }

    const conversationId = startConversation(user.id, user.name, provider.id, provider.name)
    router.push("/dashboard/messages")
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

  if (!project || !provider) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl">
          {/* Project Image */}
          <div className="mb-8 rounded-lg overflow-hidden bg-neutral-200 aspect-video">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 whitespace-pre-wrap">{project.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tools & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <Badge key={tool} variant="secondary">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Provider Info */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>About the Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    {provider.specialty && <p className="text-sm text-accent font-medium">{provider.specialty}</p>}
                  </div>

                  {provider.bio && (
                    <div>
                      <p className="text-sm text-neutral-600">{provider.bio}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <Link href={`/profile/${provider.id}`}>
                      <Button variant="outline" className="w-full bg-transparent mb-2">
                        View Full Profile
                      </Button>
                    </Link>
                    {user ? (
                      user.userType === "provider" && provider.userType === "provider" ? (
                        <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Providers Cannot Message Providers
                        </Button>
                      ) : (
                        <Button
                          onClick={handleContactProvider}
                          className="w-full bg-primary hover:bg-primary-light flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact Provider
                        </Button>
                      )
                    ) : (
                      <Link href="/auth/login" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary-light flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Login to Contact
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
