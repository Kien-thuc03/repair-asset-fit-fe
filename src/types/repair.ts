// Định nghĩa các vai trò trong hệ thống sửa chữa tài sản
export enum UserRole {
  GIANG_VIEN = "GIANG_VIEN", // Giảng viên
  KY_THUAT_VIEN = "KY_THUAT_VIEN", // Kỹ thuật viên
  TO_TRUONG_KY_THUAT = "TO_TRUONG_KY_THUAT", // Tổ trưởng Kỹ thuật
  PHONG_QUAN_TRI = "PHONG_QUAN_TRI", // Nhân viên Phòng Quản trị
  QTV_KHOA = "QTV_KHOA", // Quản trị viên Khoa
}

// Định nghĩa thông tin chi tiết về vai trò
export const RoleInfo = {
  [UserRole.GIANG_VIEN]: {
    name: "Giảng viên",
    description: "Người dùng cuối, báo cáo sự cố thiết bị",
    defaultRoute: "/giang-vien",
    permissions: [
      "report_issues",
      "track_progress",
      "search_equipment",
      "view_personal_info",
    ],
  },
  [UserRole.KY_THUAT_VIEN]: {
    name: "Kỹ thuật viên",
    description: "Xử lý sự cố và đề xuất thay thế",
    defaultRoute: "/ky-thuat-vien",
    permissions: [
      "handle_reports",
      "create_replacement_requests",
      "manage_assets",
      "view_personal_stats",
    ],
  },
  [UserRole.TO_TRUONG_KY_THUAT]: {
    name: "Tổ trưởng Kỹ thuật",
    description: "Quản lý kỹ thuật viên và phê duyệt đề xuất",
    defaultRoute: "/to-truong-ky-thuat",
    permissions: [
      "manage_technicians",
      "approve_replacements",
      "create_proposals",
      "confirm_reports",
    ],
  },
  [UserRole.PHONG_QUAN_TRI]: {
    name: "Nhân viên Phòng Quản trị",
    description: "Xác minh và hoàn thiện hồ sơ đề xuất",
    defaultRoute: "/phong-quan-tri",
    permissions: [
      "process_proposals",
      "verify_equipment",
      "create_reports",
      "submit_requests",
    ],
  },
  [UserRole.QTV_KHOA]: {
    name: "Quản trị viên Khoa",
    description: "Quản lý hệ thống và phê duyệt cuối cùng",
    defaultRoute: "/qtv-khoa",
    permissions: [
      "manage_users",
      "final_approval",
      "view_reports",
      "system_oversight",
    ],
  },
} as const;

// Định nghĩa trạng thái báo cáo lỗi
export enum ReportStatus {
  PENDING = "PENDING", // Chờ tiếp nhận
  IN_PROGRESS = "IN_PROGRESS", // Đang xử lý
  COMPLETED = "COMPLETED", // Đã hoàn thành
  REJECTED = "REJECTED", // Bị từ chối
  CANCELLED = "CANCELLED", // Đã hủy
}

// Định nghĩa mức độ ưu tiên
export enum Priority {
  LOW = "LOW", // Thấp
  MEDIUM = "MEDIUM", // Trung bình
  HIGH = "HIGH", // Cao
  URGENT = "URGENT", // Khẩn cấp
}

// Định nghĩa trạng thái thiết bị
export enum EquipmentStatus {
  ACTIVE = "ACTIVE", // Hoạt động
  UNDER_REPAIR = "UNDER_REPAIR", // Đang sửa chữa
  BROKEN = "BROKEN", // Hỏng
  RETIRED = "RETIRED", // Đã thanh lý
}

// Type cho user
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  roles: UserRole[]; // User can have multiple roles
  activeRole: UserRole; // Currently active role
  department?: string;
}

// Type cho báo cáo lỗi
export interface ErrorReport {
  id: string;
  title: string;
  description: string;
  equipmentId: string;
  location: string;
  priority: Priority;
  status: ReportStatus;
  reporterId: string;
  assignedTechnicianId?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  feedback?: string;
}

// Type cho đề xuất thay thế
export interface ReplacementRequest {
  id: string;
  equipmentId: string;
  reason: string;
  estimatedCost: number;
  technicianId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy interfaces for backward compatibility
export interface RepairRequest {
  id: string;
  assetId: string;
  assetName: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  requestedBy: string;
  requestedAt: string;
  assignedTo?: string;
  completedAt?: string;
  notes?: string;
}

export interface RepairInput {
  assetId: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface RepairFilter {
  search?: string;
  status?: "pending" | "in_progress" | "completed" | "rejected";
  startDate?: string;
  endDate?: string;
}

// Asset related interfaces
export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  roomId: string;
  roomName: string;
  status: "HOẠT_ĐỘNG" | "BẢO_TRÌ" | "HỎNG_HÓC" | "NGỪNG_SỬ_DỤNG";
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenanceDate?: string;
  assignedTo?: string;
  specifications?: Record<string, string>;
  qrCode: string;
}

// Component interface for computer assets
export interface Component {
  id: string;
  computerAssetId: string;
  componentType: string;
  name: string;
  componentSpecs?: string;
  serialNumber?: string;
  status: "INSTALLED" | "REMOVED" | "MAINTENANCE" | "FAULTY";
  installedAt: string;
  removedAt?: string;
  notes?: string;
}

// Repair history interface
export interface RepairHistory {
  id: string;
  assetId: string;
  requestCode: string;
  reportDate: string;
  completedDate: string;
  errorType: string;
  description: string;
  technicianName: string;
  solution: string;
  componentChanges?: {
    componentType: string;
    oldComponent?: string;
    newComponent: string;
    changeReason: string;
  }[];
  status: "HOÀN_THÀNH" | "ĐANG_XỬ_LÝ" | "HỦY_BỎ";
}

// Enhanced repair request interface
export interface EnhancedRepairRequest {
  id: string;
  requestCode: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  componentId?: string;
  componentName?: string;
  reporterId: string;
  reporterName: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  roomId: string;
  roomName: string;
  errorTypeId?: string;
  errorTypeName?: string;
  description: string;
  mediaUrls?: string[];
  status: "CHỜ_TIẾP_NHẬN" | "ĐANG_XỬ_LÝ" | "HOÀN_THÀNH" | "HỦY_BỎ";
  resolutionNotes?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

// Report form interface
export interface ReportForm {
  assetId: string;
  componentId: string;
  roomId: string;
  errorTypeId: string;
  description: string;
  mediaFiles: File[];
}

// Simple Asset interface for forms
export interface SimpleAsset {
  id: string;
  name: string;
  assetCode: string;
  roomId: string;
}
