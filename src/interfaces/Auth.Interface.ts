export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    SUCESS: string;
    message: string;
}

interface LoginFormProps {
    onLogin: (
        username: string,
        password: string
    ) => void;
    loading: boolean;
    error: string;
}