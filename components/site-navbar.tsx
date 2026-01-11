"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

type SiteNavbarProps = {
  /** On the homepage this should be "#features"; on subpages use "/#features". */
  featuresHref?: string
}

export default function SiteNavbar({ featuresHref = "#features" }: SiteNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-github-border/50 backdrop-blur-sm bg-github-canvas/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent-emphasis to-accent-emphasis/70 shadow-lg shadow-accent-emphasis/20">
              <img src="/pathminer-custom-logo.svg" alt="PathMiner logo" className="w-26 h-26" />
            </div>
            <span id="logo-text" className="text-xl font-bold text-github-fg">
              PathMiner
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a id="features-link" href={featuresHref} className="text-github-fg-muted hover:text-github-fg transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-github-fg-muted hover:text-github-fg transition-colors" style={{ display: "none" }}>
              Benefits
            </a>
            <a href="#pricing" className="text-github-fg-muted hover:text-github-fg transition-colors" style={{ display: "none" }}>
              Pricing
            </a>
            <Link href="/playground" className="text-github-fg-muted hover:text-github-fg transition-colors">
              Playground
            </Link>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button
                    id="sign-in-btn"
                    className="bg-[#6d00d4] text-white hover:bg-[#6d00d4]/90 shadow-lg shadow-[#6d00d4]/20"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}


