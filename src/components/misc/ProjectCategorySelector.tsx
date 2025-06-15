"use client";

import { LayoutGrid } from "lucide-react";
import { Button } from "../ui/button";

export function ProjectCategorySelector() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 bg-gray-800 rounded-sm p-2 sm:p-4">
        <div className="flex justify-center items-center gap-2">
          <Button className="bg-blue-400 ">
            <LayoutGrid className=" size-5 text-white " />
            Todos
          </Button>
        </div>
        <div>
          <Button className="bg-gray-800">Javascript</Button>
        </div>
        <div>
          <Button className="bg-gray-800">Python</Button>
        </div>
        <div>
          <Button className="bg-gray-800">React</Button>
        </div>
        <div>
          <Button className="bg-gray-800">Node.js</Button>
        </div>
        <div>
          <Button className="bg-gray-800">MongoDB</Button>
        </div>
      </div>
    </>
  );
}
