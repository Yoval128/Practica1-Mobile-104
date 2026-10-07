import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import SideMenu from "../components/SideMenu";
import {useRouter} from "expo-router";

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();



    return (
        <View style={styles.container}>

            {/* Encabezado */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => setMenuOpen(true)}
                >
                    <Text style={styles.menuIcon}>
                        ☰
                    </Text>
                </TouchableOpacity>

                <Text style={styles.greeting}>
                    Hola, Ana
                </Text>

                <Text style={styles.profile}>
                    👤
                </Text>

            </View>

            {/* Contenido principal */}
            <View style={styles.content}>

                <Text style={styles.title}>
                    ¡Bienvenida!
                </Text>

                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>

            </View>

            {/* Menú lateral */}
            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}

                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}

                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}

                onLogout={() => {
                    setMenuOpen(false);
                    router.replace("/");
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },

    menuIcon: {
        fontSize: 28,
    },

    greeting: {
        fontSize: 18,
        fontWeight: "600",
    },

    profile: {
        fontSize: 24,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
    },

});