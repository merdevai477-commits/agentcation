import { TasksPage } from '@/components/dave/pages/tasks-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Tasks' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <TasksPage />
}
