"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  rol: z.enum(["admin", "profesor", "estudiante"], {
    errorMap: () => ({ message: "Debes seleccionar un rol válido" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  userId: string;
  onClose: () => void;
  refetchProfile: () => void;
}


export default function RoleChangeForm({ userId, onClose, refetchProfile }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rol: "estudiante",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);

      const res = await axios.post(
        `https://red-networking-backend.vercel.app/api/users/${userId}/cambiar-rol`,
        { rol: values.rol }
      );

      setIsLoading(false);

      if (res.data.ok) {
        toast.success(res.data.message);
        refetchProfile(); 
        onClose();
        form.reset();
      } else {
        toast.error(res.data.error || "No se pudo cambiar el rol.");
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || "Error en la solicitud."
          : "Error en la solicitud.";
      toast.error(errorMessage);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="rol"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Rol</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#1f2937] text-white">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1f2937] text-white">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="profesor">Profesor</SelectItem>
                    <SelectItem value="estudiante">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white"
          >
            Confirmar cambio
          </Button>
        </form>
      </Form>
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
    </>
  );
}
