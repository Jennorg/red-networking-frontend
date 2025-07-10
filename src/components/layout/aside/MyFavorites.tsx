import React from "react";
import ProyectItem from "./ProyectItem";
import Star from '/public/icons/star.svg'

const MyFavorites = () => {
  return (
    <div className="mt-3">
      <div className="flex gap-1 w-full">
        <Star className="fill-amber-400"/>
        <h2 className="text-xl font-semibold">Favoritos</h2>
      </div>
      <ProyectItem></ProyectItem>
      <ProyectItem></ProyectItem>
    </div>
  )
}

export default MyFavorites;