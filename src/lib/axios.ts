import axios from "axios";
import { rfToken } from "../utils/apis";
import { BASE_API_URL } from "../configs";
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 90 * 1000, // 90s
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await rfToken();
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error?.response?.data || {});
  }
);

export default axiosInstance;
