import { users } from "./mockData/users";
import { userRoles } from "./mockData/users_roles";
import { roles } from "./mockData/roles";
import { permissions } from "./mockData/permissions";
import { rolePermissions } from "./mockData/roles_permissions";
import { UserRole } from "@/types/repair";
import { AuthenticatedUser } from "@/types/user";

// Hàm lấy danh sách vai trò của user
export const getUserRoles = (userId: string): UserRole[] => {
  // Lấy danh sách roleId của user
  const userRoleIds = userRoles
    .filter(ur => ur.userId === userId)
    .map(ur => ur.roleId);
  
  // Lấy danh sách role code từ roleId
  return roles
    .filter(role => userRoleIds.includes(role.id))
    .map(role => role.code as UserRole);
};

// Hàm lấy danh sách quyền của một vai trò
export const getRolePermissions = (roleId: string): string[] => {
  // Lấy danh sách permissionId của role
  const rolePermissionIds = rolePermissions
    .filter(rp => rp.roleId === roleId)
    .map(rp => rp.permissionId);
  
  // Lấy danh sách permission code từ permissionId
  return permissions
    .filter(perm => rolePermissionIds.includes(perm.id))
    .map(perm => perm.code);
};

// Hàm kiểm tra user có quyền cụ thể không
export const hasPermission = (user: AuthenticatedUser, permissionCode: string): boolean => {
  // Lấy roleId của vai trò đang active
  const activeRoleId = roles.find(r => r.code === user.activeRole)?.id;
  
  if (!activeRoleId) return false;
  
  // Lấy danh sách quyền của vai trò đang active
  const permissionCodes = getRolePermissions(activeRoleId);
  
  // Kiểm tra xem quyền cần kiểm tra có trong danh sách không
  return permissionCodes.includes(permissionCode);
};
