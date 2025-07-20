"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteProjectProps {
  projectId: string;
  userId: string;
  userRole: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function DeleteProject({
  projectId,
  userId,
  userRole,
  open,
  onOpenChange,
}: DeleteProjectProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const endpoint =
        userRole === "admin"
          ? `https://red-networking-backend.vercel.app/api/project/${projectId}/${userId}`
          : `https://red-networking-backend.vercel.app/api/project-autor/${projectId}/${userId}`;

      const response = await axios.delete(endpoint);

      if (response.data.ok) {
        toast.success("Proyecto eliminado exitosamente.");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response.data.error || "No se pudo eliminar el proyecto.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Error al eliminar el proyecto."
        );
      } else {
        toast.error("Error inesperado al eliminar el proyecto.");
      }
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            Esta acción no se puede deshacer. El proyecto será eliminado
            permanentemente.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="text-black bg-white hover:bg-gray-200"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirmar eliminación"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
