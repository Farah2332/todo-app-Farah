import { selector, selectorFamily, DefaultValue } from 'recoil';

import { todoListState, filteredTodoListState, todosLoadingState } from './atoms';
import { ITodo, ApiResponse } from '../types';

import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};
export const fetchTodosSelector = selector<ITodo[]>({
    key: 'fetchTodosSelector',
    get: async ({ get }) => {
        try {
            const userEmail = localStorage.getItem('email');
            if (!userEmail) {
                throw new Error('User email not found in localStorage');
            }
            const response = await apiClient.get<ApiResponse<ITodo[]>>('/todos', {
                params: { email: userEmail },
            });
            const todos = response.data.data;
            // Example filtering (adjust as per your filtering logic)
            const filteredTodos = todos.filter(todo => !todo.completed);
            // Update both todoListState and filteredTodoListState
            get(todoListState); // Ensure todoListState is initialized
            return todos; // Return the unfiltered todos
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            throw error;
        }
    },
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            set(todoListState, newValue);
            // Example filtering (adjust as per your filtering logic)
            const filteredTodos = newValue.filter(todo => !todo.completed);
            set(filteredTodoListState, filteredTodos);
        }
    },
});

export const todosLoadingSelector = selector<boolean>({
    key: 'todosLoadingSelector',
    get: ({ get }) => get(todosLoadingState),
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            set(todosLoadingState, newValue);
        }
    },
});

export const addTodoSelector = selectorFamily({
    key: 'addTodoSelector',
    get: (newTodo: { text: string; email: string }) => async () => {
        const response = await apiClient.post<ApiResponse<ITodo>>('/todos', newTodo);
        return response.data.data;
    },
});

export const toggleTodoSelector = selectorFamily({
    key: 'toggleTodoSelector',
    get: (id: string) => async ({ get }) => {
        const todos = get(todoListState);
        const todoToUpdate = todos.find((todo) => todo._id === id);
        if (!todoToUpdate) {
            throw new Error('Todo not found');
        }
        const response = await apiClient.put<ApiResponse<ITodo>>(`/todos/${id}`, {
            ...todoToUpdate,
            completed: !todoToUpdate.completed,
        });
        return response.data.data;
    },
});
export const deleteTodoSelector = selectorFamily({
    key: 'toggleTodoSelector',
    get: (id: string) => async ({ get }) => {
        const todos = get(todoListState);
        const todoToUpdate = todos.find((todo) => todo._id === id);
        if (!todoToUpdate) {
            throw new Error('Todo not found');
        }
        const response = await apiClient.delete<ApiResponse<ITodo>>(`/todos/${id}`, {
            ...todoToUpdate,
            completed: !todoToUpdate.completed,
        });
        return response.data.data;
    },
});


