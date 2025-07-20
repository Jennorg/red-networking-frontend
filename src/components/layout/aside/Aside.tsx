"use client";

import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MyFavorites from "./MyFavorites";
import MyProyects from "./MyProyects";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón de hamburguesa para móviles - ahora cambia de posición */}
      <button
        className={`lg:hidden fixed z-40 p-2 rounded-md bg-gray-800 text-white transition-all duration-100
          ${isOpen ? "left-50 top-4" : "left-4 top-16"}`}
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 transition-transform duration-300 ease-in-out 
          bg-gray-800 border-r border-white/20 z-20 h-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 w-64 
        `}
      >
        <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 text-white">
          {/* Contenido del sidebar */}
          <MyProyects />
          <MyFavorites />
          


          {/* Bloque de información del usuario */}
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Información del Usuario</span>
              </div>
              
              {isAuthenticated && user ? (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">Email:</span>
                    <span className="text-xs text-white font-medium truncate ml-2">
                      {user.email || 'No especificado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">Nombre:</span>
                    <span className="text-xs text-white font-medium truncate ml-2">
                      {user.name || 'No especificado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">Rol:</span>
                    <span className="text-xs text-blue-400 font-medium capitalize">
                      {user.role || 'estudiante'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">ID:</span>
                    <span className="text-xs text-gray-400 font-mono truncate ml-2">
                      {user.id}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  {isAuthenticated ? 'Cargando información...' : 'No autenticado'}
                </div>
              )}
            </div>
          </div>
          
          
        </div>
      </aside>
    </>
  );
}

export default Aside;