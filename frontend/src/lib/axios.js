import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
