import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TodoList from '@/models/TodoList';
import { Todo } from '@/types';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await connectDB();
        const list = await TodoList.findOne({ id: parseInt(id) });

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const updatedList = await request.json();
        await connectDB();

        const list = await TodoList.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: { todos: updatedList.todos, name: updatedList.name } },
            { new: true }
        );

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await connectDB();
        const result = await TodoList.findOneAndDelete({ id: parseInt(id) });

        if (!result) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { text } = await request.json();
        await connectDB();

        const newTodo: Todo = {
            id: Date.now(),
            text,
            completed: false,
        };

        const list = await TodoList.findOneAndUpdate(
            { id: parseInt(id) },
            { $push: { todos: newTodo } },
            { new: true }
        );

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json(list, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
    }
}
