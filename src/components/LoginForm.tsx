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

export default function LoginForm({
                                      onLogin,
                                      loading,
                                      error,
                                  }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!email.trim()) {
            alert("Por favor ingresa tu usuario");
            return;
        }

        if (!password) {
            alert("Por favor ingresa tu contraseña");
            return;
        }

        onLogin(email, password);
    };

    const isFormValid =
        email.trim() !== "" && password !== "";

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

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                editable={!loading}
                placeholderTextColor="#999"
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    (!isFormValid || loading) && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isFormValid || loading}
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

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
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
