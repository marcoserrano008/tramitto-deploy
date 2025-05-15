import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/Auth.http.service.ts";
import {UserResponse} from "../types/User.interface.ts";

interface AuthContextType {
  handleOAuthSuccess: () => Promise<UserResponse | null>;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authService.getCurrentUser();

        if(currentUser) {
          setUser(currentUser);
        } else {
          try {
            const userData = await authService.fetchCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Failed to fetch user data:", error);

            authService.logout();
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await authService.login({ email, password });
      setIsAuthenticated(true);
      let loggedInUser: UserResponse | null = null;

      if (response.user) {
        loggedInUser = response.user;
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(response.user);
      } else {
        loggedInUser = await authService.fetchCurrentUser();
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      }

      return loggedInUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleOAuthSuccess = async () => {
    setIsAuthenticated(true);
    let fetchedUser: UserResponse | null = null;
    try {
      fetchedUser = await authService.fetchCurrentUser();
      setUser(fetchedUser);
      if (fetchedUser) {
        localStorage.setItem("user", JSON.stringify(fetchedUser));
      }
      return fetchedUser;
    } catch (error) {
      console.error("Failed to fetch user data after OAuth:", error);
      // logout if user fetch is critical:
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }
  };

  const value = {
    handleOAuthSuccess,
    loading,
    login,
    logout,
    isAuthenticated,
    setIsAuthenticated,
    user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
