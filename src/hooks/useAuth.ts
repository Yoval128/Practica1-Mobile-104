import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

import * as authApi from '../api/auth.api';
import { saveTokens, getAccessToken, clearTokens } from '../utils/storage';
import { handleApiError, ApiError } from '../utils/errorHandler';
import { User } from '../types/user';

interface UseAuthState {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends UseAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: (signal?: AbortSignal) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();

  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const isMountedRef = useRef(false);
  const operationIdRef = useRef(0);

  /**
   * Comprobar autenticación con soporte de AbortSignal
   */
  const checkAuth = useCallback(async (signal?: AbortSignal) => {
    const operationId = ++operationIdRef.current;

    try {
      const token = await getAccessToken();

      if (!isMountedRef.current || operationId !== operationIdRef.current || signal?.aborted) return;

      if (!token) {
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
        return;
      }

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const user = await authApi.getCurrentUser(signal);

      if (!isMountedRef.current || operationId !== operationIdRef.current || signal?.aborted) return;

      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

    } catch (error: any) {
      if (signal?.aborted || !isMountedRef.current || operationId !== operationIdRef.current) return;

      try {
        await clearTokens();
      } catch (storageError) {
        console.error('Error limpiando sesión:', storageError);
      }

      if (!isMountedRef.current || operationId !== operationIdRef.current) return;

      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  }, []);

  /**
   * Iniciar sesión
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const operationId = ++operationIdRef.current;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await authApi.login({ email, password });

      if (!isMountedRef.current || operationId !== operationIdRef.current) return false;

      // Actualizado a accessToken
      await saveTokens(response.accessToken, response.refreshToken);

      if (!isMountedRef.current || operationId !== operationIdRef.current) return false;

      setState({
        user: response.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return true;

    } catch (error) {
      if (!isMountedRef.current || operationId !== operationIdRef.current) return false;

      const apiError = handleApiError(error);

      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: apiError,
        isAuthenticated: false,
      }));

      return false;
    }
  }, []);

  /**
   * Registrar usuario
   */
  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    const operationId = ++operationIdRef.current;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      await authApi.register({ email, password });

      if (!isMountedRef.current || operationId !== operationIdRef.current) return false;

      return await login(email, password);

    } catch (error) {
      if (!isMountedRef.current || operationId !== operationIdRef.current) return false;

      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));

      return false;
    }
  }, [login]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async (): Promise<void> => {
    operationIdRef.current++;

    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
      try {
        await clearTokens();
      } catch (error) {
        console.error('Error eliminando tokens:', error);
      }

      if (isMountedRef.current) {
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      }

      router.replace('/');
    }
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

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

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}