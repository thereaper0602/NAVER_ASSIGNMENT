import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/kanban';
import { useKanban } from '../contexts/KanbanContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(task.content);
  const { updateTask, deleteTask } = useKanban();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskContent.trim() && taskContent !== task.content) {
      updateTask(task.id, { content: taskContent });
    }
    setIsEditing(false);
  };

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  // Generate priority based on content length for demo

  // Generate avatar emoji based on task ID
  const avatarEmojis = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🔬', '👩‍🔬'];
  const avatar = avatarEmojis[task.id.charCodeAt(0) % avatarEmojis.length];

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-4 opacity-40"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 mb-3 cursor-grab hover:bg-slate-700/80 transition-all duration-200 hover:border-slate-500/70 hover:shadow-lg hover:shadow-slate-900/20"
    >
      {isEditing ? (
        <form onSubmit={handleUpdateTask} className="space-y-3">
          <textarea
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setTaskContent(task.content);
              }}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Task Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-xs">
                {avatar}
              </div>
              {/* <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                {priority}
              </span> */}
            </div>
            
            {/* Action buttons - visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                title="Edit task"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask();
                }}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete task"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Task Content */}
          <p className="text-slate-200 text-sm leading-relaxed mb-3">
            {task.content}
          </p>

          {/* Task Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;