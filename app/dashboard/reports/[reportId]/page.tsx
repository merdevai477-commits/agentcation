import { ReportDetailPage } from '@/components/dave/pages/reports-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Report' }

export default async function Page({ params }: { params: Promise<{ reportId: string }> }) {
  await requireProductPath('dave_doctor')
  const { reportId } = await params
  return <ReportDetailPage reportId={reportId} />
}
