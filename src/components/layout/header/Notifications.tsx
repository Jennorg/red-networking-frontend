import React from "react";

import { Bell } from "lucide-react";

const Notifications = () => {
  return(
    <button className="text-white hover:bg-gray-700 p-1 rounded-full">
      <Bell className="size-5" />
    </button>
  )
}

export default Notifications