
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function RootLayout() {
    return (
        <Provider store={store}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="login"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="home"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="profile"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="settings"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="explore"
                    options={{ headerShown: false }}
                />
            </Stack>
        </Provider>
    );
}
