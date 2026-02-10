import axios from "axios";

const baseURL = "http://localhost:5000";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json", // Optional: Set default headers
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const { status } = error.response;
    const isRetry = request._retry;
    const isRefreshRoute = request.url.includes("/auth/refresh-token");

    if (status === 401 && !isRetry && !isRefreshRoute) {
      request._retry = true;
      try {
        await instance.post("/auth/refresh-token");
        return instance(request);
      } catch (error) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  },
);

export default instance;
