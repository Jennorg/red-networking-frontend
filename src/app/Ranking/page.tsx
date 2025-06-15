"use client";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCategorySelector } from "@/components/misc/ProjectCategorySelector";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export default function Ranking() {
  return (
    <>
      <DashboardLayout>
        <div className=" flex flex-col  h-full w-full gap-5 p-2 sm:p-5 lg:p-10">
          <div className="flex flex-col gap-2">
            <h1 className=" text-sm sm:text-2xl lg:text-4xl font-medium  text-white pl-12 sm:pl-10 lg:pl-0">
              Ranking de Proyectos
            </h1>
            <h2 className="text-xs sm:text-sm font-medium  text-white  pl-12 sm:pl-10 lg:pl-0">
              Los proyectos más populares y destacados de la comunidad
            </h2>
          </div>
          <div>
            <ProjectCategorySelector />
          </div>

          <div className="flex flex-col gap-2 sm:gap-5">
            <ProjectCard
              position={1}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
            <ProjectCard
              position={2}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
            <ProjectCard
              position={3}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
          </div>

          <div>
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
        </div>
      </DashboardLayout>
    </>
  );
}
/*
 <>
      <div className="flex flex-col min-h-screen">
        <div className="w-full">
          <Header></Header>
        </div>
        <div className="flex flex-grow">
          <Sidebar />
          <div className=" flex justify-center items-center h-screen bg-blue-500 flex-grow">
            <h1>This is the container</h1>
          </div>
        </div>
      </div>
    </>
*/
