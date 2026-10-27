import { TaskDetailPage } from '@/components/dave/pages/tasks-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Task' }

export default async function Page({ params }: { params: Promise<{ taskId: string }> }) {
  await requireProductPath('dave_doctor')
  const { taskId } = await params
  return <TaskDetailPage taskId={taskId} />
}
