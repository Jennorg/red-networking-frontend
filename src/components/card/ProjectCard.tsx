"use client";
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

interface ProjectCardProps {
  position?: number;
  name: string;
  username: string;
  projectDescription: string;
  stars?: number;
  avatarURL: string;
}

export function ProjectCard({
  position: number,
  name,
  username,
  projectDescription,
  stars,
  avatarURL = "avatar.png", // Default avatar URL
}: ProjectCardProps) {
  return (
    <>
      <Card className="flex flex-col bg-gray-800 text-white border border-gray-700 rounded-r-sm ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarURL} alt={`Avatar de ${username}`} />{" "}
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-blue-400">{name}</h1>
              <h2 className="text-gray-400 font-light">
                @{username} . {stars} Estrellas
              </h2>
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="">
          <div>
            <p className="text-white font-medium">{projectDescription}</p>
            <div>
              Iconos iconos iconos
              <Button
                className="border-1 border-blue-400 text-blue-400 font-light"
                onClick={() => alert("Ver detalles")}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
