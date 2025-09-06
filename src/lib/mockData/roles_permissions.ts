// Quan hệ giữa vai trò và quyền
export const rolePermissions = [
  // Quyền của Giảng viên
  { roleId: "role-1", permissionId: "perm-1" }, // Báo cáo sự cố
  { roleId: "role-1", permissionId: "perm-2" }, // Theo dõi tiến độ xử lý
  { roleId: "role-1", permissionId: "perm-3" }, // Tra cứu thiết bị
  { roleId: "role-1", permissionId: "perm-4" }, // Xem thông tin cá nhân
  
  // Quyền của Kỹ thuật viên
  { roleId: "role-2", permissionId: "perm-5" }, // Xử lý báo cáo sự cố
  { roleId: "role-2", permissionId: "perm-6" }, // Tạo đề xuất thay thế
  { roleId: "role-2", permissionId: "perm-7" }, // Quản lý tài sản
  { roleId: "role-2", permissionId: "perm-8" }, // Xem thống kê cá nhân
  
  // Quyền của Tổ trưởng Kỹ thuật
  { roleId: "role-3", permissionId: "perm-9" },  // Quản lý kỹ thuật viên
  { roleId: "role-3", permissionId: "perm-10" }, // Phê duyệt đề xuất thay thế
  { roleId: "role-3", permissionId: "perm-11" }, // Lập tờ trình
  { roleId: "role-3", permissionId: "perm-12" }, // Xác nhận biên bản
  { roleId: "role-3", permissionId: "perm-5" },  // Cũng có thể xử lý báo cáo sự cố
  { roleId: "role-3", permissionId: "perm-6" },  // Cũng có thể tạo đề xuất thay thế
  
  // Quyền của Phòng Quản trị
  { roleId: "role-4", permissionId: "perm-13" }, // Xử lý tờ trình
  { roleId: "role-4", permissionId: "perm-14" }, // Xác minh thiết bị
  { roleId: "role-4", permissionId: "perm-15" }, // Lập biên bản
  { roleId: "role-4", permissionId: "perm-16" }, // Gửi đề xuất
  
  // Quyền của QTV Khoa
  { roleId: "role-5", permissionId: "perm-17" }, // Quản lý người dùng
  { roleId: "role-5", permissionId: "perm-18" }, // Phê duyệt cuối cùng
  { roleId: "role-5", permissionId: "perm-19" }, // Xem báo cáo thống kê
  { roleId: "role-5", permissionId: "perm-20" }, // Giám sát hệ thống
];
