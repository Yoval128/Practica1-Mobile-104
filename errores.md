# Historial de errores y correcciones del proyecto

## 1. Error de configuración de Redux Provider

**Estado:** Corrección propuesta.

**Error:**
Could not find react-redux context value; please ensure the component is wrapped in a <Provider>

**Archivo afectado:**
- src/app/_layout.tsx

**Causa:**
Se utilizaba useDispatch() sin envolver la aplicación en un Provider de Redux.

**Solución:**
Envolver el Stack de Expo Router con Provider y pasarle el store.

## 2. Error de Expo SecureStore

**Estado:** Pendiente de comprobar.

**Error:**
ExpoSecureStore.default.getValueWithKeyAsync is not a function

**Archivo afectado:**
- src/utils/storage.ts

**Causa probable:**
Problema de compatibilidad, instalación o carga del módulo expo-secure-store.

**Solución propuesta:**
- Comprobar la instalación del paquete.
- Verificar compatibilidad con Expo SDK.
- Comprobar el entorno de ejecución.
- Reconstruir la aplicación nativa si es necesario.

## 3. Almacenamiento duplicado de tokens

**Estado:** Corrección propuesta.

**Archivos afectados:**
- src/utils/storage.ts
- src/utils/secureStore.ts

**Problema:**

Existían dos módulos independientes para almacenar los tokens.

Además, utilizaban claves diferentes:

- storage.ts: access_token
- secureStore.ts: jwt_token

**Consecuencia:**
El token podía guardarse con una clave y buscarse con otra.

**Solución:**
Centralizar el almacenamiento en un único módulo y utilizar las mismas claves para guardar, recuperar y eliminar los tokens.

## 4. Inconsistencia en el inicio de sesión

**Estado:** Pendiente de integración.

**Archivo afectado:**
- src/hooks/useLogin.ts

**Problema:**
El inicio de sesión utilizaba saveToken() desde secureStore.ts, mientras que la recuperación de sesión utilizaba getAccessToken() desde storage.ts.

**Solución:**
Utilizar saveAccessToken() y getAccessToken() desde el mismo módulo de almacenamiento.

## 5. Error en el cierre de sesión (Logout)

**Estado:** Corrección propuesta.

**Archivo afectado:**
- HomeScreen.tsx

**Problema:**
El cierre de sesión únicamente ejecutaba router.replace("/"), sin eliminar el token almacenado ni limpiar Redux.

**Consecuencia:**
La aplicación podía recuperar el token anterior y volver a iniciar la sesión automáticamente.

**Solución:**
1. Ejecutar clearTokens().
2. Ejecutar dispatch(logout()).
3. Redirigir al usuario a la pantalla de login.

## 6. Inconsistencia en authSlice

**Estado:** Corrección propuesta.

**Archivo afectado:**
- src/store/authSlice.ts

**Problema:**
La acción setToken estaba tipada para recibir exclusivamente string.

Sin embargo, para cerrar sesión se necesita limpiar el token.

**Solución:**
Utilizar la acción logout() existente para limpiar:
- token
- user
- error
- isLoading

## 7. Orden de trabajo recomendado

1. Resolver el problema de Expo SecureStore.
2. Unificar el almacenamiento de tokens.
3. Corregir la integración del inicio de sesión.
4. Corregir el cierre de sesión.
5. Comprobar la recuperación automática de sesión.
6. Verificar la sincronización entre Redux y almacenamiento.

## 8. Pruebas funcionales pendientes

- [ ] La aplicación inicia sin errores de Redux.
- [ ] SecureStore funciona correctamente en Android/iOS.
- [ ] El almacenamiento web funciona correctamente.
- [ ] El usuario puede iniciar sesión.
- [ ] El token se guarda correctamente.
- [ ] La aplicación recupera una sesión existente.
- [ ] El usuario puede cerrar sesión.
- [ ] Redux limpia los datos de autenticación.
- [ ] El token se elimina del almacenamiento.
- [ ] Después de cerrar sesión no se recupera la sesión anterior.

## 9. Consideraciones generales

- Trabajar archivo por archivo.
- No reconstruir funcionalidades que ya funcionan.
- Identificar la causa antes de modificar código.
- Mantener una única fuente de almacenamiento para los tokens.
- Comprobar las dependencias antes de cambiar versiones.
- Verificar las correcciones mediante pruebas.

**Objetivo:** conseguir una aplicación funcional, estable, segura, organizada y fácil de mantener.