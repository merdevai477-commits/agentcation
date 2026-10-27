import { DaveIncidentsPage } from '@/components/dave/incidents-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Incidents' }

export default async function IncidentsRoute() {
  await requireProductPath('dave_doctor')
  return <DaveIncidentsPage />
}
