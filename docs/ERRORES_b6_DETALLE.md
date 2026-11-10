
# Reporte de Correcciones y Solución de Errores del Proyecto

Este documento detalla exclusivamente las modificaciones, parches y fragmentos de código corregidos durante la resolución de incidencias en el proyecto de desarrollo con Expo y React Native.

---

## 1. ErrorBoundary (`src/components/ErrorBoundary.tsx`)

### Problema:
Memory Leak por llamadas a `setState` en un componente desmontado durante el proceso de reinicio.

### Corrección:
Implementación de una bandera de control `isMounted` para verificar que el componente siga montado antes de actualizar su estado.

### Código corregido:

```tsx
export default class ErrorBoundary extends Component<Props, State> {
  private isMounted: boolean = false;

  public componentDidMount() {
    this.isMounted = true;
  }

  public componentWillUnmount() {
    this.isMounted = false;
  }

  private handleReset = () => {
    if (this.isMounted) {
      this.setState({ hasError: false, error: null });
    }
  };
}
```

---

## 2. LoginForm (`src/components/LoginForm.tsx`)

### Problema:
Race condition y memory leak en peticiones asíncronas cuando la pantalla se desmontaba durante el proceso de autenticación.

### Corrección:
Integración de `mountedRef` para comprobar si el componente continúa montado después de resolver la promesa de inicio de sesión.

### Código corregido:

```tsx
const mountedRef = useRef(true);

useEffect(() => {
  mountedRef.current = true;

  return () => {
    mountedRef.current = false;
  };
}, []);

const handleLogin = async () => {
  if (!email || !password) return;

  await onLogin(email, password);

  if (!mountedRef.current) return;
};
```

---

## 3. StudentService (`src/services/studentService.ts`)

### Problema:
Error de sintaxis en `CACHE_TTL` y falta de límite en el almacenamiento en caché mediante `Map`, lo que podía provocar un crecimiento excesivo del consumo de memoria.

### Corrección:
Ajuste de la constante de tiempo de almacenamiento e implementación de un mecanismo de limpieza LRU con un límite máximo de 50 entradas.

### Código corregido:

```tsx
private readonly CACHE_TTL = 5 * 60 * 1000;
private readonly MAX_CACHE_SIZE = 50;

private setCache<T>(key: string, data: T): void {
  this.cache.delete(key);

  this.cache.set(key, {
    data,
    timestamp: Date.now(),
  });

  while (this.cache.size > this.MAX_CACHE_SIZE) {
    const oldestKey = this.cache.keys().next().value;

    if (oldestKey === undefined) break;

    this.cache.delete(oldestKey);
  }
}
```

---

## 4. AuthContext (`src/context/AuthContext.tsx`)

### Problema:
Re-renderizados innecesarios en toda la aplicación debido a que el objeto `value` del contexto se creaba como una nueva referencia en cada renderizado.

### Corrección:
Implementación de `useMemo` para memorizar el valor del contexto y evitar actualizaciones innecesarias cuando sus dependencias no cambian.

### Código corregido:

```tsx
const value = useMemo<AuthContextType>(() => ({
  user,
  loading,
  error,
  isAuthenticated,
  login,
  logout,
}), [user, loading, error, isAuthenticated, login, logout]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

---

## 5. API y Auth Hook (`src/api/auth.api.ts` y `src/hooks/useAuth.ts`)

### Problema:
Error TS2339 en `UserMeResponse`, falta de soporte para `AbortSignal` y problemas en la actualización y manejo de tokens de autenticación (`accessToken`).

### Corrección:
Modificación de la firma de `getCurrentUser` para aceptar `AbortSignal`, actualización del manejo de tokens y control de cancelación de peticiones asíncronas.

### Código corregido en `auth.api.ts`:

```tsx
export async function getCurrentUser(
  signal?: AbortSignal
): Promise<User> {
  const response = await apiClient.get<UserMeResponse>(
    '/api/auth/me',
    { signal }
  );

  return response.data.data;
}
```

### Código corregido en `useAuth.ts`:

```tsx
useEffect(() => {
  isMountedRef.current = true;

  const abortController = new AbortController();

  checkAuth(abortController.signal);

  return () => {
    isMountedRef.current = false;
    operationIdRef.current++;
    abortController.abort();
  };
}, [checkAuth]);
```

---

## 6. StudentList (`src/components/StudentList.tsx`)

### Problema:
Antipatrón de rendimiento al combinar el índice del elemento con su identificador dentro de `keyExtractor`, generando claves innecesariamente dependientes de la posición.

### Corrección:
Implementación de una clave única basada exclusivamente en la propiedad identificadora del estudiante.

### Código corregido:

```tsx
const keyExtractor = useCallback(
  (item: Student) => item.id.toString(),
  []
);
```

---

## 7. SearchBar (`src/components/SearchBar.tsx`)

### Problema:
Error TS2694: Namespace `NodeJS` has no exported member `Timeout`, debido a incompatibilidades entre los tipos de Node.js y el entorno React Native/Expo.

### Corrección:
Sustitución del tipo `NodeJS.Timeout` por `ReturnType<typeof setTimeout>`, permitiendo utilizar el tipo de temporizador correspondiente al entorno de ejecución.

### Código corregido:

```tsx
const debounceTimer = useRef<
  ReturnType<typeof setTimeout> | null
