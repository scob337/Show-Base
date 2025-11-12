"use client"

import { useLanguage } from "@/lib/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === "ar" ? "EN" : "AR"}</span>
    </button>
  )
}
