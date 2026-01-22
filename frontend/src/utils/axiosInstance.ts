import axios from "axios";

const baseURL = 'http://localhost:5000';

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json", // Optional: Set default headers
  },
  withCredentials: true,
});

export default instance;