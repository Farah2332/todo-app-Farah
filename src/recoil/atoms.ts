// atoms.ts
import { atom } from 'recoil';

export const todoListState = atom<ITodo[]>({
    key: 'todoListState',
    default: [],
});

export const filteredTodoListState = atom<ITodo[]>({
    key: 'filteredTodoListState',
    default: [],
});

export const todosLoadingState = atom<boolean>({
    key: 'todosLoadingState',
    default: false,
});
