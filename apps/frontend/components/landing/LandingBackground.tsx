'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update & Draw particles
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)' // brand-500
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / 120)})`
            ctx.lineWidth = 1
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-bg-base pointer-events-none">
      {/* Deep radial gradients for ambient light */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-brand-600/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[100px]"
      />
      
      {/* Grid overlay for structure */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      {/* Canvas for neural network particle effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Vignette to focus center */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-bg-base opacity-80" />
    </div>
  )
}
