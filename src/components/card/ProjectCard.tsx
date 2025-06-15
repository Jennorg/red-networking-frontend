"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Star } from "lucide-react";
import { LanguageIcon } from "../misc/LanguageIcon";

interface ProjectCardProps {
  position?: number;
  name: string;
  username: string;
  projectDescription: string;
  stars?: number;
  avatarURL: string;
  views: number;
}

export function ProjectCard({
  views,
  position,
  name,
  username,
  projectDescription,
  stars,
  avatarURL = "avatar.png",
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col bg-gray-800 text-white border border-gray-700 rounded-r-sm">
      <CardHeader>
        <CardTitle className="flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
          {/* ESTE ES EL NUEVO CONTENEDOR FLEX PARA EL GRUPO DE LA IZQUIERDA */}
          <div className="flex items-center gap-2">
            {" "}
            {/* Puedes ajustar 'gap-2' aquí */}
            {position && (
              <span className="text-blue-400 font-bold text-2xl">
                #{position}
              </span>
            )}
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarURL} alt={`Avatar de ${username}`} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {/* Este div ya es parte del grupo de la izquierda */}
            <div className="flex-col">
              <h1 className="text-blue-400">{name}</h1>
              <h2 className="text-gray-400 font-light">
                @{username} · {stars} Estrellas
              </h2>
            </div>
          </div>

          {/* ESTE ES EL CONTENEDOR DE ESTRELLAS/VISTAS (el grupo de la derecha) */}
          <div className="flex gap-2">
            {/* Quitamos ml-auto aquí */}
            <Star className="size-5 text-gray-300 hover:text-yellow-400" />
            <p className="font-light"> {stars}</p>
            <Eye className="size-5 text-gray-300 hover:text-blue-400" />
            <p className="font-light"> {views}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-white font-light text-xs sm:text-sm sm:font-medium">
            {projectDescription}
          </p>
          {/* Contenedor principal */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
            {/* Iconos (siempre a la izquierda) */}
            <div className="flex flex-col lg:flex-row gap-4">
              <LanguageIcon languageName="python" languageIcon="python.PNG" />
              <LanguageIcon languageName="javascript" languageIcon="js.PNG" />
            </div>

            {/* Botón (debajo en móvil, a la derecha en desktop) */}
            <Button
              className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10 w-full sm:w-auto"
              onClick={() => alert("Ver detalles")}
            >
              Ver detalles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
