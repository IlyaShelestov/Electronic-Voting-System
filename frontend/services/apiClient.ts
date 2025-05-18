import axios from "axios";
import { API_URL } from "@/config/env";
import { getAuthToken, removeAuthToken } from "@/utils/tokenHelper";
import { toast } from "react-toastify";
import { userService } from "./userService";

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
  (error) => {
    if (!error.response) {
      toast.error("Ошибка сети. Проверьте подключение!");
    } else {
      const status = error.response.status;
      const message = error.response.data?.message || "Ошибка запроса";

      if (status === 200) {
        toast.success(message);
      } else if (status === 201) {
        toast.success(message);
      } else if (status === 401) {
        toast.warn(message);
        removeAuthToken();
      } else if (status === 403) {
        toast.error("Доступ запрещен!");
      } else if (status === 500) {
        toast.error("Ошибка сервера. Попробуйте позже.");
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);
