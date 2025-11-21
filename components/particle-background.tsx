"use client"

import type React from "react"
import { useEffect, useRef } from "react"
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

function mapSpeedToVelocity(speed: SpeedSetting | undefined): number {
  switch (speed) {
    case "fast":
      return 1
    case "slow":
      return 0.33
    case "none":
      return 0
    case "medium":
    default:
      return 0.66
  }
}

function mapDensityToValue(density: DensitySetting | undefined): number {
  if (typeof density === "number") return density
  switch (density) {
    case "high":
      return 5000
    case "low":
      return 20000
    case "medium":
    default:
      return 10000
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
  lastUpdateTime: number = Date.now()

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

      const hue = 270 + (this.x / window.innerWidth) * 40
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
  particleColor = "#6d00d4",
  interactive = true,
  speed = "medium",
  density = "medium",
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
      const count = Math.floor(((canvas.width / dpi) * (canvas.height / dpi)) / densityValue)
      for (let i = 0; i < count; i += 1) {
        particlesRef.current.push(
          new ParticleImpl(canvas.width / dpi, canvas.height / dpi, baseVelocity, particleColor),
        )
      }
      if (interactive) {
        anchorRef.current = new ParticleImpl(canvas.width / dpi, canvas.height / dpi, 0, particleColor, true)
        particlesRef.current.push(anchorRef.current)
      }
    }

    const drawConnections = (ctx2: CanvasRenderingContext2D) => {
      const particles = particlesRef.current
      const mousePos = mousePositionRef.current

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
          if (dist <= 120) {
            ctx2.beginPath()

            const connectionGlow = Math.max(a.glowIntensity, b.glowIntensity)
            if (connectionGlow > 0.01) {
              const hue = 270 + ((a.x + b.x) / 2 / window.innerWidth) * 40
              ctx2.strokeStyle = `hsl(${hue}, 100%, 70%)`
              ctx2.globalAlpha = ((120 - dist) / 120) * (0.3 + connectionGlow * 0.7)
              ctx2.lineWidth = 0.7 + connectionGlow * 1.5
            } else {
              ctx2.strokeStyle = particleColor
              ctx2.globalAlpha = (120 - dist) / 120
              ctx2.lineWidth = 0.7
            }

            ctx2.moveTo(a.x, a.y)
            ctx2.lineTo(b.x, b.y)
            ctx2.stroke()
          }
        }
      }
    }

    isRenderingRef.current = true

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
      drawConnections(ctx)
      if (baseVelocity !== 0 && isRenderingRef.current) {
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
