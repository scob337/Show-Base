"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Upload, X } from "lucide-react"

interface FormData {
  title: string
  description: string
  category: string
  tools: string
}

const SERVICE_CATEGORIES = [
  "Graphic Design",
  "UI/UX Design",
  "Web Development",
  "Mobile Development",
  "Backend Development",
  "Frontend Development",
  "Content Writing",
  "Video Production",
  "Photography",
  "Digital Marketing",
  "Branding",
  "Illustration",
]

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    tools: "",
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>("")
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      setSession(session)
    }

    checkAuth()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAdditionalImages((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("portfolio-images").getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("يرجى إدخال عنوان للمشروع")
      return
    }

    if (!formData.description.trim()) {
      setError("يرجى إدخال وصف للمشروع")
      return
    }

    if (!coverImage) {
      setError("يرجى تحميل صورة غلاف للمشروع")
      return
    }

    if (!formData.category) {
      setError("يرجى اختيار تصنيف للمشروع")
      return
    }

    if (!session) {
      setError("يجب تسجيل الدخول لإنشاء مشروع جديد")
      return
    }

    setIsSaving(true)

    try {
      const coverImageUrl = await uploadImage(coverImage, `projects/${session.user.id}`)

      const additionalImageUrls: string[] = []
      for (const image of additionalImages) {
        const url = await uploadImage(image, `projects/${session.user.id}`)
        additionalImageUrls.push(url)
      }

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: session.user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tools: formData.tools.split(",").map((t) => t.trim()),
          cover_image_url: coverImageUrl,
        })
        .select()
        .single()

      if (projectError) throw projectError

      if (additionalImageUrls.length > 0) {
        const imagesToInsert = additionalImageUrls.map((url) => ({
          project_id: projectData.id,
          image_url: url,
        }))

        const { error: imagesError } = await supabase.from("project_images").insert(imagesToInsert)

        if (imagesError) throw imagesError
      }

      router.push("/dashboard/projects")
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsSaving(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-neutral-600">Showcase your latest work to potential clients</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Fill in your project information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Project Title *</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., E-commerce Website Redesign"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project, the challenge, and the solution"
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      id="cover-image"
                      required
                    />
                    <label htmlFor="cover-image" className="cursor-pointer">
                      {coverImagePreview ? (
                        <div className="space-y-2">
                          <img
                            src={coverImagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded"
                          />
                          <p className="text-sm text-neutral-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-neutral-400" />
                          <p className="text-sm font-medium">Drag image here or click to select</p>
                          <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Images</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                      id="additional-images"
                      multiple
                    />
                    <label htmlFor="additional-images" className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-neutral-400" />
                        <p className="text-sm font-medium">Add more images</p>
                        <p className="text-xs text-neutral-500">You can select multiple images</p>
                      </div>
                    </label>
                  </div>

                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tools & Technologies</label>
                  <Input
                    type="text"
                    name="tools"
                    value={formData.tools}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Figma, Adobe XD (comma separated)"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-light" disabled={isSaving}>
                  {isSaving ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
