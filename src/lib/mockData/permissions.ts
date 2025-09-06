// Danh sách các quyền trong hệ thống
export const permissions = [
  // Quyền của Giảng viên
  {
    id: "perm-1",
    name: "Báo cáo sự cố",
    code: "report_issues",
  },
  {
    id: "perm-2",
    name: "Theo dõi tiến độ xử lý",
    code: "track_progress",
  },
  {
    id: "perm-3",
    name: "Tra cứu thiết bị",
    code: "search_equipment",
  },
  {
    id: "perm-4",
    name: "Xem thông tin cá nhân",
    code: "view_personal_info",
  },
  
  // Quyền của Kỹ thuật viên
  {
    id: "perm-5",
    name: "Xử lý báo cáo sự cố",
    code: "handle_reports",
  },
  {
    id: "perm-6",
    name: "Tạo đề xuất thay thế",
    code: "create_replacement_requests",
  },
  {
    id: "perm-7",
    name: "Quản lý tài sản",
    code: "manage_assets",
  },
  {
    id: "perm-8",
    name: "Xem thống kê cá nhân",
    code: "view_personal_stats",
  },
  
  // Quyền của Tổ trưởng Kỹ thuật
  {
    id: "perm-9",
    name: "Quản lý kỹ thuật viên",
    code: "manage_technicians",
  },
  {
    id: "perm-10",
    name: "Phê duyệt đề xuất thay thế",
    code: "approve_replacements",
  },
  {
    id: "perm-11",
    name: "Lập tờ trình",
    code: "create_proposals",
  },
  {
    id: "perm-12",
    name: "Xác nhận biên bản",
    code: "confirm_reports",
  },
  
  // Quyền của Phòng Quản trị
  {
    id: "perm-13",
    name: "Xử lý tờ trình",
    code: "process_proposals",
  },
  {
    id: "perm-14",
    name: "Xác minh thiết bị",
    code: "verify_equipment",
  },
  {
    id: "perm-15",
    name: "Lập biên bản",
    code: "create_reports",
  },
  {
    id: "perm-16",
    name: "Gửi đề xuất",
    code: "submit_requests",
  },
  
  // Quyền của QTV Khoa
  {
    id: "perm-17",
    name: "Quản lý người dùng",
    code: "manage_users",
  },
  {
    id: "perm-18",
    name: "Phê duyệt cuối cùng",
    code: "final_approval",
  },
  {
    id: "perm-19",
    name: "Xem báo cáo thống kê",
    code: "view_reports",
  },
  {
    id: "perm-20",
    name: "Giám sát hệ thống",
    code: "system_oversight",
  },
];
