"use client"

import React from "react";
import Logo from './Logo';
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import AddProjectButton from "./AddProjectButton";
import PerfilBubble from "@/components/common/PerfilBubble";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";


const Header = () => {
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
              <NavigationMenuLink asChild className="hover:!bg-gray-700 active:!bg-gray-700 focus:!bg-gray-700 hover:text-white">
                <a className="block px-4 py-2 hover:text-white">Perfil</a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
