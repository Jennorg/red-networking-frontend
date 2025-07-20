"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/env";
import Folder from '/public/icons/folder.svg';
import { Loader2, RefreshCw } from "lucide-react";

interface UserProject {
  _id: string;
  title: string;
  // Add other properties as needed
}

const MyProyects = () => {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      setProjects([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        API_ENDPOINTS.USER_PROJECTS(user.id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Extract the projects data - adjust based on actual API response structure
      const projectsData = response.data.proyectos;
      
      // Ensure it's an array and limit to last 3
      const projectsArray = Array.isArray(projectsData) ? projectsData : [];
      const limitedProjects = projectsArray.slice(-3);
      
      setProjects(limitedProjects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      setError("Error al cargar proyectos");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Listen for projects changes from the main component
  useEffect(() => {
    const handleProjectsChange = () => {
      fetchProjects();
    };

    window.addEventListener('projectsChanged', handleProjectsChange);
    
    return () => {
      window.removeEventListener('projectsChanged', handleProjectsChange);
    };
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/Proyecto/${projectId}`);
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  // Debug logs
  console.log('MyProyects - isAuthenticated:', isAuthenticated);
  console.log('MyProyects - user:', user);
  console.log('MyProyects - token:', token);
  console.log('MyProyects - projects:', projects);
  console.log('MyProyects - isLoading:', isLoading);
  console.log('MyProyects - error:', error);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return <div className="text-gray-400 text-sm">No autenticado</div>;
  }

  return (
    <div>
      <div className="flex gap-1 w-full mb-3 items-center justify-between">
        <Link 
          href="/Perfil" 
          className="flex gap-1 items-center hover:text-green-400 transition-colors cursor-pointer"
        >
          <Folder className="fill-amber-400"/>
          <h2 className="text-xl font-semibold">Tus Proyectos</h2>
        </Link>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          title="Actualizar proyectos"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {!isLoading && !error && projects.length === 0 && (
        <div className="text-gray-400 text-sm">
          No tienes proyectos creados
        </div>
      )}
      
      {!isLoading && !error && projects.length > 0 && (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex gap-2 items-center cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors group"
              onClick={() => handleProjectClick(project._id)}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:bg-green-300 transition-colors"></div>
              <p className="font-light text-base truncate hover:text-green-400 transition-colors">
                {project.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProyects;