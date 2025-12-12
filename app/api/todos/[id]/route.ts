import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { TodoList, Todo } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'todos.json');

async function readLists(): Promise<TodoList[]> {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

async function writeLists(lists: TodoList[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(lists, null, 2), 'utf-8');
}

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const lists = await readLists();
    const list = lists.find((l) => l.id === parseInt(id));

    if (!list) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list);
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const updatedList = await request.json();
    const lists = await readLists();
    const index = lists.findIndex((l) => l.id === parseInt(id));

    if (index === -1) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    lists[index] = updatedList;
    await writeLists(lists);

    return NextResponse.json(lists[index]);
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const lists = await readLists();
    const filtered = lists.filter((l) => l.id !== parseInt(id));

    if (lists.length === filtered.length) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    await writeLists(filtered);
    return new Response(null, { status: 204 });
}

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { text } = await request.json();
    const lists = await readLists();
    const index = lists.findIndex((l) => l.id === parseInt(id));

    if (index === -1) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
    };

    lists[index].todos.push(newTodo);
    await writeLists(lists);

    return NextResponse.json(lists[index]);
}
