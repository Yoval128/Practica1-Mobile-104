
/**
 * Pantalla de lista de estudiantes
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useStudents } from '../hooks/useStudents';
import StudentList from '../components/StudentList';
import { ErrorMessage, Loading } from '../components';
import { Student } from '../types/student';

export default function StudentsScreen() {
    const router = useRouter();

    const { students, loading, error, refresh } = useStudents();

    const [refreshing, setRefreshing] = useState(false);

    // Navegación al detalle del estudiante
    const handleStudentPress = useCallback(
        (student: Student) => {
            router.push(`/student/${student.id}`);
        },
        [router]
    );

    // Actualizar lista de estudiantes
    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            await refresh();
        } finally {
            setRefreshing(false);
        }
    }, [refresh]);

    if (loading && !refreshing) {
        return <Loading message="Cargando estudiantes..." />;
    }

    // Mantener la lista visible si falla una actualización
    if (error && students.length === 0) {
        return (
            <ErrorMessage
                error={error}
                onRetry={refresh}
            />
        );
    }

    return (
        <View style={styles.container}>
            <StudentList
                students={students}
                onStudentPress={handleStudentPress}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
});
