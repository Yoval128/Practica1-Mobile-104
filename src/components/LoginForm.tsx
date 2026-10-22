import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { LoginFormProps } from "@/interfaces/Auth.Interface";
import {validateEmail, validatePassword} from "@/utils/validations";


export default function LoginForm({
                                      onLogin,
                                      loading,
                                      error,
                                  }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (text: string) => {
        setEmail(text);

        if (text.trim() !== "") {
            setEmailError("");
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);

        if (text !== "") {
            setPasswordError("");
        }
    };

    const handleLogin = () => {

        setEmailError("");
        setPasswordError("");

        const emailValidationError = validateEmail(email);

        if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
        }

        const passwordValidationError = validatePassword(password);

        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        onLogin(email.trim(), password);
    };

    const isFormValid =
        email.trim() !== "" &&
        password !== "";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Iniciar sesión
            </Text>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>
                        ⚠ {error}
                    </Text>
                </View>
            ) : null}

            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        emailError && styles.inputError,
                    ]}
                    placeholder="Correo"
                    value={email}
                    onChangeText={handleEmailChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!loading}
                    placeholderTextColor="#999"
                />

                {emailError ? (
                    <Text style={styles.fieldError}>
                        {emailError}
                    </Text>
                ) : null}
            </View>

            <View style={styles.inputContainer}>
                <View
                    style={[
                        styles.passwordContainer,
                        passwordError && styles.inputError,
                    ]}
                >
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        onPress={() =>
                            setShowPassword(!showPassword)
                        }
                        disabled={loading}
                    >
                        <Text style={styles.showPassword}>
                            {showPassword
                                ? "Ocultar"
                                : "Mostrar"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {passwordError ? (
                    <Text style={styles.fieldError}>
                        {passwordError}
                    </Text>
                ) : null}
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    (!isFormValid || loading) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={ loading}
            >
                {loading ? (
                    <ActivityIndicator
                        color="#fff"
                        size="small"
                    />
                ) : (
                    <Text style={styles.buttonText}>
                        Iniciar Sesión
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333",
        textAlign: "center",
    },

    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
    },

    passwordContainer: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 12,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },

    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },

    showPassword: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },

    inputError: {
        borderColor: "#FF3B30",
    },

    fieldError: {
        color: "#FF3B30",
        fontSize: 13,
        marginTop: 5,
        marginLeft: 3,
    },

    errorContainer: {
        width: "100%",
        marginBottom: 15,
    },

    error: {
        color: "red",
        fontSize: 16,
        fontWeight: "600",
    },

    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    buttonDisabled: {
        backgroundColor: "#999",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
