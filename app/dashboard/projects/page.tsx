"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Edit2, Loader } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  cover_image_url: string
  tools: string[]
  user_id: string
  created_at: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        setSession(session)

        const { data: projectsData, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setProjects(projectsData || [])
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [supabase, router])

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    setDeletingId(projectId)

    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error

      setProjects(projects.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-neutral-600">Loading projects...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity">
              PortfolioHub
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/messages" className="text-foreground hover:text-primary transition-colors font-medium">
                Messages
              </Link>
              <Link href="/dashboard/settings" className="text-foreground hover:text-primary transition-colors font-medium">
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/projects/new">
              <Button className="bg-primary hover:bg-primary-light text-white">
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
              <p className="text-neutral-600">Manage and showcase your portfolio</p>
            </div>
            <Link href="/dashboard/projects/new">
              <Button className="bg-accent hover:bg-accent-light flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-600 mb-4">You haven't created any projects yet</p>
                <Link href="/dashboard/projects/new">
                  <Button className="bg-primary hover:bg-primary-light">Create Your First Project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-neutral-200 overflow-hidden">
                    <img
                      src={project.cover_image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-neutral-600 mb-2">Tools Used:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tools?.map((tool) => (
                          <span key={tool} className="px-2 py-1 bg-neutral-100 rounded text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/projects/${project.id}/edit`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
