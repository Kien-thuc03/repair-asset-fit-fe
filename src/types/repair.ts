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

// Component Type enum
export enum ComponentType {
  CPU = "CPU",
  RAM = "RAM",
  STORAGE = "STORAGE",
  MOTHERBOARD = "MOTHERBOARD",
  PSU = "PSU", // Power Supply Unit
  GPU = "GPU", // Graphics Card
  MONITOR = "MONITOR",
  KEYBOARD = "KEYBOARD",
  MOUSE = "MOUSE",
  CASE = "CASE",
  COOLING = "COOLING", // Cooling system
  OPTICAL_DRIVE = "OPTICAL_DRIVE", // CD/DVD Drive
  NETWORK_CARD = "NETWORK_CARD",
  SOUND_CARD = "SOUND_CARD",
  SPEAKER = "SPEAKER",
  WEBCAM = "WEBCAM",
  OTHER = "OTHER",
}

// Component Status enum
export enum ComponentStatus {
  INSTALLED = "INSTALLED", // Đang lắp đặt và hoạt động
  REMOVED = "REMOVED", // Đã gỡ ra
  MAINTENANCE = "MAINTENANCE", // Đang bảo trì
  FAULTY = "FAULTY", // Hỏng hóc
  REPLACED = "REPLACED", // Đã thay thế
  PENDING_INSTALL = "PENDING_INSTALL", // Chờ lắp đặt
  TESTING = "TESTING", // Đang kiểm tra
}

// Component interface for computer assets (updated to match database schema)
export interface Component {
  id: string; // UUID - Đây là mã định danh duy nhất cho một linh kiện cụ thể
  computerAssetId: string; // FK đến máy tính cha
  componentType: ComponentType; // Loại linh kiện là gì (CPU, RAM, ...)
  name: string; // Tên/Model của linh kiện, vd: Kingston Fury Beast DDR5
  componentSpecs?: string; // Thông số kỹ thuật chi tiết, vd: 16GB 5200MHz
  serialNumber?: string; // Số serial của linh kiện nếu có (unique, nullable)
  status: ComponentStatus; // Trạng thái của linh kiện này
  installedAt: string; // Ngày lắp đặt linh kiện này vào máy (ISO timestamp)
  removedAt?: string; // Ngày gỡ ra (khi thay thế hoặc hỏng) (nullable)
  notes?: string; // Ghi chú bổ sung
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

// Asset Type enum
export enum AssetType {
  FIXED_ASSET = "FIXED_ASSET", // Tài sản cố định
  CONSUMABLE = "CONSUMABLE", // Vật tư tiêu hao
  OFFICE_SUPPLIES = "OFFICE_SUPPLIES", // Đồ dùng văn phòng
}

// Asset Shape enum
export enum AssetShape {
  GENERIC = "GENERIC", // Tài sản thông thường
  COMPUTER = "COMPUTER", // Máy tính
  PRINTER = "PRINTER", // Máy in
  NETWORK_DEVICE = "NETWORK_DEVICE", // Thiết bị mạng
  FURNITURE = "FURNITURE", // Nội thất
}

// Asset Status enum
export enum AssetStatus {
  CHO_PHAN_BO = "chờ_phân_bổ", // Waiting for allocation
  DANG_SU_DUNG = "đang_sử_dụng", // In use
  BAO_TRI = "bảo_trì", // Under maintenance
  HONG_HOC = "hỏng_hóc", // Broken/Damaged
  DA_THANH_LY = "đã_thanh_lý", // Disposed
  MAT_TICH = "mất_tích", // Missing
}

// Comprehensive Asset interface based on database schema
export interface ComprehensiveAsset {
  id: string; // UUID primary key
  ktCode: string; // Mã kế toán: xx-yyyy/nn (e.g., 19-0205/00)
  fixedCode: string; // Mã tài sản cố định xxxx.yyyy
  name: string; // Tên tài sản
  specs?: string; // Thông số kĩ thuật
  entryDate: string; // Ngày nhập (ISO date string)
  currentRoomId?: string; // Mã vị trí hiện tại
  unit: string; // Đơn vị tính
  quantity: number; // Số lượng: Với tài sản cố định = 1
  origin?: string; // Xuất xứ
  purchasePackage: number; // Gói mua
  type: AssetType; // Loại tài sản
  isHandover: boolean; // Flag bàn giao
  isLocked: boolean; // Khi đã sử dụng thì không cho cập nhật lại
  categoryId: string; // Danh mục - 4: máy tính, 3: thiết bị văn phòng, 5: máy in
  shape: AssetShape; // Cột xác định hình thái của tài sản
  status: AssetStatus; // Trạng thái tài sản
  createdBy: string; // User who initiated the handover
  createdAt: string; // timestamp ISO string
  updatedAt: string; // timestamp ISO string
  deletedAt?: string; // timestamp ISO string (soft delete)
}
