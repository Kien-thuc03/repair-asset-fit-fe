import { api } from "../api";

/**
 * Interface cho request đăng nhập
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface cho response đăng nhập từ BE
 */
export interface LoginResponse {
  user: {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    roles: string[];
    permissions: string[];
  };
  token: string;
}

/**
 * Interface cho request đổi mật khẩu
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Interface cho request cập nhật profile
 */
export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  birthDate?: string;
}

/**
 * Interface cho response profile
 */
export interface ProfileResponse {
  fullName: string;
  email: string;
  phoneNumber?: string;
  birthDate?: string;
}

/**
 * API helper functions cho việc xác thực (Authentication)
 */

/**
 * Đăng nhập người dùng
 * @param credentials Thông tin đăng nhập (username, password)
 * @returns Promise với thông tin user và access token
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      "/v1/auth/login",
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Login error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
    );
  }
};

/**
 * Đổi mật khẩu người dùng
 * @param data Thông tin đổi mật khẩu
 * @returns Promise với message thành công
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ message: string }> => {
  try {
    const response = await api.put<{ message: string }>(
      "/v1/auth/change-password",
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Change password error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
    );
  }
};

/**
 * Cập nhật thông tin profile người dùng
 * @param data Thông tin profile cần cập nhật
 * @returns Promise với thông tin profile đã cập nhật
 */
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<ProfileResponse> => {
  try {
    const response = await api.patch<ProfileResponse>(
      "/v1/auth/update-profile",
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Update profile error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message ||
        "Cập nhật thông tin thất bại. Vui lòng thử lại."
    );
  }
};

/**
 * Lưu token vào localStorage
 * @param token JWT token
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

/**
 * Lấy token từ localStorage
 * @returns JWT token hoặc null
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Xóa token khỏi localStorage (logout)
 */
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns true nếu có token, false nếu không
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Lưu thông tin user vào localStorage
 * @param user Thông tin user
 */
export const saveUser = (user: LoginResponse["user"]): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Lấy thông tin user từ localStorage
 * @returns Thông tin user hoặc null
 */
export const getUser = (): LoginResponse["user"] | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Xóa thông tin user khỏi localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem("user");
};

/**
 * Đăng xuất - xóa tất cả thông tin authentication
 */
export const logout = (): void => {
  removeToken();
  removeUser();
};

/**
 * Đăng nhập và lưu thông tin
 * @param credentials Thông tin đăng nhập
 * @returns Promise với thông tin user và token
 */
export const loginAndSave = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await login(credentials);
  saveToken(response.token);
  saveUser(response.user);
  return response;
};
