"use client"

import React, { useEffect, useRef } from "react"
import "../app/particleBackground.css"

type SpeedSetting = "fast" | "medium" | "slow" | "none"
type DensitySetting = "high" | "medium" | "low" | number

interface ParticleBackgroundProps {
  particleColor?: string
  interactive?: boolean
  speed?: SpeedSetting
  density?: DensitySetting
  active?: boolean
  onFadeOutComplete?: () => void
}

interface Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  draw: (ctx: CanvasRenderingContext2D) => void
  update: (width: number, height: number) => void
  isAnchor?: boolean
}

interface Connection {
  a: ParticleImpl
  b: ParticleImpl
  dist: number
}

interface Spark {
  start: ParticleImpl
  end: ParticleImpl
  progress: number
  speed: number
  dist: number
}

interface Ripple {
  x: number
  y: number
  age: number
  duration: number
  maxRadius: number
  alpha: number
}

function cubicBezierEase(t: number, p1 = 0.01, p2 = 0.3): number {
  const u = 1 - t
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t
}

function easeOutCubic(t: number): number {
  const inv = 1 - t
  return 1 - inv * inv * inv
}

function mapSpeedToVelocity(speed: SpeedSetting | undefined): number {
  switch (speed) {
    case "fast":
      return 0.18
    case "slow":
      return 0.17
    case "none":
      return 0
    case "medium":
    default:
      return 0.1
  }
}

function mapDensityToValue(density: DensitySetting | undefined): number {
  if (typeof density === "number") return density
  switch (density) {
    case "high":
      return 8400
    case "low":
      return 10000
    case "medium":
    default:
      return 20000
  }
}

