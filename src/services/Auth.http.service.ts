import axios from 'axios';
import {LoginRequest} from "../types/LoginRequest.interface.ts";
import {AuthResponse} from "../types/AuthResponse.interface.ts";
import {UserResponse} from "../types/User.interface.ts";

const API_URL = 'http://localhost:3000/api/v1';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/authenticate`, credentials);
    this.setTokens(response.data);
    return response.data;
  }

  async register(userData: any): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
    this.setTokens(response.data);
    return response.data;
  }

  async fetchCurrentUser(): Promise<UserResponse> {
    const response = await axios.get<UserResponse>(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });

    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  async handleOAuthRedirect(): Promise<UserResponse | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refreshToken');

    if (token && refreshToken) {
      this.setTokens({
        accessToken: token,
        refreshToken: refreshToken
      });

      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      return await this.fetchCurrentUser();
    }

    return null;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  initiateGoogleLogin(): void {
    window.location.href = 'http://localhost:3000/oauth2/authorize/google';
  }
}

export default new AuthService();
