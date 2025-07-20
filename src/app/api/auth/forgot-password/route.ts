import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validar que el email esté presente
    if (!email) {
      return NextResponse.json(
        { proceso: false, message: "El correo electrónico es requerido" },
        { status: 400 }
      );
    }

    // Hacer la petición al backend de producción
    const response = await fetch(
      `https://red-networking-backend.vercel.app/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { proceso: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
