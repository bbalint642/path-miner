"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Code2, Sparkles, Shield, Zap, Target, Brain } from "lucide-react"
import ParticleBackground from "@/components/particle-background"
import ScrollToTop from "@/components/scroll-to-top"
import Link from "next/link"
import SiteNavbar from "@/components/site-navbar"

export default function Home() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasEmail = email.trim().length > 0
  const canSubmit = hasEmail && consentChecked

  const HONEYPOT_FIELD = "company"

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !consentChecked) return

    setSubmitError(null)

    const formData = new FormData(event.currentTarget)
    const honeypot = String(formData.get(HONEYPOT_FIELD) ?? "").trim()

    // If honeypot is filled, silently "succeed" without hitting the backend.
    if (honeypot.length > 0) {
      setSubmitted(true)
      setEmail("")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent: consentChecked,
          [HONEYPOT_FIELD]: honeypot,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setSubmitError(data?.error ?? "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
      setEmail("")
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-github-canvas text-github-fg overflow-hidden">
      <ParticleBackground particleColor="#888" speed="slow" density="high" />
      <ScrollToTop />

      {/* Navigation */}
      <SiteNavbar featuresHref="#features" />

      {/* Content wrapper - pushed down by navbar height */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-left mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emphasis/30 bg-accent-emphasis/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">AI-Powered DOM Testing Tool</span>
            </div>
          </div>

          <h1 id="hero-title" className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            <span className="text-github-fg">All in one </span>
            <span className="bg-gradient-to-r from-accent-emphasis via-purple-400 to-accent-emphasis bg-clip-text text-transparent">
              DOM Exploration and Automation tool
            </span>
          </h1>

          <p id="hero-description" className="text-xl md:text-2xl text-github-fg-muted mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
            {
              "Discover DOM elements instantly and generate Playwright automation code in TypeScript. Built-in AI with local LLM ensures your data never leaves your machine."
            }
          </p>

          <div className="group/cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              id="primary-cta-btn"
              size="lg"
              onClick={() => {
                document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary-cta"
            >
              
              Join waitlist
            </Button>
            <Button
              id="secondary-cta-btn"
              asChild
              size="lg"
              variant="outline"
              className="btn-secondary-cta"
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
            <p className="text-xl text-github-fg-muted">Everything you need to explore, understand, and automate complex DOM structures with confidence.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards with Glass Morphism */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-emphasis/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full rounded-xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-6 hover:border-accent-emphasis/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-accent-emphasis/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-github-fg">Blazing Fast DOM Element Discovery</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Instantly locate any element on the page with PathMiner’s interactive DOM explorer."
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
                <h3 className="text-xl font-bold mb-2 text-github-fg">Production-Ready Code Generation</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Generate clean, idiomatic code with a single click. Copy the snippets with ease to your Playwright or Python test suite."
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
                <h3 className="text-xl font-bold mb-2 text-github-fg">Context-Aware Built-in AI Assistant</h3>
                <p className="text-github-fg-muted leading-relaxed">
                  {
                    "Ask questions, get suggestions, and optimize your selectors with our intelligent built-in AI assistant."
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
                    "PathMiner runs entirely on your machine – your pages, tests, and prompts never leave your local environment."
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
      <section id="waitlist-section" className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-emphasis via-purple-500 to-accent-emphasis rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-2xl border border-github-border/50 bg-github-canvas-overlay/50 backdrop-blur-xl p-12 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emphasis/30 bg-accent-emphasis/5 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">Join the waitlist</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-github-fg text-balance text-center">
                Want early access to PathMiner?
              </h2>
              <p className="text-xl text-github-fg-muted mb-8 text-balance text-center">
                {
                  "Let us know you're interested and we'll keep you updated on our progress."
                }
              </p>

              <form onSubmit={handleWaitlistSubmit} className="space-y-4 max-w-2xl mx-auto">
                {/* Honeypot field (anti-bot). Real users won't see or fill this. */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="waitlist-company">Company</label>
                  <input
                    id="waitlist-company"
                    name={HONEYPOT_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>

                <div className="relative w-full">
                  <label htmlFor="waitlist-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="waitlist-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-github-border/60 bg-github-canvas/60 px-4 py-4 pr-40 text-center sm:text-left text-github-fg shadow-inner shadow-black/5 outline-none transition focus:border-accent-emphasis focus:ring-2 focus:ring-accent-emphasis/50"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit || isSubmitting}
                    className={[
                      "btn-waitlist-submit-cta absolute inset-y-1 right-1 px-5 border-2 text-white h-[calc(100%-0.5rem)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-60 disabled:cursor-not-allowed",
                      !canSubmit
                        ? "bg-gray-500 border-gray-500 shadow-none hover:bg-gray-500 hover:border-gray-500"
                        : "bg-accent-emphasis border-accent-emphasis shadow-xl shadow-accent-emphasis/20 hover:bg-accent-emphasis/90 hover:border-accent-emphasis",
                    ].join(" ")}
                  >
                    {isSubmitting ? "Joining..." : "Join waitlist"}
                  </Button>
                </div>

                {submitted ? (
                  <p className="text-sm text-white/90 text-center">
                    Thanks — you’re on the list.
                  </p>
                ) : null}

                {submitError ? (
                  <p className="text-sm text-red-200 text-center">{submitError}</p>
                ) : null}

                <div className="space-y-2 text-sm text-github-fg-muted text-center">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center">
                    <Checkbox
                      id="consent-checkbox"
                      checked={consentChecked}
                      onCheckedChange={(next) => setConsentChecked(Boolean(next))}
                      className={[
                        "mt-1 cursor-pointer",
                        "focus-visible:ring-2 focus-visible:ring-accent-emphasis/50",
                        // explicit unchecked border; colors are enforced via inline style below
                        "border border-github-border/60",
                      ].join(" ")}
                      style={
                        consentChecked
                          ? {
                              backgroundColor: "#10002e",
                              borderColor: "#6d00d4",
                              color: "#ffffff", // checkmark uses currentColor
                            }
                          : {
                              backgroundColor: "#ffffff",
                              borderColor: "rgba(255,255,255,0.35)",
                              color: "#6d00d4",
                            }
                      }
                    />
                    <Label
                      htmlFor="consent-checkbox"
                      className="block leading-relaxed cursor-pointer font-normal text-center"
                    >
                      I acknowledge that PathMiner may store my data in line with the{" "}
                      <Link
                        href="/consent"
                        className="text-purple-100 underline decoration-1 underline-offset-4 hover:text-accent-emphasis transition-colors cursor-pointer"
                      >
                        Data Processing Consent
                      </Link>
                      .
                    </Label>
                  </div>
                </div>
              </form>
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
                <span id="footer-logo-text" className="text-lg font-bold text-github-fg">PathMiner</span>
              </div>
              <p id="footer-description" className="text-github-fg-muted text-sm">
                {"PathMiner is your all‑in‑one workspace. Fast, reliable, and developer-friendly."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-github-fg mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-github-fg-muted">
                <li>
                  <a id="features-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a id="pricing-link-footer" href="#" className="hover:text-accent-emphasis transition-colors" style={{display: "none"}}>
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/playground" className="hover:text-accent-emphasis transition-colors">
                    Playground
                  </Link>
                </li>
                <li>
                  <a id="documentation-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a id="changelog-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-github-fg mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-github-fg-muted">
                <li>
                  <a id="about-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a id="blog-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a id="contact-link-footer" href="#" className="hover:text-accent-emphasis transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-emphasis transition-colors" style={{display: "none"}}>
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
    </div>
  )
}
