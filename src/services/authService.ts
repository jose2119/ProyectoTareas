import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { User } from '../types';

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterData {
  nombre_usuario: string;
  nombre_completo: string;
  correo: string;
  password: string;
  zona_horaria?: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

const TOKEN_KEY = 'taskflow_token';
const USER_KEY = 'taskflow_user';

export const authService = {
  /**
   * Inicia sesión en el backend.
   * POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  /**
   * Registra un nuevo usuario en el backend.
   * POST /api/auth/register
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const payload = {
      ...data,
      zona_horaria: data.zona_horaria || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Lima',
    };
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  /**
   * Obtiene los datos del usuario autenticado actual.
   * GET /api/auth/me
   */
  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const response = await apiClient.get<{ usuario: User }>(ENDPOINTS.AUTH.ME);
      const user = response.data.usuario || (response.data as unknown as User);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      return this.getCurrentUser();
    }
  },

  /**
   * Cierra sesión y elimina tokens guardados.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
