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
import { Project } from "../../../types";
import { Textarea } from "../ui/textarea";
import { useCreateProjectRating } from "../../../actions/project/actions";

const FormSchema = z.object({
  security: z.string().regex(/^\d+$/, "Debe ser un número"),
  functionality: z.string().regex(/^\d+$/, "Debe ser un número"),
  efficiency: z.string().regex(/^\d+$/, "Debe ser un número"),
  design: z.string().regex(/^\d+$/, "Debe ser un número"),
  architecture: z.string().regex(/^\d+$/, "Debe ser un número"),

  feedback: z.string(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface FormProps {
  initialData?: Project;
  isEditing?: boolean;
  onClose: () => void;
}

export function CreateProjectRatingForm({
  initialData,
  isEditing,
  onClose,
}: FormProps) {
  const { createRating } = useCreateProjectRating();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormSchemaType) => {
    console.log("Datos del formulario:", data);
    if (initialData && isEditing) {
    } else {
      // Convertir explícitamente a número (por si acaso)
      const totalScore =
        Number(data.security) +
        Number(data.functionality) +
        Number(data.efficiency) +
        Number(data.design) +
        Number(data.architecture);
      const averageScore = totalScore / 5; // 5 campos en total

      const value = {
        projectId: "6858d8a712e9a76a07d6db69",
        data: {
          puntuacion: averageScore,
          feedback: data.feedback,
        },
      };
      await createRating.mutateAsync(value);
    }

    onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-3"
      >
        <FormLabel className="text-lg text-center"></FormLabel>

        <FormField
          control={form.control}
          name="design"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Diseño</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Deficiente</SelectItem>
                  <SelectItem value="2">Insuficiente</SelectItem>
                  <SelectItem value="3">Aceptable</SelectItem>
                  <SelectItem value="4">Bueno</SelectItem>
                  <SelectItem value="5">Excelente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="functionality"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Funcionalidad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Deficiente</SelectItem>
                  <SelectItem value="2">Insuficiente</SelectItem>
                  <SelectItem value="3">Aceptable</SelectItem>
                  <SelectItem value="4">Bueno</SelectItem>
                  <SelectItem value="5">Excelente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="efficiency"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Eficiencia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem value="1">Deficiente</SelectItem>
                  <SelectItem value="2">Insuficiente</SelectItem>
                  <SelectItem value="3">Aceptable</SelectItem>
                  <SelectItem value="4">Bueno</SelectItem>
                  <SelectItem value="5">Excelente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="architecture"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Arquitectura</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem value="1">Deficiente</SelectItem>
                  <SelectItem value="2">Insuficiente</SelectItem>
                  <SelectItem value="3">Aceptable</SelectItem>
                  <SelectItem value="4">Bueno</SelectItem>
                  <SelectItem value="5">Excelente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Seguridad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem value="1">Deficiente</SelectItem>
                  <SelectItem value="2">Insuficiente</SelectItem>
                  <SelectItem value="3">Aceptable</SelectItem>
                  <SelectItem value="4">Bueno</SelectItem>
                  <SelectItem value="5">Excelente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recomendacion</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center gap-x-4">
          <Separator className="flex-1" />
          <p className="text-muted-foreground">Red Networking</p>
          <Separator className="flex-1" />
        </div>

        <Button type="submit" />
        {/* <Button disabled={createInformationSource.isPending}>
          {createInformationSource.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Enviar"
          )}
        </Button> */}
      </form>
    </Form>
  );
}
