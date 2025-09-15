export interface Task{
    id: string,
    content: string,
    columnId: string,
    createdAt: number
}

export interface Column{
    id: string,
    title: string,
    tasks: Task[]
}

export interface KanbanBoard{
    columns: Column[]
}