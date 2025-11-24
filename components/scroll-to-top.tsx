"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down past first section (about 600px)
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      id="scroll-to-top-btn"
      className={`
        fixed bottom-8 right-8 z-50 cursor-pointer
        w-12 h-12 rounded-xl
        border border-github-border/50 bg-github-canvas-overlay/80 backdrop-blur-xl
        shadow-lg shadow-accent-emphasis/10
        flex items-center justify-center
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:border-accent-emphasis/50 hover:bg-accent-emphasis/10 hover:shadow-accent-emphasis/30
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-accent-emphasis" />
    </button>
  )
}
