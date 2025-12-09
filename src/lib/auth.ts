import { AuthenticatedUser, IRole } from "@/types/user";

// Hàm lấy danh sách vai trò của user
export const getUserRoles = (user: AuthenticatedUser | null): IRole[] => {
  return user?.roles || [];
};

// Hàm lấy danh sách quyền của một vai trò
export const getRolePermissions = (user: AuthenticatedUser | null): string[] => {
  return user?.permissions?.map((perm) => perm.code || "") || [];
};

// Hàm kiểm tra user có quyền cụ thể không
export const hasPermission = (user: AuthenticatedUser, permissionCode: string): boolean => {
  if (!user) return false;
  const permissionCodes = getRolePermissions(user);
  return permissionCodes.includes(permissionCode);
};
