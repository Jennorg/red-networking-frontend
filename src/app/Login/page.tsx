"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useState } from "react";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post(
        "https://red-networking-backend.vercel.app/auth/login",
        data
      );

      if (response.data) {
        setSuccess("¡Autenticación válida!");
        reset(); // Limpiar el formulario después de un login exitoso
      }
    } catch (err) {
      setError("Autenticación fallida. Por favor, verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen w-full lg:h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col items-center justify-center p-8 w-full lg:w-1/2">
        <img src="/uneg_log.png" alt="Logo UNEG" className="mb-8" />
        <h1 className="text-4xl font-bold mb-4">Iniciar sesión</h1>
        <span className="text-sm text-gray-50 mb-8 text-center">
          Inicia sesión y disfruta de un mundo de posibilidades
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Contraseña"
            type="password"
            id="password"
            placeholder="Contraseña"
            {...register("password")}
            error={errors.password?.message}
          />
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-md">
              <p className="text-sm text-green-500">{success}</p>
            </div>
          )}
          <Button isLoading={isLoading} type="submit" />
        </form>

        <span className="mt-8 text-sm text-gray-50 text-center">
          ¿No tienes una cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </span>
        <span className="text-sm text-gray-50 text-center">
          ¿Olvidaste tu contraseña?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Recuperar contraseña
          </a>
        </span>
      </div>

      <div className="hidden lg:block lg:w-1/2 p-2">
        <img
          src="/container.png"
          alt="Container"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};
