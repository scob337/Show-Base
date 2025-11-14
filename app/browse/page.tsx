"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"

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
  const { conversations } = useChat()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [providers, setProviders] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // قراءة Providers من الـ Cookies
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
    const providers = allProfiles.filter((p: User) => p.userType === "provider")
    setProviders(providers)
    setIsLoading(false)
  }, [user, router])

  const filteredProviders = providers.filter((provider) => {
    // لا تُظهر بروفايل المستخدم الحالي في القائمة
    if (user && provider.id === user.id) return false

    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty?.toLowerCase().includes(searchQuery.toLowerCase())

    // إذا لم يتم اختيار أي فلتر، عرض الجميع (ما عدا البحث)
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(category => provider.specialty?.includes(category))

    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background">
      <>
        <section className="bg-card dark:bg-card border-b border-border py-6 sm:py-8">
          <div className="container px-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      if (category === "All") {
                        setSelectedCategories([])
                      } else {
                        setSelectedCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(c => c !== category)
                            : [...prev, category]
                        )
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-colors text-xs sm:text-sm ${
                      (category === "All" && selectedCategories.length === 0) ||
                      (category !== "All" && selectedCategories.includes(category))
                        ? "bg-primary text-white"
                        : "bg-card dark:bg-muted border border-border text-foreground hover:border-primary"
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
        <section className="container py-8 sm:py-12 px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground mb-4">No providers found matching your search</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategories([])
              }}
              variant="outline"
              className="bg-transparent text-sm sm:text-base"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProviders.map((provider) => {
              return (
                <Link 
                  href={`/profile/${provider.id}`} 
                  key={provider.id}
                >
                  <div className="group rounded-lg border border-border bg-card dark:bg-card hover:shadow-sm transition-shadow h-full flex flex-col">
                    <div className="aspect-4/3 bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-t-lg">
                      <img
                        src={provider.avatar || "/placeholder-user.jpg"}
                        alt={provider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 sm:p-3 flex flex-col grow">
                      <h3 className="font-medium text-sm sm:text-base leading-tight mb-1 truncate text-foreground">{provider.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2 truncate">{provider.specialty || "Service Provider"}</p>
                      {provider.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{provider.bio}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </section>
      </>
    </main>
  )
}
