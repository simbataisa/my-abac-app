import api from './api';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserAttributes,
} from '../types/auth';

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private rememberKey = 'auth_remember';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      if (credentials.remember) {
        // If remember me is checked, store in localStorage
        localStorage.setItem(this.tokenKey, response.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
        localStorage.setItem(this.rememberKey, 'true');
      } else {
        // If remember me is not checked, store in sessionStorage
        sessionStorage.setItem(this.tokenKey, response.data.token);
        sessionStorage.setItem(
          this.userKey,
          JSON.stringify(response.data.user)
        );
        // Clear any existing localStorage items
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.rememberKey);
      }

      return response.data;
    } catch (error: any) {
      this.clearAuth();
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if it exists
      await api.post('/auth/logout', {});
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuth();
      // Reset axios default authorization header
      // delete api.defaults.headers.common['Authorization'];
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      // By default, store in sessionStorage for new registrations
      sessionStorage.setItem(this.tokenKey, response.data.token);
      sessionStorage.setItem(this.userKey, JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      this.clearAuth();
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<UserAttributes | null> {
    try {
      // Check localStorage first, then sessionStorage
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await api.get<UserAttributes>('/auth/me');
      return response.data;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', {});
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data.token;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  getToken(): string | null {
    // First check localStorage (for remembered sessions)
    const localToken = localStorage.getItem(this.tokenKey);
    if (localToken) {
      return localToken;
    }

    // Then check sessionStorage (for current session)
    return sessionStorage.getItem(this.tokenKey);
  }

  isRemembered(): boolean {
    return localStorage.getItem(this.rememberKey) === 'true';
  }

  clearAuth(): void {
    // Clear both storages to ensure complete logout
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.rememberKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: UserAttributes): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('An unexpected error occurred');
  }
}

export const authService = new AuthService();
