"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TAG_OPTIONS, TOOL_OPTIONS } from "@/components/form/project-options";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Image as ImageIcon,
  File as FileIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/multiselect"; 

const projectUploadSchema = z.object({
  title: z.string().min(2, { message: "El título es obligatorio" }),
  authors: z.string().min(2, { message: "Autores requeridos" }),
  date: z.date({ required_error: "La fecha es obligatoria" }),
  tags: z
    .array(z.string())
    .min(1, { message: "Selecciona al menos una etiqueta" }),
  description: z.string().min(10, { message: "Descripción muy corta" }),
  repositoryLink: z.string().url({ message: "URL del repositorio inválida" }),
  tools: z
    .array(z.string())
    .min(1, { message: "Selecciona al menos una herramienta" }),
  image: z.any().optional(),
  document: z.any().optional(),
});
type ProjectUploadValues = z.infer<typeof projectUploadSchema>;

export default function ProjectUploadForm() {
  const form = useForm<ProjectUploadValues>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      title: "",
      authors: "",
      date: undefined,
      tags: [],
      description: "",
      repositoryLink: "",
      tools: [],
      image: undefined,
      document: undefined,
    },
  });

  function onSubmit(values: ProjectUploadValues) {
    // Lógica para enviar el formulario
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center w-full mx-5 mb-5 p-8">
      <h2 className="text-3xl font-bold text-white mb-8 mt-8 text-center">
        Formulario Nuevo Proyecto
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-6"
        >
          {/* Título */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Título del proyecto
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white text-black"
                    placeholder="Título del proyecto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Autores y Fecha */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">
                    Autores del Proyecto
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white text-black"
                      placeholder="Autores"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal bg-white flex items-center gap-2"
                      >
                        {field.value
                          ? format(field.value, "PPP", { locale: es })
                          : "Selecciona una fecha"}
                        <CalendarIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={es}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Etiquetas */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Etiquetas</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={TAG_OPTIONS}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecciona etiquetas"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-white text-black"
                    placeholder="Describe el proyecto..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
              control={form.control}
              name="repositoryLink"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">
                    Link del Repositorio
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white text-black"
                      placeholder="https://github.com/usuario/repositorio"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Herramientas */}
          <FormField
            control={form.control}
            name="tools"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Herramientas utilizadas
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={TOOL_OPTIONS}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecciona herramientas"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cargar Imagen y Documento */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">Cargar Imagen</FormLabel>
                  <FormControl>
                    <label className="flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                      <span className="text-sm ">
                        {field.value
                          ? field.value.name
                          : "Selecciona una imagen"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="hidden"
                      />
                      <ImageIcon size={20} />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">Cargar Documento</FormLabel>
                  <FormControl>
                    <label className="flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                      <span className="text-sm ">
                        {field.value
                          ? field.value.name
                          : "Selecciona un documento"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="hidden"
                      />
                      <FileIcon size={20} />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botón Enviar */}
          <Button
            type="submit"
            className="w-full border border-white bg-black text-white hover:bg-gray-800"
          >
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
}
