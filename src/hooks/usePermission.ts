"use client";

import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/lib/auth";

/**
 * Hook để kiểm tra quyền của người dùng đang đăng nhập
 */
export function usePermission() {
  const { user } = useAuth();

  /**
   * Kiểm tra người dùng có quyền cụ thể không
   * @param permissionCode Mã quyền cần kiểm tra
   * @returns true nếu người dùng có quyền, false nếu không
   */
  const can = (permissionCode: string): boolean => {
    if (!user) return false;
    return hasPermission(user, permissionCode);
  };

  /**
   * Kiểm tra người dùng có ít nhất một trong các quyền được liệt kê không
   * @param permissionCodes Danh sách mã quyền cần kiểm tra
   * @returns true nếu người dùng có ít nhất một quyền, false nếu không
   */
  const canAny = (permissionCodes: string[]): boolean => {
    if (!user) return false;
    return permissionCodes.some(code => hasPermission(user, code));
  };

  /**
   * Kiểm tra người dùng có tất cả các quyền được liệt kê không
   * @param permissionCodes Danh sách mã quyền cần kiểm tra
   * @returns true nếu người dùng có tất cả quyền, false nếu không
   */
  const canAll = (permissionCodes: string[]): boolean => {
    if (!user) return false;
    return permissionCodes.every(code => hasPermission(user, code));
  };

  return { can, canAny, canAll };
}
