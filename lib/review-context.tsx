"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Review {
  id: string
  providerId: string
  reviewerId: string
  reviewerName: string
  rating: number
  text: string
  createdAt: string
}

interface ReviewContextType {
  reviews: Review[]
  addReview: (providerId: string, reviewerId: string, reviewerName: string, rating: number, text: string) => void
  getProviderReviews: (providerId: string) => Review[]
  getProviderRating: (providerId: string) => number
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

// Helper functions for cookies
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
}

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

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])

  const addReview = (providerId: string, reviewerId: string, reviewerName: string, rating: number, text: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      providerId,
      reviewerId,
      reviewerName,
      rating,
      text,
      createdAt: new Date().toISOString(),
    }

    const allReviewsCookie = getCookie("portfolioReviews")
    const allReviews = allReviewsCookie ? JSON.parse(allReviewsCookie) : []
    allReviews.push(newReview)
    setCookie("portfolioReviews", JSON.stringify(allReviews), 7)

    setReviews([...reviews, newReview])
  }

  const getProviderReviews = (providerId: string): Review[] => {
    const allReviewsCookie = getCookie("portfolioReviews")
    const allReviews = allReviewsCookie ? JSON.parse(allReviewsCookie) : []
    return allReviews.filter((r: Review) => r.providerId === providerId)
  }

  const getProviderRating = (providerId: string): number => {
    const providerReviews = getProviderReviews(providerId)
    if (providerReviews.length === 0) return 0

    const totalRating = providerReviews.reduce((sum: number, r: Review) => sum + r.rating, 0)
    return Math.round((totalRating / providerReviews.length) * 10) / 10
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProviderReviews, getProviderRating }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReview() {
  const context = useContext(ReviewContext)
  if (context === undefined) {
    throw new Error("useReview must be used within ReviewProvider")
  }
  return context
}
