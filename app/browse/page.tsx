"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

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

const categories = [
  "All",
  "Graphic Design",
  "Motion Graphics",
  "Web Development",
  "Content Writing",
  "UI/UX Design",
  "Photography",
]

export default function BrowsePage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [providers, setProviders] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allProfiles = JSON.parse(localStorage.getItem("portfolioProfiles") || "[]")
    const serviceProviders = allProfiles.filter((p: User) => p.userType === "provider")
    setProviders(serviceProviders)
    setIsLoading(false)
  }, [])

  // إضافة المستخدم الحالي إلى قائمة مقدمي الخدمات إذا كان مسجلاً
  useEffect(() => {
    if (user && user.userType === "provider") {
      // التحقق من عدم وجود المستخدم بالفعل في القائمة
      const userExists = providers.some(provider => provider.id === user.id);
      if (!userExists) {
        setProviders(prevProviders => [...prevProviders, user]);
      }
    }
  }, [user, providers]);

  const filteredProviders = providers.filter((provider) => {
    // لا تُظهر بروفايل المستخدم الحالي في القائمة
    if (user && provider.id === user.id) return false

    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || provider.specialty?.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity">
              PortfolioHub
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium border-b-2 border-primary">
                Browse
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard/settings" className="text-sm text-neutral-600 hover:text-primary transition-colors">
                  {user.name}
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-md shadow-sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-md shadow-sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Search Section */}
      <section className="bg-neutral-50 border-b border-border py-8">
        <div className="container">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Providers Grid */}
      <section className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">No providers found matching your search</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              variant="outline"
              className="bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProviders.map((provider) => {
              return (
                <Link 
                  href={`/profile/${provider.id}`} 
                  key={provider.id}
                >
                  <div className="group rounded-lg border border-border bg-white hover:shadow-sm transition-shadow">
                    <div className="aspect-[4/3] bg-neutral-100 overflow-hidden rounded-t-lg">
                      <img
                        src={provider.avatar || "/placeholder-user.jpg"}
                        alt={provider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-base leading-tight mb-1 truncate">{provider.name}</h3>
                      <p className="text-xs text-neutral-600 mb-2 truncate">{provider.specialty || "Service Provider"}</p>
                      {provider.bio && (
                        <p className="text-xs text-neutral-500 line-clamp-2">{provider.bio}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  )
}
