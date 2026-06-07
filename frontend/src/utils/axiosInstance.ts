import axios from "axios";

const ENV = import.meta.env.VITE_ENV;
let baseURL = ENV === 'Dev' ? "http://localhost:5001" : "/api";

const instance = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. لو مفيش response (سيرفر واقع مثلاً)، ارمي الإيرور فوراً
    if (!error.response) return Promise.reject(error);

    const request = error.config;
    const { status } = error.response;
    const isRetry = request._retry;
    const isRefreshRoute = request.url?.includes("/auth/refresh-token");

    // 2. ماولة تجديد التوكن فقط إذا كان 401
    if (status === 401 && !isRetry && !isRefreshRoute) {
      request._retry = true;
      try {
        await instance.post("/auth/refresh-token");
        return instance(request); // إعادة تنفيذ الريكويست الأصلي
      } catch (refreshError) {
        // شلنا الـ window.location.href من هنا!
        // دلوقتي الـ Interceptor هيرجع الإيرور للـ Component اللي طلب الريكويست
        return Promise.reject(refreshError);
      }
    }

    // 3. أي إيرور تاني يرجع للـ Component
    return Promise.reject(error);
  },
);

export default instance;