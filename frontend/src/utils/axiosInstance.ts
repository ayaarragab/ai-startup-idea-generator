import axios from "axios";

const ENV = import.meta.env.VITE_ENV;
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const instance = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);

    const request = error.config;
    const { status } = error.response;
    const isRetry = request._retry;
    const isRefreshRoute = request.url?.includes("/auth/refresh-token");

    if (status === 401 && !isRetry && !isRefreshRoute) {
      request._retry = true;
      try {
        await instance.post("/auth/refresh-token");
        return instance(request); // إعادة تنفيذ الريكويست الأصلي
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;