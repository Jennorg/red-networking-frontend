"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteUserButtonProps {
  userId: string;
  currentUserId: string;
  currentUserRole: string;
}

export default function DeleteUserButton({
  userId,
  currentUserId,
  currentUserRole,
}: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const endpoint =
        currentUserRole === "admin"
          ? `https://red-networking-backend.vercel.app/api/user/${userId}/${currentUserId}`
          : `https://red-networking-backend.vercel.app/api/account/${userId}`;
      const response = await axios.delete(endpoint);
      if (response.data.ok) {
        toast.success("Usuario eliminado exitosamente.");

        if (currentUserId === userId) {
          logout(); // Cierra sesión si es su propia cuenta
        }

        setTimeout(() => {
          router.push("/"); // Redirige al home después de eliminar el usuario
        }, 1000);
      } else {
        toast.error(response.data.error || "No se pudo eliminar el usuario.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Error al eliminar el usuario.");
      } else {
        toast.error("Error al eliminar el usuario.");
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
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Eliminar Usuario
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
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
