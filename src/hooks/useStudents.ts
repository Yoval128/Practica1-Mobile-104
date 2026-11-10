
/**
 * Hook personalizado para manejar la lista de estudiantes
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { studentService } from '../services/studentService';
import { Student } from '../types/student';

interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

interface UseStudentsReturn extends UseStudentsState {
  refresh: () => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export function useStudents(): UseStudentsReturn {
  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: true,
    error: null,
  });

  // Control de montaje del hook
  const isMountedRef = useRef(false);

  // Identificador para descartar peticiones antiguas
  const requestIdRef = useRef(0);

  // Estudiantes con eliminación pendiente
  const pendingDeletesRef = useRef(new Set<number>());

  /**
   * Obtener estudiantes
   */
  const fetchStudents = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    const requestId = ++requestIdRef.current;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const students = await studentService.getAll();

      // Ignorar respuestas obsoletas o posteriores al desmontaje
      if (
          !isMountedRef.current ||
          requestId !== requestIdRef.current
      ) {
        return;
      }

      // No recuperar estudiantes que están siendo eliminados
      const filteredStudents = students.filter(
          student => !pendingDeletesRef.current.has(student.id)
      );

      setState({
        students: filteredStudents,
        loading: false,
        error: null,
      });
    } catch {
      if (
          !isMountedRef.current ||
          requestId !== requestIdRef.current
      ) {
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estudiantes',
      }));
    }
  }, []);

  /**
   * Eliminar estudiante con actualización optimista
   */
  const deleteStudent = useCallback(async (id: number): Promise<void> => {
    if (
        !isMountedRef.current ||
        pendingDeletesRef.current.has(id)
    ) {
      return;
    }

    const originalIndex = state.students.findIndex(
        student => student.id === id
    );

    if (originalIndex === -1) return;

    const deletedStudent = state.students[originalIndex];

    // Invalidar consultas anteriores
    requestIdRef.current += 1;

    // Registrar eliminación pendiente
    pendingDeletesRef.current.add(id);

    // Actualización optimista
    setState(prev => ({
      ...prev,
      students: prev.students.filter(student => student.id !== id),
      error: null,
    }));

    try {
      await studentService.delete(id);

      // La operación del servidor terminó.
      // No actualizar el estado si el hook se desmontó.
      if (!isMountedRef.current) return;

      pendingDeletesRef.current.delete(id);
    } catch {
      pendingDeletesRef.current.delete(id);

      if (!isMountedRef.current) return;

      // Restaurar estudiante sin generar duplicados
      setState(prev => {
        const alreadyExists = prev.students.some(
            student => student.id === id
        );

        if (alreadyExists) {
          return {
            ...prev,
            error: 'Error al eliminar estudiante',
          };
        }

        const restoredStudents = [...prev.students];

        restoredStudents.splice(
            Math.min(originalIndex, restoredStudents.length),
            0,
            deletedStudent
        );

        return {
          ...prev,
          students: restoredStudents,
          error: 'Error al eliminar estudiante',
        };
      });
    }
  }, [state.students]);

  /**
   * Cargar estudiantes al montar el hook
   */
  useEffect(() => {
    isMountedRef.current = true;

    fetchStudents();

    return () => {
      isMountedRef.current = false;

      // Invalidar cualquier petición pendiente
      requestIdRef.current += 1;
    };
  }, [fetchStudents]);

  return {
    ...state,
    refresh: fetchStudents,
    deleteStudent,
  };
}
