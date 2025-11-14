"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  LogOut, 
  Settings, 
  User, 
  MessageCircle, 
  LayoutDashboard,
  ChevronDown,
  FileText,
  Star
} from "lucide-react"

export default function UserDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return null

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push("/")
  }

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      show: true,
    },
    {
      label: "Profile Settings",
      icon: Settings,
      href: "/dashboard/settings",
      show: true,
    },
    {
      label: "Messages",
      icon: MessageCircle,
      href: "/dashboard/messages",
      show: true,
    },
    ...(user.userType === "provider"
      ? [
          {
            label: "My Services",
            icon: FileText,
            href: "/dashboard/projects",
            show: true,
          },
          {
            label: "Reviews",
            icon: Star,
            href: "/dashboard/reviews",
            show: true,
          },
        ]
      : [
          {
            label: "Browse Providers",
            icon: User,
            href: "/browse",
            show: true,
          },
        ]),
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded capitalize">
              {user.userType === "provider" ? "Service Provider" : "Seeker"}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-3 text-foreground hover:bg-muted transition-colors text-sm"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </div>

          {/* Logout Button */}
          <div className="px-2 py-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors text-sm rounded"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
