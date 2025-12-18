'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Todo } from '@/types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, newText: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editText.trim()) {
            onUpdate(todo.id, editText.trim());
            setIsEditing(false);
        } else {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <li className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <span
                        className={`flex-1 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {todo.text}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="text-green-600 hover:text-green-700 p-1">
                            <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="text-red-500 hover:text-red-600 p-1">
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-400 hover:text-blue-500 p-1"
                            aria-label="Edit todo"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            aria-label="Delete todo"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}
