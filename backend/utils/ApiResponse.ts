// ApiResponse.ts

interface ApiResponseOptions<T> {
    data?: T;
    code?: number;
    message?: string;
}

export default class ApiResponse<T> {
    constructor(
        public readonly data?: T,
        public readonly code: number = 200,
        public readonly message: string = ''
    ) {}

    static getBuilder<T>(options?: ApiResponseOptions<T>): ApiResponseBuilder<T> {
        return new ApiResponseBuilder<T>(options);
    }
}

export class ApiResponseBuilder<T> {
    private data?: T;
    private code?: number;
    private message?: string;

    constructor(options?: ApiResponseOptions<T>) {
        this.data = options?.data;
        this.code = options?.code;
        this.message = options?.message;
    }

    withData(data: T): ApiResponseBuilder<T> {
        this.data = data;
        return this;
    }

    withCode(code: number): ApiResponseBuilder<T> {
        this.code = code;
        return this;
    }

    withMessage(message: string): ApiResponseBuilder<T> {
        this.message = message;
        return this;
    }

    build(): ApiResponse<T> {
        return new ApiResponse<T>(this.data, this.code, this.message);
    }
}
