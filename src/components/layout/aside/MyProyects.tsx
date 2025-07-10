import React from "react";
import ProyectItem from "@/components/layout/aside/ProyectItem";
import Folder from "/public/icons/folder.svg"

const MyProyects = () => {
  return(
    <div>
      <div className="flex gap-1">
        <Folder className="fill-amber-400"/>
        <h2 className="text-xl font-semibold">Tus Proyectos</h2>
      </div>
      <ProyectItem />
      <ProyectItem />
      <ProyectItem />
    </div>
  )
}

export default MyProyects