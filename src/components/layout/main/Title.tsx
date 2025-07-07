import React from "react";

import PerfilBubble from "@/components/common/PerfilBubble";

const Title = () => {
  return (
    <div className="flex">
      <PerfilBubble />
      <div>
        <h2>Titulo Proyecto</h2>
        <p>@Username - Actualizado hace 2 horas</p>
      </div>
    </div>
  )
}

export default Title