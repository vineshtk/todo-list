'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import AddTodoForm from './AddTodoForm';
import TodoItem from './TodoItem';
import { TodoList as TodoListType } from '@/types';

interface TodoListProps {
    list: TodoListType;
    onUpdateList: (list: TodoListType) => void;
    onDeleteList: (id: number) => void;
}

export default function TodoList({ list, onUpdateList, onDeleteList }: TodoListProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(list.name);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleAddTodo = async (text: string) => {
        const res = await fetch(`/api/todos/${list.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (res.ok) {
            const updatedList = await res.json();
            onUpdateList(updatedList);
        }
    };

    const updateList = async (updatedList: TodoListType) => {
        const res = await fetch(`/api/todos/${list.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList),
        });

        if (res.ok) {
            const savedList = await res.json();
            onUpdateList(savedList);
        }
    };

    const handleToggleTodo = async (id: number) => {
        const updatedList = {
            ...list,
            todos: list.todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        };
        await updateList(updatedList);
    };

    const handleDeleteTodo = async (id: number) => {
        const updatedList = {
            ...list,
            todos: list.todos.filter(todo => todo.id !== id),
        };
        await updateList(updatedList);
    };

    const handleUpdateTodoText = async (id: number, newText: string) => {
        const updatedList = {
            ...list,
            todos: list.todos.map(todo =>
                todo.id === id ? { ...todo, text: newText } : todo
            ),
        };
        await updateList(updatedList);
    };

    const handleSaveTitle = async () => {
        if (editTitle.trim() && editTitle !== list.name) {
            const updatedList = {
                ...list,
                name: editTitle.trim(),
            };
            await updateList(updatedList);
        } else {
            setEditTitle(list.name);
        }
        setIsEditingTitle(false);
    };

    const handleCancelTitle = () => {
        setEditTitle(list.name);
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            handleCancelTitle();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 group">
                {isEditingTitle ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={handleTitleKeyDown}
                            className="flex-1 text-xl font-bold p-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSaveTitle} className="text-green-600 hover:text-green-700">
                            <Check size={20} />
                        </button>
                        <button onClick={handleCancelTitle} className="text-red-500 hover:text-red-600">
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                        <h2
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onDoubleClick={() => setIsEditingTitle(true)}
                        >
                            {list.name}
                        </h2>
                        <button
                            onClick={() => setIsEditingTitle(true)}
                            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                )}

                <button
                    onClick={() => onDeleteList(list.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete list"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {list.todos.length > 0 ? (
                <ul className="space-y-1 mb-4">
                    {list.todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggleTodo}
                            onDelete={handleDeleteTodo}
                            onUpdate={handleUpdateTodoText}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-sm italic mb-4">No todos yet. Add one below!</p>
            )}

            <AddTodoForm onAddTodo={handleAddTodo} />
        </div>
    );
}
