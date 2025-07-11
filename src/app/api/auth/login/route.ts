import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // URL del backend - usar la URL de producción
    const backendUrl = "https://red-networking-backend.vercel.app";

    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error en login API route:", error);
    return NextResponse.json(
      { proceso: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
