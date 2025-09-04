import axios from "axios";

// Có thể cấu hình từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Xử lý trường hợp hết hạn token
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Các hàm wrapper cho API
export const apiClient = {
  get: <T>(url: string, params = {}) => 
    api.get<T>(url, { params }).then((res) => res.data),
  
  post: <T>(url: string, data = {}) => 
    api.post<T>(url, data).then((res) => res.data),
  
  put: <T>(url: string, data = {}) => 
    api.put<T>(url, data).then((res) => res.data),
  
  delete: <T>(url: string) => 
    api.delete<T>(url).then((res) => res.data),
};
