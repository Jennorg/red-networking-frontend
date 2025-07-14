"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import {
  useCreateProjectRating,
  useCreatePuntuacionProject,
} from "../../../actions/project/actions";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  score: z.string().regex(/^\d+$/, "Debe ser un número"),
  feedback: z.string(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface FormProps {
  projectId: string;
  onClose: () => void;
}

export function CreatePuntuacionForm({ projectId, onClose }: FormProps) {
  const { createPuntuacion } = useCreatePuntuacionProject();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormSchemaType) => {
    const puntuacionData = {
      projectID: projectId,
      data: {
        score: parseInt(data.score, 10),
        feedback: data.feedback,
      },
    };
    await createPuntuacion.mutateAsync(puntuacionData);

    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-6 bg-gray-800 rounded-lg"
      >
        <FormLabel className="text-lg text-center text-white">
          Calificación del Proyecto
        </FormLabel>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-white">Puntuacion</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="1" className="hover:bg-gray-600">
                      Deficiente
                    </SelectItem>
                    <SelectItem value="2" className="hover:bg-gray-600">
                      Insuficiente
                    </SelectItem>
                    <SelectItem value="3" className="hover:bg-gray-600">
                      Aceptable
                    </SelectItem>
                    <SelectItem value="4" className="hover:bg-gray-600">
                      Bueno
                    </SelectItem>
                    <SelectItem value="5" className="hover:bg-gray-600">
                      Excelente
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Recomendación</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escribe tus recomendaciones..."
                    {...field}
                    className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center gap-x-4">
          <Separator className="flex-1 bg-gray-600" />
          <p className="text-gray-300">Red Networking</p>
          <Separator className="flex-1 bg-gray-600" />
        </div>

        <Button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white"
          disabled={createPuntuacion.isPending}
        >
          {createPuntuacion.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Enviar Puntuacion"
          )}
        </Button>
      </form>
    </Form>
  );
}
