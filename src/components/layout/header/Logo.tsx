import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image 
        src="/pngs/uneg.png" 
        alt="Uneg Logo" 
        width={60}
        height={60}
        className="w-15 p-2"
      />
    </>
  )
}

export default Logo;