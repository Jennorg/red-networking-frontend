"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/env";
import Star from '/public/icons/star.svg';
import { Loader2, RefreshCw } from "lucide-react";

interface FavoriteProject {
  _id: string;
  title: string;
  // Add other properties as needed
}

const MyFavorites = () => {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        API_ENDPOINTS.USER_FAVORITES(user.id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the favorites data - adjust based on actual API response structure
      
      const favoritesData = response.data.favoritos;
      console.log(favoritesData);
      // Ensure it's an array and limit to last 3
      const favoritesArray = Array.isArray(favoritesData) ? favoritesData : [];
      const limitedFavorites = favoritesArray.slice(-3);
      
      setFavorites(limitedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Error al cargar favoritos");
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Listen for favorites changes from the main component
  useEffect(() => {
    const handleFavoritesChange = () => {
      fetchFavorites();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, [fetchFavorites]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/Proyecto/${projectId}`);
  };

  const handleRefresh = () => {
    fetchFavorites();
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="flex gap-1 w-full mb-3 items-center justify-between">
        <Link 
          href="/Perfil" 
          className="flex gap-1 items-center hover:text-blue-400 transition-colors cursor-pointer"
        >
          <Star className="fill-amber-400"/>
          <h2 className="text-xl font-semibold">Favoritos</h2>
        </Link>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          title="Actualizar favoritos"
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
      
      {!isLoading && !error && favorites.length === 0 && (
        <div className="text-gray-400 text-sm">
          No tienes proyectos favoritos
        </div>
      )}
      
      {!isLoading && !error && favorites.length > 0 && (
        <div className="space-y-2">
          {favorites.map((project) => (
            <div
              key={project._id}
              className="flex gap-2 items-center cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors group"
              onClick={() => handleProjectClick(project._id)}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors"></div>
              <p className="font-light text-sm truncate hover:text-blue-400 transition-colors">
                {project.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;