import { requireBusinessPath } from '@/lib/bizniz/guard'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireBusinessPath()
  return children
}
