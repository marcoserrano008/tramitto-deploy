import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  role: RoleEnum;
}

export enum RoleEnum {
  APPLICANT = 'APPLICANT',
  ADMINISTRATOR = 'ADMINISTRATOR',
  ARCHIVES_MANAGER = 'ARCHIVES_MANAGER',
  GENERAL_SECRETARY = 'GENERAL_SECRETARY'
}

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

  async fetchCurrentUser(): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    });

    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  async handleOAuthRedirect(): Promise<User | null> {
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



  getCurrentUser(): User | null {
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

  // handleOAuthRedirect(): void {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = urlParams.get('token');
  //   const refreshToken = urlParams.get('refreshToken');
  //
  //   if (token && refreshToken) {
  //     this.setTokens({
  //       accessToken: token,
  //       refreshToken: refreshToken
  //     });
  //
  //     // Clear the URL parameters
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }
}

export default new AuthService();
