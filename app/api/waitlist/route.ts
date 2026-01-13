import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const HONEYPOT_FIELD = "company" // honeypot field name expected from the client
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5 // max requests per IP per window

// URL is not secret; allow fallback to NEXT_PUBLIC_ to avoid duplication in env setup.
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null

function isValidEmail(email: string) {
  // intentionally simple; we only need to block obvious garbage
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type RateLimitEntry = { count: number; resetAt: number }

function getClientIp(request: Request) {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for"),
  ].filter(Boolean) as string[]

  const raw = (candidates[0] ?? "").split(",")[0]?.trim() ?? ""
  if (!raw) return "unknown"

  // strip port if present (e.g. "1.2.3.4:1234")
  if (raw.includes(":") && raw.includes(".")) {
    const lastColon = raw.lastIndexOf(":")
    const maybePort = raw.slice(lastColon + 1)
    if (/^\d+$/.test(maybePort)) return raw.slice(0, lastColon)
  }

  return raw
}

function rateLimitHit(ip: string, now = Date.now()) {
  const g = globalThis as unknown as {
    __waitlistRateLimit?: Map<string, RateLimitEntry>
  }

  if (!g.__waitlistRateLimit) g.__waitlistRateLimit = new Map()
  const store = g.__waitlistRateLimit

  const current = store.get(ip)
  if (!current || current.resetAt <= now) {
    const next: RateLimitEntry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    store.set(ip, next)
    return { limited: false as const, remaining: RATE_LIMIT_MAX - 1, resetAt: next.resetAt }
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { limited: true as const, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(ip, current)
  return { limited: false as const, remaining: Math.max(0, RATE_LIMIT_MAX - current.count), resetAt: current.resetAt }
}

export async function POST(request: Request) {
  let email = ""
  let consent = false
  let honeypot = ""

  const contentType = request.headers.get("content-type") ?? ""

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as unknown
      if (body && typeof body === "object") {
        const b = body as Record<string, unknown>
        email = typeof b.email === "string" ? b.email.trim() : ""
        consent = Boolean(b.consent)
        honeypot =
          typeof b[HONEYPOT_FIELD] === "string" ? (b[HONEYPOT_FIELD] as string).trim() : ""
      }
    } else {
      const formData = await request.formData()
      email = String(formData.get("email") ?? "").trim()
      consent = String(formData.get("consent") ?? "") === "true"
      honeypot = String(formData.get(HONEYPOT_FIELD) ?? "").trim()
    }
  } catch {
    // ignore parse errors; we'll validate below
  }

  // Honeypot hit: treat as success but do nothing (drop bots silently).
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const ip = getClientIp(request)
  const rl = rateLimitHit(ip)
  if (rl.limited) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
        },
      },
    )
  }

  if (!email || email.length > 320 || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }

  if (!consent) {
    return NextResponse.json({ ok: false, error: "Consent required" }, { status: 400 })
  }

  if (!supabaseAdmin) {
    const missing: string[] = []
    if (!SUPABASE_URL) missing.push("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)")
    if (!SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY")
    console.error("Waitlist API misconfigured. Missing env:", missing.join(", "))
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 })
  }

  const userAgent = request.headers.get("user-agent") ?? null

  const { error } = await supabaseAdmin.from("waitlist_signups").insert({
    email,
    consent,
    ip: ip === "unknown" ? null : ip,
    user_agent: userAgent,
    source: "landing",
  })

  // Unique constraint violation => email already exists.
  // We treat this as success (idempotent) to avoid email enumeration UX/security issues.
  if (error && error.code === "23505") {
    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
        },
      },
    )
  }

  if (error) {
    console.error("Supabase insert failed:", error)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }

  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
      },
    },
  )
}

