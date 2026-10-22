import React, {useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import {useRouter} from "expo-router";
import {useSelector, useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import {fetchUserProfile} from "@/store/authSlice";


export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const {user, isLoading, error} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Usuario');
    const firstLetter = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {isLoading ? (
                <View style={[styles.profile, {justifyContent: 'center'}]}>
                    <ActivityIndicator size="large" color="#4f46e5"/>
                    <Text style={{marginTop: 10}}>Cargando perfil...</Text>
                </View>
            ) : error ? (
                <View style={styles.profile}>
                    <Text style={{color: 'red'}}>Error: {error}</Text>
                    <TouchableOpacity onPress={() => dispatch(fetchUserProfile())}>
                        <Text style={{color: '#4f46e5', marginTop: 10}}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.profile}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {firstLetter}
                        </Text>
                    </View>

                    <Text style={styles.name}>
                        {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                    </Text>

                    <Text style={styles.email}>
                        {user?.email || 'Cargando correo...'}
                    </Text>
                </View>
            )}

            <View style={styles.options}>
                <Text>👤 Editar perfil</Text>
                <Text>🔒 Cambiar contraseña</Text>
                <Text>🔔 Notificaciones</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#f5f6fa"},
    header: {height: 60, backgroundColor: "#4f46e5", flexDirection: "row", alignItems: "center", paddingHorizontal: 20},
    back: {color: "#fff", fontSize: 28, marginRight: 20},
    headerTitle: {color: "#fff", fontSize: 20, fontWeight: "bold"},
    profile: {alignItems: "center", paddingVertical: 30, backgroundColor: "#fff", minHeight: 220},
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#4f46e5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15
    },
    avatarText: {color: "#fff", fontSize: 36, fontWeight: "bold"},
    name: {fontSize: 24, fontWeight: "bold", color: "#222", marginBottom: 5},
    email: {fontSize: 16, color: "#777"},
    options: {marginTop: 20, backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 10, gap: 20},
});