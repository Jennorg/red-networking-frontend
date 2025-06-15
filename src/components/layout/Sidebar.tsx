"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón de hamburguesa para móviles - ahora cambia de posición */}
      <button
        className={`lg:hidden fixed z-40 p-2 rounded-md bg-gray-800 text-white transition-all duration-100
          ${isOpen ? "left-50 top-4" : "left-2 top-16"}`}
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
          fixed lg:sticky top-0 h-screen transition-transform duration-300 ease-in-out 
          bg-gray-950 border-r border-white/20 z-20
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 w-64
        `}
      >
        <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 text-white">
          {/* Contenido del sidebar */}
          <h2 className="text-xl font-bold px-4 mb-6 flex items-center gap-2">
            <span>Menú Principal</span>
          </h2>

          {/* Items de menú con iconos Lucide */}
          <nav>
            <ul className="space-y-2">
              <MenuItem icon="Home" text="Inicio" />
              <MenuItem icon="User" text="Perfil" />
              <MenuItem icon="Settings" text="Configuración" />
              <MenuItem icon="Bell" text="Notificaciones" />
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

function MenuItem({ icon, text }: { icon: string; text: string }) {
  const IconComponent = require(`lucide-react`)[icon];
  return (
    <li>
      <a
        href="#"
        className="flex items-center px-4 py-2 hover:bg-gray-800 rounded transition-colors gap-3"
      >
        {IconComponent && <IconComponent className="w-5 h-5" />}
        <span>{text}</span>
      </a>
    </li>
  );
}
