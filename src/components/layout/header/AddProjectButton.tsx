
"use client";

import React, { useState } from "react";
import Add from "/public/icons/add.svg";
import ProjectUploadForm from "@/components/form/ProjectForm";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const AddProjectButton = () => {
  const [open, setOpen] = useState(false);  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-white hover:bg-gray-700 p-1 rounded-full">
          <Add />
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-[90%] max-h-[90vh] bg-gray-900 text-white p-0 overflow-hidden [&>button]:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white">
            <DialogTitle className="text-xl">Subir nuevo proyecto</DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-2xl hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* Contenedor con scroll vertical */}
          <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(90vh - 64px)" }}>
            <ProjectUploadForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectButton;