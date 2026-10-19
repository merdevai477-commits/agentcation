'use client'

import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; z: number; r: number; tw: number }
type Comet = { x: number; y: number; vx: number; vy: number; life: number; max: number }

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let stars: Star[] = []
    let comets: Comet[] = []
    let t = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(220, Math.floor((w * h) / 9000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.35 + Math.random() * 0.65,
        r: 0.4 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    function spawnComet() {
      const fromTop = Math.random() > 0.35
      comets.push({
        x: fromTop ? Math.random() * w * 0.85 : -40,
        y: fromTop ? -20 : Math.random() * h * 0.45,
        vx: 5.5 + Math.random() * 4.5,
        vy: 2.8 + Math.random() * 2.2,
        life: 0,
        max: 55 + Math.random() * 40,
      })
    }

    function frame() {
      t += 0.016
      ctx!.fillStyle = '#000000'
      ctx!.fillRect(0, 0, w, h)

      // soft cyan nebula
      const g = ctx!.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, w * 0.55)
      g.addColorStop(0, 'rgba(34,211,238,0.06)')
      g.addColorStop(0.45, 'rgba(14,165,233,0.03)')
      g.addColorStop(1, 'transparent')
      ctx!.fillStyle = g
      ctx!.fillRect(0, 0, w, h)

      for (const s of stars) {
        const pulse = 0.55 + 0.45 * Math.sin(t * (1.2 + s.z) + s.tw)
        const alpha = (0.25 + s.z * 0.75) * pulse
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(186,230,253,${alpha})`
        ctx!.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
        ctx!.fill()
      }

      if (!reduce) {
        if (comets.length < 2 && Math.random() < 0.008) spawnComet()
        comets = comets.filter((c) => {
          c.life += 1
          c.x += c.vx
          c.y += c.vy
          const fade = 1 - c.life / c.max
          if (fade <= 0 || c.x > w + 80 || c.y > h + 80) return false
          const len = 90 + c.vx * 8
          const grad = ctx!.createLinearGradient(c.x, c.y, c.x - c.vx * 12, c.y - c.vy * 12)
          grad.addColorStop(0, `rgba(125,211,252,${0.9 * fade})`)
          grad.addColorStop(0.35, `rgba(34,211,238,${0.45 * fade})`)
          grad.addColorStop(1, 'transparent')
          ctx!.strokeStyle = grad
          ctx!.lineWidth = 1.6
          ctx!.beginPath()
          ctx!.moveTo(c.x, c.y)
          ctx!.lineTo(c.x - (c.vx / 6) * len, c.y - (c.vy / 6) * len)
          ctx!.stroke()
          ctx!.beginPath()
          ctx!.fillStyle = `rgba(224,242,254,${0.95 * fade})`
          ctx!.arc(c.x, c.y, 1.8, 0, Math.PI * 2)
          ctx!.fill()
          return true
        })
      }

      raf = window.requestAnimationFrame(frame)
    }

    function paintStatic() {
      ctx!.fillStyle = '#000000'
      ctx!.fillRect(0, 0, w, h)
      for (const s of stars) {
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(186,230,253,${0.35 + s.z * 0.5})`
        ctx!.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduce) {
      paintStatic()
    } else {
      raf = window.requestAnimationFrame(frame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden />
}
