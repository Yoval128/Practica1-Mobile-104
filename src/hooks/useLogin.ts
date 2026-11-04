import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authSlice";
import { saveToken } from "@/utils/secureStore";

import { LoginRequest } from "@/interfaces/Auth.Interface";
import { loginService } from "@/services/Auth.service";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

            const token = response.accessToken;

            if (!token) {
                setError("No se recibió el token del servidor");
                return false;
            }

            await saveToken(token);
            dispatch(setToken(token));

            return true;

        } catch (error) {
            console.error("Error en login:", error);
            setError("Ocurrió un error al iniciar sesión");
            return false;

        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};