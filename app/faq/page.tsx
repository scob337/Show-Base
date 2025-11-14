"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import HeroSection from "@/components/hero-section"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "What is PortfolioHub?",
    answer: "PortfolioHub is a modern platform designed to help creative professionals showcase their work and connect with clients. Whether you're a designer, developer, writer, or any creative professional, you can create a portfolio, display your services, and communicate directly with potential clients.",
  },
  {
    question: "How do I create a portfolio?",
    answer: "Simply sign up for an account, provide your basic information, upload your work samples or projects, and write a bio about yourself. It takes just a few minutes! No coding knowledge is required.",
  },
  {
    question: "Is PortfolioHub free to use?",
    answer: "Yes! PortfolioHub is completely free to use. You can create your portfolio, browse other professionals, and connect with clients at no cost. We believe in making opportunities accessible to everyone.",
  },
  {
    question: "How do I contact a service provider?",
    answer: "Once you find a service provider you're interested in, you can click on their profile and use the messaging system to send them a message. Direct communication helps you discuss your project needs and get personalized quotes.",
  },
  {
    question: "What is the rating and review system?",
    answer: "After working with a service provider, you can leave a rating and review of your experience. This helps build trust and reputation in the community. Service providers with higher ratings and positive reviews tend to attract more clients.",
  },
  {
    question: "Can I edit my profile information?",
    answer: "Yes! You can edit your profile at any time from your dashboard settings. Update your bio, specialty, portfolio projects, and profile picture whenever you want to keep your profile current.",
  },
  {
    question: "How does the messaging system work?",
    answer: "PortfolioHub includes a real-time messaging system that allows service providers and clients to communicate directly. You'll receive notifications when you get new messages, and the conversation history is saved for your reference.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, your security is our priority. We implement modern security practices to protect your personal information. Your data is encrypted and stored securely on our servers.",
  },
  {
    question: "Can I search by specialty or category?",
    answer: "Absolutely! You can filter service providers by their specialty or category. You can also select multiple filters at once to narrow down your search and find exactly what you're looking for.",
  },
  {
    question: "How do I get my work noticed?",
    answer: "Complete your profile with high-quality portfolio projects, write a compelling bio, and be responsive to client inquiries. Positive reviews and ratings also help increase your visibility and attract more clients.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        title="Frequently Asked Questions"
        description="Find answers to common questions about PortfolioHub, how to use our platform, and how to get the most out of your experience."
      />

      {/* FAQ Section */}
      <section className="container px-4 pb-12 sm:pb-20">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-card hover:bg-card/50 transition-colors text-left"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-foreground pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-background border-t border-border">
                  <p className="text-xs sm:text-base text-foreground/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card border-t border-border py-12 sm:py-16">
        <div className="container max-w-2xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white rounded-md hover:bg-primary-light transition-colors font-medium text-sm sm:text-base"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  )
}
