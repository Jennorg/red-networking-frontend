import { useAuth } from "@/contexts/AuthContext";
import axios, { AxiosRequestConfig } from "axios";

export function useAuthenticatedRequest() {
  const { token } = useAuth();

  const authenticatedRequest = async <T = unknown>(
    config: AxiosRequestConfig
  ): Promise<T> => {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "GET", url });

  const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "POST", url, data });

  const put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "PUT", url, data });

  const del = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "DELETE", url });

  return {
    get,
    post,
    put,
    delete: del,
    request: authenticatedRequest,
  };
} 