'use client';

import { Trash2 } from 'lucide-react';
import AddTodoForm from './AddTodoForm';
import TodoItem from './TodoItem';
import { TodoList as TodoListType } from '@/types';

interface TodoListProps {
    list: TodoListType;
    onUpdateList: (list: TodoListType) => void;
    onDeleteList: (id: number) => void;
}

export default function TodoList({ list, onUpdateList, onDeleteList }: TodoListProps) {
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

    const handleToggleTodo = async (id: number) => {
        const updatedList = {
            ...list,
            todos: list.todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        };

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

    const handleDeleteTodo = async (id: number) => {
        const updatedList = {
            ...list,
            todos: list.todos.filter(todo => todo.id !== id),
        };

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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{list.name}</h2>
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
