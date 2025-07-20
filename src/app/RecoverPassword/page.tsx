"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";

// Esquema de validación para recuperar contraseña
const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
});

// Esquema de validación para cambiar contraseña
const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        "Debe contener al menos un número o símbolo"
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function RecoverPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumberOrSymbol: false,
    passwordsMatch: false,
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
    reset: resetEmail,
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password = watchPassword("password");
  const confirmPassword = watchPassword("confirmPassword");

  // Validar requisitos de contraseña en tiempo real
  useEffect(() => {
    const requirements = {
      minLength: Boolean(password && password.length >= 8),
      hasUppercase: Boolean(password && /[A-Z]/.test(password)),
      hasLowercase: Boolean(password && /[a-z]/.test(password)),
      hasNumberOrSymbol: Boolean(
        password && /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
      ),
      passwordsMatch: Boolean(
        password && confirmPassword && password === confirmPassword
      ),
    };
    setPasswordRequirements(requirements);
  }, [password, confirmPassword]);

  const onSubmitEmail = async (data: RecoverPasswordFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.proceso) {
        setSuccess(result.message);
        setEmailSent(true);
        setEmail(data.email);
        resetEmail();
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.proceso) {
        setSuccess(result.message);
        resetPassword();
        // Redirigir al login después de un momento
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen w-full lg:h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full lg:w-1/2">
        <div className="w-full max-w-md">
          <img
            src="/pngs/uneg-logo.png"
            alt="Logo UNEG"
            className="w-28 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-center mb-2">
            {emailSent ? "Cambiar Contraseña" : "Recuperar Contraseña"}
          </h1>
          <p className="text-sm text-gray-200 text-center mb-8">
            {emailSent
              ? "Ingresa tu nueva contraseña"
              : "Ingresa tu correo electrónico para recuperar tu contraseña"}
          </p>

          {!emailSent ? (
            <form
              onSubmit={handleSubmitEmail(onSubmitEmail)}
              className="space-y-6"
            >
              <div>
                <input
                  {...registerEmail("email")}
                  type="email"
                  id="email"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                    errorsEmail.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  )}
                  placeholder="tu@email.com"
                />
                {errorsEmail.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsEmail.email.message}
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
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className="space-y-6"
            >
              <div>
                <div className="relative">
                  <input
                    {...registerPassword("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={cn(
                      "w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2",
                      errorsPassword.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    )}
                    placeholder="Nueva contraseña"
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

                {/* Requisitos de contraseña interactivos */}
                <div className="mt-2 space-y-1">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.minLength
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {passwordRequirements.minLength ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Mínimo 8 caracteres
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasUppercase
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {passwordRequirements.hasUppercase ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Debe contener al menos una letra mayúscula
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasLowercase
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {passwordRequirements.hasLowercase ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Debe contener al menos una letra minúscula
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasNumberOrSymbol
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {passwordRequirements.hasNumberOrSymbol ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Debe contener al menos un número o símbolo
                  </div>
                </div>

                {errorsPassword.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsPassword.password.message}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    {...registerPassword("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={cn(
                      "w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2",
                      errorsPassword.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    )}
                    placeholder="Confirmar contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmación de contraseña"
                        : "Mostrar confirmación de contraseña"
                    }
                    tabIndex={0}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Requisito de coincidencia de contraseñas */}
                <div className="mt-2">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.passwordsMatch
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {passwordRequirements.passwordsMatch ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Las contraseñas deben coincidir
                  </div>
                </div>

                {errorsPassword.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsPassword.confirmPassword.message}
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
                {isLoading ? "Cambiando contraseña..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium link underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 p-2">
        <img
          src="/pngs/image_signup.png"
          alt="Container"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}
