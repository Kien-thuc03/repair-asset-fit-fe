export interface UserRole {
  userId: string;
  roleId: string;
}

// Quan hệ giữa người dùng và vai trò
export const users_roles: UserRole[] = [
  // QTV Khoa
  { userId: "user-1", roleId: "role-5" },

  // Nhân viên Phòng Quản trị
  { userId: "user-2", roleId: "role-4" },

  // Tổ trưởng Kỹ thuật
  { userId: "user-3", roleId: "role-3" },

  // Kỹ thuật viên
  { userId: "user-4", roleId: "role-2" },

  // Giảng viên
  { userId: "user-5", roleId: "role-1" },

  // Giảng viên kiêm QTV - nhiều vai trò
  { userId: "user-6", roleId: "role-1" }, // Giảng viên
  { userId: "user-6", roleId: "role-5" }, // QTV Khoa
  { userId: "user-6", roleId: "role-4" }, // Phòng Quản trị
  { userId: "user-6", roleId: "role-3" }, // Tổ trưởng Kỹ thuật
  { userId: "user-6", roleId: "role-2" }, // Kỹ thuật viên

  // Kỹ thuật viên Anh Tuấn
  { userId: "user-8", roleId: "role-2" },

  // Kỹ thuật viên Văn Đạt
  { userId: "user-9", roleId: "role-2" },
];
