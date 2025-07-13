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

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="!bg-gray-800 hover:!bg-gray-700 active:!bg-gray-700 focus:!bg-gray-700 text-white">
              <PerfilBubble />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!bg-gray-700 shadow rounded text-white border-0">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    <p className="text-xs text-gray-300">Usuario ID: {user.id}</p>
                  </div>
                  <NavigationMenuLink asChild className="hover:!bg-gray-700 active:!bg-gray-700 focus:!bg-gray-700 hover:text-white">
                    <a href="/Perfil" className="block px-4 py-2 hover:text-white">Perfil</a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild className="hover:!bg-gray-700 active:!bg-gray-700 focus:!bg-gray-700 hover:text-white">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:text-white"
                    >
                      Cerrar Sesión
                    </button>
                  </NavigationMenuLink>
                </>
              ) : (
                <NavigationMenuLink asChild className="hover:!bg-gray-700 active:!bg-gray-700 focus:!bg-gray-700 hover:text-white">
                  <a href="/Login" className="block px-4 py-2 hover:text-white">Iniciar Sesión</a>
                </NavigationMenuLink>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
