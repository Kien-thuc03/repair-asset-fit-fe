import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedUser, IUpdateUserRequest } from "@/types/user";

interface UserDetailFromDB {
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

interface UseProfileDatabaseReturn {
  userDetails: UserDetailFromDB | null;
  updateProfile: (data: IUpdateUserRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUserDetails: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook để quản lý thông tin cá nhân với tích hợp PostgreSQL
 * Tuân thủ database schema đã định nghĩa
 */
export function useProfileDatabase(): UseProfileDatabaseReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetailFromDB | null>(null);
  const { user } = useAuth();

  /**
   * Lấy thông tin chi tiết của user từ PostgreSQL
   */
  const fetchUserDetails = useCallback(async (userId: string) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      // TODO: Thay thế bằng API call thực tế khi có backend
      // Hiện tại sử dụng mock data dựa trên database schema
      const mockUserDetail: UserDetailFromDB = {
        id: userId,
        username: user?.username || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        unitId: user?.unitId || "",
        phoneNumber: "0901234567", // Từ database
        birthDate: "1990-01-15", // Từ database
        status: "ACTIVE",
        createdAt: "2022-12-31T17:00:00.000Z",
        updatedAt: "2024-01-01T17:00:00.000Z",
        unitName: user?.unit?.name || "Khoa Công nghệ Thông tin",
        unitType: user?.unit?.type || "đơn_vị_sử_dụng",
        unitPhone: "028.38940390",
        unitEmail: "cntt@iuh.edu.vn",
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserDetails(mockUserDetail);

      /* 
      // API call thực tế sẽ như thế này:
      const response = await fetch(`/api/users/${userId}/details`);
      if (!response.ok) {
        throw new Error('Không thể lấy thông tin user');
      }
      
      const data = await response.json();
      setUserDetails(data);
      */

    } catch (error) {
      console.error("Fetch user details error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch(`/api/users/${user.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   throw new Error('Cập nhật thông tin thất bại');
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Profile updated successfully:", data);
      
      // Cập nhật localStorage và state (tạm thời)
      const savedUser = localStorage.getItem("repair_user");
      if (savedUser) {
        const parsedUser: AuthenticatedUser = JSON.parse(savedUser);
        const updatedUser = {
          ...parsedUser,
          fullName: data.fullName || parsedUser.fullName,
          email: data.email || parsedUser.email,
          unitId: data.unitId || parsedUser.unitId,
        };
        localStorage.setItem("repair_user", JSON.stringify(updatedUser));
      }

      // Refresh user details
      await refreshUserDetails();

    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshUserDetails]);

  /**
   * Thay đổi mật khẩu
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    setIsLoading(true);
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch(`/api/users/${user.id}/change-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     currentPassword,
      //     newPassword,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Thay đổi mật khẩu thất bại');
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Password changed successfully", { 
        userId: user.id, 
        hasCurrentPassword: !!currentPassword, 
        hasNewPassword: !!newPassword 
      });

    } catch (error) {
      console.error("Change password error:", error);
      throw error;
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
  };
}