import {LoginRequest, LoginResponse} from "@/interfaces/Auth.Interface";
import {API_ULR} from "@/constants/api";

export const loginService = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await fetch(
        `${API_ULR}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message: result.message || "Usuario o contraseña incorrecta",
        };
    }

    return {
        success: true,
        message: result.message || "Usuario logeado",

    };

};
