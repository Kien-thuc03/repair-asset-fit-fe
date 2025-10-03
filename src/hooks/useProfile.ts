import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedUser, IUpdateUserRequest } from "@/types/user";

interface UseProfileReturn {
  updateProfile: (data: IUpdateUserRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook để quản lý thông tin cá nhân của user
 */
export function useProfile(): UseProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  /**
   * Cập nhật thông tin cá nhân
   */
  const updateProfile = useCallback(async (data: IUpdateUserRequest) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      console.log("Profile updated successfully:", data);
      
      // Cập nhật localStorage (tạm thời)
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

    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Thay đổi mật khẩu
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      console.log("Password changed successfully", { currentPassword, newPassword });

    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    updateProfile,
    changePassword,
    isLoading,
  };
}