"use client";

export function Sidebar() {
  return (
    <aside className="h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-gray-950 border-r border-white/20">
      {/* border-white/20 agrega transparencia para mejor integración */}
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 mt-5 text-white">
        ACA VA EL MENU DE LAS OPCIONES
      </div>
    </aside>
  );
}
