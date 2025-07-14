"use client";

import React from "react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

import { ProjectCard, ProjectCardProps } from "@/components/card/ProjectCard";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { API_ENDPOINTS } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedRequest } from "@/hooks/useAuthenticatedRequest";
import { toast } from "sonner";

interface PaginationData {
  current_page: number;
  data: ProjectCardProps[];
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}

// Define la interfaz del backend para evitar errores de tipo
interface BackendProject {
  favoritos: number;
  [key: string]: any;
}

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const { post, delete: del } = useAuthenticatedRequest();
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());
  const [favoritedProjects, setFavoritedProjects] = useState<Set<string>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<Set<string>>(new Set());

  // Custom event to notify sidebar of favorites changes
  const notifyFavoritesChange = () => {
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  // Custom event to notify sidebar of projects changes
  const notifyProjectsChange = () => {
    window.dispatchEvent(new CustomEvent('projectsChanged'));
  };

  // Función para obtener los favoritos del usuario
  const fetchUserFavorites = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFavoritedProjects(new Set());
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.USER_FAVORITES(user.id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extraer los IDs de los proyectos favoritos
      const favoritesData = response.data.favoritos || response.data || [];
      const favoriteIds = Array.isArray(favoritesData) 
        ? favoritesData.map((fav: any) => fav._id || fav.id || fav)
        : [];
      
      console.log('User favorites:', favoriteIds);
      setFavoritedProjects(new Set(favoriteIds));
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      setFavoritedProjects(new Set());
    }
  }, [isAuthenticated, user]);

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
      setProjects(
        apiResponse.data .map(project => ({
          ...project,
          stars: project.favoritos ?? 0,
        })) as ProjectCardProps[]
      );
      console.log(apiResponse.data); 
      setPaginationInfo(apiResponse);
      setCurrentPage(apiResponse.current_page);
      notifyProjectsChange(); // Notify sidebar of projects update
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setProjects([]);
      setPaginationInfo(null);
      toast.error("Error al cargar los proyectos");
    } finally {
      setIsLoading(false);
    }
  };

  // Elimino fetchUserFavorites y los useEffect relacionados
  // Elimino las llamadas a fetchUserFavorites en addToFavorites y removeFromFavorites
  // Mantengo solo el manejo local de favoritos

  const addToFavorites = useCallback(async (projectId: string) => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, cannot add to favorites");
      return;
    }

    setFavoriteLoading(prev => new Set(prev).add(projectId));
    
    try {
      console.log("Adding to favorites - User ID:", user.id, "Project ID:", projectId);
      console.log("API URL:", API_ENDPOINTS.USER_FAVORITE_PROJECT(user.id, projectId));
      console.log("User object:", user);
      console.log("Token available:", !!localStorage.getItem('token'));
      
      const token = localStorage.getItem('token');
      
      // Try the first endpoint structure
      try {
        const response = await axios.post(
          API_ENDPOINTS.USER_FAVORITE_PROJECT(user.id, projectId),
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Project added to favorites:", response.data);
        setFavoritedProjects(prev => new Set(prev).add(projectId));
        notifyFavoritesChange(); // Notify sidebar
        // Actualizar la lista de favoritos desde el backend
        await fetchUserFavorites();
        
        return; // Success, exit early
      } catch (firstError) {
        console.log("First endpoint failed, trying alternative:", firstError);
        
        // Try alternative endpoint structure
        try {
          const response = await axios.post(
            API_ENDPOINTS.FAVORITE_PROJECT_ALT(projectId),
            { userId: user.id },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log("Project added to favorites (alternative):", response.data);
          setFavoritedProjects(prev => new Set(prev).add(projectId));
          notifyFavoritesChange(); // Notify sidebar
          // Actualizar la lista de favoritos desde el backend
          await fetchUserFavorites();
          
          return; // Success, exit early
        } catch (secondError) {
          console.log("Alternative endpoint also failed:", secondError);
          throw secondError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error: unknown) {
      console.error("Error adding project to favorites:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error("Response status:", axiosError.response?.status);
        console.error("Response data:", axiosError.response?.data);
        console.error("Response headers:", axiosError.response?.headers);
        console.error("Request URL:", axiosError.config?.url);
        console.error("Request method:", axiosError.config?.method);
        console.error("Request headers:", axiosError.config?.headers);
      }
      toast.error("Error al agregar a favoritos");
    } finally {
      setFavoriteLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  }, [isAuthenticated, user, fetchUserFavorites]);

  const removeFromFavorites = useCallback(async (projectId: string) => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, cannot remove from favorites");
      return;
    }

    setFavoriteLoading(prev => new Set(prev).add(projectId));
    
    try {
      const token = localStorage.getItem('token');
      
      // Try the first endpoint structure
      try {
        const response = await axios.delete(
          API_ENDPOINTS.USER_FAVORITE_PROJECT(user.id, projectId),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Project removed from favorites:", response.data);
        setFavoritedProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
        notifyFavoritesChange(); // Notify sidebar
        // Actualizar la lista de favoritos desde el backend
        await fetchUserFavorites();
        
        return; // Success, exit early
      } catch (firstError) {
        console.log("First endpoint failed, trying alternative:", firstError);
        
        // Try alternative endpoint structure
        try {
          const response = await axios.delete(
            API_ENDPOINTS.FAVORITE_PROJECT_ALT(projectId),
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              data: { userId: user.id }
            }
          );
          
          console.log("Project removed from favorites (alternative):", response.data);
          setFavoritedProjects(prev => {
            const newSet = new Set(prev);
            newSet.delete(projectId);
            return newSet;
          });
          notifyFavoritesChange(); // Notify sidebar
          // Actualizar la lista de favoritos desde el backend
          await fetchUserFavorites();
          
          return; // Success, exit early
        } catch (secondError) {
          console.log("Alternative endpoint also failed:", secondError);
          throw secondError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error) {
      console.error("Error removing project from favorites:", error);
      toast.error("Error al quitar de favoritos");
    } finally {
      setFavoriteLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  }, [isAuthenticated, user, fetchUserFavorites]);

  const toggleFavorite = useCallback((projectId: string) => {
    if (!isAuthenticated) {
      console.log("User not authenticated, cannot toggle favorite");
      return;
    }

    if (favoritedProjects.has(projectId)) {
      removeFromFavorites(projectId);
    } else {
      addToFavorites(projectId);
    }
  }, [isAuthenticated, favoritedProjects, addToFavorites, removeFromFavorites]);

  // useEffect(() => {
  //   fetchUserFavorites();
  // }, [fetchUserFavorites]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites]);

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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Cargando proyectos...</p>
          </div>
        </div>
      ) : (
        <>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              {...project}
              showComments={visibleComments.has(project._id)}
              onToggleComments={() => toggleComments(project._id)}
              isFavorited={favoritedProjects.has(project._id)}
              onToggleFavorite={() => toggleFavorite(project._id)}
              isFavoriteLoading={favoriteLoading.has(project._id)}
            />
          ))}

          {paginationInfo && (
            <SmartPagination
              currentPage={currentPage}
              totalPages={paginationInfo.last_page}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Main;