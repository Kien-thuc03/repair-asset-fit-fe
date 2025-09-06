"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { UserRole } from "@/types/repair";
import { users } from "@/lib/mockData/users";
import { userRoles } from "@/lib/mockData/users_roles";
import { AuthenticatedUser, UserStatus } from "@/types/user";
import { roles } from "@/lib/mockData/roles";
import { units } from "@/lib/mockData/units";

// Type context để quản lý xác thực
type AuthContextType = {
  user: AuthenticatedUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Hàm helper để lấy các vai trò của user
const getUserRoles = (userId: string): UserRole[] => {
  // Lấy danh sách roleId của user
  const userRoleIds = userRoles
    .filter(ur => ur.userId === userId)
    .map(ur => ur.roleId);
  
  // Lấy danh sách role code từ roleId
  return roles
    .filter(role => userRoleIds.includes(role.id))
    .map(role => role.code as UserRole);
};

// Hàm helper để lấy đơn vị của user
const getUserDepartment = (unitId?: string): string => {
  if (!unitId) return "";
  const unit = units.find(u => u.id === unitId);
  return unit ? unit.name : "";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Thêm trạng thái isInitializing để kiểm soát quá trình khởi tạo
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    // Đặt một timeout nhỏ để đảm bảo hydration đã hoàn tất
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("repair_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Kiểm tra tính hợp lệ của dữ liệu người dùng
          if (parsedUser && parsedUser.id && parsedUser.roles && parsedUser.activeRole) {
            setUser(parsedUser);
            // Set cookie for middleware
            document.cookie = `repair_user=${savedUser}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
          } else {
            // Xóa dữ liệu không hợp lệ
            localStorage.removeItem("repair_user");
            document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
      } catch {
        localStorage.removeItem("repair_user");
        document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      }
      // Đánh dấu quá trình khởi tạo đã hoàn tất
      setIsInitializing(false);
    };
    
    checkAuth();
  }, []);

  async function login(username: string, password: string) {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Tìm user từ dữ liệu - có thể đăng nhập bằng username hoặc email
      const foundUser = users.find(
        u => (u.username === username || 
             u.email === username) && 
             u.password === password &&
             u.status === UserStatus.ACTIVE
      );

      if (foundUser) {
        // Lấy danh sách vai trò của user
        const userRolesList = getUserRoles(foundUser.id);
        
        // Kiểm tra vai trò
        console.log("User roles:", userRolesList);
        
        // Nếu không có vai trò nào, không cho phép đăng nhập
        if (userRolesList.length === 0) {
          throw new Error("Tài khoản không có quyền truy cập");
        }

        // Tạo đối tượng user đã xác thực
        const authenticatedUser: AuthenticatedUser = {
          id: foundUser.id,
          username: foundUser.username,
          fullName: foundUser.fullName,
          email: foundUser.email,
          unitId: foundUser.unitId,
          roles: userRolesList,
          activeRole: userRolesList[0], // Vai trò đầu tiên là vai trò mặc định
          department: getUserDepartment(foundUser.unitId),
        };
        
        console.log("Authenticated user:", authenticatedUser);
        
        setUser(authenticatedUser);
        const userJson = JSON.stringify(authenticatedUser);
        localStorage.setItem("repair_user", userJson);
        // Set cookie for middleware
        document.cookie = `repair_user=${userJson}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      } else {
        throw new Error("Thông tin đăng nhập không chính xác");
      }
    } catch (error) {
      console.error("Login error details:", error);
      throw new Error((error as Error).message || "Lỗi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("repair_user");
    // Remove cookie
    document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  
  // Function to switch between roles for users with multiple roles
  function switchRole(role: UserRole) {
    if (user && user.roles.includes(role)) {
      const updatedUser = {
        ...user,
        activeRole: role
      };
      
      setUser(updatedUser);
      const userJson = JSON.stringify(updatedUser);
      localStorage.setItem("repair_user", userJson);
      document.cookie = `repair_user=${userJson}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      
      // Chuyển hướng tới URL tương ứng với vai trò được chọn
      // Sử dụng window.location thay vì router để đảm bảo làm mới toàn bộ trang
      import("@/types/repair").then(({ RoleInfo }) => {
        const defaultRoute = RoleInfo[role].defaultRoute;
        window.location.href = defaultRoute;
      });
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
      }}
    >
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