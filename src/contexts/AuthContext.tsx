"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { UserRole } from "@/types/repair";
import { AuthenticatedUser, IRole } from "@/types/user";
import {
  loginAndSave,
  logout as apiLogout,
  getUser as getStoredUser,
  saveUser as saveStoredUser,
} from "@/lib/api/auth";

// Type context để quản lý xác thực
type AuthContextType = {
  user: AuthenticatedUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: IRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Hàm helper để chuyển đổi response từ API thành AuthenticatedUser
const mapLoginResponseToUser = (
  apiUser: {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    roles: string[];
    permissions: string[];
  }
): AuthenticatedUser => {
  // Convert role codes to IRole objects
  const userRoles: IRole[] = apiUser.roles.map((roleCode) => ({
    id: roleCode, // Sử dụng code làm id tạm thời
    name: roleCode,
    code: roleCode,
  }));

  // Convert permission codes to IPermission objects
  const userPermissions = apiUser.permissions.map((permCode) => ({
    id: permCode,
    name: permCode,
    code: permCode,
  }));

  return {
    id: apiUser.id,
    username: apiUser.username,
    fullName: apiUser.fullName,
    email: apiUser.email || "",
    roles: userRoles,
    activeRole: userRoles[0], // First role is default
    permissions: userPermissions,
    // Optional fields - không thêm phoneNumber vì không có trong AuthenticatedUser type
    unitId: undefined,
    unit: undefined,
    department: undefined,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Thêm trạng thái isInitializing để kiểm soát quá trình khởi tạo
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Lấy user từ storage (đã được lưu bởi API auth)
        const savedUser = getStoredUser();
        if (savedUser) {
          // Convert saved user to AuthenticatedUser format
          const authenticatedUser = mapLoginResponseToUser(savedUser);
          setUser(authenticatedUser);
          
          // Set cookie for middleware
          const userJson = JSON.stringify(authenticatedUser);
          document.cookie = `repair_user=${userJson}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`; // 7 days
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        // Clear invalid data
        apiLogout();
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  async function login(username: string, password: string) {
    setIsLoading(true);
    try {
      // Call API login (sẽ tự động lưu token và user info vào localStorage)
      const response = await loginAndSave({ username, password });

      // Convert API response to AuthenticatedUser format
      const authenticatedUser = mapLoginResponseToUser(response.user);

      console.log("✅ Login successful:", authenticatedUser);

      // Update state
      setUser(authenticatedUser);

      // Set cookie for middleware
      const userJson = JSON.stringify(authenticatedUser);
      document.cookie = `repair_user=${userJson}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`; // 7 days
    } catch (error) {
      console.error("❌ Login error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Thông tin đăng nhập không chính xác"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    // Call API logout để xóa token và user info từ localStorage
    apiLogout();
    
    // Clear state
    setUser(null);
    
    // Remove cookie
    document.cookie =
      "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // Function to switch between roles for users with multiple roles
  function switchRole(role: IRole) {
    if (user && user.roles.some((r) => r.code === role.code)) {
      const updatedUser = {
        ...user,
        activeRole: role,
      };

      setUser(updatedUser);

      // Save updated user to storage
      // Convert back to API format for storage
      const userForStorage = {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        roles: updatedUser.roles.map((r) => r.code || ""),
        permissions: updatedUser.permissions.map((p) => p.code || ""),
      };
      saveStoredUser(userForStorage);

      // Set cookie for middleware
      const userJson = JSON.stringify(updatedUser);
      document.cookie = `repair_user=${userJson}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`; // 7 days

      // Chuyển hướng tới URL tương ứng với vai trò được chọn
      // Sử dụng window.location thay vì router để đảm bảo làm mới toàn bộ trang
      if (role.code) {
        import("@/types/repair").then(({ RoleInfo }) => {
          const defaultRoute =
            RoleInfo[role.code as UserRole]?.defaultRoute || "/";
          window.location.href = defaultRoute;
        });
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        isLoading,
        isInitializing,
      }}>
      {isInitializing ? (
        // Hiển thị một loading indicator trong quá trình khởi tạo để tránh nhấp nháy
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
