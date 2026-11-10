
/**
 * Utilidades para almacenamiento de tokens
 * Web: localStorage
 * Android/iOS: Expo SecureStore
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Validar token antes de almacenarlo
 */
function validateToken(token: string): void {
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('El token proporcionado no es válido');
  }
}

/**
 * Guardar un token según la plataforma
 */
async function saveToken(key: string, token: string): Promise<void> {
  validateToken(token);

  if (Platform.OS === 'web') {
    localStorage.setItem(key, token);
    return;
  }

  await SecureStore.setItemAsync(key, token);
}

/**
 * Obtener un token según la plataforma
 */
async function getToken(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

/**
 * Eliminar un token según la plataforma
 */
async function deleteToken(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

/**
 * Guarda el access token
 */
export async function saveAccessToken(token: string): Promise<void> {
  await saveToken(ACCESS_TOKEN_KEY, token);
}

/**
 * Obtiene el access token
 */
export async function getAccessToken(): Promise<string | null> {
  return getToken(ACCESS_TOKEN_KEY);
}

/**
 * Guarda el refresh token
 */
export async function saveRefreshToken(token: string): Promise<void> {
  await saveToken(REFRESH_TOKEN_KEY, token);
}

/**
 * Obtiene el refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  return getToken(REFRESH_TOKEN_KEY);
}

/**
 * Guarda ambos tokens
 */
export async function saveTokens(
    accessToken: string,
    refreshToken: string
): Promise<void> {
  validateToken(accessToken);
  validateToken(refreshToken);

  await saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
}

/**
 * Elimina todos los tokens
 * Intenta eliminar ambos aunque uno falle.
 */
export async function clearTokens(): Promise<void> {
  const results = await Promise.allSettled([
    deleteToken(ACCESS_TOKEN_KEY),
    deleteToken(REFRESH_TOKEN_KEY),
  ]);

  const failedOperation = results.find(
      result => result.status === 'rejected'
  );

  if (failedOperation?.status === 'rejected') {
    throw failedOperation.reason;
  }
}
