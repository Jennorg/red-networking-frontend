"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const { email, password } = values;

    try {
      setIsLoading(true);

      const login = await axios.post(
        "https://red-networking-backend.vercel.app/auth/login",
        { email, password }
      );

      setIsLoading(false);

      if (login.data.proceso) {
        const token = login.data.token;
        localStorage.setItem("token", token);

        toast.success("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(login.data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Error al conectar con el servidor");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#161B22]">
      <div className="flex-[3] flex flex-col justify-center items-center px-8 py-6 mx-6">
        <Image src="/pngs/uneg.png" alt="UNEG" width={80} height={80} />
        <h1 className="text-3xl font-bold mt-5 text-white">Iniciar Sesión</h1>
        <p className="text-sm text-white mt-2">Ingresa con tus credenciales</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-sm mt-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">Email</FormLabel>
                  <FormControl className="text-white">
                    <Input {...field} placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">Contraseña</FormLabel>
                  <FormControl className="text-white">
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Ingresa tu contraseña"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-white" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-white" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#58A6FF] text-black hover:bg-blue-500 transition-colors"
            >
              Iniciar Sesión
            </Button>
          </form>
        </Form>

        <p className="text-sm text-white mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/Signup" className="text-[#58A6FF] underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
      <div className="hidden md:flex flex-[6] items-center justify-center rounded-lg relative m-3">
        <Image
          src="/pngs/image_signup.png"
          alt="Background"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}