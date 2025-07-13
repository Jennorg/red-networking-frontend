"use client"

import React from "react";
import Logo from './Logo';
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import AddProjectButton from "./AddProjectButton";
import PerfilBubble from "@/components/common/PerfilBubble";
import { useAuth } from "@/contexts/AuthContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // El contexto se encargará de limpiar localStorage
  };

  return (
    <header className="flex p-2 bg-gray-800 w-full items-center border-b border-gray-600">      
      <div className="flex items-center gap-4">
        <Logo />
        <SearchBar />
      </div>
      <div className="flex items-center gap-4 ml-auto">
       
        <Notifications />

        <AddProjectButton />

        {/* Menú de usuario con Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <PerfilBubble />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" side="bottom" className="bg-gray-700 shadow rounded text-white border-0 min-w-[220px] max-w-[90vw] p-0">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-600">
                  <p className="text-sm font-medium">{user.name || user.email}</p>
                  <p className="text-xs text-gray-300 break-all">Usuario ID: {user.id}</p>
                </div>
                <a href="/Perfil" className="block px-4 py-2 hover:bg-gray-600 transition-colors">Perfil</a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <a href="/Login" className="block px-4 py-2 hover:bg-gray-600 transition-colors">Iniciar Sesión</a>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
