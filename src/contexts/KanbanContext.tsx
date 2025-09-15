import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Column, Task } from '../types/kanban';
import * as kanbanService from '../services/kanbanService';

interface KanbanContextType {
  columns: Column[];
  loading: boolean;
  error: string | null;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (columnId: string, title: string) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  addTask: (content: string, columnId: string) => Promise<void>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newColumnId: string) => Promise<void>;
  reorderTasks: (columnId: string, sourceIndex: number, destinationIndex: number) => Promise<void>;
  moveTaskBetweenColumns: (taskId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};

interface KanbanProviderProps {
  children: ReactNode;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setLoading(true);
        const fetchedColumns = await kanbanService.getColumns();
        setColumns(fetchedColumns);
        setError(null);
      } catch (err) {
        setError('Failed to fetch kanban data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const addColumn = async (title: string) => {
    try {
      const newColumnId = await kanbanService.addColumn(title);
      setColumns([...columns, { id: newColumnId, title, tasks: [] }]);
    } catch (err) {
      setError('Failed to add column');
      console.error(err);
    }
  };

  const updateColumn = async (columnId: string, title: string) => {
    try {
      await kanbanService.updateColumn(columnId, title);
      setColumns(columns.map(col => 
        col.id === columnId ? { ...col, title } : col
      ));
    } catch (err) {
      setError('Failed to update column');
      console.error(err);
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await kanbanService.deleteColumn(columnId);
      setColumns(columns.filter(col => col.id !== columnId));
    } catch (err) {
      setError('Failed to delete column');
      console.error(err);
    }
  };

  const addTask = async (content: string, columnId: string) => {
    try {
      const newTaskId = await kanbanService.addTask(content, columnId);
      const newTask: Task = {
        id: newTaskId,
        content,
        columnId,
        createdAt: Date.now()
      };

      setColumns(columns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...col.tasks, newTask] } 
          : col
      ));
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      await kanbanService.updateTask(taskId, data);
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.map(task => 
          task.id === taskId ? { ...task, ...data } : task
        )
      })));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await kanbanService.deleteTask(taskId);
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId)
      })));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const moveTask = async (taskId: string, newColumnId: string) => {
    try {
      await kanbanService.moveTask(taskId, newColumnId);
      
      // Find the task and its current column
      let taskToMove: Task | null = null;
      let sourceColumnId: string | null = null;
      
      columns.forEach(col => {
        const task = col.tasks.find(t => t.id === taskId);
        if (task) {
          taskToMove = task;
          sourceColumnId = col.id;
        }
      });
      
      if (!taskToMove || !sourceColumnId) return;
      
      // Update the state
      setColumns(columns.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
          };
        }
        if (col.id === newColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, { ...taskToMove!, columnId: newColumnId }]
          };
        }
        return col;
      }));
    } catch (err) {
      setError('Failed to move task');
      console.error(err);
    }
  };

  const reorderTasks = async (columnId: string, sourceIndex: number, destinationIndex: number) => {
    try {
      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      const newTasks = [...column.tasks];
      const [removed] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, removed);

      setColumns(columns.map(col => 
        col.id === columnId ? { ...col, tasks: newTasks } : col
      ));

      // Note: In a real app, you might want to update the order in the database
      // This is a simplified version that only updates the local state
    } catch (err) {
      setError('Failed to reorder tasks');
      console.error(err);
    }
  };

  const moveTaskBetweenColumns = async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) => {
    try {
      // Update in the database
      await kanbanService.moveTask(taskId, destinationColumnId);

      // Find the task
      const sourceColumn = columns.find(col => col.id === sourceColumnId);
      if (!sourceColumn) return;

      const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
      if (!taskToMove) return;

      // Create new state
      const newColumns = columns.map(col => {
        // Remove from source column
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          };
        }
        
        // Add to destination column at the right position
        if (col.id === destinationColumnId) {
          const newTasks = [...col.tasks];
          newTasks.splice(destinationIndex, 0, {
            ...taskToMove,
            columnId: destinationColumnId
          });
          return {
            ...col,
            tasks: newTasks
          };
        }
        
        return col;
      });

      setColumns(newColumns);
    } catch (err) {
      setError('Failed to move task between columns');
      console.error(err);
    }
  };

  const value = {
    columns,
    loading,
    error,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    moveTaskBetweenColumns
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};