import { useAuth } from "@/contexts/AuthContext";
import axios, { AxiosRequestConfig } from "axios";

export function useAuthenticatedRequest() {
  const { token } = useAuth();

  const authenticatedRequest = async <T = any>(
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

  const get = <T = any>(url: string, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "GET", url });

  const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "POST", url, data });

  const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "PUT", url, data });

  const del = <T = any>(url: string, config?: AxiosRequestConfig) =>
    authenticatedRequest<T>({ ...config, method: "DELETE", url });

  return {
    get,
    post,
    put,
    delete: del,
    request: authenticatedRequest,
  };
} 