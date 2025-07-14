import type { Metadata } from "next";

// Función para metadatos básicos
export function createBasicMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} - Red Networking`,
    description,
    icons: {
      icon: "/pngs/uneg-logo.png",
    },
  };
}

// Función para metadatos dinámicos con título personalizado
export function createDynamicMetadata(
  title: string, 
  description: string, 
  customTitle?: string
): Metadata {
  return {
    title: customTitle ? `${customTitle} - Red Networking` : `${title} - Red Networking`,
    description,
    icons: {
      icon: "/pngs/uneg-logo.png",
    },
  };
}

// Metadatos predefinidos para páginas comunes
export const METADATA = {
  LOGIN: createBasicMetadata(
    "Iniciar Sesión",
    "Accede a tu cuenta en Red Networking"
  ),
  SIGNUP: createBasicMetadata(
    "Registro",
    "Crea tu cuenta en Red Networking"
  ),
  PROFILE: createBasicMetadata(
    "Perfil",
    "Gestiona tu perfil de usuario"
  ),
  RANKING: createBasicMetadata(
    "Ranking",
    "Los proyectos más populares y destacados"
  ),
  UNAUTHORIZED: createBasicMetadata(
    "Acceso No Autorizado",
    "Necesitas iniciar sesión para acceder a esta página"
  ),
  EVALUATION: createBasicMetadata(
    "Evaluación de Proyecto",
    "Evaluación y puntuación de proyectos"
  ),
  EVALUATED_PROJECTS: createBasicMetadata(
    "Proyectos Evaluados",
    "Proyectos evaluados por el profesor"
  ),
} as const;

// Función para metadatos de proyecto individual
export async function createProjectMetadata(projectId: string) {
  try {
    const response = await fetch(`https://red-networking-backend.vercel.app/api/projects/${projectId}`);
    const data = await response.json();
    
    if (data && data.proyecto) {
      return createDynamicMetadata(
        "Proyecto",
        data.proyecto.description.substring(0, 160) + "...",
        data.proyecto.title
      );
    }
  } catch (error) {
    console.error("Error fetching project metadata:", error);
  }
  
  return createBasicMetadata("Proyecto", "Detalles del proyecto");
} 