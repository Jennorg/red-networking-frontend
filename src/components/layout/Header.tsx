"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Bell, ChevronDown, Plus, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex p-2 bg-gray-800 w-full items-center border-b border-gray-600">
      {/* Contenedor para el texto y el buscador */}
      <div className="flex items-center gap-4">
        <p className="text-white text-sm pl-2">
          Universidad Nacional Experimental de Guayana
        </p>
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-white size-4" />
          <Input
            className="pl-10 pr-3 text-white bg-gray-700 border-gray-600 rounded-md"
            placeholder="Buscar..."
            type="text"
          />
        </div>
      </div>

      {/* Contenedor para los elementos del lado derecho */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-white hover:bg-gray-700 p-1 rounded-full">
          <Bell className="size-5" />
        </button>
        <Avatar className="w-8 h-8">
          <AvatarImage src="avatar.png" alt="User avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <button className="text-white hover:bg-gray-700 p-1 rounded-full">
          <Plus className="size-5" />
        </button>
        <button className="text-white hover:bg-gray-700 p-1 rounded-full">
          <ChevronDown className="size-5" />
        </button>
      </div>
    </header>
  );
}
