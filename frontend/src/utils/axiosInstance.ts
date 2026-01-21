/// <reference types="vite/client" />
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL as string;

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json", // Optional: Set default headers
  },
  withCredentials: true,
});

export default instance;