"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import ParticleBackground from "@/components/particle-background"
import ScrollToTop from "@/components/scroll-to-top"
import Link from "next/link"
import { FileText, PlayCircle, Image as ImageIcon, BookOpen, X, ArrowLeft, ArrowRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

const screenshots = [
  {
    src: "/demo-pics/1-PM-Login.png",
    alt: "PathMiner login screen",
  },
  {
    src: "/demo-pics/2-PM-create-project-1.png",
    alt: "Create new project screen - step 1",
  },
  {
    src: "/demo-pics/3-PM-create-project-2.png",
    alt: "Create new project screen - step 2",
  },
  {
    src: "/demo-pics/4-PM-main-1-empty.png",
    alt: "Main PathMiner UI with empty project",
  },
  {
    src: "/demo-pics/5-PM-main-2-search.png",
    alt: "Main UI with element search",
  },
  {
    src: "/demo-pics/6-PM-main-3-scan.png",
    alt: "Main UI with DOM scan results",
  },
  {
    src: "/demo-pics/7-PM-locators.png",
    alt: "Locators panel",
  },
  {
    src: "/demo-pics/8-PM-actions-and-code.png",
    alt: "Actions and generated code view",
  },
  {
    src: "/demo-pics/9-PM-AI-1.png",
    alt: "AI assistance view 1",
  },
  {
    src: "/demo-pics/10-PM-AI-2.png",
    alt: "AI assistance view 2",
  },
  {
    src: "/demo-pics/11-PM-AI-3.png",
    alt: "AI assistance view 3",
  },
  {
    src: "/demo-pics/12-PM-browser-DOM-inspector.png",
    alt: "Browser DOM inspector integration",
  },
  {
    src: "/demo-pics/13-PM-browser-step-recorder.png",
    alt: "Browser step recorder",
  },
  {
    src: "/demo-pics/14-PM-browser-step-recorder-ai.png",
    alt: "Browser step recorder with AI explanation",
  },
  {
    src: "/demo-pics/15-PM-ai-generated-tc.png",
    alt: "AI generated test case",
  },
]

export default function LearnMorePage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesCount, setSlidesCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!carouselApi) return

    const update = () => {
      setSlidesCount(carouselApi.scrollSnapList().length)
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }

    update()
    carouselApi.on("select", update)
    carouselApi.on("reInit", update)

    return () => {
      carouselApi.off("select", update)
      carouselApi.off("reInit", update)
    }
  }, [carouselApi])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null)
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) => {
          if (prev === null) return prev
          return (prev - 1 + screenshots.length) % screenshots.length
        })
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((prev) => {
          if (prev === null) return prev
          return (prev + 1) % screenshots.length
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxIndex])
  return (
    <div className="relative min-h-screen bg-github-canvas text-github-fg overflow-hidden">
      <ParticleBackground particleColor="#6d00d4" speed="slow" density="medium" />
      <ScrollToTop />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-github-border/50 backdrop-blur-sm bg-github-canvas/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-emphasis to-accent-emphasis/70 shadow-lg shadow-accent-emphasis/20">
                <img
                  src="/pathminer-custom-logo.svg"
                  alt="PathMiner logo"
                  className="w-26 h-26"
                />
              </div>
              <span className="text-xl font-bold text-github-fg">PathMiner</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-github-fg-muted hover:text-github-fg transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-github-fg-muted hover:text-github-fg transition-colors" style={{display: "none"}}>
                Benefits
              </a>
              <a href="#pricing" className="text-github-fg-muted hover:text-github-fg transition-colors" style={{display: "none"}}>
                Pricing
              </a>
              <Button
                className="bg-accent-emphasis hover:bg-accent-emphasis/90 text-white shadow-lg shadow-accent-emphasis/20"
                disabled
              >
                Download Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Intro */}
      <section className="relative z-10 container mx-auto px-6 pt-16 pb-10 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emphasis/30 bg-accent-emphasis/5 backdrop-blur-sm mb-6">
          <span className="text-sm text-accent-emphasis font-medium">
            Learn more about PathMiner
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-github-fg text-balance">
          Everything you need to know about{" "}
          <span className="bg-gradient-to-r from-accent-emphasis via-purple-400 to-accent-emphasis bg-clip-text text-transparent">
            PathMiner
          </span>
        </h1>
        <p className="text-lg md:text-xl text-github-fg-muted mb-8 leading-relaxed max-w-3xl">
          Here you can find detailed documentation, step-by-step guides, screenshots,
          videos, and best practices to help you get the most out of PathMiner.
        </p>
      </section>

      {/* Content grid */}
      <section className="relative z-10 container mx-auto px-6 pb-24 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Documentation */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-github-fg">Documentation</h2>
              <p className="text-github-fg-muted mb-4 text-sm leading-relaxed">
                In-depth explanations of the core features, configuration options, and integrations.
              </p>
              <ul className="space-y-2 text-sm text-github-fg-muted mb-4">
                <li>• Overview of core features</li>
                <li>• Advanced DOM search techniques</li>
                <li>• Playwright integration examples</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-auto cursor-pointer" disabled>
                Coming soon
              </Button>
            </div>
          </div>

          {/* Guides */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-github-fg">Guides</h2>
              <p className="text-github-fg-muted mb-4 text-sm leading-relaxed">
                Step-by-step guides from installation to your first automated tests.
              </p>
              <ul className="space-y-2 text-sm text-github-fg-muted mb-4">
                <li>• Getting started with PathMiner</li>
                <li>• Setting up your own project</li>
                <li>• Tips for effective selector creation</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-auto cursor-pointer" disabled>
                Coming soon
              </Button>
            </div>
          </div>

          {/* Videos & screenshots */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-github-fg">Videos & demos</h2>
              <p className="text-github-fg-muted mb-4 text-sm leading-relaxed">
                Short videos and demos that showcase how to use PathMiner in real-world scenarios.
              </p>
              <ul className="space-y-2 text-sm text-github-fg-muted mb-4">
                <li>• Quick overview demo</li>
                <li>• End-to-end test automation</li>
                <li>• Advanced workflows</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-auto cursor-pointer" disabled>
                Coming soon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots & UI overview - wide slider */}
      <section className="relative z-10 w-full pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 sm:p-8 lg:p-10 hover:border-accent-emphasis/50 transition-all shadow-2xl">
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-emphasis/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-github-fg">Screenshots & UI overview</h2>
                    <p className="text-sm md:text-base text-github-fg-muted">
                      See how PathMiner looks and feels while it&apos;s running.
                    </p>
                  </div>
                </div>
              </div>

              <Carousel
                className="w-full"
                opts={{
                  loop: true,
                }}
                setApi={setCarouselApi}
              >
                <CarouselContent>
                  {screenshots.map((shot, index) => (
                    <CarouselItem key={shot.src} className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="group w-full max-w-5xl aspect-[16/9] rounded-xl border border-github-border/40 bg-github-canvas-inset/80 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emphasis/80 focus-visible:ring-offset-2 focus-visible:ring-offset-github-canvas"
                      >
                        <img
                          src={shot.src}
                          alt={shot.alt}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-6 md:-left-12 bg-github-canvas/80 border-github-border/60 hover:bg-accent-emphasis/80 hover:text-white" />
                <CarouselNext className="hidden sm:flex -right-6 md:-right-12 bg-github-canvas/80 border-github-border/60 hover:bg-accent-emphasis/80 hover:text-white" />
              </Carousel>

              {slidesCount > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {Array.from({ length: slidesCount }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={`h-2.5 rounded-full border transition-all ${
                        index === currentIndex
                          ? "w-6 bg-white border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                          : "w-2.5 bg-white/30 border-white/60 opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative px-4 sm:px-6 flex flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg transition hover:bg-black hover:border-white/60"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close image preview"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="inline-flex rounded-xl border border-github-border/60 bg-github-canvas-inset/90 overflow-hidden shadow-2xl items-center justify-center p-2 sm:p-4 max-w-[95vw] max-h-[90vh]">
              <img
                src={screenshots[lightboxIndex].src}
                alt={screenshots[lightboxIndex].alt}
                className="h-auto w-auto max-h-[85vh] max-w-[90vw] object-contain"
              />
            </div>
            {screenshots.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={`h-2.5 rounded-full border transition-all ${
                      index === lightboxIndex
                        ? "w-6 bg-white border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                        : "w-2.5 bg-white/40 border-white/70 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Open slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
            {screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg transition hover:bg-black hover:border-white/60"
                  onClick={() =>
                    setLightboxIndex((prev) => {
                      if (prev === null) return prev
                      return (prev - 1 + screenshots.length) % screenshots.length
                    })
                  }
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg transition hover:bg-black hover:border-white/60"
                  onClick={() =>
                    setLightboxIndex((prev) => {
                      if (prev === null) return prev
                      return (prev + 1) % screenshots.length
                    })
                  }
                  aria-label="Next image"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
