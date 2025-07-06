"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectCategorySelector } from "@/components/misc/ProjectCategorySelector";
import axios from "axios";

export default function Ranking() {
  const [projects, setProjects] = useState([
  {
    id: 1,
    name: "Ecuanutrition",
    username: "EdwardG",
    stars: 120,
    views: 200,
    description: "Gestión de productos del mar y camarones con inventario inteligente.",
    avatarURL: "avatar.png",
  },
  {
    id: 2,
    name: "TechCampus",
    username: "LauraDev",
    stars: 98,
    views: 180,
    description: "Plataforma de seguimiento de cursos universitarios en tiempo real.",
    avatarURL: "avatar.png",
  },
  {
    id: 3,
    name: "TaskForge",
    username: "Carlos123",
    stars: 90,
    views: 160,
    description: "App para organizar tareas y proyectos colaborativos entre estudiantes.",
    avatarURL: "avatar.png",
  },
  {
    id: 4,
    name: "EcoTrack",
    username: "MariaG",
    stars: 85,
    views: 140,
    description: "Seguimiento de huella ecológica personal y gamificación verde.",
    avatarURL: "avatar.png",
  },
  {
    id: 5,
    name: "CodeMatch",
    username: "PedroJS",
    stars: 80,
    views: 130,
    description: "Red de emparejamiento entre programadores y proyectos universitarios.",
    avatarURL: "avatar.png",
  },
  {
    id: 6,
    name: "UniMarket",
    username: "AnaUX",
    stars: 75,
    views: 125,
    description: "Marketplace interno para intercambiar libros, apuntes y recursos.",
    avatarURL: "avatar.png",
  },
  {
    id: 7,
    name: "HealthTime",
    username: "LuisRN",
    stars: 70,
    views: 115,
    description: "App de seguimiento de hábitos saludables con rutinas estudiantiles.",
    avatarURL: "avatar.png",
  },
  {
    id: 8,
    name: "RedUNEGlab",
    username: "SofiaDev",
    stars: 65,
    views: 110,
    description: "Gestor de recursos tecnológicos de laboratorios de informática.",
    avatarURL: "avatar.png",
  },
  {
    id: 9,
    name: "OpenNotas",
    username: "Frankie",
    stars: 60,
    views: 100,
    description: "Repositorio colaborativo de resúmenes y material académico.",
    avatarURL: "avatar.png",
  },
  {
    id: 10,
    name: "VirtualMeet",
    username: "ValenC",
    stars: 58,
    views: 95,
    description: "Plataforma ligera para reuniones estudiantiles y clubs de carrera.",
    avatarURL: "avatar.png",
  },
]);


  // useEffect(() => {
  //   async function fetchRanking() {
  //     try {
  //       const response = await axios.get("https://red-networking-backend.vercel.app/projects/ranking");
  //       setProjects(response.data.projects);
  //     } catch (error) {
  //       console.error("Error al cargar el ranking:", error);
  //     }
  //   }

  //   fetchRanking();
  // }, []);

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

        <div>
          <ProjectCategorySelector />
        </div>

        <div className="flex flex-col gap-2 sm:gap-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || index}
              _id={project.id?.toString() ?? index.toString()}
              title={project.name}
              authors={[project.username]}
              date={""}
              tags={[]}
              repositoryLink={""}
              tools={[]}
              avatarURL={project.avatarURL}
              stars={project.stars}
              views={project.views}
              description={project.description}
              position={index + 1}
              image={""}
              document={""}
              __v={0}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}