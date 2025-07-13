import axios from "axios";

// 1. Crear instancia base
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // ↓ Eliminamos headers globales para mayor flexibilidad
});

// 2. Interceptor de Request (para debuggear y auto-auth)
axiosInstance.interceptors.request.use(
  (config) => {
    // Agrega headers comunes dinámicamente
    const newConfig = { ...config };

    if (!newConfig.headers["Content-Type"]) {
      newConfig.headers["Content-Type"] = "application/json"; // Default a JSON
    }

    // Auto-incluye token si existe (opcional)
    const token = localStorage.getItem("token");
    if (token && !newConfig.headers["Authorization"]) {
      newConfig.headers["Authorization"] = `Bearer ${token}`;
    }

    console.debug("⬆️ Request:", {
      // Debugging
      url: newConfig.url,
      method: newConfig.method,
      data: newConfig.data,
      headers: newConfig.headers,
    });

    return newConfig;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 3. Interceptor de Response (manejo centralizado de errores)
axiosInstance.interceptors.response.use(
  (response) => {
    console.debug("⬇️ Response:", {
      // Debugging
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    };

    console.error("❌ API Error:", errorDetails);

    // Mensajes personalizados por código
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.message || "Datos inválidos";
          break;
        case 401:
          error.message = "No autorizado - Por favor inicia sesión";
          break;
        case 404:
          error.message = "Recurso no encontrado";
          break;
        default:
          error.message = `Error del servidor (${error.response.status})`;
      }
    } else if (error.message === "Network Error") {
      error.message = "No hay conexión al servidor";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
