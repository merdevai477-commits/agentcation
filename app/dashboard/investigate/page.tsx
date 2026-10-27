import { DaveInvestigatePage } from '@/components/dave/investigate-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Investigate' }

export default async function InvestigateRoute() {
  await requireProductPath('dave_doctor')
  return <DaveInvestigatePage />
}
