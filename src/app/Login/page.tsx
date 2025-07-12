"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
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
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result)

      if (result.proceso) {
        setSuccess(result.message);
        
        // Extraer datos del usuario de la respuesta
        const userData = {
          id: result.token?.id || result.user?.id || result.userId || result.id,
          email: result.user?.email || result.email || '',
          name: result.user?.name || result.name || ''
        };
        
        console.log('User data extracted:', userData);
        
        // Usar el contexto de autenticación con datos completos del usuario
        login(result.token.token, userData);
        
        // Limpiar el formulario
        reset();
        
        // Redirigir a la página principal después de un breve delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen w-full lg:h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full lg:w-1/2">
        <div className="w-full max-w-md">
          <Image
            src="/pngs/uneg-logo.png"
            alt="Logo UNEG"
            width={112}
            height={112}
            className="w-28 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-center mb-2">
            Iniciar Sesión
          </h1>
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
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                )}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                id="password"
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                )}
                placeholder="contraseña"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2 px-4 rounded-md font-medium transition-colors",
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Has olvidado tu contraseña?{" "}
              <a
                href="/Signup"
                className="text-blue-600 hover:text-blue-700 font-medium link underline"
              >
                Pulsa aquí
              </a>
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
    </div>
  );
}