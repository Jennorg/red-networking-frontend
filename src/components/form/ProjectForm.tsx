"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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
  X, Loader2,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/multiselect"; 
import { useEffect, useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";

const projectUploadSchema = z.object({
  title: z.string().min(2, { message: "El título es obligatorio" }),
  authors: z
    .array(z.string().length(24))
    .min(1,{ message: "Selecciona al menos un autor" }),
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function ProjectUploadForm() {

  const [usuarios, setUsuarios] = useState<{ id: string; nombre: string }[]>([]); 
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://red-networking-backend.vercel.app/auth/users")
      .then((res) => {
        const lista = res.data.users.map((u: { _id: string; name: string }) => ({
          id: u._id,
          nombre: u.name,
        }));
        setUsuarios(lista);
      })
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  const form = useForm<ProjectUploadValues>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      title: "",
      authors: [],
      date: undefined,
      tags: [],
      description: "",
      repositoryLink: "",
      tools: [],
      image: undefined,
      document: undefined,
    },
  });

async function onSubmit(values: ProjectUploadValues) {
    setIsLoading(true);
    try {
      const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

      if (values.image && values.image.size > MAX_FILE_SIZE) {
        toast.error("La imagen supera el tamaño máximo permitido de 4.5MB");
        return;
      }

      if (values.document && values.document.size > MAX_FILE_SIZE) {
        toast.error("El documento supera el tamaño máximo permitido de 4.5MB");
        return;
      }

      const imageBase64 = values.image ? await fileToBase64(values.image) : null;
      const documentBase64 = values.document ? await fileToBase64(values.document) : null;

      const payload = {
        ...values, 
        date: values.date.toISOString(), 
        image: imageBase64,
        document: documentBase64,
      };

     const res = await axios.post("https://red-networking-backend.vercel.app/api/subida_proyecto", payload);  
     console.log("Proyecto creado:", res.data);

    toast.success("Proyecto subido correctamente");
    form.reset();
  } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error("Error al enviar:", errorMessage);
       toast.error("Error enviando proyecto, intenta nuevamente");
  } finally {
    setIsLoading(false); // Desactivar loader siempre
  }
}

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gray-900">
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
      <h2 className="text-3xl font-bold text-white mb-16 mt-5 text-center">
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

          {/* Autores */}
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
                    <MultiSelect
                    options={usuarios.map((u) => ({ label: u.nombre, value: u.id }))}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecciona autores"
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fecha */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-white">Fecha</FormLabel>
                  <Popover >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal bg-white text-black flex items-center gap-2"
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

          {/* Repositorio */}

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
                    <div className="flex items-center gap-2">
                      <label className=" flex-1 flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                          <span className="text-sm truncate max-w-[250px]">
                            {field.value?.name ?? "Selecciona una imagen"}
                          </span>
                          <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            className="hidden"
                          />
                          <ImageIcon size={20} />
                      </label>

                      {field.value && (
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(undefined);
                            if (imageInputRef.current) {
                              imageInputRef.current.value = ""; 
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Eliminar imagen"
                        >
                          <X size={18} />
                        </button>
                      )}
                      </div>

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
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                        <span className="text-sm truncate max-w-[250px]">
                          {field.value
                            ? field.value.name
                            : "Selecciona un documento"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          ref={documentInputRef}
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="hidden"
                        />
                        <FileIcon size={20} />
                      </label>

                      {field.value && (
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(undefined);
                            if (documentInputRef.current) {
                              documentInputRef.current.value = ""; 
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Eliminar documento"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botón Enviar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full border border-white bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
