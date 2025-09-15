import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragOverEvent, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanban } from '../contexts/KanbanContext';
import type { Task } from '../types/kanban';
import TaskColumn from './TaskColumn.tsx';
import TaskCard from './TaskCard.tsx';
import SearchBar from './SearchBar.tsx';
import useSearch from '../hooks/useSearch.tsx';

const KanbanBoard: React.FC = () => {
    const { columns, addColumn, reorderTasks, moveTaskBetweenColumns, loading, error } = useKanban();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const { searchTerm, setSearchTerm, filteredColumns } = useSearch(columns); 

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        const task = columns
            .flatMap(column => column.tasks)
            .find(task => task.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId !== overId) {
            const activeTask = columns.flatMap(col => col.tasks).find(task => task.id === activeId);
            const overColumn = columns.find(col => col.id === overId);
            const activeColumn = columns.find(col => col.tasks.some(task => task.id === activeId));

            if (activeTask && overColumn && activeColumn && activeColumn.id !== overColumn.id) {
                moveTaskBetweenColumns(activeTask.id, activeColumn.id, overColumn.id, 0);
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeColumn = columns.find(col => col.tasks.some(task => task.id === activeId));
        const overTask = columns.flatMap(col => col.tasks).find(task => task.id === overId);
        const overColumn = overTask ? columns.find(col => col.tasks.some(task => task.id === overId)) : null;

        if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
            const activeIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
            const overIndex = activeColumn.tasks.findIndex(task => task.id === overId);
            if (activeIndex !== overIndex) {
                reorderTasks(activeColumn.id, activeIndex, overIndex);
            }
        }
    };

    const handleAddColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newColumnTitle.trim()) {
            await addColumn(newColumnTitle);
            setNewColumnTitle('');
            setIsAddingColumn(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading your board...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
                    <div className="text-red-400 text-2xl mb-2">⚠️</div>
                    <h3 className="text-red-300 font-medium mb-2">Error Loading Board</h3>
                    <p className="text-red-400/80 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
    const completedTasks = columns.find(col => col.title.toLowerCase() === 'complete')?.tasks.length || 0;

    // Empty state when no columns exist
    if (columns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px]">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Welcome to Your Kanban Board
                    </h3>
                    <p className="text-slate-400 mb-6">
                        Start organizing your work by creating your first column.
                        You can create columns like "To Do", "In Progress", "Review", or any custom workflow that fits your needs.
                    </p>

                    {isAddingColumn ? (
                        <div className="space-y-4">
                            <form onSubmit={handleAddColumn} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter column name (e.g., To Do, In Progress)"
                                    value={newColumnTitle}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                    autoFocus
                                />
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                                    >
                                        Create First Column
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingColumn(false);
                                            setNewColumnTitle('');
                                        }}
                                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingColumn(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
                        >
                            <span className="text-lg">+</span>
                            <span>Create Your First Column</span>
                        </button>
                    )}

                    <div className="mt-8 p-4 bg-slate-700/30 rounded-lg">
                        <p className="text-xs text-slate-500">
                            💡 Tip: Start with basic columns like "To Do", "In Progress", and "Done" for a simple workflow
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Board Statistics */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            📊
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Total Tasks</p>
                            <p className="text-xl font-bold text-white">{totalTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            ✅
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Completed</p>
                            <p className="text-xl font-bold text-white">{completedTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            📋
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Columns</p>
                            <p className="text-xl font-bold text-white">{columns.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            🎯
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Progress</p>
                            <p className="text-xl font-bold text-white">
                                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>


            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                collisionDetection={closestCorners}
            >
                <div className="flex space-x-6 overflow-x-auto pb-6 min-h-[700px]">
                    <SortableContext items={filteredColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
                        {filteredColumns.map((column) => (
                            <TaskColumn key={column.id} column={column} />
                        ))}
                    </SortableContext>

                    {/* Add New Column */}
                    <div className="flex-shrink-0 w-80">
                        {isAddingColumn ? (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-5">
                                <form onSubmit={handleAddColumn} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Column Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter column name..."
                                            value={newColumnTitle}
                                            onChange={(e) => setNewColumnTitle(e.target.value)}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                        >
                                            Create Column
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingColumn(false);
                                                setNewColumnTitle('');
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
                                onClick={() => setIsAddingColumn(true)}
                                className="w-full h-24 border-2 border-dashed border-slate-600 rounded-xl hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200 group"
                            >
                                <div className="flex flex-col items-center justify-center space-y-2 text-slate-400 group-hover:text-slate-300">
                                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                                        <span className="text-xl">+</span>
                                    </div>
                                    <span className="text-sm font-medium">Add Column</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="rotate-3 shadow-2xl">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;