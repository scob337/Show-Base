"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useReview } from "@/lib/review-context"
import { MessageCircle, Mail, Star } from "lucide-react"

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

interface Project {
  id: string
  title: string
  description: string
  image: string
  tools: string[]
  userId: string
  createdAt: string
}

interface Review {
  id: string
  providerId: string
  reviewerId: string
  reviewerName: string
  rating: number
  text: string
  createdAt: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getProviderReviews, getProviderRating } = useReview()
  const providerId = params.id as string

  const [provider, setProvider] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [providerReviews, setProviderReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<"projects" | "reviews">("projects")
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, text: "" })

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

    const allProfilesCookie = getCookie("portfolioProfiles")
    const allProfiles = allProfilesCookie ? JSON.parse(allProfilesCookie) : []
    const foundProvider = allProfiles.find((p: User) => p.id === providerId)

    if (!foundProvider) {
      router.push("/browse")
      return
    }

    setProvider(foundProvider)

    const allProjectsCookie = getCookie("portfolioProjects")
    const allProjects = allProjectsCookie ? JSON.parse(allProjectsCookie) : []
    const providerProjects = allProjects.filter((p: Project) => p.userId === providerId)
    setProjects(providerProjects)

    const reviews = getProviderReviews(providerId)
    setProviderReviews(reviews)
    setIsLoading(false)
  }, [providerId, router, getProviderReviews])

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

    // بدء محادثة وذهاب للمحادثات
    router.push("/dashboard/messages")
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !provider || !reviewData.text.trim()) return

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

    const setCookie = (name: string, value: string, days = 7) => {
      if (typeof document === "undefined") return
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
    }

    const allReviewsCookie = getCookie("portfolioReviews")
    const allReviews = allReviewsCookie ? JSON.parse(allReviewsCookie) : []
    const newReview: Review = {
      id: Date.now().toString(),
      providerId: provider.id,
      reviewerId: user.id,
      reviewerName: user.name,
      rating: reviewData.rating,
      text: reviewData.text,
      createdAt: new Date().toISOString(),
    }

    allReviews.push(newReview)
    setCookie("portfolioReviews", JSON.stringify(allReviews), 7)

    setProviderReviews([...providerReviews, newReview])
    setReviewData({ rating: 5, text: "" })
    setShowReviewForm(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return null
  }

  const averageRating = getProviderRating(providerId)

  return (
    <main className="min-h-screen bg-background">
      {/* Profile Header */}
      <section className="bg-neutral-50 border-b border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={provider.avatar || "/placeholder-user.jpg"}
              alt={provider.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{provider.name}</h1>
              <p className="text-xl text-neutral-600 mb-4">{provider.specialty || "Service Provider"}</p>
              <p className="text-neutral-700 mb-6 max-w-2xl">{provider.bio || "Professional service provider"}</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-neutral-600">({providerReviews.length} reviews)</span>
                </div>
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                {user ? (
                  user.userType === "provider" && provider.userType === "provider" ? (
                    <Button className="bg-gray-400 cursor-not-allowed" disabled>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Providers Cannot Message Providers
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleContactProvider}
                      className="bg-primary hover:bg-primary-light"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  )
                ) : (
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary-light">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Login to Contact
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="bg-transparent">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects & Reviews Tabs */}
      <section className="container py-12">
        <div className="flex gap-8 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === "projects"
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600 hover:text-foreground"
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === "reviews"
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600 hover:text-foreground"
            }`}
          >
            Reviews ({providerReviews.length})
          </button>
        </div>

        {activeTab === "projects" && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No projects yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} href={`/project/${project.id}`}>
                    <div className="card-project cursor-pointer group">
                      <div className="aspect-square bg-neutral-100 overflow-hidden rounded-lg">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h3>
                        <p className="text-sm text-neutral-600 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "reviews" && (
          <>
            {user && user.userType === "seeker" && user.id !== provider.id && (
              <div className="mb-8">
                {!showReviewForm ? (
                  <Button onClick={() => setShowReviewForm(true)} className="bg-accent hover:bg-accent-light">
                    Leave a Review
                  </Button>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Leave a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= reviewData.rating ? "fill-yellow-500 text-yellow-500" : "text-neutral-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Your Review</label>
                          <textarea
                            value={reviewData.text}
                            onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                            placeholder="Share your experience working with this provider..."
                            rows={4}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" className="bg-primary hover:bg-primary-light">
                            Submit Review
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                            className="bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {providerReviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {providerReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{review.reviewerName}</h4>
                          <p className="text-sm text-neutral-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
