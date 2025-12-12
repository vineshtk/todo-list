'use client';

import { Trash2 } from 'lucide-react';
import { Todo } from '@/types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {todo.text}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete todo"
            >
                <Trash2 size={18} />
            </button>
        </li>
    );
}
