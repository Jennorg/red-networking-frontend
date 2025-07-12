"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function UnauthorizedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Si está autenticado, redirigir a la página principal
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-300 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Acceso No Autorizado
          </h2>
          <p className="text-gray-300 mb-8">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/Login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </Link>
          
          <div>
            <Link
              href="/Signup"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 