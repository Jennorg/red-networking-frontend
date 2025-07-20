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

    // Hacer la petición al backend
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
      }/auth/cambiar-contrasena`,
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
    console.error("Error en cambiar contraseña:", error);
    return NextResponse.json(
      { proceso: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
