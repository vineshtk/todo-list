'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
    onAddTodo: (text: string) => Promise<void>;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
    const [newTodoText, setNewTodoText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoText.trim() && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await onAddTodo(newTodoText.trim());
                setNewTodoText('');
            } catch (error) {
                console.error('Failed to add todo:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
            <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new todo..."
                disabled={isSubmitting}
                className="flex-1 p-2 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={isSubmitting || !newTodoText.trim()}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Add todo"
            >
                <Plus size={20} />
            </button>
        </form>
    );
}
