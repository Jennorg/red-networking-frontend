"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        
        if (storedToken && storedUserId) {
          setToken(storedToken);
          
          // Intentar cargar datos completos del usuario
          const storedUserData = localStorage.getItem('userData');
          let userData: User;
          
          if (storedUserData) {
            try {
              userData = JSON.parse(storedUserData);
            } catch {
              // Fallback si no se puede parsear
              userData = {
                id: storedUserId,
                email: '',
                name: '',
                role: ''
              };
            }
          } else {
            // Fallback para compatibilidad con versiones anteriores
            userData = {
              id: storedUserId,
              email: '',
              name: '',
              role: ''
            };
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    token,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 