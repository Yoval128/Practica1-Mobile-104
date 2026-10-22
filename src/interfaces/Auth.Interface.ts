export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
}
export interface LoginFormProps {
    onLogin: (
        email: string,
        password: string
    ) => void;
    loading: boolean;
    error: string;
}