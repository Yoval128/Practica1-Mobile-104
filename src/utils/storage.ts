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
 * Guarda el access token
 */
export async function saveAccessToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Obtiene el access token
 */
export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Guarda el refresh token
 */
export async function saveRefreshToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Obtiene el refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Elimina todos los tokens
 */
export async function clearTokens(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}
