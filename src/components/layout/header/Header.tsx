"use client"

import React from "react";
import Logo from './Logo';
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import AddProjectButton from "./AddProjectButton";
import PerfilBubble from '../../common/PerfilBubble';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  return (
    <header className="relative flex items-center justify-between px-4 py-2 shadow w-full">
      <SidebarTrigger />
      <Logo />
      <SearchBar />
      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Notifications />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="mt-2 bg-white shadow rounded">
                <NavigationMenuLink asChild>
                  <a className="block px-4 py-2 hover:bg-gray-100">Notificación 1</a>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>            
          </NavigationMenuList>          
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <PerfilBubble />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="mt-2 bg-white shadow rounded">
                <NavigationMenuLink asChild>
                  <a className="block px-4 py-2 hover:bg-gray-100">Perfil</a>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <AddProjectButton />
      </div>
    </header>
  );
};

export default Header;
