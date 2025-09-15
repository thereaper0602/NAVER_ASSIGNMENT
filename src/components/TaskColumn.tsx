import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column } from '../types/kanban';
import TaskCard from './TaskCard';
import { useKanban } from '../contexts/KanbanContext';

interface TaskColumnProps {
  column: Column;
}

const TaskColumn = React.memo(({ column }: TaskColumnProps) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const { addTask, updateColumn, deleteColumn } = useKanban();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskContent.trim()) {
      await addTask(newTaskContent, column.id);
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  const handleUpdateTitle = () => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      updateColumn(column.id, columnTitle);
    }
    setIsEditing(false);
  };

  // Generate dynamic column styling based on column title
  const getColumnConfig = (title: string) => {
    // Generate consistent colors based on title hash
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colors = [
      { icon: '📋', color: 'from-blue-600 to-blue-700', borderColor: 'border-blue-500/30', textColor: 'text-blue-300' },
      { icon: '⚡', color: 'from-purple-600 to-purple-700', borderColor: 'border-purple-500/30', textColor: 'text-purple-300' },
      { icon: '🎯', color: 'from-green-600 to-green-700', borderColor: 'border-green-500/30', textColor: 'text-green-300' },
      { icon: '🔥', color: 'from-red-600 to-red-700', borderColor: 'border-red-500/30', textColor: 'text-red-300' },
      { icon: '⭐', color: 'from-yellow-600 to-yellow-700', borderColor: 'border-yellow-500/30', textColor: 'text-yellow-300' },
      { icon: '💎', color: 'from-cyan-600 to-cyan-700', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-300' },
      { icon: '�', color: 'from-indigo-600 to-indigo-700', borderColor: 'border-indigo-500/30', textColor: 'text-indigo-300' },
      { icon: '✨', color: 'from-pink-600 to-pink-700', borderColor: 'border-pink-500/30', textColor: 'text-pink-300' }
    ];

    const colorIndex = Math.abs(hash) % colors.length;
    return {
      ...colors[colorIndex],
      description: title
    };
  };

  const config = getColumnConfig(column.title);

  const handleDeleteColumn = () => {
    if (confirm('Are you sure you want to delete this column? All tasks will be permanently deleted.')) {
      deleteColumn(column.id);
    }
  };

  return (
    <div className="flex-shrink-0 w-80 h-fit min-h-[600px]">
      <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-200 h-full flex flex-col ${isOver
          ? 'border-blue-400/70 shadow-lg shadow-blue-500/20 bg-slate-700/60'
          : 'border-slate-600/50'
        }`}>
        {/* Column Header */}
        <div className={`bg-gradient-to-r ${config.color} p-4 border-b ${config.borderColor}`}>
          <div className="flex items-center justify-between mb-2">
            {isEditing ? (
              <div className="flex-1 mr-2">
                <input
                  type="text"
                  value={columnTitle}
                  onChange={(e) => setColumnTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                  className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-xl">{config.icon}</span>
                <div>
                  <h3
                    className={`font-semibold text-lg ${config.textColor} cursor-pointer hover:text-white transition-colors`}
                    onClick={() => {
                      if (column.title !== 'Todo' && column.title !== 'In progress' && column.title !== 'Complete') {
                        setIsEditing(true)
                      }
                    }}
                  >
                    {column.title}
                  </h3>
                  <p className="text-xs text-white/60">{config.description}</p>
                </div>
              </div>
            )}

            {/* Column Actions */}
            <div className="flex items-center space-x-1">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                {column.tasks.length}
              </span>
              {column.title !== 'Todo' && column.title !== 'In progress' && column.title !== 'Complete' && (
                <button
                  onClick={handleDeleteColumn}
                  className="p-1 text-white/60 hover:text-red-300 transition-colors"
                  title="Delete column"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column Content */}
        <div
          ref={setNodeRef}
          className="p-4 flex-1 min-h-[500px]"
        >
          {/* Tasks Container */}
          <div className="space-y-3 min-h-full">
            <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 min-h-[400px]">
                {column.tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}

                {/* Drop zone ở cuối cột - QUAN TRỌNG */}
                <div
                  className="h-8 w-full border-2 border-dashed border-transparent rounded-lg transition-colors"
                  data-column-id={column.id}
                  style={{ minHeight: '32px' }}
                />
              </div>
            </SortableContext>

            {/* Drop Zone Indicator */}
            <div className="flex-1 min-h-[200px] flex items-center justify-center">
              {isOver && (
                <div className="w-full border-2 border-dashed border-blue-400/60 bg-blue-500/10 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-blue-300">
                    <div className="text-2xl mb-2">⬇️</div>
                    <p className="text-sm font-medium">Drop task here</p>
                  </div>
                </div>
              )}

              {column.tasks.length === 0 && !isAddingTask && !isOver && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl opacity-50">{config.icon}</span>
                  </div>
                  <p className="text-sm text-center">No tasks yet</p>
                  <p className="text-xs text-center text-slate-500 mt-1">Drop tasks here or add a new one</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Task Section */}
          <div className="mt-4">
            {isAddingTask ? (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                <form onSubmit={handleAddTask} className="space-y-3">
                  <textarea
                    placeholder="Enter task description..."
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskContent('');
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center space-x-2 text-slate-400 group-hover:text-slate-300">
                  <div className="w-6 h-6 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                    <span className="text-sm">+</span>
                  </div>
                  <span className="text-sm font-medium">Add Task</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
TaskColumn.displayName = 'TaskColumn';
export default TaskColumn;