"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
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
import { MultiSelect } from "@/components/ui/multiselect";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Loader2,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { TAG_OPTIONS, TOOL_OPTIONS } from "@/components/form/project-options";
import Image from "next/image";

const schema = z.object({
  title: z.string().min(2, { message: "El título es obligatorio" }),
  description: z.string().min(10, { message: "La descripción es muy corta" }),
  tags: z
    .array(z.string())
    .min(1, { message: "Selecciona al menos una etiqueta" }),
  tools: z
    .array(z.string())
    .min(1, { message: "Selecciona al menos una herramienta" }),
  date: z.date({ required_error: "La fecha es obligatoria" }),
  repositoryLink: z.string().url({ message: "URL no válida" }),
  coAuthors: z.array(z.string()).optional(),
  image: z.any(),
  document: z.any().optional(),
});

type EditValues = z.infer<typeof schema>;

interface Proyecto {
  _id: string;
  title: string;
  description: string;
  authors: string[];
  tags: string[];
  tools: string[];
  repositoryLink: string;
  image: string;
  document: string;
  puntuacion: number[];
  comments: string[];
  date: string;
}

interface EditProps {
  project: Proyecto;
  onSuccess?: () => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function EditProjectForm({ project, onSuccess }: EditProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<{ id: string; nombre: string }[]>(
    []
  );
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    project.image || null
  );

  useEffect(() => {
    axios
      .get("https://red-networking-backend.vercel.app/auth/users")
      .then((res) => {
        const lista = res.data.users
          .filter((u: { _id: string }) => u._id !== user?.id)
          .map((u: { _id: string; name: string }) => ({
            id: u._id,
            nombre: u.name,
          }));
        setUsuarios(lista);
      })
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, [user]);

  const form = useForm<EditValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project.title,
      description: project.description,
      tags: project.tags || [],
      tools: project.tools || [],
      coAuthors: project.authors?.filter((id: string) => id !== user?.id) ?? [],
      date: project.date ? new Date(project.date) : undefined,
      repositoryLink: project.repositoryLink,
      image: undefined,
      document: undefined,
    },
  });

  async function onSubmit(values: EditValues) {
    setIsLoading(true);

    try {
      let imageBase64 = project.image;
      let documentBase64 = project.document || null;

      if (values.image instanceof File) {
        if (values.image.size <= 0) {
          toast.error("La imagen seleccionada no es válida");
          return;
        }
        imageBase64 = await fileToBase64(values.image);
      }

      if (!imageBase64) {
        toast.error("Debes subir una imagen");
        return;
      }

      if (values.document instanceof File) {
        documentBase64 = await fileToBase64(values.document);
      }

      await axios.put(
        `https://red-networking-backend.vercel.app/api/update-project/${project._id}/autor/${user?.id}`,
        {
          ...values,
          date: values.date.toISOString(),
          image: imageBase64,
          document: documentBase64,
          authors: [user?.id, ...(values.coAuthors ?? [])],
        }
      );

      toast.success("Proyecto actualizado correctamente");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar proyecto");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Título</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white text-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coAuthors"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white">
                Co-autores (opcional)
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={usuarios.map((u) => ({
                    label: u.nombre,
                    value: u.id,
                  }))}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Selecciona co-autores"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} className="bg-white text-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repositoryLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Repositorio</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white text-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white text-black"
                  >
                    {field.value
                      ? format(field.value, "PPP", { locale: es })
                      : "Selecciona fecha"}
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

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Etiquetas</FormLabel>
              <FormControl>
                <MultiSelect
                  options={TAG_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Herramientas</FormLabel>
              <FormControl>
                <MultiSelect
                  options={TOOL_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Imagen</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center">
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Imagen del proyecto"
                    width={400} // Necesario para Next.js
                    height={300} // Necesario para Next.js
                    className="rounded-lg border border-gray-700 object-contain h-auto max-h-40"
                  />
                )}
                </div>
                <label className="flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                  <span className="text-sm truncate max-w-[250px]">
                    {field.value?.name ?? "Selecciona una imagen"}
                  </span>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue("image", file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewImage(url);
                      }
                    }}
                    className="hidden"
                  />
                  <ImageIcon size={20} />
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Documento (opcional)</FormLabel>
              <div className="flex flex-col gap-2">
                {project.document && (
                  <a
                    href={project.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline text-sm"
                  >
                    Ver documento actual
                  </a>
                )}
                <label className="flex items-center justify-between gap-2 bg-white text-black px-3 py-2 rounded cursor-pointer border border-gray-300">
                  <span className="text-sm truncate max-w-[250px]">
                    {field.value?.name ?? "Selecciona un documento"}
                  </span>
                  <input
                    type="file"
                    ref={documentInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <FileIcon size={20} />
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="border-white border-1 w-full"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Actualizar"
          )}
        </Button>
      </form>
    </Form>
  );
}
