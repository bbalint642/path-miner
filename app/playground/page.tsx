"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

import ParticleBackground from "@/components/particle-background"
import ScrollToTop from "@/components/scroll-to-top"
import SiteNavbar from "@/components/site-navbar"
import EchoForm from "@/components/playground/echo-form"
import SimpleLoginForm from "@/components/playground/simple-login-form"

import styles from "./playground.module.css"

export default function PlaygroundPage() {
  return (
    <div className={styles.page}>
      <ParticleBackground particleColor="#6d00d4" speed="slow" density="medium" />
      <ScrollToTop />

      {/* Navigation */}
      <SiteNavbar featuresHref="/#features" />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles className={styles.badgeIcon} />
          <span className={styles.badgeText}>Playground</span>
        </div>

        <h1 className={styles.title}>
          A place to{" "}
          <span className={styles.titleAccent}>experiment</span>
        </h1>
        <p className={styles.subtitle}>
          Practice UI automation by interacting with a wide variety of web elements and experimenting with locator
          strategies — from simple XPath to more advanced approaches.
        </p>
      </section>

      <div className={styles.lower}>
        {/* Empty section placeholder */}
        <section className={styles.placeholderSection}>
          <h2 className={styles.sectionTitle}>Simple forms</h2>

          <div className={styles.simpleFormsGrid}>
            <SimpleLoginForm />
            <EchoForm />
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerGrid}>
              <div>
                <div className={styles.footerBrandRow}>
                  <div className={styles.footerBrandMark}>
                    <img src="/pathminer-custom-logo.svg" alt="PathMiner logo" className={styles.footerBrandLogo} />
                  </div>
                  <span className={styles.footerBrandText}>PathMiner</span>
                </div>
                <p className={styles.footerDesc}>
                  {"PathMiner is your all‑in‑one workspace. Fast, reliable, and developer-friendly."}
                </p>
              </div>

              <div>
                <h4 className={styles.footerHeading}>Product</h4>
                <ul className={styles.footerList}>
                  <li>
                    <Link href="/playground" className={styles.footerLink}>
                      Playground
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={styles.footerHeading}>Company</h4>
                <ul className={styles.footerList}>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={styles.footerHeading}>Legal</h4>
                <ul className={styles.footerList}>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.footerBottom}>
              <p>{"© 2025 PathMiner. All rights reserved."}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}


