"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"
import { Send, MessageCircle, Phone, Video, X } from "lucide-react"
import CallInterface from "@/components/call-interface"

interface Conversation {
  id: string
  participants: string[]
  participantNames: { [key: string]: string }
  lastMessage?: string
  lastMessageTime?: string
  createdAt: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
}

export default function MessagesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { conversations, currentConversation, messages, sendMessage, loadConversation, loadUserConversations } =
    useChat()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState("")
  const [localConversations, setLocalConversations] = useState<Conversation[]>([])
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [activeCall, setActiveCall] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    } else if (user) {
      loadUserConversations(user.id)
      const allConversations = JSON.parse(localStorage.getItem("portfolioConversations") || "[]")
      const userConversations = allConversations.filter((c: Conversation) => c.participants.includes(user.id))
      setLocalConversations(userConversations)
    }
  }, [user, isLoading, router, loadUserConversations])

  // Poll for new messages every 2 seconds for real-time effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversation && user) {
        const allMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]")
        const convMessages = allMessages.filter((m: Message) => m.conversationId === selectedConversation.id)
        
        // Check if there are new messages
        if (convMessages.length > localMessages.length) {
          const newMessages = convMessages.slice(localMessages.length)
          newMessages.forEach((msg: Message) => {
            if (msg.senderId !== user.id) {
              showNotification(`New message from ${msg.senderName}`, "info")
            }
          })
        }
        
        setLocalMessages(convMessages)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [selectedConversation, localMessages, user])

  const showNotification = (message: string, type: "success" | "info") => {
    setNotification({ message, type })
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  useEffect(() => {
    if (selectedConversation) {
      loadConversation(selectedConversation.id)
      const allMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]")
      const convMessages = allMessages.filter((m: Message) => m.conversationId === selectedConversation.id)
      setLocalMessages(convMessages)
    }
  }, [selectedConversation, loadConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !user) return

    sendMessage(selectedConversation.id, user.id, user.name, messageText)
    setMessageText("")
    showNotification("Message sent successfully", "success")

    const allMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]")
    const convMessages = allMessages.filter((m: Message) => m.conversationId === selectedConversation.id)
    setLocalMessages(convMessages)
  }

  const getOtherParticipantName = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find((id) => id !== user?.id)
    return otherUserId ? conversation.participantNames[otherUserId] : "Unknown"
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-40 ${
          notification.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-blue-500 text-white"
        }`}>
          {notification.message}
        </div>
      )}

      {/* Call Interface */}
      {activeCall && selectedConversation && (
        <CallInterface
          conversationId={activeCall}
          otherUserName={getOtherParticipantName(selectedConversation)}
          onCallEnd={() => setActiveCall(null)}
        />
      )}

      <div className="container py-12">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Messages</h1>

          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="border border-border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {localConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  localConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 border-b border-border text-left hover:bg-card/50 transition-colors ${
                        selectedConversation?.id === conv.id ? "bg-card" : ""
                      }`}
                    >
                      <p className="font-medium text-sm text-foreground">{getOtherParticipantName(conv)}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col bg-background">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold">{getOtherParticipantName(selectedConversation)}</h2>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setActiveCall(selectedConversation.id)}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <Phone className="w-4 h-4" />
                        Audio
                      </Button>
                      <Button
                        onClick={() => setActiveCall(selectedConversation.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {localMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      localMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.senderId === user.id 
                                ? "bg-primary text-white" 
                                : "bg-card dark:bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-primary hover:bg-primary-light">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
