import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

export const Button = ({
  isLoading,
  type = "submit",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {isLoading ? "Cargando..." : "Iniciar sesión"}
    </button>
  );
};
