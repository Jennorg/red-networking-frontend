import React from "react";
import Open_Folder from "/public/icons/folder_open.svg"

const ProyectItem = () => {
  return (
    <div className="flex gap-1">
      <Open_Folder className="fill-blue-400"/>
      <p className="font-light">Proyecto</p>
    </div>
  ) 
}

export default ProyectItem