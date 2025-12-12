'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TodoList from '@/components/TodoList';
import { TodoList as TodoListType } from '@/types';

export default function TodosPage() {
    const [lists, setLists] = useState<TodoListType[]>([]);
    const [newListName, setNewListName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const res = await fetch('/api/todos');
            if (res.ok) {
                const data = await res.json();
                setLists(data);
            }
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim() && !isSubmitting) {
            setIsSubmitting(true);
            try {
                const res = await fetch('/api/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newListName.trim() }),
                });

                if (res.ok) {
                    const newList = await res.json();
                    setLists([...lists, newList]);
                    setNewListName('');
                }
            } catch (error) {
                console.error('Failed to add list:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleUpdateList = (updatedList: TodoListType) => {
        setLists(lists.map((l) => (l.id === updatedList.id ? updatedList : l)));
    };

    const handleDeleteList = async (id: number) => {
        try {
            const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLists(lists.filter((l) => l.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete list:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        My To-Do Lists
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <form onSubmit={handleAddList} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="Create a new list..."
                            disabled={isSubmitting}
                            className="flex-1 p-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newListName.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <Plus size={24} />
                            <span className="hidden sm:inline">Add List</span>
                        </button>
                    </form>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                    </div>
                ) : lists.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No lists yet. Create your first list above!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lists.map((list) => (
                            <TodoList
                                key={list.id}
                                list={list}
                                onUpdateList={handleUpdateList}
                                onDeleteList={handleDeleteList}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
