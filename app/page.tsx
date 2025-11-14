"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Users, Award } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import HeroSection from "@/components/hero-section"

const features = [
  {
    icon: Zap,
    title: "Easy to Use",
    description: "Create and manage your portfolio in minutes. No coding required.",
  },
  {
    icon: Users,
    title: "Connect with Clients",
    description: "Built-in messaging system to communicate directly with potential clients.",
  },
  {
    icon: Award,
    title: "Build Your Reputation",
    description: "Collect ratings and reviews from satisfied clients to build trust.",
  },
]

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/browse")
    }
  }, [user, router])
  
  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        title="Showcase Your Work Professionally"
        description="A modern portfolio platform for designers, developers, writers, and creative professionals. Connect with clients and build your professional presence."
        height="lg"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/auth/register">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/browse" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-background/50 hover:bg-background/70 text-foreground border-foreground/30">
              Browse Portfolios
            </Button>
          </Link>
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 text-foreground">Why Choose PortfolioHub?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <div key={idx} className="bg-card p-6 sm:p-8 rounded-lg border border-border">
                  <IconComponent className="w-10 sm:w-12 h-10 sm:h-12 text-primary mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-foreground/70">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 sm:py-20 px-4">
        <div className="bg-primary text-white rounded-lg p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Showcase Your Work?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">Join thousands of creative professionals on PortfolioHub</p>
          <Link href="/auth/register">
            <Button className="bg-white text-primary hover:bg-neutral-100 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg">
              Create Your Portfolio
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
