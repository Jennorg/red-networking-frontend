"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import RoleChangeButton from "@/components/admin/RoleChangeButton";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedRequest } from "@/hooks/useAuthenticatedRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Star, 
  Eye, 
  Heart, 
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  BookOpen,
  Code,
  Award,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

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
  rating: number | null;
  repositoryLink?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  website?: string;
  github?: string;
  avatar?: string;
  createdAt: string;
  role?: string; // Agregar campo de rol
}

export default function Perfil() {
  const { user, isAuthenticated } = useAuth();
  const { get, put } = useAuthenticatedRequest();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
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
    website: '',
    github: '',
    role: ''
  });

  // Determinar qué usuario mostrar
  const userIdToShow = targetUserId || user?.id;
  const isOwnProfile = !targetUserId || targetUserId === user?.id;

  // Cargar datos del perfil usando endpoints existentes
  const loadProfileData = async () => {
    if (!userIdToShow) return;
    
    console.log('Loading profile data for userId:', userIdToShow);
    setIsLoading(true);
    try {
      // Obtener datos del usuario usando el endpoint correcto
      const userResponse = await axios.get(`https://red-networking-backend.vercel.app/api/getUser/${userIdToShow}`);
      console.log('User response:', userResponse.data);
      const userData = userResponse.data.user || userResponse.data; // Acceder al objeto 'user' dentro de la respuesta
      console.log('Processed userData:', userData);
      console.log('User role from database:', userData?.role || userData?.rol);
      console.log('GitHub data from database:', userData?.github);
      console.log('Website data from database:', userData?.website);
      console.log('User links array:', userData?.links);
      console.log('User bio from database:', userData?.bio);
      
      if (userData) {
        // Extraer GitHub y Website del array de links si existe
        let githubLink = '';
        let websiteLink = '';
        
        if (userData.links && Array.isArray(userData.links)) {
          // Extraer sitio web (posición 0)
          if (userData.links[0] && userData.links[0] !== '') {
            websiteLink = userData.links[0];
          }
          
          // Extraer GitHub (posición 1 o construir desde posición 2)
          const githubLinkItem = userData.links.find((link: string) => 
            link && (link.includes('github.com') || link.startsWith('https://github.com'))
          );
          if (githubLinkItem) {
            githubLink = githubLinkItem;
          } else if (userData.links[2] && userData.links[2] !== '') {
            // Si no hay link de GitHub pero hay un username en la posición 2
            githubLink = `https://github.com/${userData.links[2]}`;
          }
        }
        
        console.log('Processed GitHub link:', githubLink);
        console.log('Processed Website link:', websiteLink);
        
        setUserProfile({
          _id: userData._id || userIdToShow,
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          website: websiteLink,
          github: githubLink,
          createdAt: userData.createdAt || new Date().toISOString(),
          role: userData.role || userData.rol || 'estudiante' // Intentar ambos campos de rol
        });
      } else {
        console.log('No userData found, isOwnProfile:', isOwnProfile);
        // Usar datos del contexto como fallback solo si es el propio perfil
        if (isOwnProfile) {
                  setUserProfile({
          _id: user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
          bio: '',
          website: '',
          github: '',
          createdAt: new Date().toISOString(),
          role: user?.role || 'estudiante' // Usar el rol del contexto de autenticación
        });
        } else {
          setUserProfile(null);
        }
      }
      
      // Obtener proyectos del usuario usando el endpoint correcto
      let userProjects = [];
      try {
        console.log('Fetching projects for userId:', userIdToShow);
        const projectsResponse = await axios.get(`https://red-networking-backend.vercel.app/api/usuario_projects/${userIdToShow}`);
        console.log('Projects response:', projectsResponse.data);
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
          
          // Filtrar proyectos del usuario objetivo
          userProjects = allProjectsData.filter((project: any) => 
            project.authors && project.authors.includes(userIdToShow)
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
            project.authors && project.authors.includes(userIdToShow)
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
      
      // Actualizar formulario de edición solo si es el propio perfil
      if (isOwnProfile) {
        // Extraer GitHub y Website del array de links si existe
        let githubLink = '';
        let websiteLink = '';
        
        if (userData?.links && Array.isArray(userData.links)) {
          // Extraer sitio web (posición 0)
          if (userData.links[0] && userData.links[0] !== '') {
            websiteLink = userData.links[0];
          }
          
          // Extraer GitHub (posición 1 o construir desde posición 2)
          const githubLinkItem = userData.links.find((link: string) => 
            link && (link.includes('github.com') || link.startsWith('https://github.com'))
          );
          if (githubLinkItem) {
            githubLink = githubLinkItem;
          } else if (userData.links[2] && userData.links[2] !== '') {
            // Si no hay link de GitHub pero hay un username en la posición 2
            githubLink = `https://github.com/${userData.links[2]}`;
          }
        }
        
        setEditForm({
          name: userData?.name || user?.name || '',
          email: userData?.email || user?.email || '',
          bio: userData?.bio || '',
          website: websiteLink,
          github: githubLink,
          role: userData?.role || userData?.rol || user?.role || 'estudiante'
        });
      }
      
    } catch (error) {
      console.error('Error cargando datos del perfil:', error);
      toast.error('Error al cargar los datos del perfil');
      
      // Usar datos del contexto como fallback solo si es el propio perfil
      if (isOwnProfile) {
        setUserProfile({
          _id: user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
          bio: '',
          website: '',
          github: '',
          createdAt: new Date().toISOString()
        });
      } else {
        setUserProfile(null);
      }
      
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
    if (userIdToShow) {
      loadProfileData();
    }
  }, [userIdToShow]);

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
      console.log('Saving profile with data:', {
        userId: user.id,
        formData: editForm
      });
      
      // Preparar los datos para el backend
      // El backend espera los links en un array: [website, github_url, github_username]
      let links = ['', '', ''];
      
      // Sitio web en posición 0
      links[0] = editForm.website || '';
      
      // Extraer el username de GitHub si es una URL completa
      let githubUsername = '';
      if (editForm.github) {
        if (editForm.github.includes('github.com/')) {
          githubUsername = editForm.github.split('github.com/')[1];
        } else {
          githubUsername = editForm.github;
        }
      }
      
      links[1] = editForm.github || ''; // URL completa de GitHub
      links[2] = githubUsername; // Username de GitHub
      
      console.log('Prepared links array for backend:', links);
      
      // Llamada al endpoint para actualizar el perfil
      const response = await axios.put(
        `https://red-networking-backend.vercel.app/api/users/${user.id}/profile`,
        {
          name: editForm.name,
          email: editForm.email,
          bio: editForm.bio,
          website: editForm.website,
          links: links,
          role: editForm.role
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Profile update response:', response.data);

      if (response.data.ok) {
        // Actualizar el estado local con los datos actualizados
        setUserProfile(prev => prev ? {
          ...prev,
          name: editForm.name,
          email: editForm.email,
          bio: editForm.bio,
          website: editForm.website,
          github: editForm.github, // Mantener el valor del formulario
          role: editForm.role
        } : null);
        
        console.log('Profile updated successfully, new data:', {
          name: editForm.name,
          email: editForm.email,
          bio: editForm.bio,
          website: editForm.website,
          github: editForm.github,
          role: editForm.role
        });
        
        toast.success('Perfil actualizado correctamente');
        setIsEditing(false);
        
        // Recargar los datos del perfil para asegurar que se muestren los datos actualizados
        setTimeout(() => {
          loadProfileData();
        }, 1000);
      } else {
        console.error('Profile update failed:', response.data);
        toast.error(response.data.error || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
            setEditForm({
          name: userProfile?.name || '',
          email: userProfile?.email || '',
          bio: userProfile?.bio || '',
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
    console.log('Role from database:', role); // Debug log
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

  if (!isAuthenticated && !targetUserId) {
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

  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Usuario no encontrado</h2>
            <p className="text-gray-400">El perfil que buscas no existe o no está disponible</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        {/* Header del Perfil */}
        <div className="bg-[#232733] rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar y Información Principal */}
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile?.avatar || "https://github.com/shadcn.png"} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {userProfile?.name ? getInitials(userProfile.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {userProfile?.name || 'Usuario'}
                  </h1>
                  {userProfile?.role && (
                    <div className="flex items-center mt-1">
                      {getRoleBadge(userProfile.role)}
                    </div>
                  )}
                  {/* Botón de GitHub */}
                  {userProfile?.github && (
                    <a
                      href={userProfile.github.startsWith('http') ? userProfile.github : `https://github.com/${userProfile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white w-9 h-9 transition-colors border border-gray-700"
                      title="Ver perfil de GitHub"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-gray-300 mb-2">{userProfile?.email}</p>
                <p className="text-gray-400 text-sm">
                  Miembro desde {userStats?.memberSince || new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-2 ml-auto">
              {isOwnProfile && !isEditing ? (
                <Button onClick={handleEdit} variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </Button>
              ) : isOwnProfile && isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              ) : null}
            </div>

                {user?.role === "admin" && !isOwnProfile &&  (
                  <RoleChangeButton userId={userProfile._id} refetchProfile={loadProfileData} />
                )}
                {user?.role === "admin" && (
                  <DeleteUserButton userId={userProfile._id} adminId={user.id} />
                )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card className="bg-[#232733] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Nombre</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-[#181b22] border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-[#181b22] border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-gray-300">Biografía</Label>
                      <textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full h-24 p-3 rounded-md bg-[#181b22] border border-gray-600 text-white resize-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-gray-300">Sitio Web</Label>
                      <Input
                        id="website"
                        value={editForm.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="bg-[#181b22] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github" className="text-gray-300">Enlace de GitHub</Label>
                      <Input
                        id="github"
                        value={editForm.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        className="bg-[#181b22] border-gray-600 text-white"
                        placeholder="https://github.com/tu-usuario"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-gray-300">Rol</Label>
                      <Input
                        id="role"
                        value={editForm.role}
                        disabled
                        className="bg-[#181b22] border-gray-600 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">El rol no se puede editar desde aquí</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{userProfile?.email || 'Email no disponible'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Miembro desde {userStats?.memberSince || new Date().getFullYear()}</span>
                    </div>
                    {userProfile?.bio && (
                      <div>
                        <p className="text-gray-300">{userProfile?.bio || 'Biografía no disponible'}</p>
                      </div>
                    )}
                    {userProfile?.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <a href={userProfile?.website || undefined} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          {userProfile?.website || 'Sitio web no disponible'}
                        </a>
                      </div>
                    )}
                    {userProfile?.github && (
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-gray-400" />
                        <a href={userProfile?.github ? (userProfile.github.startsWith('http') ? userProfile.github : `https://github.com/${userProfile.github}`) : undefined} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          {userProfile?.github ? (userProfile.github.startsWith('http') ? userProfile.github : `github.com/${userProfile.github}`) : 'GitHub no disponible'}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proyectos del Usuario */}
            <Card className="bg-[#232733] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {isOwnProfile ? 'Mis Proyectos' : 'Proyectos'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {userProjects.length} proyectos creados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProjects.length > 0 ? (
                  <div className="space-y-4">
                    {userProjects.map((project) => (
                      <div key={project._id} className="bg-[#181b22] rounded-lg p-4 border border-gray-700 relative">
                        <div className="flex justify-between items-start mb-3">
                          <h3 
                            className="text-lg font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => handleProjectClick(project._id)}
                          >
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-300 text-sm">
                              {projectRatings && projectRatings[project._id] !== undefined && projectRatings[project._id] !== null
                                ? projectRatings[project._id]?.toFixed(1)
                                : 'Sin rating'}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </div>
                          {project.repositoryLink && (
                            <div className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              <a 
                                href={project.repositoryLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Repositorio
                              </a>
                            </div>
                          )}
                        </div>
                        {/* Tecnologías en la esquina inferior derecha */}
                        <div className="absolute bottom-3 right-4 flex flex-wrap gap-2 justify-end">
                          {project.tools.slice(0, 3).map((tool) => (
                            <Badge key={tool} variant="secondary" className="bg-blue-900 text-blue-300">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Aún no has creado ningún proyecto</p>
                    <p className="text-gray-500 text-sm">¡Comienza creando tu primer proyecto!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Barra Lateral */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <Card className="bg-[#232733] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userStats?.projectsCreated || 0}</div>
                    <div className="text-sm text-gray-400">Proyectos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userStats?.projectsLiked || 0}</div>
                    <div className="text-sm text-gray-400">Me gusta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userStats?.totalViews || 0}</div>
                    <div className="text-sm text-gray-400">Vistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userStats?.averageRating || 0}</div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuración Rápida */}
            <Card className="bg-[#232733] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                  <Shield className="w-4 h-4" />
                  Privacidad
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                  <Bell className="w-4 h-4" />
                  Notificaciones
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                  <Palette className="w-4 h-4" />
                  Apariencia
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                  <BookOpen className="w-4 h-4" />
                  Ayuda
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
