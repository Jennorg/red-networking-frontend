"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
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
  Award
} from "lucide-react";

interface UserStats {
  projectsCreated: number;
  projectsLiked: number;
  totalViews: number;
  averageRating: number;
  memberSince: string;
}

export default function Perfil() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Desarrollador apasionado por la tecnología y la innovación',
    location: 'Venezuela',
    website: '',
    github: ''
  });

  // Datos simulados de estadísticas del usuario
  const userStats: UserStats = {
    projectsCreated: 12,
    projectsLiked: 45,
    totalViews: 2340,
    averageRating: 4.2,
    memberSince: '2023'
  };

  // Proyectos simulados del usuario
  const userProjects = [
    {
      id: '1',
      title: 'Sistema de Gestión de Inventario',
      description: 'Aplicación web para control de inventario en tiempo real',
      technologies: ['React', 'Node.js', 'MongoDB'],
      views: 156,
      likes: 23,
      rating: 4.5
    },
    {
      id: '2',
      title: 'App de Notas Inteligentes',
      description: 'Aplicación móvil con IA para organizar notas',
      technologies: ['React Native', 'Python', 'TensorFlow'],
      views: 89,
      likes: 15,
      rating: 4.1
    },
    {
      id: '3',
      title: 'Dashboard de Analytics',
      description: 'Panel de control para análisis de datos empresariales',
      technologies: ['Vue.js', 'D3.js', 'Express'],
      views: 203,
      likes: 31,
      rating: 4.3
    }
  ];

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

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar los cambios
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Desarrollador apasionado por la tecnología y la innovación',
      location: 'Venezuela',
      website: '',
      github: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        {/* Header del Perfil */}
        <div className="bg-[#232733] rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar y Información Principal */}
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.name || 'Usuario'}
                </h1>
                <p className="text-gray-300 mb-2">{user?.email}</p>
                <p className="text-gray-400 text-sm">
                  Miembro desde {userStats.memberSince}
                </p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-2 ml-auto">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location" className="text-gray-300">Ubicación</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="bg-[#181b22] border-gray-600 text-white"
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
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{editForm.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Miembro desde {userStats.memberSince}</span>
                    </div>
                    <div>
                      <p className="text-gray-300">{editForm.bio}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proyectos del Usuario */}
            <Card className="bg-[#232733] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Mis Proyectos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {userProjects.length} proyectos creados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProjects.map((project) => (
                    <div key={project.id} className="bg-[#181b22] rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-300 text-sm">{project.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-blue-900 text-blue-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{project.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <div className="text-2xl font-bold text-blue-400">{userStats.projectsCreated}</div>
                    <div className="text-sm text-gray-400">Proyectos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userStats.projectsLiked}</div>
                    <div className="text-sm text-gray-400">Me gusta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userStats.totalViews}</div>
                    <div className="text-sm text-gray-400">Vistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userStats.averageRating}</div>
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
