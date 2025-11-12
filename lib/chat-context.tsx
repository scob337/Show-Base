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

      const allMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]")
      allMessages.push(newMessage)
      localStorage.setItem("portfolioMessages", JSON.stringify(allMessages))

      const allConversations = JSON.parse(localStorage.getItem("portfolioConversations") || "[]")
      const convIndex = allConversations.findIndex((c: Conversation) => c.id === conversationId)
      if (convIndex !== -1) {
        allConversations[convIndex].lastMessage = text
        allConversations[convIndex].lastMessageTime = newMessage.timestamp
        localStorage.setItem("portfolioConversations", JSON.stringify(allConversations))
      }

      setMessages((prev) => [...prev, newMessage])
    },
    []
  )

  const startConversation = useCallback(
    (userId1: string, user1Name: string, userId2: string, user2Name: string): string => {
      const allConversations = JSON.parse(localStorage.getItem("portfolioConversations") || "[]")

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
      localStorage.setItem("portfolioConversations", JSON.stringify(allConversations))

      return newConversation.id
    },
    []
  )

  const loadConversation = useCallback((conversationId: string) => {
    const allConversations = JSON.parse(localStorage.getItem("portfolioConversations") || "[]")
    const conv = allConversations.find((c: Conversation) => c.id === conversationId)
    setCurrentConversation(conv || null)

    const allMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]")
    const convMessages = allMessages.filter((m: Message) => m.conversationId === conversationId)
    setMessages(convMessages)
  }, [])

  const loadUserConversations = useCallback((userId: string) => {
    const allConversations = JSON.parse(localStorage.getItem("portfolioConversations") || "[]")
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
