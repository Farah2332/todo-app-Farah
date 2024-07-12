export interface ITodo {
    _id: string;
    text: string;
    completed: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}