import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authSlice";
import { saveToken } from "@/utils/secureStore";

import { LoginRequest } from "@/interfaces/Auth.Interface";
import { loginService } from "@/services/Auth.service";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Inicializamos el dispatch
    const dispatch = useDispatch();

    const login = async (data: LoginRequest): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");

            const response = await loginService(data);

            if (!response.success) {
                setError(response.message || "Error al iniciar sesión");
                return false;
            }

            const token = response.token || response.data?.token;

            if (token) {
                await saveToken(token);
                dispatch(setToken(token));
            } else {
                console.warn("Login exitoso, pero no se recibió el token del backend");
            }

            return true;
        } catch (error) {
            setError("Ocurrió un error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};