import React from "react";
import ProyectItem from "./ProyectItem";
import Star from '/public/icons/star.svg'

const MyFavorites = () => {
  return (
    <div>
      <div className="flex gap-1">
        <Star />
        <h2>Favoritos</h2>
      </div>
      <ProyectItem></ProyectItem>
      <ProyectItem></ProyectItem>
    </div>
  )
}

export default MyFavorites;