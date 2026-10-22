export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return "Por favor ingresa tu correo";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Por favor ingresa un correo válido";
    }

    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return "Por favor ingresa tu contraseña";
    }

    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres";
    }

    return null;
};
