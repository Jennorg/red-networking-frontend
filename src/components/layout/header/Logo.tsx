import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image 
        src="/pngs/uneg.png" 
        alt="Uneg Logo" 
        width={60}
        height={60}
        className="w-15 p-2 cursor-pointer"
      />
    </Link>
  )
}

export default Logo;