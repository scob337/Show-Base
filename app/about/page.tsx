"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Zap, Award } from "lucide-react"
import HeroSection from "@/components/hero-section"

const benefits = [
  {
    icon: Users,
    title: "For Service Providers",
    description: "Showcase your work, connect with clients, and build your professional reputation through ratings and reviews.",
  },
  {
    icon: Zap,
    title: "For Clients",
    description: "Browse portfolios, find talented professionals, and communicate directly to discuss your project needs.",
  },
  {
    icon: Award,
    title: "Community Driven",
    description: "A transparent marketplace where quality work is rewarded and professionals grow together.",
  },
]

const features = [
  "Easy portfolio creation with no coding required",
  "Real-time messaging system for seamless communication",
  "Ratings and reviews system to build trust",
  "Browse and filter services by specialty and category",
  "Secure and reliable platform for professionals",
  "Dark mode support for comfortable viewing",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        title="About PortfolioHub"
        description="PortfolioHub is a modern platform designed to connect creative professionals with clients who need their services. Whether you're a designer, developer, writer, or any creative professional, we provide the tools you need to succeed."
      />

      {/* Mission Section */}
      <section className="bg-card border-t border-b border-border py-12 sm:py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Our Mission</h2>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3 sm:mb-4">
            We believe that talented professionals deserve a platform where their work speaks for itself. PortfolioHub was created to bridge the gap between service providers and clients, making it easy for professionals to showcase their skills and for clients to find exactly what they need.
          </p>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            Our goal is to create a transparent, trustworthy marketplace where quality work is recognized and rewarded, enabling professionals to build thriving careers doing what they love.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-12 sm:py-20 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12 text-center">Who We Serve</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon
            return (
              <Card key={idx}>
                <CardHeader>
                  <IconComponent className="w-8 sm:w-10 h-8 sm:h-10 text-primary mb-4" />
                  <CardTitle className="text-lg sm:text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-foreground/70">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-b border-border py-12 sm:py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-foreground/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container py-12 sm:py-20 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-4">100%</div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Transparency</h3>
            <p className="text-sm sm:text-base text-foreground/70">Clear communication and honest reviews build trust between all parties</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-4">∞</div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Growth</h3>
            <p className="text-sm sm:text-base text-foreground/70">We support professionals in growing their careers and expanding their reach</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-4">🔒</div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Security</h3>
            <p className="text-sm sm:text-base text-foreground/70">Your data and transactions are secure on our reliable platform</p>
          </div>
        </div>
      </section>
    </main>
  )
}
