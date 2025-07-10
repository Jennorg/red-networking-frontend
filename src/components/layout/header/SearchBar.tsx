import React from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return(
    <div className="relative flex items-center">
      <Search className="absolute left-3 text-white size-4" />
      <Input
        className="pl-10 pr-3 text-white bg-gray-700 border-gray-600 rounded-md"
        placeholder="Buscar..."
        type="text"
      />
    </div>
  )
}

export default SearchBar;