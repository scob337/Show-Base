"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeroSection from "@/components/hero-section"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const mailtoLink = `mailto:scob198350@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`
    
    window.location.href = mailtoLink
    
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        title="Get in Touch"
        description="Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
      />

      <section className="container px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Contact Information</h2>
            
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-start gap-4">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-sm sm:text-base text-foreground/70">scob198350@gmail.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-start gap-4">
                <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-sm sm:text-base text-foreground/70">+20 1095 450 145</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Address</h3>
                  <p className="text-sm sm:text-base text-foreground/70">Cairo, Egypt</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl sm:text-5xl mb-4">✓</div>
                  <p className="text-base sm:text-lg text-green-600 font-semibold">Message sent successfully!</p>
                  <p className="text-sm sm:text-base text-foreground/70 mt-2">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-foreground mb-2">Your Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-foreground mb-2">Subject</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium text-foreground mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-light text-white py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
  )

    </main>
  )
}
