/// <reference types="react" />
import { notFound } from 'next/navigation';
import axios from "axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Metadata } from "next";
import Image from "next/image";
import { Github, FileText, Download } from "lucide-react";

interface Proyecto {
  _id: string;
  title: string;
  description: string;
  authors: string[];
  tags: string[];
  tools: string[];
  repositoryLink: string;
  image: string;
  document: string;
  puntuacion: number[];
  comments: string[];
  date: string;
}

async function getProyecto(id: string): Promise<Proyecto | null> {
  try {
    const res = await axios.get(`https://red-networking-backend.vercel.app/api/projects/${id}`);
    if (!res.data || !res.data.proyecto) return null;
    return res.data.proyecto;
  } catch {
    return null;
  }
}

// Función para generar metadatos dinámicos
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const proyecto = await getProyecto(params.id);
  
  return {
    title: proyecto ? `${proyecto.title} - Red Networking` : "Proyecto - Red Networking",
    description: proyecto ? proyecto.description.substring(0, 160) + "..." : "Detalles del proyecto",
    icons: {
      icon: "/favicon.svg",
    },
  };
}

// Función para obtener nombres de autores
async function getAuthorNames(authorIds: string[]): Promise<string[]> {
  try {
    const response = await axios.get("https://red-networking-backend.vercel.app/auth/users");
    const users = response.data.users || [];
    
    return authorIds.map(id => {
      const user = users.find((u: any) => u._id === id);
      return user ? user.name : 'Usuario desconocido';
    });
  } catch (error) {
    console.error('Error obteniendo nombres de autores:', error);
    return authorIds.map(() => 'Usuario desconocido');
  }
}

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyecto = await getProyecto(id);
  if (!proyecto) {
    return notFound();
  }

  // Obtener nombres de autores
  const authorNames = await getAuthorNames(proyecto.authors || []);
  
  // Debug: ver el valor de la fecha
  console.log('Fecha del proyecto:', proyecto.date);
  console.log('Tipo de fecha:', typeof proyecto.date);

  const avgScore =
    proyecto.puntuacion && proyecto.puntuacion.length > 0
      ? (
          proyecto.puntuacion.reduce((a, b) => a + b, 0) / proyecto.puntuacion.length
        ).toFixed(1)
      : 'Sin puntuación';

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto bg-[#232733] rounded-xl shadow-lg p-8 border border-gray-700 my-8 text-white">
        {/* Header principal */}
        <div className="mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">Título del Proyecto: <span className="text-blue-400">{proyecto.title}</span></h1>
        </div>
        {/* Autores y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#181b22] rounded-lg p-4 flex flex-col gap-2 border border-gray-700 text-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-white">Autores:</span>
            </div>
            <ul className="flex flex-col gap-1 ml-2">
              {authorNames && authorNames.length > 0 ? (
                authorNames.map((author, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-sm font-medium">{author}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Sin autores especificados</li>
              )}
            </ul>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 flex flex-col gap-2 border border-gray-700 text-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-white">Fecha de Publicación:</span>
            </div>
            <span className="text-gray-300 text-sm">
              {(() => {
                try {
                  const date = new Date(proyecto.date);
                  if (isNaN(date.getTime())) {
                    return 'Fecha no válida';
                  }
                  return date.toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  });
                } catch (error) {
                  console.error('Error parsing date:', proyecto.date, error);
                  return 'Fecha no válida';
                }
              })()}
            </span>
          </div>
        </div>
        {/* Descripción */}
        <div className="bg-[#181b22] rounded-lg p-4 mb-6 border border-gray-700 text-gray-200">
          <h2 className="font-semibold text-lg mb-2 text-white">Descripción del Proyecto:</h2>
          <p className="text-gray-300 text-sm whitespace-pre-line">{proyecto.description}</p>
        </div>
        {/* Tecnologías y Etiquetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Tecnologías */}
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 text-gray-200">
            <h2 className="font-semibold text-lg mb-3 text-white">Tecnologías:</h2>
            <div className="flex flex-wrap gap-2">
              {proyecto.tools && proyecto.tools.length > 0 ? (
                proyecto.tools.map((tool) => (
                  <span key={tool} className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {tool}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Sin tecnologías especificadas</span>
              )}
            </div>
          </div>
          {/* Etiquetas */}
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 text-gray-200">
            <h2 className="font-semibold text-lg mb-3 text-white">Etiquetas:</h2>
            <div className="flex flex-wrap gap-2">
              {proyecto.tags && proyecto.tags.length > 0 ? (
                proyecto.tags.map((tag, idx) => {
                  const colors = [
                    'bg-blue-900 text-blue-300',
                    'bg-green-900 text-green-300',
                    'bg-purple-900 text-purple-300',
                    'bg-pink-900 text-pink-300',
                    'bg-yellow-900 text-yellow-300',
                    'bg-red-900 text-red-300',
                    'bg-indigo-900 text-indigo-300',
                    'bg-teal-900 text-teal-300',
                    'bg-orange-900 text-orange-300',
                  ];
                  const color = colors[idx % colors.length];
                  return (
                    <span key={tag} className={`${color} px-3 py-1 rounded-full text-sm`}>{tag}</span>
                  );
                })
              ) : (
                <span className="text-gray-400 text-sm">Sin etiquetas</span>
              )}
            </div>
          </div>
        </div>
        {/* Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Código Fuente:</span>
            {proyecto.repositoryLink && proyecto.repositoryLink.trim() !== "" ? (
              <a 
                href={proyecto.repositoryLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">Ver en GitHub</span>
              </a>
            ) : (
              <span className="text-gray-400 text-sm">No disponible</span>
            )}
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Manual:</span>
            {proyecto.document && proyecto.document.trim() !== "" ? (
              <a 
                href={proyecto.document}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-blue-400 border border-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Descargar
              </a>
            ) : (
              <span className="text-gray-400 text-sm">No disponible</span>
            )}
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Puntaje Promedio:</span>
            <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">{avgScore}</span>
          </div>
        </div>
        {/* Imágenes del sistema */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-white">Imágenes del Sistema</h3>
          <div className="flex justify-center">
            {proyecto.image && proyecto.image.trim() !== "" ? (
              <div className="max-w-2xl w-full">
                <Image 
                  src={proyecto.image} 
                  alt="Imagen del sistema" 
                  width={800}
                  height={600}
                  className="rounded-lg w-full h-auto max-h-96 object-contain border border-gray-700" 
                />
              </div>
            ) : (
              <div className="w-full max-w-2xl h-64 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No hay imagen disponible</span>
              </div>
            )}
          </div>
        </div>
        {/* Comentarios */}
        <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 mt-6 text-gray-200">
          <h3 className="font-semibold text-lg mb-2 text-white">Comentarios</h3>
          <ul className="space-y-2">
            {!proyecto.comments || proyecto.comments.length === 0 ? (
              <li className="text-gray-400 text-sm">Sin comentarios.</li>
            ) : (
              proyecto.comments.map((comment, idx) => (
                <li key={idx} className="bg-gray-800 rounded p-3 text-sm text-gray-200 border border-gray-700">
                  {comment}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
} 