"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { UserRole } from "@/types/repair";
import { demoUsers } from "@/lib/mockData/users";

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
        } catch (error) {
          localStorage.removeItem("repair_user");
          document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
      // Đánh dấu quá trình khởi tạo đã hoàn tất
      setIsInitializing(false);
    };
    
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check demo users
      const foundUser = demoUsers.find(
        u => (u.email === email || u.username === email.split('@')[0]) && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        const userJson = JSON.stringify(userWithoutPassword);
        localStorage.setItem("repair_user", userJson);
        // Set cookie for middleware
        document.cookie = `repair_user=${userJson}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      } else {
        throw new Error("Invalid credentials");
      }
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
