/**
 * Pantalla de inicio (Home)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, loading } = useAuthContext();

  // Obtener el nombre o correo de forma segura
  const getUserLabel = () => {
    if (!user) return 'Usuario';
    if (user.nombre) {
      return `${user.nombre} ${user.apellido || ''}`.trim();
    }
    return user.email || 'Usuario';
  };

  const quickActions = [
    { title: 'Ver Estudiantes', route: '/students', color: '#3B82F6' },
    { title: 'Mi Perfil', route: '/profile', color: '#10B981' },
    { title: 'Ajustes', route: '/settings', color: '#8B5CF6' },
  ];

  // Esperar a que getAccessToken() lea el localStorage al iniciar
  if (loading) {
    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
  }

  return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              ¡Bienvenido!
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.secondary }]}>
              {getUserLabel()}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Acciones rápidas
          </Text>

          {quickActions.map((action, index) => (
              <TouchableOpacity
                  key={index}
                  style={[styles.actionCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]} />
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});