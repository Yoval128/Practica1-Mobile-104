
/**
 * Layout raíz de la aplicación
 * Configura el Stack Navigator principal
 * Proporciona el contexto Redux a toda la aplicación
 */

import { Stack } from "expo-router";
import { Provider } from "react-redux";
import {store} from "@/store";


export default function RootLayout() {
    return (
        <Provider store={store}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="student/[id]"
                    options={{
                        headerShown: true,
                        title: "Detalle de Estudiante",
                        headerStyle: {
                            backgroundColor: "#FFFFFF",
                        },
                        headerTitleStyle: {
                            fontWeight: "600",
                        },
                        headerTintColor: "#111827",
                    }}
                />
            </Stack>
        </Provider>
    );
}
