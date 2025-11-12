import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ChatProvider } from "@/lib/chat-context"
import { ReviewProvider } from "@/lib/review-context"

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
        <AuthProvider>
          <ChatProvider>
            <ReviewProvider>{children}</ReviewProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
