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
          <h1 className="text-2xl font-medium  text-white ">
            Ranking de Proyectos
          </h1>
          <h2 className="text-sm font-medium  text-white ">
            Los proyectos más populares y destacados de la comunidad
          </h2>

          <Card className="flex flex-col bg-gray-800 text-white border border-gray-700 rounded-r-sm ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="avatar.png" alt="User avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="text-blue-400">Ecuanutrition</h1>
                  <h2 className="text-gray-400 font-light">
                    @EdwardG . 120 Estrellas
                  </h2>
                </div>
              </CardTitle>
              <CardDescription></CardDescription>
              <CardAction></CardAction>
            </CardHeader>
            <CardContent className="">
              <div>
                <p className="text-white font-medium">
                  Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas.
                </p>
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
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <ProjectCard
            avatarURL="avatar.png"
            name="Ecuanutrition"
            username="EdwardG"
            stars={120}
            projectDescription="Plataforma de gestión para productos del mar y camarones, con
                  sistema de inventario y ventas."
          ></ProjectCard>
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
