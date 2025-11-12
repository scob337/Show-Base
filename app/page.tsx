"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Users, Award } from "lucide-react"
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity">PortfolioHub</Link>
          <div className="flex items-center gap-6">
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse
            </Link>
            {!user ? (
              <>
                <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-md shadow-sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/settings" className="text-foreground hover:text-primary transition-colors font-medium">
                  {user.name}
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-md shadow-sm">Dashboard</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Showcase Your Work Professionally
          </h1>
          <p className="text-xl text-neutral-600 mb-8 text-balance">
            A modern portfolio platform for designers, developers, writers, and creative professionals. Connect with
            clients and build your professional presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary-light text-white px-8 py-6 text-lg">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="px-8 py-6 text-lg bg-transparent">
                Browse Portfolios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose PortfolioHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-border">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-neutral-600">Create and manage your portfolio in minutes. No coding required.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-border">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">Connect with Clients</h3>
              <p className="text-neutral-600">
                Built-in messaging system to communicate directly with potential clients.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-border">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Build Your Reputation</h3>
              <p className="text-neutral-600">Collect ratings and reviews from satisfied clients to build trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-primary text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Work?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of creative professionals on PortfolioHub</p>
          <Link href="/auth/register">
            <Button className="bg-white text-primary hover:bg-neutral-100">Create Your Portfolio</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-neutral-50 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">PortfolioHub</h4>
              <p className="text-neutral-600 text-sm">Professional portfolio platform for creative professionals.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-neutral-600">
            <p>&copy; 2025 PortfolioHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
