
/**
 * Servicio de estudiantes con cache LRU
 */

import apiClient from '../api/client';
import { Student } from '../types/student';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

class StudentService {
  private readonly baseUrl = '/api/students';

  private cache = new Map<string, CacheEntry>();

  private pendingRequests = new Map<string, Promise<unknown>>();

  private readonly CACHE_TTL = 5 * 60 * 1000;
  private readonly MAX_CACHE_SIZE = 50;

  // Versión para invalidar respuestas antiguas
  private cacheVersion = 0;

  /**
   * Obtener elemento de caché y actualizar su posición LRU
   */
  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    if (Date.now() - cached.timestamp >= this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    // Mover al final: elemento recientemente utilizado
    this.cache.delete(key);
    this.cache.set(key, cached);

    return cached.data as T;
  }

  /**
   * Guardar elemento respetando el límite LRU
   */
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

  /**
   * Consultar caché y evitar peticiones duplicadas
   */
  private async getCached<T>(
      key: string,
      loader: () => Promise<T>
  ): Promise<T> {
    const cached = this.getCache<T>(key);

    if (cached !== null) {
      return cached;
    }

    const pending = this.pendingRequests.get(key) as
        | Promise<T>
        | undefined;

    if (pending) {
      return pending;
    }

    const version = this.cacheVersion;

    const request = loader()
        .then(data => {
          // No guardar respuestas de una versión anterior
          if (version === this.cacheVersion) {
            this.setCache(key, data);
          }

          return data;
        })
        .finally(() => {
          if (this.pendingRequests.get(key) === request) {
            this.pendingRequests.delete(key);
          }
        });

    this.pendingRequests.set(key, request);

    return request;
  }

  /**
   * Invalidar toda la caché
   */
  private invalidateCache(): void {
    this.cacheVersion++;

    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Obtener todos los estudiantes
   */
  async getAll(): Promise<Student[]> {
    return this.getCached('all-students', async () => {
      const response = await apiClient.get<{ data: Student[] }>(
          this.baseUrl
      );

      return response.data.data;
    });
  }

  /**
   * Obtener estudiante por ID
   */
  async getById(id: number): Promise<Student> {
    return this.getCached(`student-${id}`, async () => {
      const response = await apiClient.get<{ data: Student }>(
          `${this.baseUrl}/${id}`
      );

      return response.data.data;
    });
  }

  /**
   * Crear estudiante
   */
  async create(
      student: Omit<Student, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Student> {
    const response = await apiClient.post<{ data: Student }>(
        this.baseUrl,
        student
    );

    const newStudent = response.data.data;

    this.invalidateCache();

    return newStudent;
  }

  /**
   * Actualizar estudiante
   */
  async update(
      id: number,
      student: Partial<Student>
  ): Promise<Student> {
    const response = await apiClient.put<{ data: Student }>(
        `${this.baseUrl}/${id}`,
        student
    );

    const updatedStudent = response.data.data;

    this.invalidateCache();

    return updatedStudent;
  }

  /**
   * Eliminar estudiante
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);

    this.invalidateCache();
  }

  /**
   * Buscar estudiantes
   */
  async search(query: string): Promise<Student[]> {
    const response = await apiClient.get<{ data: Student[] }>(
        `${this.baseUrl}/search`,
        {
          params: { q: query },
        }
    );

    return response.data.data;
  }
}

export const studentService = new StudentService();
