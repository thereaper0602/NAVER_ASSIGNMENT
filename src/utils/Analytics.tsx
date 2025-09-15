import type { Column,Task } from "../types/kanban";

export const calculateAnalytics = (columns: Column[]) => {
    const allTasks: Task[] = columns.flatMap(col => col.tasks);
    const totalTasks = allTasks.length;

    const completedColumn = columns.find(col => 
        col.title.toLowerCase().includes('complete') || 
        col.title.toLowerCase().includes('done')
    );
    const completeTasks = completedColumn ? completedColumn.tasks.length : 0;

    const inProgressColumn = columns.find(col => 
        col.title.toLowerCase().includes('in progress') ||
        col.title.toLowerCase().includes('doing')
    );
    const inProgressTasks = inProgressColumn ? inProgressColumn.tasks.length : 0;

    const toDoColumn = columns.find(col => 
        col.title.toLowerCase().includes('todo') ||
        col.title.toLowerCase().includes('doing')
    );
    const toDoTasks = toDoColumn ? toDoColumn.tasks.length : 0;

    const columnStats = columns.map(col => ({
        name: col.title,
        count: col.tasks.length,
        percentage: totalTasks === 0 ? 0 : (col.tasks.length / totalTasks) * 100
    }));
    const completitionRate = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;

    return {
        totalTasks,
        completeTasks,
        inProgressTasks,
        toDoTasks,
        columnStats,
        completitionRate
    };
}