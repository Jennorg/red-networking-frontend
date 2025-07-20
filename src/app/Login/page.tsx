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
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(
      /[0-9!@#$%^&*(),.?":{}|<>]/,
      "Debe contener al menos un número o símbolo"
    ),
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
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={cn(
                    "w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2",
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  )}
                  placeholder="contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

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
              <Link
                href="/RecoverPassword"
                className="text-blue-600 hover:text-blue-700 font-medium link underline"
              >
                Pulsa aquí
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
    </div>
  );
}
