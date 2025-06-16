"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Star, MessageCircleMore, Heart } from "lucide-react";
import { LanguageIcon } from "../misc/LanguageIcon";

interface ProjectCardProps {
  position?: number;
  name: string;
  username: string;
  projectDescription: string;
  stars?: number;
  avatarURL: string;
  views?: number;
  showComments?: boolean;
}

export function ProjectCard({
  views,
  position,
  name,
  username,
  projectDescription,
  stars,
  avatarURL = "avatar.png",
  showComments
}: ProjectCardProps) {
  return (
    <div>
      <Card className="flex flex-col bg-gray-800 text-white border-b-2 border-gray-700 rounded-b-sm">
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
              {views && 
                <>
                  <Eye className="size-5 text-gray-300 hover:text-blue-400" />
                  <p className="font-light"> {views}</p>
                </>
              }
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
              <div className="flex flex-row gap-4">
                <LanguageIcon languageName="python" languageIcon="python.png" />
                <LanguageIcon languageName="javascript" languageIcon="js.png" />
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
      {showComments && 
        <div className="p-5 bg-gray-900 rounded-b-sm border-b-2 border-x-2 border-x-gray-700 border-b-gray-700">
          <h2 className="text-blue-400 m-3 text-2xl">Comentarios</h2>
          <Card className="bg-gray-800 border border-gray-700">
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 flex flex-col">
                <p className="text-white font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ad recusandae labore, aspernatur facere, molestiae voluptates debitis fugiat necessitatibus impedit praesentium cum repellendus dolor nobis aliquid officiis aut quis! Adipisci!</p>
                {/* ESTE ES EL CONTENEDOR FLEX DE LOS BOTOENES DE INTERACCION USUARIO */}
                <div className="flex gap-3">
                  <button>
                    <Heart className="hover:text-red-700 text-gray-400"/>
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 hover:fill-blue-500">
                    <MessageCircleMore  /> 
                    <p className="">Responder</p>
                  </button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }
  </div>
  );
}
