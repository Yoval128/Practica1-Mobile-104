# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# Practica1-Mobile-104

Errores y soluciones del proyecto API Alumnos
1. Error de sintaxis en SQLite

Problema: Error near "FOREIGN": syntax error al crear la tabla refresh_tokens.

Causa: Faltaba una coma después de la columna created_at.

Solución: Agregar una coma antes de la declaración FOREIGN KEY.

2. Error de orden de Hooks en React

Problema: Posibles errores por llamar los Hooks en un orden incorrecto.

Causa: Declarar useEffect antes de inicializar referencias u otros Hooks.

Solución: Mantener los Hooks en el mismo orden en cada renderizado.

3. Fugas de memoria en animaciones

Problema: La animación podía continuar después de desmontar el componente.

Causa: No detener la animación al desmontar el componente.

Solución: Guardar la animación y utilizar una función de limpieza (cleanup) con animation.stop().

4. Optimización de tarjetas de estudiantes

Problema: Renderizados innecesarios de las tarjetas al actualizar el componente padre.

Causa: No utilizar optimización de renderizado.

Solución: Implementar React.memo y utilizar displayName para facilitar la depuración.

5. Problemas de accesibilidad

Problema: Los lectores de pantalla no identificaban correctamente los elementos interactivos.

Causa: Falta de etiquetas y descripciones accesibles.

Solución: Agregar accessibilityLabel, accessibilityHint y accessibilityRole cuando corresponda.

6. Manejo de valores null y undefined

Problema: La aplicación podía generar errores al mostrar nombres o apellidos incompletos.

Causa: Acceder directamente a métodos de cadenas como charAt().

Solución: Utilizar optional chaining (?.) y valores alternativos (|| '?').

7. Manejo de errores en componentes

Problema: El componente podía fallar al recibir información de error inesperada.

Causa: No validar correctamente los datos recibidos.

Solución: Validar el tipo de dato y establecer un mensaje predeterminado como "Error desconocido".

8. Problema de Stale Closure en callbacks

Problema: La función de reintento podía utilizar una referencia anterior de onRetry.

Causa: No actualizar correctamente las dependencias del callback.

Solución: Utilizar useRef y useEffect para mantener actualizada la referencia de onRetry.

9. Error al recibir el token de autenticación

Problema: El frontend mostraba el mensaje: No se recibió el token del servidor.

Causa: El backend devolvía accessToken, mientras que el frontend esperaba token.

Solución: Modificar Auth.service.ts para obtener result.accessToken y actualizar la interfaz LoginResponse.

10. Pérdida de información en la respuesta del login

Problema: El servicio de autenticación solamente devolvía el token y descartaba otros datos.

Causa: No se estaban recuperando refreshToken ni user de la respuesta del backend.

Solución: Actualizar LoginResponse y loginService para incluir:

accessToken
refreshToken
user
Conclusión

Durante el desarrollo se identificaron y corrigieron errores relacionados con SQLite, React Hooks, optimización de componentes, accesibilidad, manejo de errores y autenticación.

Estas correcciones permiten mejorar la estabilidad, seguridad, mantenimiento y experiencia de usuario de la aplicación de gestión de estudiantes.

PROMPT – Continuación del desarrollo y corrección de errores del proyecto API Alumnos

Actúa como un desarrollador senior especializado en TypeScript, React Native, Expo, Node.js, Express, SQLite y Redux Toolkit.

Estoy desarrollando un proyecto llamado API Alumnos, que consiste en una aplicación móvil para gestionar estudiantes, conectada a un backend mediante una API REST.

Quiero que me ayudes a continuar desarrollando, revisando y corrigiendo errores de mi proyecto siguiendo una metodología ordenada.

1. Estructura y tecnologías del proyecto
   Backend
   Node.js
   TypeScript
   Express
   SQLite
   JWT para autenticación
   bcryptjs para contraseñas
   Arquitectura organizada por controladores, servicios, repositorios, middleware y rutas.
   Frontend
   React Native
   Expo
   TypeScript
   Redux Toolkit para manejar estados globales.
   Hooks personalizados.
   React Navigation o Expo Router, según la estructura existente.
   SecureStore para guardar información sensible.
2. Metodología de trabajo

Cada vez que te comparta un archivo o código, debes:

Analizar completamente el código.
Identificar errores de sintaxis, lógica, tipado y funcionamiento.
Detectar posibles problemas de rendimiento y seguridad.
Revisar si existen problemas relacionados con React Hooks.
Comprobar que el código sea compatible con la estructura actual del proyecto.
Proponer una solución sencilla y correcta.
Entregarme el código completo corregido.
3. Forma de entregar las correcciones

Quiero que sigas estas reglas:

Entregar el archivo completo, no solamente fragmentos.
Eliminar todos los comentarios innecesarios del código.
Conservar las funcionalidades existentes.
No modificar nombres de funciones, variables o interfaces sin necesidad.
No cambiar la arquitectura del proyecto innecesariamente.
Mantener las importaciones y rutas existentes.
Utilizar buenas prácticas de TypeScript.
Evitar soluciones que generen nuevos errores.
No agregar dependencias nuevas sin consultarme.
4. Explicación de los errores

Después de cada corrección, proporciona una explicación breve indicando:

Número de error.
Nombre del problema.
Causa del error.
Solución implementada.

No necesito explicaciones demasiado extensas. Quiero entender qué estaba mal y cómo se solucionó.

5. Reglas importantes
   No inventes archivos, funciones, interfaces o estructuras que no haya compartido.
   Si necesitas conocer otro archivo para solucionar un problema, solicítamelo.
   Antes de modificar una interfaz, comprueba dónde se utiliza.
   Si el problema está en el frontend, revisa también cómo responde el backend cuando sea necesario.
   Si el problema está en el backend, comprueba cómo consume la respuesta el frontend.
   Mantén sincronizados los nombres de propiedades, interfaces y respuestas de la API.
   Presta especial atención a la autenticación JWT, accessToken, refreshToken y almacenamiento seguro.
   No des por solucionado un problema hasta comprobar que la corrección coincide con el código existente.
6. Objetivo

Quiero construir una aplicación funcional, estable, organizada y fácil de mantener.

Mi objetivo es ir compartiendo los archivos poco a poco para que los revises, identifiques problemas y me entregues versiones corregidas.

IMPORTANTE: Trabajaremos archivo por archivo. No quiero que reconstruyas todo el proyecto cada vez que aparezca un error. Primero analiza, después corrige y finalmente explica brevemente.

Cuando te comparta un código, comienza directamente con su revisión siguiendo esta metodología.