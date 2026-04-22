import axios from "axios";


const ENV = import.meta.env.VITE_ENV;

let baseURL;

if (ENV === 'Dev') {
  baseURL = "http://localhost:5001";
} else {
  baseURL = "/api";
}

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
