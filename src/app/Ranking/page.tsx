"use client";
import { useState } from "react";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCategorySelector } from "@/components/misc/ProjectCategorySelector";
import { SmartPagination } from "@/components/ui/smart-pagination";

export default function Ranking() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPages = 3;
  const mockData = [
    {
      _id: "ranking-1",
      title: "Ecuanutrition",
      authors: ["EdwardG"],
      date: "2024-01-01",
      tags: ["web", "management"],
      description: "Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas.",
      repositoryLink: "#",
      tools: ["React", "Node.js"],
      image: "",
      document: "",
      __v: 0,
      position: 1,
      avatarURL: "avatar.png",
      stars: 120,
      views: 200
    },
    {
      _id: "ranking-2",
      title: "Ecuanutrition",
      authors: ["EdwardG"],
      date: "2024-01-01",
      tags: ["web", "management"],
      description: "Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas.",
      repositoryLink: "#",
      tools: ["React", "Node.js"],
      image: "",
      document: "",
      __v: 0,
      position: 2,
      avatarURL: "avatar.png",
      stars: 120,
      views: 200
    },
    {
      _id: "ranking-3",
      title: "Ecuanutrition",
      authors: ["EdwardG"],
      date: "2024-01-01",
      tags: ["web", "management"],
      description: "Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas.",
      repositoryLink: "#",
      tools: ["React", "Node.js"],
      image: "",
      document: "",
      __v: 0,
      position: 3,
      avatarURL: "avatar.png",
      stars: 120,
      views: 200
    }
  ];



  const handlePageChange = (page: number) => {
    // Validate page number before changing
    if (!page || page <= 0 || page > totalPages || page === currentPage) {
      return;
    }
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

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
            {mockData.map((project, index) => (
              <ProjectCard
                key={`${project._id}-${index}`}
                {...project}
              />
            ))}
          </div>

          <div>
            <SmartPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
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
