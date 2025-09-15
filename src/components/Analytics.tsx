import { useKanban } from "../contexts/KanbanContext"
import { calculateAnalytics } from "../utils/Analytics";
import MetricCard from "./MetricCard";
import TaskDistributionChart from "./TaskDistributionChart";

const Analytics = () => {
    const { columns } = useKanban();
    const analytics = calculateAnalytics(columns);

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">📊 Task Analytics</h1>
                <p className="text-slate-400 my-8">Analyze your tasks and improve your workflow</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Tasks" value={analytics.totalTasks} icon="🗂️" color="blue" />
                <MetricCard title="Completed Tasks" value={analytics.completeTasks} icon="✅" color="green" />
                <MetricCard title="In Progress Tasks" value={analytics.inProgressTasks} icon="🔄" color="yellow" />
                <MetricCard title="To Do Tasks" value={analytics.toDoTasks} icon="📝" color="red" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TaskDistributionChart columns={columns} />
            </div>
        </div>
    );
}

export default Analytics;