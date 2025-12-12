export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export interface TodoList {
    id: number;
    name: string;
    todos: Todo[];
}
