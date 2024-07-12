// src/custom.d.ts

declare namespace Express {
    export interface Request {
        user?: {
            id: string; // Adjust type as per your authentication mechanism
            // Add other properties if needed, like username, role, etc.
        };
    }
}
