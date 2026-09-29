import {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

interface LoginFormProps {
    onLogin: (
        username: string,
        password: string
    ) => void;
    loading: boolean;
    error: string;
}

export default function LoginForm({
                                      onLogin,
                                      loading,
                                      error
                                  }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!username.trim()) {
            alert("Por favor ingresa tu usuario");
            return;
        }
        if (!password) {
            alert("Por favor ingresa tu contraseña");
            return;
        }
        onLogin(username, password);
    };

    const isFormValid = username.trim() !== "" && password !== "";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Iniciar sesión
            </Text>

            {error && (
                <View >
                    <Text>⚠ {error}</Text>
                </View>
            )}

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#999"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                placeholderTextColor="#999"
            />

            <TouchableOpacity

                onPress={handleLogin}
                disabled={!isFormValid || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small"/>
                ) : (
                    <Text>Iniciar Sesión</Text>
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
    },    error: {
        color: "red",
        fontSize: 16,
        fontWeight: "600",
    },
});