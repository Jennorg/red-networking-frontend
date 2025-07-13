"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedRequest } from "@/hooks/useAuthenticatedRequest";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Tipos
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  createdAt: string;
  role?: string;
}

interface UserStats {
  projectsCreated: number;
  projectsLiked: number;
  totalViews: number;
  averageRating: number;
  memberSince: string;
}

interface UserProject {
  _id: string;
  title: string;
  description: string;
  tools: string[];
  views: number;
  stars: number;
  rating: number;
  repositoryLink: string;
}

export default function Perfil() {
  const { user, isAuthenticated } = useAuth();
  const { get, put } = useAuthenticatedRequest();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [projectRatings, setProjectRatings] = useState<{ [key: string]: number | null }>({});
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    role: ''
  });

  // Cargar datos del perfil usando endpoints existentes
  const loadProfileData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Obtener datos del usuario usando el endpoint correcto
      const userResponse = await axios.get(`https://red-networking-backend.vercel.app/api/getUser/${user.id}`);
      const userData = userResponse.data;
      
      if (userData) {
        setUserProfile({
          _id: userData._id || user.id,
          name: userData.name || user.name || '',
          email: userData.email || user.email || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          github: userData.github || '',
          createdAt: userData.createdAt || new Date().toISOString(),
          role: userData.role || 'estudiante'
        });
      } else {
        // Usar datos del contexto como fallback
        setUserProfile({
          _id: user.id,
          name: user.name || '',
          email: user.email || '',
          bio: '',
          location: '',
          website: '',
          github: '',
          createdAt: new Date().toISOString(),
          role: 'estudiante'
        });
      }
      
      // Obtener proyectos del usuario usando el endpoint correcto
      let userProjects = [];
      try {
        const projectsResponse = await axios.get(`https://red-networking-backend.vercel.app/api/usuario_projects/${user.id}`);
        let rawData = projectsResponse.data;
        
        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(rawData)) {
          userProjects = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          userProjects = rawData.data;
        } else if (rawData && Array.isArray(rawData.projects)) {
          userProjects = rawData.projects;
        } else if (rawData && Array.isArray(rawData.proyectos)) {
          userProjects = rawData.proyectos;
        } else if (rawData && Array.isArray(rawData.results)) {
          userProjects = rawData.results;
        } else {
          userProjects = [];
        }
        
        if (userProjects.length === 0) {
          // Intentar método alternativo: obtener todos los proyectos y filtrar
          const allProjectsResponse = await axios.get('https://red-networking-backend.vercel.app/api/pagina_principal');
          const allProjectsData = allProjectsResponse.data?.data?.data || allProjectsResponse.data?.data || allProjectsResponse.data?.proyectos || allProjectsResponse.data || [];
          
          // Filtrar proyectos del usuario actual
          userProjects = allProjectsData.filter((project: any) => 
            project.authors && project.authors.includes(user.id)
          );
        }
        
        // Asegurar que userProjects sea un array antes de hacer map
        if (!Array.isArray(userProjects)) {
          userProjects = [];
        }
        
        setUserProjects(userProjects.map((project: any) => ({
          _id: project._id || project.id,
          title: project.title,
          description: project.description || 'Sin descripción disponible',
          tools: project.tools || [],
          views: project.views || 0,
          stars: project.stars || 0,
          rating: project.rating || 0,
          repositoryLink: project.repositoryLink || ''
        })));
      } catch (error: any) {
        console.error('Error obteniendo proyectos del usuario:', error);
        
        // Intentar método alternativo si falla el endpoint específico
        try {
          const allProjectsResponse = await axios.get('https://red-networking-backend.vercel.app/api/pagina_principal');
          const allProjectsData = allProjectsResponse.data?.data?.data || allProjectsResponse.data?.data || allProjectsResponse.data?.proyectos || allProjectsResponse.data || [];
          
          userProjects = allProjectsData.filter((project: any) => 
            project.authors && project.authors.includes(user.id)
          );
          
          // Asegurar que userProjects sea un array antes de hacer map
          if (!Array.isArray(userProjects)) {
            userProjects = [];
          }
          
          setUserProjects(userProjects.map((project: any) => ({
            _id: project._id || project.id,
            title: project.title,
            description: project.description || 'Sin descripción disponible',
            tools: project.tools || [],
            views: project.views || 0,
            stars: project.stars || 0,
            rating: project.rating || 0,
            repositoryLink: project.repositoryLink || ''
          })));
        } catch (altError: any) {
          console.error('Error en método alternativo:', altError);
          setUserProjects([]);
        }
      }
      
      // Calcular estadísticas básicas con los datos reales
      const projectsCount = userProjects.length;
      const totalViews = userProjects.reduce((sum: number, project: any) => sum + (project.views || 0), 0);
      
      setUserStats({
        projectsCreated: projectsCount,
        projectsLiked: 0, // No hay endpoint para likes
        totalViews: totalViews,
        averageRating: 0, // No hay rating en el modelo actual
        memberSince: new Date().getFullYear().toString()
      });
      
      // Actualizar formulario de edición
      setEditForm({
        name: userData?.name || user.name || '',
        email: userData?.email || user.email || '',
        bio: userData?.bio || '',
        location: userData?.location || '',
        website: userData?.website || '',
        github: userData?.github || '',
        role: userData?.role || 'estudiante'
      });
      
    } catch (error) {
      console.error('Error cargando datos del perfil:', error);
      toast.error('Error al cargar los datos del perfil');
      
      // Usar datos del contexto como fallback
      setUserProfile({
        _id: user.id,
        name: user.name || '',
        email: user.email || '',
        bio: '',
        location: '',
        website: '',
        github: '',
        createdAt: new Date().toISOString()
      });
      
      setUserStats({
        projectsCreated: 0,
        projectsLiked: 0,
        totalViews: 0,
        averageRating: 0,
        memberSince: new Date().getFullYear().toString()
      });
      
      setUserProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadProfileData();
    }
  }, [isAuthenticated, user?.id]);

  // Obtener ratings reales de los proyectos
  useEffect(() => {
    const fetchRatings = async () => {
      const ratings: { [key: string]: number | null } = {};
      await Promise.all(userProjects.map(async (project) => {
        try {
          const res = await axios.get(`https://red-networking-backend.vercel.app/api/projects/evaluacion/promedio/${project._id}`);
          const avg = res.data?.promedio;
          ratings[project._id] = typeof avg === 'number' ? avg : null;
        } catch {
          ratings[project._id] = null;
        }
      }));
      setProjectRatings(ratings);
    };
    if (userProjects.length > 0) fetchRatings();
  }, [userProjects]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      // Por ahora, solo actualizar el estado local
      // En el futuro, cuando tengas endpoints de perfil, aquí iría la llamada al backend
      setUserProfile(prev => prev ? {
        ...prev,
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        github: editForm.github
      } : null);
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      bio: userProfile?.bio || '',
      location: userProfile?.location || '',
      website: userProfile?.website || '',
      github: userProfile?.github || '',
      role: userProfile?.role || 'estudiante'
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/Proyecto/${projectId}`);
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <Badge className="bg-red-900/80 text-red-300 border-red-700 px-3 py-1 text-xs font-medium shadow-sm">
            👑 Administrador
          </Badge>
        );
      case 'profesor':
      case 'professor':
        return (
          <Badge className="bg-purple-900/80 text-purple-300 border-purple-700 px-3 py-1 text-xs font-medium shadow-sm">
            🎓 Profesor
          </Badge>
        );
      case 'estudiante':
      case 'student':
      default:
        return (
          <Badge className="bg-blue-900/80 text-blue-300 border-blue-700 px-3 py-1 text-xs font-medium shadow-sm">
            📚 Estudiante
          </Badge>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Acceso Requerido</h2>
            <p className="text-gray-400">Debes iniciar sesión para ver tu perfil</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div>
      <h1>Perfil</h1>
    </div>
  );
}
