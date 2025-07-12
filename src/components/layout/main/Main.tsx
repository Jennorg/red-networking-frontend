"use client";

import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import { ProjectCard, ProjectCardProps } from "@/components/card/ProjectCard";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { API_ENDPOINTS } from "@/config/env";

interface PaginationData {
  current_page: number;
  data: ProjectCardProps[];
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}

const Main = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());

  const fetchData = async (page: number) => {
    console.log(`Main: fetchData called with page ${page}`);
    if (page <= 0 || !page) return; 
    
    setIsLoading(true);
    try {
      const fullUrl = `${API_ENDPOINTS.PAGINA_PRINCIPAL}?page=${page}`;
      console.log(`Main: Making API call to ${fullUrl}`);
      
      const response = await axios.get(fullUrl);
      const apiResponse: PaginationData = response.data.data;
      console.log(apiResponse)

      console.log(`Main: API response received, setting data`);
      setProjects(apiResponse.data);
      setPaginationInfo(apiResponse);
      setCurrentPage(apiResponse.current_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProjects([]);
      setPaginationInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    console.log(`Main: handlePageChange called with page ${page}`);
    // Validate page number before changing
    if (!page || page <= 0 || !paginationInfo || page > paginationInfo.last_page || page === currentPage) {
      console.log(`Main: Page change validation failed`);
      return;
    }
    console.log(`Main: Setting currentPage to ${page} - this will trigger API call`);
    setCurrentPage(page);
  };

  const toggleComments = (projectId: string) => {
    setVisibleComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-5 w-full bg-gray-900 p-10">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          {...project}
          showComments={visibleComments.has(project._id)}
          onToggleComments={() => toggleComments(project._id)}
        />
      ))}

      <ProjectCard
        _id="static-1"
        avatarURL="avatar.png"
        title="Ecuanutrition"
        authors={["EdwardG"]}
        showComments={visibleComments.has("static-1")}
        onToggleComments={() => toggleComments("static-1")}
        description="Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas."
        repositoryLink="#"
        date="" tags={[]} tools={[]} image="" document="" __v={0}
      />
      <ProjectCard
        _id="static-2"
        avatarURL="avatar.png"
        title="Ecuanutrition"
        authors={["EdwardG"]}
        showComments={visibleComments.has("static-2")}
        onToggleComments={() => toggleComments("static-2")}
        description="Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas."
        repositoryLink="#"
        date="" tags={[]} tools={[]} image="" document="" __v={0}
      />
      <ProjectCard
        _id="static-3"
        avatarURL="avatar.png"
        title="Ecuanutrition"
        authors={["EdwardG"]}
        showComments={visibleComments.has("static-3")}
        onToggleComments={() => toggleComments("static-3")}
        description="Plataforma de gestión para productos del mar y camarones, con sistema de inventario y ventas."
        repositoryLink="#"
        date="" tags={[]} tools={[]} image="" document="" __v={0}
      />

      {paginationInfo && (
        <SmartPagination
          currentPage={currentPage}
          totalPages={paginationInfo.last_page}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Main;