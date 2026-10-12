import { getTasks } from '@/app/actions';
import { DashboardContent } from '@/components/DashboardContent';

export default async function Dashboard() {
  const allTasks = await getTasks();
  return <DashboardContent allTasks={allTasks} />;
}
