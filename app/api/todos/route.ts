import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TodoList from '@/models/TodoList';

export async function GET() {
    try {
        await connectDB();
        const lists = await TodoList.find({}).sort({ createdAt: -1 });
        return NextResponse.json(lists);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        const newList = await TodoList.create({
            id: Date.now(),
            name: body.name,
            todos: [],
        });

        return NextResponse.json(newList, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
    }
}
