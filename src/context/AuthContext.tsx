'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada al cargar la app
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Verificar token real con el backend
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        // Configurar cookie para el middleware
        document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 24 horas
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implementar llamada real al API de login
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Usuario GymTiva',
        email: email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Guardar en localStorage
      localStorage.setItem('auth-token', mockToken);
      localStorage.setItem('user-data', JSON.stringify(mockUser));
      
      // Configurar cookie para middleware
      document.cookie = `auth-token=${mockToken}; path=/; max-age=86400`;
      
      setUser(mockUser);
      
      // Redirigir al dashboard
      window.location.href = '/rutinas';
      
    } catch (error) {
      throw new Error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implementar llamada real al API de registro
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Guardar en localStorage
      localStorage.setItem('auth-token', mockToken);
      localStorage.setItem('user-data', JSON.stringify(mockUser));
      
      // Configurar cookie para middleware
      document.cookie = `auth-token=${mockToken}; path=/; max-age=86400`;
      
      setUser(mockUser);
      
      // Redirigir al dashboard
      window.location.href = '/rutinas';
      
    } catch (error) {
      throw new Error('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpiar datos de autenticación
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    
    // Redirigir al login
    window.location.href = '/auth';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

// Hook para proteger páginas
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth';
    }
  }, [isAuthenticated, isLoading]);
  
  return { isAuthenticated, isLoading };
}