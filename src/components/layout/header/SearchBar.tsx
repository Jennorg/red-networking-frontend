import React from "react";
import SearchIcon from '/public/icons/search.svg'

const SearchBar = () => {
  return(
    <div className="flex gap-1.5">
      <SearchIcon />
      <input type="search" placeholder="Buscar..."/>
    </div>
  )
}

export default SearchBar;