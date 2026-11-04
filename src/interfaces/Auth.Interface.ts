export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    user?: {
        id: number;
        email: string;
    };
}

export interface LoginFormProps {
    onLogin: (
        email: string,
        password: string
    ) => void;
    loading: boolean;
    error: string;
}