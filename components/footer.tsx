"use client"

import Link from "next/link"

const footerSections = [
  {
    title: "PortfolioHub",
    content: "Professional portfolio platform for creative professionals.",
    isDescription: true,
  },
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-footer text-footer py-12 dark:bg-background dark:text-foreground">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
            
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              {section.isDescription ? (
                <p className="text-sm">{section.content}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {section.links?.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link 
                        href={link.href} 
                        className="hover:opacity-70 transition-opacity dark:hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p>&copy; 2025 PortfolioHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
