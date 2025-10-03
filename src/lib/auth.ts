import { users_roles } from "./mockData/users_roles";
import { roles } from "./mockData/roles";
import { permissions } from "./mockData/permissions";
import { roles_permissions } from "./mockData/roles_permissions";
import { AuthenticatedUser, IRole } from "@/types/user";

// Hàm lấy danh sách vai trò của user
export const getUserRoles = (userId: string): IRole[] => {
  // Lấy danh sách roleId của user
  const userRoleIds = users_roles
    .filter(ur => ur.userId === userId)
    .map(ur => ur.roleId);
  
  // Lấy danh sách IRole từ roleId
  return roles
    .filter(role => userRoleIds.includes(role.id))
    .map(role => ({
      id: role.id,
      name: role.name,
      code: role.code
    }));
};

// Hàm lấy danh sách quyền của một vai trò
export const getRolePermissions = (roleId: string): string[] => {
  // Lấy danh sách permissionId của role
  const rolePermissionIds = roles_permissions
    .filter(rp => rp.roleId === roleId)
    .map(rp => rp.permissionId);
  
  // Lấy danh sách permission code từ permissionId
  return permissions
    .filter(perm => rolePermissionIds.includes(perm.id))
    .map(perm => perm.code || "");
};

// Hàm kiểm tra user có quyền cụ thể không
export const hasPermission = (user: AuthenticatedUser, permissionCode: string): boolean => {
  // Lấy roleId của vai trò đang active
  const activeRoleId = user.activeRole?.id;
  
  if (!activeRoleId) return false;
  
  // Lấy danh sách quyền của vai trò đang active
  const permissionCodes = getRolePermissions(activeRoleId);
  
  // Kiểm tra xem quyền cần kiểm tra có trong danh sách không
  return permissionCodes.includes(permissionCode);
};
