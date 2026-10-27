import { IncidentDetailPage } from '@/components/dave/pages/incidents-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Incident' }

export default async function Page({ params }: { params: Promise<{ incidentId: string }> }) {
  await requireProductPath('dave_doctor')
  const { incidentId } = await params
  return <IncidentDetailPage incidentId={incidentId} />
}
