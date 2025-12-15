import mongoose, { Schema, model, models } from 'mongoose';

const TodoSchema = new Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const TodoListSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    todos: [TodoSchema]
}, { timestamps: true });

const TodoList = models.TodoList || model('TodoList', TodoListSchema);

export default TodoList;
