"use client"

import { Button } from "@/components/ui/button"
import { Code2, Sparkles, Shield, Zap, Target, Brain } from "lucide-react"
import ParticleBackground from "@/components/particle-background"
import ScrollToTop from "@/components/scroll-to-top"
import Link from "next/link"

export default function Home() {
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
              <Button className="bg-accent-emphasis hover:bg-accent-emphasis/90 text-white shadow-lg shadow-accent-emphasis/20">
                Download Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emphasis/30 bg-accent-emphasis/5 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-accent-emphasis" />
            <span className="text-sm text-accent-emphasis font-medium">AI-Powered DOM Testing Tool</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            <span className="text-github-fg">The Ultimate </span>
            <span className="bg-gradient-to-r from-accent-emphasis via-purple-400 to-accent-emphasis bg-clip-text text-transparent">
              DOM Element Finder
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-github-fg-muted mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
            {
              "Discover DOM elements instantly and generate Playwright automation code in TypeScript. Built-in AI with local LLM ensures your data never leaves your machine."
            }
          </p>

          <div className="group/cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="cursor-pointer bg-accent-emphasis border-2 border-accent-emphasis group-hover/cta:bg-github-canvas/30 group-hover/cta:border-accent-emphasis text-white shadow-2xl shadow-accent-emphasis/20 text-lg px-8 py-6 h-auto transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Mining Elements
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="cursor-pointer border-github-border border-2 hover:bg-accent-emphasis text-github-fg hover:text-white text-lg px-8 py-6 h-auto backdrop-blur-sm bg-github-canvas/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <Link href="/learn-more">
                Find out more
              </Link>
            </Button>
          </div>

          {/* Glass Card with Screenshot Placeholder */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative rounded-2xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden">
              <div className="inline-flex rounded-xl border border-github-border/30 bg-github-canvas-inset/80 items-center justify-center">
                <video
                  src="/vids/pminer-landing-demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-github-fg">Powerful Features</h2>
            <p className="text-xl text-github-fg-muted">Everything you need for efficient DOM testing and automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards with Glass Morphism */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Smart Element Detection</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Instantly find any DOM element with our intelligent selector engine. Click, hover, or search - PathMiner finds it all."
                  }
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">TypeScript Code Generation</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Generate production-ready Playwright automation code in TypeScript. Copy and paste directly into your test suite."
                  }
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Built-in AI Assistant</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Ask questions, get suggestions, and optimize your selectors with our intelligent AI assistant powered by local LLM."
                  }
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Maximum Data Safety</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Your data never leaves your machine. Our locally stored LLM ensures complete privacy and security for your testing workflows."
                  }
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Lightning Fast Performance</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Built as a native desktop application for maximum speed. No browser extensions, no slowdowns, just pure performance."
                  }
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Developer-Friendly</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Designed by developers, for developers. Intuitive interface with keyboard shortcuts and seamless workflow integration."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-emphasis via-purple-500 to-accent-emphasis rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-2xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-12 text-center shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-github-fg text-balance">
                {"Interested in trying PathMiner for yourself?"}
              </h2>
              <p className="text-xl text-github-fg-muted mb-8 text-balance">
                {"Download our free demo and see how PathMiner accelerates your DOM testing and automation workflow in minutes."}
              </p>
              <div className="group/cta flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="cursor-pointer bg-accent-emphasis border-2 border-accent-emphasis group-hover/cta:bg-github-canvas/30 group-hover/cta:border-accent-emphasis text-white shadow-xl shadow-accent-emphasis/20 text-lg px-8 py-6 h-auto transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                  Download the free demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-github-border border-2 hover:bg-accent-emphasis text-github-fg hover:text-white text-lg px-8 py-6 h-auto backdrop-blur-sm bg-github-canvas/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                  View documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-github-border/50 backdrop-blur-sm bg-github-canvas/30 mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-emphasis to-accent-emphasis/70">
                  <img
                    src="/pathminer-custom-logo.svg"
                    alt="PathMiner logo"
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-lg font-bold text-github-fg">PathMiner</span>
              </div>
              <p className="text-github-fg-muted text-sm">
                {"The ultimate DOM testing and automation tool for modern developers."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-github-fg mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-github-fg-muted">
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors" style={{display: "none"}}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-github-fg mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-github-fg-muted">
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-github-fg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-github-fg-muted">
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent-emphasis transition-colors"
                    style={{ display: "none" }}
                  >
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-github-border/50 mt-12 pt-8 text-center text-sm text-github-fg-muted">
            <p>{"© 2025 PathMiner. All rights reserved."}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
