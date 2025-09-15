import type { Column } from "../types/kanban";

const TaskDistributionChart = ({columns} : {columns: Column[]}) => {
    const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">📊Task Distribution</h3>
            <div className="space-y-4">
                {columns.map((col, index) => {
                    const percentage = totalTasks === 0 ? 0 : (col.tasks.length / totalTasks) * 100;
                    const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-green-500','bg-purple-500'];

                    return (
                        <div key={col.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">{col.title}</span>
                                <span className="text-sm text-slate-400">{col.tasks.length} tasks ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
export default TaskDistributionChart;