import axios, { AxiosInstance, AxiosError } from 'axios';

// URL base configurada desde variable de entorno o fallback a localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Cliente Axios centralizado para conectar con el backend.
 * Incluye interceptores para tokens JWT y manejo uniforme de errores.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para inyectar token de autenticación si existe en localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // El backend respondió con un código de error fuera del rango 2xx
      console.warn(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      // La petición fue enviada pero el backend no respondió (servidor caído o no iniciado)
      console.warn('[API Network Warning]: Backend no alcanzable. Usando fallback local.');
    } else {
      console.error('[API Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
