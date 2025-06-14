"use client";
import { ProjectCard } from "@/components/card/ProjectCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Ranking() {
  return (
    <>
      <DashboardLayout>
        <div className="h-full w-full p-20">
          <div className="flex flex-col gap-2 pb-10">
            <h1 className="text-2xl font-medium  text-white ">
              Ranking de Proyectos
            </h1>
            <h2 className="text-sm font-medium  text-white ">
              Los proyectos más populares y destacados de la comunidad
            </h2>
          </div>

          <div className="flex flex-col gap-10">
            <ProjectCard
              position={1}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
            <ProjectCard
              position={2}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
            <ProjectCard
              position={3}
              avatarURL="avatar.png"
              name="Ecuanutrition"
              username="EdwardG"
              stars={120}
              views={200}
              projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
            ></ProjectCard>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
/*
 <>
      <div className="flex flex-col min-h-screen">
        <div className="w-full">
          <Header></Header>
        </div>
        <div className="flex flex-grow">
          <Sidebar />
          <div className=" flex justify-center items-center h-screen bg-blue-500 flex-grow">
            <h1>This is the container</h1>
          </div>
        </div>
      </div>
    </>
*/
