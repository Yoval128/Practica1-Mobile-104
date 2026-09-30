import {useState} from "react";
import {LoginRequest} from "@/interfaces/Auth.Interface";
import {loginService} from "@/services/Auth.service";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (
        data: LoginRequest
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");

            const response = await loginService(data);
            if (!response.success) {
                setError(response.message);
                return false;
            }
            return true;
        } catch (error) {
            setError("Ocurrio un error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {login, loading, error};
};