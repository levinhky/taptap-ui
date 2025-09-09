import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  label: string;
  deadline: string;
  priority: number;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [
    { id: '1', label: 'Viết báo cáo', priority: 3, deadline: '10/09/2025' },
    { id: '2', label: 'Đi chợ', priority: 2, deadline: '11/09/2025' },
    { id: '3', label: 'Học React Native', priority: 1, deadline: '18/09/2025' },
  ],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.todos[index] = action.payload;
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
