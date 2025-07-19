"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteCommentButtonProps {
  commentId: string;
  userId: string;
  userRole: string;
  onDeleted: () => void;
}

export default function DeleteCommentButton({
  commentId,
  userId,
  userRole,
  onDeleted,
}: DeleteCommentButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const endpoint =
      userRole === "admin"
        ? `https://red-networking-backend.vercel.app/api/comment/${commentId}/${userId}`
        : `https://red-networking-backend.vercel.app/api/comment-autor/${commentId}/${userId}`;
    try {
      const response = await axios.delete(endpoint);
      if (response.data.ok) {
        toast.success("Comentario eliminado exitosamente.");
        onDeleted();
      } else {
        toast.error(
          response.data.error || "No se pudo eliminar el comentario."
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Error al eliminar el comentario."
        );
      } else {
        toast.error("Error inesperado al eliminar el comentario.");
      }
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
        size="icon"
        className="bg-red-800 hover:bg-red-900 text-white"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>¿Eliminar comentario?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            Esta acción no se puede deshacer. El comentario será eliminado
            permanentemente.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => setOpen(false)}
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
                "Eliminar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
