"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react"

interface CallInterfaceProps {
  conversationId: string
  otherUserName: string
  onCallEnd: () => void
}

export default function CallInterface({ conversationId, otherUserName, onCallEnd }: CallInterfaceProps) {
  const [callActive, setCallActive] = useState(false)
  const [callType, setCallType] = useState<"audio" | "video" | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const videoRefLocal = useRef<HTMLVideoElement>(null)
  const videoRefRemote = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (callActive && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [callActive])

  const startCall = (type: "audio" | "video") => {
    setCallType(type)
    setCallActive(true)
    setCallDuration(0)

    // Simulate getting local stream
    if (type === "video" && videoRefLocal.current) {
      // في التطبيق الفعلي، ستستخدم getUserMedia من WebRTC
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRefLocal.current) {
            videoRefLocal.current.srcObject = stream
          }
        })
        .catch((err) => console.error("Error accessing media devices:", err))
    }
  }

  const endCall = () => {
    setCallActive(false)
    setCallType(null)
    setCallDuration(0)
    onCallEnd()
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!callActive) {
    return (
      <div className="flex gap-4">
        <Button
          onClick={() => startCall("audio")}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Audio Call
        </Button>
        <Button
          onClick={() => startCall("video")}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          Video Call
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {callType === "video" ? "Video Call" : "Audio Call"} with {otherUserName}
          </h2>
          <p className="text-foreground/70">Duration: {formatDuration(callDuration)}</p>
        </div>

        {callType === "video" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRefLocal}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              <video
                ref={videoRefRemote}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <p className="text-white">Connecting...</p>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {callType === "video" && (
            <Button
              onClick={toggleVideo}
              variant="outline"
              className={`${
                isVideoEnabled
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isVideoEnabled ? (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Video On
                </>
              ) : (
                <>
                  <VideoOff className="w-4 h-4 mr-2" />
                  Video Off
                </>
              )}
            </Button>
          )}

          <Button
            onClick={toggleMute}
            variant="outline"
            className={`${
              isMuted
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isMuted ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Muted
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Unmuted
              </>
            )}
          </Button>

          <Button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </Button>
        </div>
      </div>
    </div>
  )
}
