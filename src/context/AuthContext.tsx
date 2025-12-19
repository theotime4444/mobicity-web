// Context d'authentification

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../API/client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      apiClient.setAuthToken(storedToken);
    }
    return storedToken;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Utiliser apiClient pour bénéficier du proxy Vite en dev
      // En dev : utilise le proxy Vite (/v1 -> localhost:3001)
      // En prod : utilise l'URL complète
      const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
      const endpoint = '/v1/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = response.status === 401 
          ? 'Nom d\'utilisateur ou mot de passe incorrect'
          : 'Erreur lors de la connexion';
        console.error(`[ERROR][AUTH][LOGIN] HTTP ${response.status} – ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const authToken = data.token || data.accessToken || 'mock_token';
      
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      apiClient.setAuthToken(authToken);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error && !error.message.includes('HTTP')) {
        // Erreur réseau ou autre erreur non-HTTP
        console.error(`[ERROR][AUTH][LOGIN] – ${error.message}`);
      }
      throw error;
    }
    setLoading(false);
  };

  const logout = (): void => {
    localStorage.removeItem('auth_token');
    setToken(null);
    apiClient.setAuthToken(null);
  };

  useEffect(() => {
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.setAuthToken(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

