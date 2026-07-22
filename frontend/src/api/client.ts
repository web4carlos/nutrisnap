import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateTokens,
} from "./session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };
type RefreshResponse = { access_token: string; refresh_token: string };
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token is available.");

  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  updateTokens(response.data.access_token, response.data.refresh_token);
  return response.data.access_token;
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthRequest = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/refresh",
      "/auth/logout",
    ].some((path) => requestUrl.includes(path));

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      window.dispatchEvent(new Event("auth:session-expired"));
      return Promise.reject(refreshError);
    }
  },
);

export default api;
