
/**
 * Tipos para el módulo de estudiantes
 */

export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Datos necesarios para crear un estudiante
 */
export type CreateStudentDTO = Omit<
    Student,
    'id' | 'created_at' | 'updated_at'
>;

/**
 * Datos permitidos para actualizar un estudiante
 */
export type UpdateStudentDTO = Partial<CreateStudentDTO>;

/**
 * Respuesta de la API con lista de estudiantes
 */
export interface StudentListResponse {
  data: Student[];
}

/**
 * Respuesta de la API con un estudiante
 */
export interface StudentResponse {
  data: Student;
}
