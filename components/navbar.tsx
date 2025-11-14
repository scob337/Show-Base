"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import ThemeToggle from "@/components/theme-toggle"
import UserDropdown from "@/components/user-dropdown"
import { LogOut, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function Navbar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        logout()
        setIsMenuOpen(false)
        router.push("/")
    }

    const handleNavClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
            <div className="container flex items-center justify-between h-16">
                <Link href="/" className="text-lg overflow-hidden sm:text-2xl font-bold text-primary hover:opacity-90 transition-opacity whitespace-nowrap">
                    <Image
                        src="./logo.png"
                        alt="PortfolioHub Logo"
                        width={20}
                        height={20}
                        className="object-cover w-[120px] h-[50px] " 
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-3 xl:gap-6">
                    <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium text-sm xl:text-base">
                        Browse
                    </Link>
                    <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium text-sm xl:text-base">
                        About
                    </Link>
                    <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium text-sm xl:text-base">
                        Contact
                    </Link>
                    <Link href="/faq" className="text-foreground hover:text-primary transition-colors font-medium text-sm xl:text-base">
                        FAQ
                    </Link>
                    {!user && (
                        <>
                            <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors font-medium text-sm xl:text-base">
                                Login
                            </Link>
                            <Link href="/auth/register">
                                <Button className="bg-primary hover:bg-primary-light text-white px-3 xl:px-5 py-2 rounded-md shadow-sm text-sm xl:text-base">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                    {user && (
                        <>
                            <UserDropdown />
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="bg-transparent border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 px-3 xl:px-5 py-2 rounded-md flex items-center gap-2 text-sm xl:text-base"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden xl:inline">Logout</span>
                            </Button>
                        </>
                    )}
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button and Theme Toggle */}
                <div className="lg:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5 text-foreground" />
                        ) : (
                            <Menu className="w-5 h-5 text-foreground" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="lg:hidden border-t border-border bg-background/95 backdrop-blur animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="container py-4 flex flex-col gap-3">
                        <Link
                            href="/browse"
                            onClick={handleNavClick}
                            className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded hover:bg-muted"
                        >
                            Browse
                        </Link>
                        <Link
                            href="/about"
                            onClick={handleNavClick}
                            className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded hover:bg-muted"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            onClick={handleNavClick}
                            className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded hover:bg-muted"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/faq"
                            onClick={handleNavClick}
                            className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded hover:bg-muted"
                        >
                            FAQ
                        </Link>

                        {!user ? (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={handleNavClick}
                                    className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded hover:bg-muted"
                                >
                                    Login
                                </Link>
                                <Link href="/auth/register" onClick={handleNavClick}>
                                    <Button className="w-full bg-primary hover:bg-primary-light text-white py-2 rounded-md shadow-sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="border-t border-border pt-3 mt-3">
                                    {user && <UserDropdown />}
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full bg-transparent border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 py-2 rounded-md flex items-center justify-center gap-2 mt-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
