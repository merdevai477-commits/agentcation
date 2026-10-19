'use client'

import { useEffect, useState } from 'react'
import { useOptionalI18n } from '@/components/i18n'
import { copy } from '@/lib/copy'

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

type Props = {
  compact?: boolean
  className?: string
}

export function BrandLogo({ compact = false, className = '' }: Props) {
  const i18n = useOptionalI18n()
  const brand = i18n?.t.brand ?? copy.en.brand
  const [src, setSrc] = useState('/logo.png')

  useEffect(() => {
    let alive = true
    knockOutBlack('/logo.png').then((url) => {
      if (alive) setSrc(url)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <a href="/" className={`logo-lockup brand-logo ${compact ? 'brand-logo--compact' : ''} ${className}`.trim()}>
      <img src={src} alt="" className="brand-logo__mark" width={40} height={40} />
      {!compact && <span className="brand-logo__word">{brand}</span>}
      <span className="sr-only">{brand}</span>
    </a>
  )
}
