"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateProfile, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    skills: [] as string[],
    bio: "",
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  
  // Skill categories with sub-skills
  const skillCategories = {
    "Web Development": [
      "Front-End Development",
      "Back-End Development",
      "Full-Stack Development",
      "React",
      "Angular",
      "Vue.js",
      "Node.js",
      "PHP",
      "WordPress",
      "Shopify",
    ],
    "Design": [
      "UI/UX Design",
      "Graphic Design",
      "Logo Design",
      "Brand Identity",
      "Illustration",
      "Motion Graphics",
      "3D Design",
    ],
    "Marketing": [
      "Digital Marketing",
      "Social Media Marketing",
      "Content Marketing",
      "SEO",
      "Email Marketing",
      "PPC Advertising",
    ],
    "Writing": [
      "Content Writing",
      "Copywriting",
      "Technical Writing",
      "Creative Writing",
      "Translation",
    ],
    "Video & Audio": [
      "Video Editing",
      "Animation",
      "Voice Over",
      "Audio Editing",
      "Podcast Production",
    ],
  };

  // إغلاق القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowSkillsDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    } else if (user) {
      setFormData({
        name: user.name || "",
        specialty: user.specialty || "",
        skills: user.skills || [],
        bio: user.bio || "",
      })
      if (user.avatar) {
        setAvatar(user.avatar)
      }
    }
  }, [user, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsSaving(true)

    try {
      // Prepare updates object
      const updates: any = {
        name: formData.name,
        specialty: formData.specialty,
        skills: formData.skills,
        bio: formData.bio,
      }

      // If we have a new avatar, add it to updates
      if (avatar && avatarFile) {
        updates.avatar = avatar
      }

      await updateProfile(updates)
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-neutral-600">Update your professional information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Your profile information is visible to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div
                    className={`p-3 rounded border ${
                      message.includes("successfully")
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex flex-col items-center mb-6">
                  <div 
                    className="relative cursor-pointer group mb-2" 
                    onClick={handleAvatarClick}
                  >
                    <div className="size-24 rounded-full overflow-hidden border-2 border-border">
                      {avatar ? (
                        <Image 
                          src={avatar} 
                          alt="Profile" 
                          width={96} 
                          height={96} 
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full bg-neutral-100 flex items-center justify-center">
                          <span className="text-2xl font-medium text-neutral-500">
                            {user?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="text-white size-6" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <span className="text-sm text-neutral-600">Click to change profile picture</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Specialty</label>
                  <Input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development, Graphic Design"
                    className="w-full mb-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <div className="relative">
                    <div 
                      className="w-full p-2 border border-gray-200 rounded-md mb-2 min-h-[42px] cursor-text flex flex-wrap gap-2"
                      onClick={() => setShowSkillsDropdown(true)}
                    >
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center"
                          >
                            {skill}
                            <button 
                              type="button"
                              className="ml-1 text-primary hover:text-primary-dark"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select your skills...</span>
                      )}
                    </div>
                    
                    {showSkillsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search skills..."
                            className="w-full p-2 border border-gray-200 rounded-md mb-2"
                            onChange={(e) => setSkillSearchQuery(e.target.value.toLowerCase())}
                            autoFocus
                          />
                        </div>
                        {Object.entries(skillCategories)
                          .filter(([category]) => 
                            !skillSearchQuery || 
                            category.toLowerCase().includes(skillSearchQuery) ||
                            skillCategories[category].some(skill => 
                              skill.toLowerCase().includes(skillSearchQuery)
                            )
                          )
                          .map(([category, skills]) => (
                            <div key={category} className="mb-2">
                              <div className="px-3 py-2 font-medium bg-gray-50">{category}</div>
                              <div>
                                {skills
                                  .filter(skill => !skillSearchQuery || skill.toLowerCase().includes(skillSearchQuery))
                                  .map(skill => (
                                    <div
                                      key={skill}
                                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                                        formData.skills.includes(skill) ? 'bg-primary/5' : ''
                                      }`}
                                      onClick={() => {
                                        if (formData.skills.includes(skill)) {
                                          setFormData(prev => ({
                                            ...prev,
                                            skills: prev.skills.filter(s => s !== skill)
                                          }));
                                        } else {
                                          setFormData(prev => ({
                                            ...prev,
                                            skills: [...prev.skills, skill]
                                          }));
                                        }
                                      }}
                                    >
                                      <span>{skill}</span>
                                      {formData.skills.includes(skill) && (
                                        <span className="text-primary">✓</span>
                                      )}
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Selected Skills</label>
                  <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-background/50">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm flex items-center"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No skills selected yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell clients about your experience and expertise"
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-light" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
