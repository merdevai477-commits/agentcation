const SRC = {
  github: '/brands/github.svg',
  railway: '/brands/railway.svg',
  slack: '/brands/slack.svg',
  linear: '/brands/linear.svg',
  sentry: '/brands/sentry.svg',
  datadog: '/brands/datadog.svg',
  whatsapp: '/brands/whatsapp.svg',
  instagram: '/brands/instagram.svg',
  telegram: '/brands/telegram.svg',
  messenger: '/brands/messenger.svg',
} as const

export type PlatformLogoName = keyof typeof SRC

export function PlatformLogo({
  name,
  size = 18,
  title,
}: {
  name: PlatformLogoName
  size?: number
  title?: string
}) {
  return (
    <img
      className="platform-logo"
      src={SRC[name]}
      alt={title || name}
      width={size}
      height={size}
      draggable={false}
    />
  )
}
