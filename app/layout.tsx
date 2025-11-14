import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { ChatProvider } from "@/lib/chat-context"
import { ReviewProvider } from "@/lib/review-context"
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PortfolioHub - Showcase Your Work",
  description: "Professional portfolio platform for freelancers and service providers",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <Navbar />
              <ReviewProvider>{children}</ReviewProvider>
              <Footer />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
