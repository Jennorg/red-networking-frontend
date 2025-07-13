"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, EyeIcon, EyeOffIcon,} from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "El correo electrónico es requerido").email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.proceso) {
        toast.success(result.message || "Inicio de sesión exitoso");

        const userData = {
          id: result.token?.id || result.user?.id || result.userId || result.id,
          email: result.user?.email || result.email || "",
          name: result.user?.name || result.name || "",
          role: result.user?.role || result.role || "",
        };

        login(result.token, userData);
        reset();

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(result.message || "No se pudo iniciar sesión");
      }
    } catch (err) {
      toast.error("Error de conexión. Inténtalo de nuevo.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen w-full lg:h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full lg:w-1/2">
        <div className="w-full max-w-md">
          <Image src="/pngs/uneg-logo.png" alt="Logo UNEG" width={112} height={112} className="w-28 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-center mb-2">Iniciar Sesión</h1>
          <p className="text-sm text-gray-200 text-center mb-8">
            Inicia sesión y disfruta de un mundo de posibilidades
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register("email")}
                type="email"
                id="email"
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                )}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                )}
                placeholder="contraseña"
              />
               <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-3"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-white" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-white" />
                        )}
                      </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2 px-4 rounded-md font-medium transition-colors",
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              ¿No tienes cuenta?{" "}
              <Link href="/Signup" className="text-[#58A6FF] hover:text-blue-700 underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 p-2">
        <Image
          src="/pngs/image_signup.png"
          alt="Container"
          width={800}
          height={600}
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}