class ParticleImpl implements Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  color: string
  isAnchor?: boolean
  glowIntensity = 0
  targetGlowIntensity = 0
  lastUpdateTime = Date.now()

  constructor(width: number, height: number, baseVelocity: number, color: string, isAnchor = false) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.velocityX = (Math.random() - 0.5) * baseVelocity
    this.velocityY = (Math.random() - 0.5) * baseVelocity
    this.color = color
    this.isAnchor = isAnchor
  }

  updateGlow(mouseX: number, mouseY: number, maxDistance = 120): void {
    const distance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2)
    this.targetGlowIntensity = distance <= maxDistance ? Math.max(0, 1 - distance / maxDistance) : 0

    const now = Date.now()
    const deltaTime = (now - this.lastUpdateTime) / 1000
    this.lastUpdateTime = now

    const transitionSpeed = 1 / 0.3
    const diff = this.targetGlowIntensity - this.glowIntensity
    this.glowIntensity += diff * Math.min(1, transitionSpeed * deltaTime)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()

    if (this.glowIntensity > 0.01) {
      const glowRadius = 1.5 + this.glowIntensity * 8
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius)

      const hue = 210 + (this.x / window.innerWidth) * 150
      const glowColor = `hsl(${hue}, 100%, 70%)`
      const glowColorInner = `hsl(${hue}, 100%, 85%)`

      gradient.addColorStop(0, glowColorInner)
      gradient.addColorStop(0.4, glowColor)
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.globalAlpha = this.glowIntensity * 0.8
      ctx.arc(this.x, this.y, glowRadius, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = glowColorInner
      ctx.globalAlpha = this.glowIntensity * 0.9
      ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI)
      ctx.fill()
    } else {
      ctx.fillStyle = this.color
      ctx.globalAlpha = 0.7
      ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  update(width: number, height: number): void {
    if (this.isAnchor) return
    if (this.x > width + 20 || this.x < -20) this.velocityX = -this.velocityX
    if (this.y > height + 20 || this.y < -20) this.velocityY = -this.velocityY
    this.x += this.velocityX
    this.y += this.velocityY
  }
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleColor = "#7cd6ff",
  interactive = true,
  speed = "medium",
  density = "high",
  active = true,
  onFadeOutComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<ParticleImpl[]>([])
  const anchorRef = useRef<ParticleImpl | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const isRenderingRef = useRef<boolean>(true)
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 })
  const connectionsRef = useRef<Connection[]>([])
  const sparksRef = useRef<Spark[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const lastFrameTimeRef = useRef<number | null>(null)

  const MIN_SPARKS = 1
  const MAX_SPARKS = 4

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const baseVelocity = mapSpeedToVelocity(speed)
    const densityValue = mapDensityToValue(density)
    const dpi = window.devicePixelRatio || 1

    const sizeCanvas = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = Math.floor(innerWidth * dpi)
      canvas.height = Math.floor(innerHeight * dpi)
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0)
    }

    const seedParticles = () => {
      particlesRef.current = []
      connectionsRef.current = []
      sparksRef.current = []
      lastFrameTimeRef.current = null
      const count = Math.floor((canvas.width / dpi) * (canvas.height / dpi) / densityValue)
      for (let i = 0; i < count; i += 1) {
        particlesRef.current.push(new ParticleImpl(canvas.width / dpi, canvas.height / dpi, baseVelocity, particleColor))
      }
      if (interactive) {
        anchorRef.current = new ParticleImpl(canvas.width / dpi, canvas.height / dpi, 0, particleColor, true)
        particlesRef.current.push(anchorRef.current)
      }
    }

    const spawnSpark = (connections: Connection[]) => {
      if (!connections.length) return
      const connection = connections[Math.floor(Math.random() * connections.length)]
      const reversed = Math.random() > 0.5
      const start = reversed ? connection.b : connection.a
      const end = reversed ? connection.a : connection.b
      const speedMultiplier = 0.54 + Math.random() * 0.3

      sparksRef.current.push({
        start,
        end,
        progress: 0,
        speed: speedMultiplier,
        dist: connection.dist,
      })
    }

    const updateAndDrawSparks = (ctx2: CanvasRenderingContext2D, connections: Connection[], deltaSeconds: number) => {
      if (!connections.length) {
        sparksRef.current = []
        return
      }

      const sparks = sparksRef.current
      while (sparks.length < MIN_SPARKS) {
        spawnSpark(connections)
      }
      if (sparks.length < MAX_SPARKS && Math.random() < 0.025) {
        spawnSpark(connections)
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i]
        spark.progress += spark.speed * Math.min(deltaSeconds, 0.05)

        if (spark.progress >= 1) {
          const rippleMax = 2.4 + Math.min(2, spark.dist * 100)
          ripplesRef.current.push({
            x: spark.end.x,
            y: spark.end.y,
            age: 0,
            duration: 0.45,
            maxRadius: rippleMax,
            alpha: 0.9,
          })

          sparks.splice(i, 1)
          continue
        }

        const eased = cubicBezierEase(Math.min(1, spark.progress))
        const x = spark.start.x + (spark.end.x - spark.start.x) * eased
        const y = spark.start.y + (spark.end.y - spark.start.y) * eased

        const distanceFactor = Math.min(1.3, Math.max(0.2, spark.dist / 130))
        const coreRadius = 0.24 + distanceFactor * 1
        const glowRadius = 6 + distanceFactor * 10
        const alpha = 0.55 + distanceFactor * 0.45

        ctx2.save()
        ctx2.globalCompositeOperation = "lighter"
        const gradient = ctx2.createRadialGradient(x, y, 0, x, y, glowRadius)
        gradient.addColorStop(0, `rgba(255,255,255,${Math.min(1, alpha + 0.05)})`)
        gradient.addColorStop(0.4, `rgba(255,255,255,${alpha})`)
        gradient.addColorStop(1, "rgba(255,255,255,0)")
        ctx2.fillStyle = gradient
        ctx2.shadowColor = `rgba(255,255,255,${0.6 + distanceFactor * 0.25})`
        ctx2.shadowBlur = 6 + distanceFactor * 6
        ctx2.beginPath()
        ctx2.arc(x, y, coreRadius, 0, Math.PI * 2)
        ctx2.fill()
        ctx2.restore()
      }
    }

    const drawRipples = (ctx2: CanvasRenderingContext2D, deltaSeconds: number) => {
      const ripples = ripplesRef.current
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i]
        ripple.age += deltaSeconds
        const t = ripple.age / ripple.duration
        if (t >= 1) {
          ripples.splice(i, 1)
          continue
        }
        const eased = easeOutCubic(t)
        const radius = ripple.maxRadius * eased
        const alpha = ripple.alpha * (1 - t)

        ctx2.save()
        ctx2.beginPath()
        ctx2.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx2.lineWidth = 1 + (1 - t) * 1.2
        ctx2.shadowColor = `rgba(255,255,255,${alpha * 0.7})`
        ctx2.shadowBlur = 6
        ctx2.globalCompositeOperation = "lighter"
        ctx2.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2)
        ctx2.stroke()
        ctx2.restore()
      }
    }

    const drawConnections = (ctx2: CanvasRenderingContext2D, connections: Connection[]) => {
      const particles = particlesRef.current
      const mousePos = mousePositionRef.current
      connections.length = 0

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        a.update(canvas.width / dpi, canvas.height / dpi)

        if (interactive) {
          a.updateGlow(mousePos.x, mousePos.y)
        }

        a.draw(ctx2)

        for (let j = particles.length - 1; j > i; j -= 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist <= 130) {
            connections.push({ a, b, dist })
            ctx2.save()
            ctx2.beginPath()

            const baseHue = 210 + ((a.x + b.x) / 2 / window.innerWidth) * 120
            const connectionGlow = Math.max(a.glowIntensity, b.glowIntensity)
            if (connectionGlow > 0.01) {
              ctx2.strokeStyle = `hsl(${baseHue}, 90%, 68%)`
              ctx2.globalAlpha = ((130 - dist) / 130) * (0.35 + connectionGlow * 0.65)
              ctx2.lineWidth = 0.55 + connectionGlow * 1
              ctx2.shadowColor = `hsla(${baseHue}, 100%, 75%, 0.6)`
              ctx2.shadowBlur = 8
            } else {
              ctx2.strokeStyle = `hsl(${baseHue}, 70%, 55%)`
              ctx2.globalAlpha = ((130 - dist) / 130) * 0.8
              ctx2.lineWidth = 0.55
              ctx2.shadowColor = "rgba(120, 180, 255, 0.25)"
              ctx2.shadowBlur = 5
            }

            ctx2.moveTo(a.x, a.y)
            ctx2.lineTo(b.x, b.y)
            ctx2.stroke()
            ctx2.restore()
          }
        }
      }
    }

    isRenderingRef.current = true

    const render = () => {
      const now = performance.now()
      const deltaSeconds = lastFrameTimeRef.current ? (now - lastFrameTimeRef.current) / 1000 : 0
      lastFrameTimeRef.current = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1

      drawConnections(ctx, connectionsRef.current)
      updateAndDrawSparks(ctx, connectionsRef.current, deltaSeconds)
      drawRipples(ctx, deltaSeconds)

      if (isRenderingRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(render)
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = ev.clientX - rect.left
      const mouseY = ev.clientY - rect.top

      mousePositionRef.current = { x: mouseX, y: mouseY }

      if (!interactive || !anchorRef.current) return
      anchorRef.current.x = mouseX
      anchorRef.current.y = mouseY
    }

    const handleMouseUp = () => {
      if (!interactive || !anchorRef.current) return
      const p = new ParticleImpl(canvas.width / dpi, canvas.height / dpi, baseVelocity, particleColor, false)
      p.x = anchorRef.current.x
      p.y = anchorRef.current.y
      p.velocityX = (Math.random() - 0.5) * baseVelocity
      p.velocityY = (Math.random() - 0.5) * baseVelocity
      particlesRef.current.push(p)
    }

    const handleMouseLeave = () => {
      mousePositionRef.current = { x: -1000, y: -1000 }
    }

    const handleResize = () => {
      sizeCanvas()
      seedParticles()
    }

    sizeCanvas()
    seedParticles()
    render()

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseup", handleMouseUp, { passive: true })
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove as EventListener)
      window.removeEventListener("mouseup", handleMouseUp as EventListener)
      window.removeEventListener("resize", handleResize as EventListener)
      canvas.removeEventListener("mouseleave", handleMouseLeave as EventListener)
    }
  }, [density, interactive, particleColor, speed])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (active) {
      root.classList.remove("fade-out")
      isRenderingRef.current = true
      return
    }

    const handleEnd = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      isRenderingRef.current = false
      onFadeOutComplete && onFadeOutComplete()
      root.removeEventListener("transitionend", handleEnd)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    root.offsetHeight
    root.addEventListener("transitionend", handleEnd)
    root.classList.add("fade-out")

    const fallback = window.setTimeout(() => {
      handleEnd()
    }, 800)

    return () => {
      window.clearTimeout(fallback)
      root.removeEventListener("transitionend", handleEnd)
    }
  }, [active, onFadeOutComplete])

  return (
    <div className="particle-background" ref={rootRef}>
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  )
}

export default ParticleBackground
