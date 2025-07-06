"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isPublicRoute } from '@/config/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Verificar si la página actual es pública
  const isPublicPage = isPublicRoute(pathname);

  useEffect(() => {
    // Simular verificación de autenticación
    // En un caso real, aquí verificarías el token, sesión, etc.
    const checkAuth = async () => {
      try {
        // Simular delay de verificación
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Por ahora, asumimos que el usuario está autenticado si no está en una página pública
        // En producción, aquí verificarías el token de autenticación
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Determinar si mostrar la navegación
  const shouldShowNavigation = isAuthenticated && !isPublicPage;

  return {
    isAuthenticated,
    isLoading,
    isPublicPage,
    shouldShowNavigation,
    pathname
  };
}; 