"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RoleChangeForm from "@/components/form/RoleChangeForm";

export default function RoleChangeButton({ userId, refetchProfile }: { userId: string, refetchProfile: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
        Cambiar Rol
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#161B22] text-white [&>button]:hidden">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg">Asignar nuevo rol</DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-red-500 text-xl"
            >
              ✕
            </button>
          </div>

          <RoleChangeForm userId={userId} onClose={() => setOpen(false)}  refetchProfile={refetchProfile} />
        </DialogContent>
      </Dialog>
    </>
  );
}