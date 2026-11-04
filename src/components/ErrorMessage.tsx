import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ApiError } from '../utils/errorHandler';

interface ErrorMessageProps {
  error: ApiError | string;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = typeof error === 'string'
      ? error
      : error?.message || 'Error desconocido';

  const onRetryRef = useRef(onRetry);

  useEffect(() => {
    onRetryRef.current = onRetry;
  }, [onRetry]);

  const handleRetry = useCallback(() => {
    if (onRetryRef.current) {
      Alert.alert(
          'Reintentar',
          '¿Seguro que deseas intentar de nuevo?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sí',
              onPress: () => onRetryRef.current?.()
            }
          ]
      );
    }
  }, []);

  return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text
              style={styles.icon}
              accessibilityLabel="Advertencia"
              accessibilityRole="image"
          >
            ⚠️
          </Text>
        </View>

        <Text style={styles.title}>¡Oops!</Text>

        <Text style={styles.message}>{message}</Text>

        {onRetry && (
            <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                accessible={true}
                accessibilityLabel="Reintentar"
                accessibilityHint="Vuelve a intentar la operación fallida"
            >
              <Text style={styles.retryText}>Intentar de nuevo</Text>
            </TouchableOpacity>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});