"use client"

interface HeroSectionProps {
  title: string
  description: string
  image?: string
  height?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
  children?: React.ReactNode
}

export default function HeroSection({
  title,
  description,
  image = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
  height = "md",
  variant = "light",
  children,
}: HeroSectionProps) {
  const heightClasses = {
    sm: "py-8 sm:py-12 md:py-16",
    md: "py-12 sm:py-20 md:py-32",
    lg: "py-16 sm:py-24 md:py-40",
  }

  const overlayClasses = {
    light: "from-background/95 to-background/80",
    dark: "from-background/80 to-background/60",
  }

  return (
    <section className={`relative overflow-hidden ${heightClasses[height]}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-linear-to-r ${overlayClasses[variant]} z-10`}></div>
        <img
          src={image}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 text-balance">
            {description}
          </p>
          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