>(null);

useEffect(() => {
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  debounceTimer.current = setTimeout(() => {
    onChangeText(localValue);
  }, debounceMs);

  return () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };
}, [localValue, debounceMs, onChangeText]);
```

---

## 8. CartContext (`src/context/CartContext.tsx`)

### Problema:
Error de sintaxis en la operación de multiplicación y en el acumulador utilizado para calcular el importe total del carrito.

### Corrección:
Ajuste de la operación `reduce` para calcular correctamente el total mediante la multiplicación del precio por la cantidad de cada producto.

### Código corregido:

```tsx
const total = useMemo(() => {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}, [items]);
```

---

## 9. ThemeContext (`src/context/ThemeContext.tsx`)

### Problema:
Error TS2345 debido a que `systemColorScheme` puede devolver valores como `unspecified` o `null`, provocando incompatibilidad con los tipos permitidos para el tema.

### Corrección:
Validación explícita de los valores permitidos (`light` y `dark`) antes de actualizar el estado del tema.

### Código corregido:

```tsx
const loadTheme = async () => {
  try {
    const savedTheme = await AsyncStorage.getItem(
      THEME_STORAGE_KEY
    );

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else if (
      systemColorScheme === 'dark' ||
      systemColorScheme === 'light'
    ) {
      setTheme(systemColorScheme);
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
};
```

---

## 10. TabLayout (`app/(tabs)/_layout.tsx`)

### Problema:
Error TS2322 por incompatibilidad entre `ColorValue`, retornado por React Navigation, y `string`, requerido por las propiedades del componente de iconos personalizado.

### Corrección:
Flexibilización del tipo de la propiedad `color` en `TabIconProps` y conversión de los colores utilizados en `screenOptions`.

### Código corregido:

```tsx
interface TabIconProps {
  name: 'home' | 'people' | 'person' | 'settings';
  color: ColorValue;
  size: number;
}
```

### Código corregido en `screenOptions`:

```tsx
tabBarActiveTintColor: colors.primary as string,
tabBarInactiveTintColor: colors.secondary as string,

tabBarStyle: {
  backgroundColor: colors.background as string,
  borderTopColor: colors.border as string,
  borderTopWidth: 1,
},
```

---

## 11. Navegación a Estudiantes (`src/app/students.tsx`)

### Problema:
Error TS2345 por incompatibilidad de argumentos y formato de ruta al ejecutar `router.push`, debido a que TypeScript no reconocía correctamente la ruta dinámica del estudiante.

### Corrección:
Implementación de navegación mediante un objeto tipado con `pathname` y `params`, permitiendo resolver correctamente la ruta dinámica `[id].tsx`.

### Código corregido:

```tsx
const handleStudentPress = (
  student: { id: number | string }
) => {
  if (!student || !student.id) return;

  router.push({
    pathname: '/students/[id]',
    params: {
      id: String(student.id),
    },
  });
};
```

---

## 12. Resultado general de las correcciones

Las modificaciones realizadas permitieron atender diferentes incidencias relacionadas con la estabilidad, el rendimiento, la navegación y la compatibilidad de tipos en el proyecto.

### Principales mejoras:

- Control de componentes desmontados durante operaciones asíncronas.
- Prevención de actualizaciones de estado innecesarias.
- Optimización del almacenamiento en caché.
- Reducción de renderizados innecesarios mediante `useMemo`.
- Implementación de cancelación de peticiones HTTP con `AbortController`.
- Optimización de las claves utilizadas en listas de estudiantes.
- Corrección de incompatibilidades de tipos entre Node.js y React Native.
- Corrección del cálculo de importes en el contexto del carrito.
- Validación de los valores del tema claro y oscuro.
- Corrección de tipos de colores en la navegación por pestañas.
- Corrección de la navegación dinámica hacia los detalles de estudiantes.

### Conclusión:

Se realizaron correcciones en diferentes componentes, servicios, contextos y archivos de navegación del proyecto desarrollado con Expo y React Native.

Estas modificaciones buscan mejorar la estabilidad de la aplicación, optimizar el uso de recursos, reducir errores de TypeScript y garantizar un funcionamiento más consistente de sus funcionalidades principales.
