"use client";

import { ClipboardPenLine, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Project } from "../../../types";
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
import { CreateProjectRatingForm } from "../form/CreateProjectRatingForm";

const ProjectDropDownActions = ({ project }: { project?: Project }) => {
  //const [openDelete, setOpenDelete] = useState(false);
  const [openRating, setOpenRating] = useState(false);

  // const handleDelete = async (id: number | string) => {
  //   //await deleteInformationSource.mutateAsync(id);
  //   //setOpenDelete(false);
  // };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"></span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="flex gap-2 justify-center"
        >
          <DropdownMenuItem onClick={() => setOpenRating(true)}>
            <ClipboardPenLine className="size-5 text-green-500" />
            <p className="pl-2">Calificar</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DIALOGO DE CALIFICACION */}
      <Dialog open={openRating} onOpenChange={setOpenRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Evaluar Proyecto</DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0"></DialogDescription>

            <CreateProjectRatingForm
              initialData={project}
              onClose={() => setOpenRating(false)}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDropDownActions;
