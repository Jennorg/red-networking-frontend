"use client";

import { ClipboardPenLine, Eye, MoreHorizontal, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useGetRatingByProjectTeacher } from "../../../hooks/useGetRatingByProjectTeacher";
import ShowRatingPage from "@/app/Proyecto/evaluacion/page";
import { CreateProjectRatingForm } from "../form/CreateProjectRatingForm";
import { CreatePuntuacionForm } from "../form/CreatePuntuacionProjectForm";

const ProjectDropDownActions = ({ projectId }: { projectId: string }) => {
  const [openRating, setOpenRating] = useState(false);
  const [openWatchRating, setOpenWatchRating] = useState(false);
  const [openPuntuacion, setOpenPuntuacion] = useState(false);
  const { user } = useAuth();

  const value = {
    teacherId: user?.id || "",
    projectId: projectId,
  };

  const { data } = useGetRatingByProjectTeacher(value);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white"
          >
            <span className="sr-only">Menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="bg-gray-800 border-gray-700 text-gray-300"
        >
          {data?.rating === null && user?.role === "profesor" ? (
            <DropdownMenuItem
              onClick={() => setOpenRating(true)}
              className="hover:bg-gray-700 focus:bg-gray-300"
            >
              <ClipboardPenLine className="size-5 text-green-500" />
              <p className="pl-2">Calificar</p>
            </DropdownMenuItem>
          ) : user?.role === "profesor" && data?.rating !== null ? (
            <DropdownMenuItem onClick={() => setOpenWatchRating(true)}>
              <Eye className="size-5 text-blue-500" />
              <p className="pl-2">Ver calificacion</p>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem onClick={() => setOpenPuntuacion(true)}>
            <Star className="size-5 text-yellow-500" />
            <p className="pl-2">Puntuar</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DIALOGO DE CALIFICACION */}
      <Dialog open={openRating} onOpenChange={setOpenRating}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              Evaluar Proyecto
            </DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0 text-gray-400">
              Califica este proyecto según diferentes criterios
            </DialogDescription>

            <CreateProjectRatingForm
              projectId={projectId}
              onClose={() => setOpenRating(false)}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* DIALOGO PARA EL FORM PUNTUACION DE CUALQUIER PERSONAS */}
      <Dialog open={openWatchRating} onOpenChange={setOpenWatchRating}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              Puntuar Proyecto
            </DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0 text-gray-400">
              Puntuacion del proyecto
            </DialogDescription>

            {data?.rating && (
              <ShowRatingPage
                feedback={data.rating.feedback}
                score={data.rating.score}
                projectID={data.rating.projectID}
                onClose={() => setOpenWatchRating(false)}
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* DIALOGO PARA EL FORM PUNTUACION DE CUALQUIER PERSONAS */}
      <Dialog open={openPuntuacion} onOpenChange={setOpenPuntuacion}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              Puntuar Proyecto
            </DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0 text-gray-400"></DialogDescription>

            <CreatePuntuacionForm
              projectId={projectId}
              onClose={() => setOpenPuntuacion(false)}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDropDownActions;
