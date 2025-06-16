import React from "react";

import Title from "./Title";
import { ProjectCard } from "@/components/card/ProjectCard";

import Star from "/public/icons/star.svg"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Main = () => {
  return (
      <div className="flex flex-col gap-2 sm:gap-5 w-full bg-gray-900 p-10">
      <ProjectCard
        avatarURL="avatar.png"
        name="Ecuanutrition"
        username="EdwardG"              
        showComments={true}
        projectDescription="Plataforma de gestión para productos del mar y camarones, con
            sistema de inventario y ventas."
      ></ProjectCard>
      <ProjectCard
        avatarURL="avatar.png"
        name="Ecuanutrition"
        username="EdwardG"        
        projectDescription="Plataforma de gestión para productos del mar y camarones, con
            sistema de inventario y ventas."
      ></ProjectCard>
      <ProjectCard
        avatarURL="avatar.png"
        name="Ecuanutrition"
        username="EdwardG"
        projectDescription="Plataforma de gestión para productos del mar y camarones, con
            sistema de inventario y ventas."
      ></ProjectCard>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="bg-gray-800 text-white border-2 border-blue-400 hover:bg-blue-400"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="bg-gray-800 text-white border-2 border-blue-400 hover:bg-blue-400"
              href="#"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="bg-gray-800 text-white border-2 border-blue-400 hover:bg-blue-400"
              href="#"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="bg-gray-800 text-white border-2 border-blue-400 hover:bg-blue-400"
              href="#"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="bg-gray-800 text-white border-2 border-blue-400 hover:bg-blue-400"
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Main;