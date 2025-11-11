import axios from "axios";

// Có thể cấu hình từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    // Serialize array params theo định dạng key=value1&key=value2 thay vì key[]=value1&key[]=value2
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Lặp qua từng phần tử của array và thêm với cùng key
          value.forEach((item) => {
            if (item !== undefined && item !== null && item !== '') {
              searchParams.append(key, String(item));
            }
          });
        } else if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
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

  patch: <T>(url: string, data = {}) =>
    api.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) => api.delete<T>(url).then((res) => res.data),
};
