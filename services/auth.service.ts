import { apiPost } from '@/utils/api';
import { LoginRequest, LoginResponse, ApiResponse } from '@/types';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/utils/constants';
import { mockLogin } from '@/utils/mockApi';

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiPost<LoginResponse>('/auth/login', {
        email,
        password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      // Store token and user in localStorage
      this.setToken(response.data.token);
      this.setUser(response.data.user);

      return response.data;
    } catch (error) {
      // Fallback to mock API for development
      console.log('[v0] Backend API unavailable, using mock API');
      const loginData = await mockLogin(email, password);
      
      this.setToken(loginData.token);
      this.setUser(loginData.user);

      return {
        token: loginData.token,
        user: loginData.user,
      };
    }
  }

  /**
   * Logout - clear stored credentials
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Set token in localStorage
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  /**
   * Clear token from localStorage
   */
  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Get stored user
   */
  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set user in localStorage
   */
  private setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Clear user from localStorage
   */
  private clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user role
   */
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }
}

export const authService = new AuthService();
