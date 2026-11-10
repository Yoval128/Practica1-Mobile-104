
/**
 * Componente de lista de estudiantes
 */

import React, { useState, useMemo, useCallback } from 'react';

import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  RefreshControl,
  ListRenderItem,
} from 'react-native';

import StudentCard from './StudentCard';
import { Student } from '../types/student';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

function StudentList({
                       students,
                       onStudentPress,
                       onRefresh,
                       refreshing = false,
                     }: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar estudiantes
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return students;

    return students.filter(student =>
        student.nombre.toLowerCase().includes(query) ||
        student.apellido.toLowerCase().includes(query) ||
        student.matricula.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // Controlar selección del estudiante
  const handleStudentPress = useCallback(
      (student: Student) => {
        onStudentPress(student);
      },
      [onStudentPress]
  );

  // Renderizar cada estudiante
  const renderStudent: ListRenderItem<Student> = useCallback(
      ({ item }) => (
          <StudentCard
              student={item}
              onPress={() => handleStudentPress(item)}
          />
      ),
      [handleStudentPress]
  );

  // Obtener identificador único
  const keyExtractor = useCallback(
      (item: Student) => item.id.toString(),
      []
  );

  // Componente cuando no hay resultados
  const ListEmpty = useMemo(
      () => (
          <Text style={styles.emptyText}>
            No se encontraron estudiantes
          </Text>
      ),
      []
  );

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, apellido o matrícula..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Buscar estudiantes"
        />

        <FlatList
            data={filteredStudents}
            renderItem={renderStudent}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            refreshControl={
              onRefresh ? (
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={['#3B82F6']}
                  />
              ) : undefined
            }
            ListEmptyComponent={ListEmpty}
        />
      </View>
  );
}

export default React.memo(StudentList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },
});
