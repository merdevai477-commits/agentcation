'use client'

import { useEffect, useRef } from 'react'

function knockOutBlack(src: string) {
  return new Promise<string>((resolve) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(src)
        return
      }
      ctx.drawImage(image, 0, 0)
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const px = frame.data
      for (let i = 0; i < px.length; i += 4) {
        const max = Math.max(px[i], px[i + 1], px[i + 2])
        const min = Math.min(px[i], px[i + 1], px[i + 2])
        if (max < 26) px[i + 3] = 0
        else if (max < 78 && max - min < 22) px[i + 3] = Math.round(((max - 26) / 52) * 255)
      }
      ctx.putImageData(frame, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = () => resolve(src)
    image.src = src
  })
}

export function HeroMark() {
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let alive = true
    knockOutBlack('/logo.png').then((url) => {
      if (alive && logoRef.current) logoRef.current.src = url
    })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return () => { alive = false }

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      stage.style.setProperty('--rx', `${(-y * 18).toFixed(2)}deg`)
      stage.style.setProperty('--ry', `${(x * 22).toFixed(2)}deg`)
      stage.style.setProperty('--px', `${(x * 18).toFixed(1)}px`)
      stage.style.setProperty('--py', `${(y * 14).toFixed(1)}px`)
    }
    const onLeave = () => {
      stage.style.setProperty('--rx', '8deg')
      stage.style.setProperty('--ry', '-12deg')
      stage.style.setProperty('--px', '0px')
      stage.style.setProperty('--py', '0px')
    }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      alive = false
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-stage" aria-hidden>
      <div className="hero-stage__glow" />
      <div className="hero-stage__rig">
        <span className="hero-ring hero-ring--a" />
        <span className="hero-ring hero-ring--b" />
        <span className="hero-ring hero-ring--c" />
        <img ref={logoRef} src="/logo.png" alt="" className="hero-mark" />
      </div>
      <div className="hero-stage__floor" />
    </div>
  )
}
