"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Star, MessageCircleMore, Heart } from "lucide-react";
import { LanguageIcon } from "../misc/LanguageIcon";
import { useRouter } from "next/navigation";

// Interfaz que representa la estructura de la respuesta de la API para un proyecto.
export interface ProjectApiResponse {
  _id: string;
  title: string;
  authors: string[];
  date: string;
  tags: string[];
  description: string;
  repositoryLink: string;
  tools: string[]; // Aseguramos que 'tools' es un array de strings
  image: string;
  document: string;
  __v: number;
}

// Interfaz para las props del componente ProjectCard,
// extendiendo la interfaz de la API y añadiendo props específicas del componente.
export interface ProjectCardProps extends ProjectApiResponse {
  position?: number;
  stars?: number;
  views?: number;
  showComments?: boolean;
  avatarURL?: string;
}

export function ProjectCard({
  title,
  authors = ["Desconocido"],
  description,
  repositoryLink,
  tools = [],
  position,
  stars = 0,
  views = 0,
  showComments = false,
  avatarURL = "/pngs/avatar.png",
}: ProjectCardProps) {
  const username = authors.length > 0 ? authors[0] : "Desconocido";
  const router = useRouter();

  return (
    <div className="my-4">
      <Card className="flex flex-col bg-gray-800 text-white border-b-2 border-gray-700 rounded-b-sm">
        <CardHeader>
          <CardTitle className="flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
            <div className="flex items-center gap-2">
              {position && (
                <span className="text-blue-400 font-bold text-2xl">
                  #{position}
                </span>
              )}
              <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarURL} alt={`Avatar de ${username}`} />
                  <AvatarFallback>
                    {username ? username.substring(0, 2).toUpperCase() : "CN"}
                  </AvatarFallback>
                </Avatar>
              <div className="flex-col">
                <h1 className="text-blue-400">{title}</h1>
                <h2 className="text-gray-400 font-light">
                  @{username} · {stars} Estrellas
                </h2>
              </div>
            </div>

            <div className="flex gap-2">
              <Star className="size-5 text-gray-300 hover:text-yellow-400" />
              <p className="font-light"> {stars}</p>
              {views > 0 && (
                <>
                  <Eye className="size-5 text-gray-300 hover:text-blue-400" />
                  <p className="font-light"> {views}</p>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-white font-light text-xs sm:text-sm sm:font-medium">
              {description}
            </p>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
              <div className="flex flex-row gap-4">
                {tools.map((tool) => (
                  <LanguageIcon
                    key={tool}
                    languageName={tool}
                    languageIcon={`${tool.toLowerCase()}.png`}
                  />
                ))}
              </div>

              <Button
                className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10 w-full sm:w-auto"
                onClick={() => router.push(`/Proyecto/${_id}`)}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showComments && (
        <div className="p-5 bg-gray-900 rounded-b-sm border-b-2 border-x-2 border-x-gray-700 border-b-gray-700">
          <h2 className="text-blue-400 m-3 text-2xl">Comentarios</h2>
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
                <div className="flex items-center gap-2">
                  {" "}
                  {position && (
                    <span className="text-blue-400 font-bold text-2xl">
                      #{position}
                    </span>
                  )}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarURL} alt={`Avatar de ${username}`} />
                    <AvatarFallback>
                      {username ? username.substring(0, 2).toUpperCase() : "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-col">
                    <h1 className="text-blue-400">{title}</h1>
                    <h2 className="text-gray-400 font-light">
                      @{username} · {stars} Estrellas
                    </h2>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 flex flex-col">
                <p className="text-white font-light">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                  ad recusandae labore, aspernatur facere, molestiae voluptates
                  debitis fugiat necessitatibus impedit praesentium cum
                  repellendus dolor nobis aliquid officiis aut quis! Adipisci!
                </p>
                <div className="flex gap-3">
                  <button>
                    <Heart className="hover:text-red-700 text-gray-400" />
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 hover:fill-blue-500">
                    <MessageCircleMore />
                    <p className="">Responder</p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}