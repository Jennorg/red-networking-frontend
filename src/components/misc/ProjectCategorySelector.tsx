"use client";

import { LayoutGrid } from "lucide-react";
import { Button } from "../ui/button";

export function ProjectCategorySelector() {
  return (
    <>
      <div className="flex justify-center items-center gap-0 sm:gap-6 bg-gray-800 rounded-sm p-2 sm:p-4">
        <div className="flex justify-center items-center gap-2">
          <Button className="bg-blue-400 ">
            {" "}
            <LayoutGrid className=" size-5 text-white " />
            Todos
          </Button>
        </div>
        <div>
          <Button className="bg-gray-800 text-xs">Javascript</Button>
        </div>
        <div>
          <Button className="bg-gray-800 text-xs">Python</Button>
        </div>
        <div>
          <Button className="bg-gray-800 text-xs">React</Button>
        </div>
        <div>
          <Button className="bg-gray-800 text-xs">Node.js</Button>
        </div>
        <div>
          <Button className="bg-gray-800 text-xs">MongoDB</Button>
        </div>
      </div>
    </>
  );
}
