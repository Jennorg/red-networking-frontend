import type { Metadata } from "next";
"use client";
export const metadata: Metadata = {
  title: "Ranking - Red Networking",
  description: "Ranking de proyectos en Red Networking",
  icons: {
    icon: "/favicon.svg",
  },
};


import { useState } from "react";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCategorySelector } from "@/components/misc/ProjectCategorySelector";
import { SmartPagination } from "@/components/ui/smart-pagination";

export default function Ranking() {
  const [rankingData, setRankingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 

  const totalPages = 1; 
  
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("https://red-networking-backend.vercel.app/api/ranking");
        const resultado = response.data;

        if (resultado.proceso) {
          setRankingData(resultado.data);
        } else {
          console.error("Error al obtener ranking:", resultado.message);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

 

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
    <DashboardLayout>
      <div className="flex flex-col h-full w-full gap-5 p-2 sm:p-5 lg:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm sm:text-2xl lg:text-4xl font-medium text-white pl-12 sm:pl-10 lg:pl-0">
            Ranking de Proyectos
          </h1>
          <h2 className="text-xs sm:text-sm font-medium text-white pl-12 sm:pl-10 lg:pl-0">
            Los proyectos más populares y destacados de la comunidad
          </h2>
        </div>

        <div>
          <ProjectCategorySelector />
        </div>

          <div className="flex flex-col gap-2 sm:gap-5">
            {isLoading ? (
              <p className="text-white text-center">Cargando ranking...</p>
            ) : rankingData.length > 0 ? (
              rankingData.map((project: any, index: number) => (
                <ProjectCard
                  key={`${project._id}-${index}`}
                  {...project}
                  position={index + 1}
                />
              ))
            ) : (
              <p className="text-white text-center">No hay proyectos en el ranking.</p>
            )}
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
    );
}