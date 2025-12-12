import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { TodoList } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'todos.json');

async function readLists(): Promise<TodoList[]> {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

async function writeLists(lists: TodoList[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(lists, null, 2), 'utf-8');
}

export async function GET() {
    const lists = await readLists();
    return NextResponse.json(lists);
}

export async function POST(request: Request) {
    const body = await request.json();
    const lists = await readLists();

    const newList: TodoList = {
        id: Date.now(),
        name: body.name,
        todos: [],
    };

    lists.push(newList);
    await writeLists(lists);

    return NextResponse.json(newList, { status: 201 });
}
