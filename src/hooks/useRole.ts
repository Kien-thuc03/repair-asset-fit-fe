"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/repair";

/**
 * Hook để kiểm tra vai trò của người dùng đang đăng nhập
 */
export function useRole() {
  const { user } = useAuth();

  /**
   * Kiểm tra người dùng có vai trò cụ thể không
   * @param role Vai trò cần kiểm tra
   * @returns true nếu người dùng có vai trò, false nếu không
   */
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  /**
   * Kiểm tra vai trò đang hoạt động của người dùng
   * @param role Vai trò cần kiểm tra
   * @returns true nếu vai trò đang hoạt động của người dùng khớp với vai trò cần kiểm tra, false nếu không
   */
  const hasActiveRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.activeRole === role;
  };

  /**
   * Kiểm tra người dùng có ít nhất một trong các vai trò được liệt kê không
   * @param roles Danh sách vai trò cần kiểm tra
   * @returns true nếu người dùng có ít nhất một vai trò, false nếu không
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  };

  /**
   * Kiểm tra vai trò đang hoạt động của người dùng có nằm trong danh sách vai trò được liệt kê không
   * @param roles Danh sách vai trò cần kiểm tra
   * @returns true nếu vai trò đang hoạt động của người dùng nằm trong danh sách, false nếu không
   */
  const hasActiveRoleIn = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.activeRole);
  };

  /**
   * Lấy vai trò đang hoạt động của người dùng
   * @returns Vai trò đang hoạt động của người dùng, hoặc undefined nếu không đăng nhập
   */
  const getActiveRole = (): UserRole | undefined => {
    return user?.activeRole;
  };

  /**
   * Lấy danh sách các vai trò của người dùng
   * @returns Danh sách các vai trò của người dùng, hoặc mảng rỗng nếu không đăng nhập
   */
  const getRoles = (): UserRole[] => {
    return user?.roles || [];
  };

  return { 
    hasRole, 
    hasActiveRole, 
    hasAnyRole, 
    hasActiveRoleIn, 
    getActiveRole, 
    getRoles 
  };
}
