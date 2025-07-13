"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCategorySelector } from "@/components/misc/ProjectCategorySelector";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/config/env";

export default function Ranking() {
  const { user, isAuthenticated } = useAuth();
  const [rankingData, setRankingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritedProjects, setFavoritedProjects] = useState<Set<string>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<Set<string>>(new Set());
  const [visualStarCounts, setVisualStarCounts] = useState<{ [key: string]: number }>({});

  const totalPages = 1; 
  
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("https://red-networking-backend.vercel.app/api/ranking");
        const resultado = response.data;

        if (resultado.proceso) {
          const projectsWithStars = resultado.data.map((project: any) => ({
            ...project,
            stars: project.favoritos ?? 0,
          }));
          
          setRankingData(projectsWithStars);
          
          // Inicializar contadores visuales de estrellas con los valores actuales
          const initialStarCounts: { [key: string]: number } = {};
          projectsWithStars.forEach((project: any) => {
            initialStarCounts[project._id] = project.stars || 0;
          });
          setVisualStarCounts(prev => ({ ...prev, ...initialStarCounts }));
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

  // Custom event to notify sidebar of favorites changes
  const notifyFavoritesChange = () => {
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
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

  // Cargar favoritos cuando el componente se monta
  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites]);

 

  const addToFavorites = useCallback(async (projectId: string) => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, cannot add to favorites");
      return;
    }

    setFavoriteLoading(prev => new Set(prev).add(projectId));
    
    try {
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
        // Actualizar inmediatamente el contador visual de estrellas basado en el valor actual
        setVisualStarCounts(prev => ({
          ...prev,
          [projectId]: (prev[projectId] || 0) + 1
        }));
        notifyFavoritesChange(); // Notify sidebar
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
          // Actualizar inmediatamente el contador visual de estrellas basado en el valor actual
          setVisualStarCounts(prev => ({
            ...prev,
            [projectId]: (prev[projectId] || 0) + 1
          }));
          notifyFavoritesChange(); // Notify sidebar
          await fetchUserFavorites();
          return; // Success, exit early
        } catch (secondError) {
          console.log("Alternative endpoint also failed:", secondError);
          throw secondError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error: unknown) {
      console.error("Error adding project to favorites:", error);
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
        // Actualizar inmediatamente el contador visual de estrellas basado en el valor actual
        setVisualStarCounts(prev => ({
          ...prev,
          [projectId]: Math.max(0, (prev[projectId] || 0) - 1)
        }));
        notifyFavoritesChange(); // Notify sidebar
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
          // Actualizar inmediatamente el contador visual de estrellas basado en el valor actual
          setVisualStarCounts(prev => ({
            ...prev,
            [projectId]: Math.max(0, (prev[projectId] || 0) - 1)
          }));
          notifyFavoritesChange(); // Notify sidebar
          await fetchUserFavorites();
          return; // Success, exit early
        } catch (secondError) {
          console.log("Alternative endpoint also failed:", secondError);
          throw secondError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error) {
      console.error("Error removing project from favorites:", error);
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

        {/* <div>
          <ProjectCategorySelector />
        </div> */}

          <div className="flex flex-col gap-2 sm:gap-5">
            {isLoading ? (
              <p className="text-white text-center">Cargando ranking...</p>
            ) : rankingData.length > 0 ? (
              rankingData.map((project: any, index: number) => (
                <ProjectCard
                  key={`${project._id}-${index}`}
                  {...project}
                  stars={visualStarCounts[project._id] ?? project.stars ?? 0}
                  position={index + 1}
                  isFavorited={favoritedProjects.has(project._id)}
                  onToggleFavorite={() => toggleFavorite(project._id)}
                  isFavoriteLoading={favoriteLoading.has(project._id)}
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