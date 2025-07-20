import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar que los campos estén presentes
    if (!email || !password) {
      return NextResponse.json(
        {
          proceso: false,
          message: "El correo electrónico y la contraseña son requeridos",
        },
        { status: 400 }
      );
    }

    // Hacer la petición al backend de producción
    const response = await fetch(
      `https://red-networking-backend.vercel.app/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en reset-password:", error);
    return NextResponse.json(
      { proceso: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
