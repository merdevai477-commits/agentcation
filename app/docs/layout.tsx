import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Documentation — Agentication',
    template: '%s — Agentication Docs',
  },
  description:
    'Learn how Agentication helps developers and businesses use specialized AI agents. Get. Integrate. Grow.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
