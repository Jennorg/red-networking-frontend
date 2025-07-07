/// <reference types="react" />
import { notFound } from 'next/navigation';
import axios from "axios";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

export default async function ProyectoPage({ params }: { params: { id: string } }) {
  let proyecto = await getProyecto(params.id);
  if (!proyecto) {
    // MOCKUP de proyecto si no se encuentra uno real
    proyecto = {
      _id: "mockid123",
      title: "SeaFood Manager Pro",
      description: "Plataforma integral para la gestión de productos del mar (especialmente camarones), con: Inventario en tiempo real (lotes, caducidad, ubicación). Módulo de ventas integrado con facturación electrónica. Seguimiento de calidad: Sensores de temperatura/humedad y alertas. Dashboard interactivo con gráficos de ventas y estado de productos.",
      authors: ["Edward Guzman", "Maria López"],
      tags: ["inventario", "ventas", "React", "Node.js"],
      tools: ["React", "Chart.js", "Bootstrap", "PDFKit", "Node.js", "Express.js", "MongoDB", "Arduino", "Balanzas Inteligentes"],
      repositoryLink: "https://github.com/usuario/proyecto",
      image: "https://bing.com/th/id/BCO.1e45fad0-c0dd-45fd-b03d-40966fa87d05.png",
      document: "#",
      puntuacion: [4, 5, 3],
      comments: ["Excelente trabajo! Me gustaría contribuir con algunas mejoras en la documentación.", "He encontrado un bug en la funcionalidad de autenticación. ¿Podrías revisar el issue #123?"],
      date: "2025-05-26T00:00:00.000Z",
    };
  }

  const avgScore =
    proyecto.puntuacion.length > 0
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
        {/* Autores, Fecha, Etiquetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#181b22] rounded-lg p-4 flex flex-col gap-2 border border-gray-700 text-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-white">Autores:</span>
            </div>
            <ul className="flex flex-col gap-1 ml-2">
              {proyecto.authors.map((author, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">{author}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 flex flex-col gap-2 border border-gray-700 text-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-white">Fecha de Publicación:</span>
            </div>
            <span className="text-gray-300 text-sm">{new Date(proyecto.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {proyecto.tags.map((tag) => (
                <span key={tag} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Descripción */}
        <div className="bg-[#181b22] rounded-lg p-4 mb-6 border border-gray-700 text-gray-200">
          <h2 className="font-semibold text-lg mb-2 text-white">Descripción del Proyecto:</h2>
          <p className="text-gray-300 text-sm whitespace-pre-line">{proyecto.description}</p>
        </div>
        {/* Herramientas utilizadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col gap-2 text-gray-200">
            <span className="font-semibold text-white">Frontend:</span>
            <ul className="list-disc list-inside text-gray-300 text-sm">
              {proyecto.tools.filter(t => ["React", "Chart.js", "Bootstrap", "PDFKit"].includes(t)).map(tool => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col gap-2 text-gray-200">
            <span className="font-semibold text-white">Backend:</span>
            <ul className="list-disc list-inside text-gray-300 text-sm">
              {proyecto.tools.filter(t => ["Node.js", "Express.js", "MongoDB"].includes(t)).map(tool => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col gap-2 text-gray-200">
            <span className="font-semibold text-white">Hardware / Sensores:</span>
            <ul className="list-disc list-inside text-gray-300 text-sm">
              {proyecto.tools.filter(t => ["Arduino", "Balanzas Inteligentes"].includes(t)).map(tool => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Código Fuente:</span>
            <a href={proyecto.repositoryLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">Ver repositorio</a>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Manual de Programador:</span>
            <a href={proyecto.document} download className="text-blue-400 underline text-xs">Descargar</a>
          </div>
          <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 flex flex-col items-center text-gray-200">
            <span className="font-semibold mb-2 text-white">Puntaje Promedio:</span>
            <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">{avgScore}</span>
          </div>
        </div>
        {/* Imágenes del sistema */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 text-white">Imágenes del Sistema</h3>
          <div className="flex flex-col items-center">
            <img src={proyecto.image} alt="Imagen del sistema" className="rounded-lg w-full max-w-2xl border border-gray-700" />
          </div>
        </div>
        {/* Comentarios */}
        <div className="bg-[#181b22] rounded-lg p-4 border border-gray-700 mt-6 text-gray-200">
          <h3 className="font-semibold text-lg mb-2 text-white">Comentarios</h3>
          <ul className="space-y-2">
            {proyecto.comments.length === 0 && (
              <li className="text-gray-400 text-sm">Sin comentarios.</li>
            )}
            {proyecto.comments.map((comment, idx) => (
              <li key={idx} className="bg-gray-800 rounded p-3 text-sm text-gray-200 border border-gray-700">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
} 