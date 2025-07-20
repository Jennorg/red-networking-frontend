"use client";

import {
  ClipboardPenLine,
  Eye,
  MoreHorizontal,
  ScrollText,
  Star,
  Trash2,
} from "lucide-react";
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
import ShowRatingPage from "./ShowRatingPage";
import { CreateProjectRatingForm } from "../form/CreateProjectRatingForm";
import { CreatePuntuacionForm } from "../form/CreatePuntuacionProjectForm";
import EditProjectForm from "../form/EditProjectForm";
import RatingListPage from "./RatingList";
import DeleteProject from "@/components/admin/DeleteProject";

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

const ProjectDropDownActions = ({
  projectId,
  isAuthor,
  project,
}: {
  projectId: string;
  isAuthor: boolean;
  project: Proyecto;
}) => {
  const [openRating, setOpenRating] = useState(false);
  const [openWatchRating, setOpenWatchRating] = useState(false);
  const [openListRating, setOpenListRating] = useState(false);
  const [openPuntuacion, setOpenPuntuacion] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
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

          <DropdownMenuItem onClick={() => setOpenListRating(true)}>
            <ScrollText className="size-5 text-blue-500" />
            <p className="pl-2">Ver calificaciones</p>
          </DropdownMenuItem>

          {isAuthor && (
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <ClipboardPenLine className="size-5 text-purple-500" />
              <p className="pl-2">Editar Proyecto</p>
            </DropdownMenuItem>
          )}

          {(user?.role === "admin" || isAuthor) && (
            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="hover:bg-gray-700 focus:bg-gray-300"
            >
              <Trash2 className="size-5 text-red-500" />
              <p className="pl-2">Eliminar Proyecto</p>
            </DropdownMenuItem>
          )}
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

      {/* DIALOGO PARA VER CALIFICACIONES DE PROFESORES */}
      <Dialog open={openListRating} onOpenChange={setOpenListRating}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              Lista de Calificaciones por Profesores
            </DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0 text-gray-400"></DialogDescription>

            <RatingListPage
              projectId={projectId}
              onClose={() => setOpenListRating(false)}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* DIALOGO PARA EDITAR PROYECTO */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className=" overflow-y-auto bg-gray-800 border-gray-700 text-white max-h-[90vh] max-w-2xl ">
          <DialogHeader>
            <DialogTitle className="text-center">Editar Proyecto</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            project={project}
            onSuccess={() => {
              setOpenEdit(false);
              window.location.reload();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ELIMINAR PROYECTO PARA ADMINISTRADORES Y USUARIOS PROPIETARIOS*/}
      <DeleteProject
        projectId={projectId}
        userId={user?.id || ""}
        userRole={user?.role || ""}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
};

export default ProjectDropDownActions;
