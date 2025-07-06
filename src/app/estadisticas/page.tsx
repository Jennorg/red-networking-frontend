"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, FolderOpen, Star, Eye } from "lucide-react";

export default function Estadisticas() {
  // Datos mock para las estadísticas
  const stats = [
    {
      title: "Proyectos Totales",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FolderOpen,
      color: "text-blue-500"
    },
    {
      title: "Usuarios Activos",
      value: "5,678",
      change: "+8%",
      changeType: "positive",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Estrellas Promedio",
      value: "4.2",
      change: "+0.3",
      changeType: "positive",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      title: "Visualizaciones",
      value: "89,123",
      change: "+15%",
      changeType: "positive",
      icon: Eye,
      color: "text-purple-500"
    }
  ];

  const recentActivity = [
    {
      action: "Nuevo proyecto creado",
      project: "Ecuanutrition",
      user: "EdwardG",
      time: "2 horas atrás"
    },
    {
      action: "Proyecto actualizado",
      project: "Connect Education",
      user: "MaríaL",
      time: "4 horas atrás"
    },
    {
      action: "Nuevo comentario",
      project: "AI Learning Platform",
      user: "CarlosR",
      time: "6 horas atrás"
    },
    {
      action: "Proyecto destacado",
      project: "EcoTech Solutions",
      user: "AnaS",
      time: "1 día atrás"
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full w-full gap-5 p-2 sm:p-5 lg:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm sm:text-2xl lg:text-4xl font-medium text-white pl-12 sm:pl-10 lg:pl-0">
            Estadísticas
          </h1>
          <h2 className="text-xs sm:text-sm font-medium text-white pl-12 sm:pl-10 lg:pl-0">
            Análisis y métricas de la plataforma
          </h2>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-700 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className={`w-4 h-4 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">vs mes anterior</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráfico y actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de actividad */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actividad de Proyectos</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Gráfico de actividad</p>
                <p className="text-sm text-gray-500">Implementar con librería de gráficos</p>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">
                      <span className="font-medium">{activity.project}</span> por {activity.user}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proyectos más populares */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Proyectos Más Populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Ecuanutrition", stars: 120, views: 200, category: "Web Development" },
              { name: "AI Learning Platform", stars: 98, views: 180, category: "Machine Learning" },
              { name: "EcoTech Solutions", stars: 85, views: 150, category: "Sustainability" },
              { name: "Connect Education", stars: 76, views: 120, category: "Education" },
              { name: "HealthTech App", stars: 65, views: 110, category: "Healthcare" },
              { name: "Smart City IoT", stars: 54, views: 95, category: "IoT" }
            ].map((project, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                <h4 className="font-medium text-white mb-2">{project.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{project.category}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      {project.stars}
                    </span>
                    <span className="flex items-center text-blue-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {project.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 