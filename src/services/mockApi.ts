import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserAttributes,
} from '../types/auth';
import { mockUsers } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApi {
  private users: typeof mockUsers = [...mockUsers];

  async post<T>(url: string, data: any): Promise<{ data: T }> {
    // Simulate network delay
    await delay(500);

    switch (url) {
      case '/auth/login':
        return { data: (await this.handleLogin(data)) as T };
      case '/auth/register':
        return { data: (await this.handleRegister(data)) as T };
      case '/auth/logout':
        return { data: (await this.handleLogout()) as T };
      default:
        throw new Error(`Unhandled endpoint: ${url}`);
    }
  }

  async get<T>(url: string): Promise<{ data: T }> {
    await delay(500);

    switch (url) {
      case '/auth/me':
        return { data: (await this.handleGetCurrentUser()) as T };
      default:
        throw new Error(`Unhandled endpoint: ${url}`);
    }
  }

  private async handleLogin(
    credentials: LoginCredentials
  ): Promise<AuthResponse> {
    // Check if this is an auto-login attempt (with token)
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (
      credentials.remember &&
      !credentials.password &&
      storedToken &&
      storedUser
    ) {
      // Validate token and return stored user
      try {
        const user = JSON.parse(storedUser);
        return {
          token: storedToken,
          user,
        };
      } catch (error) {
        throw new Error('Invalid stored credentials');
      }
    }

    // Regular login
    const user = this.users.find(u => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = `token-${user.id}-${Date.now()}`;

    // Store credentials if remember is true
    if (credentials.remember) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('auth_remember', 'true');
    } else {
      // Use session storage for non-remembered login
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      // Clear any existing localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_remember');
    }

    return {
      token,
      user: userWithoutPassword,
    };
  }

  private async handleRegister(data: RegisterData): Promise<AuthResponse> {
    if (this.users.some(u => u.email === data.email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
      department: data.department || 'General',
      clearanceLevel: 1,
      region: 'Global',
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const token = btoa(`token-${newUser.id}-${Date.now()}`);

    return {
      token,
      user: userWithoutPassword,
    };
  }

  private async handleLogout(): Promise<void> {
    // Simulate successful logout
    return;
  }

  private async handleGetCurrentUser(): Promise<UserAttributes> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract user ID from token (in real app, would decode JWT)
    const match = token.match(/token-(\d+)-/);
    if (!match) {
      throw new Error('Invalid token');
    }

    const userId = parseInt(match[1], 10);
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const mockApi = new MockApi();
