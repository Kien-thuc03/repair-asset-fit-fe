import { UserRole } from "@/types/repair";
import { roles } from "./roles";

// Tìm roleId dựa trên code
function getRoleIdByCode(code: UserRole): string {
  const role = roles.find(r => r.code === code);
  return role ? role.id : "";
}

// Quan hệ giữa người dùng và vai trò
export const userRoles = [
  // QTV Khoa
  { userId: "user-1", roleId: getRoleIdByCode(UserRole.QTV_KHOA) },
  
  // Nhân viên Phòng Quản trị
  { userId: "user-2", roleId: getRoleIdByCode(UserRole.PHONG_QUAN_TRI) },
  
  // Tổ trưởng Kỹ thuật
  { userId: "user-3", roleId: getRoleIdByCode(UserRole.TO_TRUONG_KY_THUAT) },
  
  // Kỹ thuật viên
  { userId: "user-4", roleId: getRoleIdByCode(UserRole.KY_THUAT_VIEN) },
  
  // Giảng viên
  { userId: "user-5", roleId: getRoleIdByCode(UserRole.GIANG_VIEN) },
  
  // Giảng viên kiêm QTV
  { userId: "user-6", roleId: getRoleIdByCode(UserRole.GIANG_VIEN) },
  { userId: "user-6", roleId: getRoleIdByCode(UserRole.QTV_KHOA) },
  { userId: "user-6", roleId: getRoleIdByCode(UserRole.PHONG_QUAN_TRI) },
  { userId: "user-6", roleId: getRoleIdByCode(UserRole.TO_TRUONG_KY_THUAT) },
  { userId: "user-6", roleId: getRoleIdByCode(UserRole.KY_THUAT_VIEN) },
];
