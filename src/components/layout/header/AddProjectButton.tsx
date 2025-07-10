import React from "react";
import Add from '/public/icons/add.svg'

const  AddProjectButton = () => {
  return (
    <button className="text-white hover:bg-gray-700 p-1 rounded-full">
      <Add />
    </button>
  )
}

export default AddProjectButton