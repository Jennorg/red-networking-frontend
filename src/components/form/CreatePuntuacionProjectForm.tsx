// Tu archivo original, por ejemplo, components/forms/CreatePuntuacionForm.tsx
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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useCreatePuntuacionProject } from "../../../actions/project/actions";
import { Textarea } from "../ui/textarea";
import { RatingStars } from "../misc/RatingStar";

const FormSchema = z.object({
  score: z.string().regex(/^[1-5]$/, "La puntuación debe ser entre 1 y 5"), // Validar que sea un número entre 1 y 5
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
    defaultValues: {
      score: "1", // Establecer un valor por defecto para la puntuación, por ejemplo 1
      feedback: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    console.log("DATA FROM PUTUACION", data);
    const starScore = Number(data.score);
    const puntuacionData = {
      projectID: projectId,
      data: {
        puntuacion: starScore, // Convertir a número entero
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
        <FormLabel className="text-lg text-center text-white"></FormLabel>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-white">Puntuación</FormLabel>
                <FormControl>
                  <RatingStars
                    value={parseInt(field.value, 10) || 0} // Asegurarse de que el valor sea numérico
                    onChange={(newValue) => field.onChange(String(newValue))} // Convertir a string para el formulario
                    maxValue={5} // El máximo de estrellas es 5
                    className="justify-center" // Centrar las estrellas
                    starClassName="h-8 w-8" // Tamaño de las estrellas
                  />
                </FormControl>
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
            "Enviar Puntuación"
          )}
        </Button>
      </form>
    </Form>
  );
}
