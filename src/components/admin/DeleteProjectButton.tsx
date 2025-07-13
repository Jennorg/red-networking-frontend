"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteProjectButtonProps {
  projectId: string;
  adminId: string;
}

export default function DeleteProjectButton({ projectId, adminId }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://red-networking-backend.vercel.app/api/project/${projectId}/${adminId}`
      );
      if (response.data.ok) {
        toast.success("Proyecto eliminado exitosamente.");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response.data.error || "No se pudo eliminar el proyecto.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al eliminar el proyecto.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Eliminar Proyecto
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setOpen(false)} className="text-black bg-white hover:bg-gray-200">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar eliminación"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}