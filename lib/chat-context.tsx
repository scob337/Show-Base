"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  participants: string[]
  participantNames: { [key: string]: string }
  lastMessage?: string
  lastMessageTime?: string
  createdAt: string
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  sendMessage: (conversationId: string, senderId: string, senderName: string, text: string) => void
  startConversation: (userId1: string, user1Name: string, userId2: string, user2Name: string) => string
  loadConversation: (conversationId: string) => void
  loadUserConversations: (userId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

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

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = useCallback(
    (conversationId: string, senderId: string, senderName: string, text: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId,
        senderName,
        text,
        timestamp: new Date().toISOString(),
      }

      const allMessagesCookie = getCookie("portfolioMessages")
      const allMessages = allMessagesCookie ? JSON.parse(allMessagesCookie) : []
      allMessages.push(newMessage)
      setCookie("portfolioMessages", JSON.stringify(allMessages), 7)

      const allConversationsCookie = getCookie("portfolioConversations")
      const allConversations = allConversationsCookie ? JSON.parse(allConversationsCookie) : []
      const convIndex = allConversations.findIndex((c: Conversation) => c.id === conversationId)
      if (convIndex !== -1) {
        allConversations[convIndex].lastMessage = text
        allConversations[convIndex].lastMessageTime = newMessage.timestamp
        setCookie("portfolioConversations", JSON.stringify(allConversations), 7)
      }

      setMessages((prev) => [...prev, newMessage])
    },
    []
  )

  const startConversation = useCallback(
    (userId1: string, user1Name: string, userId2: string, user2Name: string): string => {
      const allConversationsCookie = getCookie("portfolioConversations")
      const allConversations = allConversationsCookie ? JSON.parse(allConversationsCookie) : []

      const existingConv = allConversations.find(
        (c: Conversation) =>
          (c.participants.includes(userId1) && c.participants.includes(userId2)) ||
          (c.participants.includes(userId2) && c.participants.includes(userId1))
      )

      if (existingConv) {
        return existingConv.id
      }

      const newConversation: Conversation = {
        id: Date.now().toString(),
        participants: [userId1, userId2],
        participantNames: {
          [userId1]: user1Name,
          [userId2]: user2Name,
        },
        createdAt: new Date().toISOString(),
      }

      allConversations.push(newConversation)
      setCookie("portfolioConversations", JSON.stringify(allConversations), 7)

      return newConversation.id
    },
    []
  )

  const loadConversation = useCallback((conversationId: string) => {
    const allConversationsCookie = getCookie("portfolioConversations")
    const allConversations = allConversationsCookie ? JSON.parse(allConversationsCookie) : []
    const conv = allConversations.find((c: Conversation) => c.id === conversationId)
    setCurrentConversation(conv || null)

    const allMessagesCookie = getCookie("portfolioMessages")
    const allMessages = allMessagesCookie ? JSON.parse(allMessagesCookie) : []
    const convMessages = allMessages.filter((m: Message) => m.conversationId === conversationId)
    setMessages(convMessages)
  }, [])

  const loadUserConversations = useCallback((userId: string) => {
    const allConversationsCookie = getCookie("portfolioConversations")
    const allConversations = allConversationsCookie ? JSON.parse(allConversationsCookie) : []
    const userConversations = allConversations.filter((c: Conversation) => c.participants.includes(userId))
    setConversations(userConversations)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        sendMessage,
        startConversation,
        loadConversation,
        loadUserConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
