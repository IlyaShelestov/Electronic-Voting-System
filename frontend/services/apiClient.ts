import axios, { AxiosError } from "axios";
import { API_URL } from "@/config/env";
import { getAuthToken, removeAuthToken } from "@/utils/tokenHelper";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

function handleApiError(error: AxiosError) {
  const status = error.response?.status;
  const message = (error.response?.data as any)?.message || "Unknown error";

  if (status === 401) {
    removeAuthToken();
    console.warn("Unauthorized. Token removed.");
  } else if (status === 403) {
    console.warn("Forbidden access.");
  } else if (status === 500) {
    console.error("Server error.");
  } else {
    console.error(`API Error: ${message}`);
  }
}
