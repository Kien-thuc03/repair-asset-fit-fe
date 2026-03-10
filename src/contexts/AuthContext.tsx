"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { UserRole, RoleInfo } from "@/types/repair";
import { AuthenticatedUser, IRole, IPermission } from "@/types/user";
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
const mapLoginResponseToUser = (apiUser: {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  roles: string[];
  permissions: string[];
  activeRole?: string; // Optional: active role code from storage
}): AuthenticatedUser => {
  console.log("🔄 Mapping API user to AuthenticatedUser:", apiUser);

  // Convert role codes to IRole objects with proper name and description
  const userRoles: IRole[] = apiUser.roles.map((roleCode) => {
    // Normalize role code: remove "ROLE_" prefix if present
    const normalizedCode = roleCode.startsWith("ROLE_")
      ? roleCode.replace("ROLE_", "")
      : roleCode;

    // Get role info from RoleInfo if available
    // Đảm bảo normalizedCode được cast đúng thành UserRole enum
    const roleKey = normalizedCode as UserRole;
    const roleInfo = RoleInfo[roleKey];

    console.log(
      `  📌 Mapping role: ${roleCode} -> ${normalizedCode}`,
      roleInfo ? "✅ Found" : "❌ Not found"
    );
    if (roleInfo) {
      console.log(
        `    Name: ${roleInfo.name}, Description: ${roleInfo.description}`
      );
    }

    return {
      id: roleCode, // Use original code as id
      name: roleInfo?.name || normalizedCode, // Use name from RoleInfo or fallback to normalized code
      code: normalizedCode, // Store normalized code for easier access
    };
  });

  // Convert permission codes to IPermission objects
  const userPermissions: IPermission[] = apiUser.permissions.map(
    (permCode) => ({
      id: permCode,
      name: permCode,
      code: permCode,
    })
  );

  // Determine active role
  let activeRole = userRoles[0]; // Default to first role
  if (apiUser.activeRole) {
    // Normalize activeRole code: remove "ROLE_" prefix if present
    const normalizedActiveRole = apiUser.activeRole.startsWith("ROLE_")
      ? apiUser.activeRole.replace("ROLE_", "")
      : apiUser.activeRole;

    // Try to find the saved active role (compare with normalized code)
    const savedActiveRole = userRoles.find(
      (r) => r.code === normalizedActiveRole
    );
    if (savedActiveRole) {
      activeRole = savedActiveRole;
      console.log("  ✅ Using saved active role:", activeRole.code);
    } else {
      console.log(
        "  ⚠️ Saved active role not found, using first role:",
        activeRole.code
      );
    }
  } else {
    console.log(
      "  ℹ️ No saved active role, using first role:",
      activeRole.code
    );
  }

  const authenticatedUser: AuthenticatedUser = {
    id: apiUser.id,
    username: apiUser.username,
    fullName: apiUser.fullName,
    email: apiUser.email || "",
    roles: userRoles,
    activeRole: activeRole,
    permissions: userPermissions,
    // Optional fields
    unitId: undefined,
    unit: undefined,
    department: undefined,
  };

  console.log("✅ Mapped AuthenticatedUser:", authenticatedUser);
  return authenticatedUser;
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
          console.log("🔍 Found saved user in storage:", savedUser);

          // Convert saved user to AuthenticatedUser format
          const authenticatedUser = mapLoginResponseToUser(savedUser);
          setUser(authenticatedUser);

          // Set cookie for middleware với cấu trúc đơn giản
          const cookieData = {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            fullName: authenticatedUser.fullName,
            email: authenticatedUser.email,
            activeRole: authenticatedUser.activeRole?.code || "",
            roles: authenticatedUser.roles.map((r) => r.code || ""),
          };

          const userJson = JSON.stringify(cookieData);
          document.cookie = `repair_user=${encodeURIComponent(
            userJson
          )}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

          console.log("🍪 Cookie restored:", cookieData);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        // Clear invalid data
        apiLogout();
        // Clear cookie
        document.cookie =
          "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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

      // Set cookie for middleware với cấu trúc đơn giản hơn để middleware có thể đọc
      // Chỉ lưu activeRole.code thay vì toàn bộ object
      const cookieData = {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        fullName: authenticatedUser.fullName,
        email: authenticatedUser.email,
        activeRole: authenticatedUser.activeRole?.code || "", // Chỉ lưu code
        roles: authenticatedUser.roles.map((r) => r.code || ""), // Chỉ lưu mảng code
      };

      const userJson = JSON.stringify(cookieData);
      document.cookie = `repair_user=${encodeURIComponent(
        userJson
      )}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

      console.log("🍪 Cookie set:", cookieData);
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

      // Save updated user to storage với activeRole
      // Convert back to API format for storage
      const userForStorage = {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        roles: updatedUser.roles.map((r) => r.code || ""),
        permissions: updatedUser.permissions.map((p) => p.code || ""),
        activeRole: role.code, // Save active role code
      };
      saveStoredUser(userForStorage);

      // Set cookie for middleware với cấu trúc đơn giản
      const cookieData = {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        activeRole: role.code || "",
        roles: updatedUser.roles.map((r) => r.code || ""),
      };

      const userJson = JSON.stringify(cookieData);
      document.cookie = `repair_user=${encodeURIComponent(
        userJson
      )}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

      console.log("✅ Switched to role:", role.name || role.code);
      console.log("🍪 Updated cookie:", cookieData);
      console.log(
        "📍 Redirecting to:",
        RoleInfo[role.code as UserRole]?.defaultRoute
      );

      // Chuyển hướng tới URL tương ứng với vai trò được chọn
      if (role.code) {
        const defaultRoute =
          RoleInfo[role.code as UserRole]?.defaultRoute || "/";
        // Sử dụng window.location để refresh page và load layout mới
        window.location.href = defaultRoute;
      }
    } else {
      console.error("❌ Role not found in user roles:", role);
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
