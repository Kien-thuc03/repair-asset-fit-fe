import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { IUpdateUserRequest, IUserWithRoles } from "@/types/user";
import { getUserById, updateUser as updateUserApi } from "@/lib/api/users";
import { changePassword as changePasswordApi } from "@/lib/api/auth";

interface UserDetail {
  id: string;
  username: string;
  fullName: string;
  email: string;
  unitId?: string;
  phoneNumber?: string;
  birthDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  unitName?: string;
  unitType?: string;
  unitPhone?: string;
  unitEmail?: string;
}

interface UseProfileReturn {
  userDetails: UserDetail | null;
  updateProfile: (data: IUpdateUserRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  refreshUserDetails: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook để quản lý thông tin cá nhân của user với tích hợp PostgreSQL
 */
export function useProfile(): UseProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const { user } = useAuth();

  /**
   * Chuyển đổi IUserWithRoles từ API sang UserDetail
   */
  const convertToUserDetail = (apiUser: IUserWithRoles): UserDetail => {
    return {
      id: apiUser.id,
      username: apiUser.username,
      fullName: apiUser.fullName,
      email: apiUser.email || '',
      unitId: apiUser.unit?.id,
      phoneNumber: apiUser.phoneNumber,
      birthDate: apiUser.birthDate,
      status: apiUser.status,
      createdAt: apiUser.createdAt || new Date().toISOString(),
      updatedAt: apiUser.updatedAt || new Date().toISOString(),
      deletedAt: apiUser.deletedAt || null,
      unitName: apiUser.unit?.name,
      unitType: apiUser.unit?.type,
      // Note: phone và email không có trong unit type hiện tại
      unitPhone: undefined,
      unitEmail: undefined,
    };
  };

  /**
   * Lấy thông tin chi tiết của user từ PostgreSQL
   */
  const fetchUserDetails = useCallback(async (userId: string) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Gọi API getUserById
      const apiUser = await getUserById(userId);
      
      // Chuyển đổi sang format UserDetail
      const userDetail = convertToUserDetail(apiUser);
      
      setUserDetails(userDetail);

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Không thể lấy thông tin người dùng";
      setError(errorMessage);
      console.error("Fetch user details error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh thông tin user
   */
  const refreshUserDetails = useCallback(async () => {
    if (user?.id) {
      await fetchUserDetails(user.id);
    }
  }, [user?.id, fetchUserDetails]);

  /**
   * Cập nhật thông tin cá nhân
   */
  const updateProfile = useCallback(async (data: IUpdateUserRequest) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Chuẩn bị dữ liệu để gửi lên API
      const updateData: IUpdateUserRequest = {
        ...data,
      };

      // Đảm bảo birthDate ở định dạng YYYY-MM-DD (nếu có)
      if (updateData.birthDate) {
        // Nếu là string có timestamp, chuyển về YYYY-MM-DD
        if (updateData.birthDate.includes('T') || updateData.birthDate.includes(':')) {
          const dateObj = new Date(updateData.birthDate);
          updateData.birthDate = dateObj.toISOString().split('T')[0];
        } else {
          // Đảm bảo format YYYY-MM-DD
          updateData.birthDate = updateData.birthDate.split('T')[0];
        }
      }

      // Gọi API updateUser
      await updateUserApi(user.id, updateData);

      // Refresh user details sau khi cập nhật thành công
      await refreshUserDetails();

    } catch (err) {
      let errorMessage = "Cập nhật thông tin thất bại";
      
      // Xử lý error message từ backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        if (axiosError.response?.data?.message) {
          const backendMessage = axiosError.response.data.message;
          // Nếu message là array, join thành string
          errorMessage = Array.isArray(backendMessage) 
            ? backendMessage.join(', ') 
            : backendMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error("Update profile error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshUserDetails]);

  /**
   * Thay đổi mật khẩu
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Gọi API changePassword từ auth.ts
      await changePasswordApi({
        currentPassword,
        newPassword,
        confirmPassword,
      });

    } catch (err) {
      let errorMessage = "Thay đổi mật khẩu thất bại";
      
      // Xử lý error message từ backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        if (axiosError.response?.data?.message) {
          const backendMessage = axiosError.response.data.message;
          // Nếu message là array, join thành string
          errorMessage = Array.isArray(backendMessage) 
            ? backendMessage.join(', ') 
            : backendMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error("Change password error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Auto-fetch user details khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      fetchUserDetails(user.id);
    }
  }, [user?.id, fetchUserDetails]);

  return {
    userDetails,
    updateProfile,
    changePassword,
    refreshUserDetails,
    isLoading,
    error,
  };
}