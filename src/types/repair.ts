// Định nghĩa các vai trò trong hệ thống sửa chữa tài sản
export enum UserRole {
  GIANG_VIEN = "GIANG_VIEN", // Giảng viên
  KY_THUAT_VIEN = "KY_THUAT_VIEN", // Kỹ thuật viên
  TO_TRUONG_KY_THUAT = "TO_TRUONG_KY_THUAT", // Tổ trưởng Kỹ thuật
  PHONG_QUAN_TRI = "PHONG_QUAN_TRI", // Nhân viên Phòng Quản trị
  QTV_KHOA = "QTV_KHOA", // Quản trị viên Khoa
}

// Interface cho bảng Computers - liên kết với assets
export interface Computer {
  id: string; // UUID primary key
  assetId: string; // FK to assets.id (unique, not null)
  roomId: string; // FK to rooms.id
  machineLabel: string; // Số máy (e.g., "01", "02", "03")
  notes?: string; // Ghi chú
}

// Interface cho yêu cầu sửa chữa
export interface RepairRequest {
  id: string;
  requestCode: string; // Mã yêu cầu tự tăng: YCSC-2025-0001
  assetId: string;
  assetCode: string; // Mã tài sản QR code được in từ bảng assets
  assetName: string;
  componentId?: string;
  componentName?: string; // Tên linh kiện cụ thể bị lỗi
  reporterId: string;
  reporterName: string; // Tên người báo lỗi
  reporterRole: string; // Vai trò: Giảng viên/KTV
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  roomId: string;
  roomName: string; // Tên phòng máy
  machineLabel: string; // Số máy từ bảng computers
  buildingName: string; // Tên tòa nhà
  errorTypeId?: string;
  errorTypeName?: string; // Tên loại lỗi
  description: string; // Mô tả chi tiết lỗi
  mediaUrls?: string[]; // Mảng URL ảnh/video minh họa
  status: RepairStatus;
  resolutionNotes?: string; // Ghi chú KTV về kết quả xử lý
  createdAt: string; // Thời điểm báo lỗi
  acceptedAt?: string; // Thời điểm KTV tiếp nhận
  completedAt?: string; // Thời điểm hoàn tất
  unit: string; // Đơn vị/Khoa
}

// Interface cho danh sách đề xuất thay thế trong trang duyệt đề xuất
export interface ReplacementRequestForList {
  id: string;
  assetCode: string;
  assetName: string;
  requestedBy: string;
  unit: string;
  location: string;
  reason: string;
  status: ReplacementStatus;
  requestDate: string;
  estimatedCost: number;
  description: string;
}

// Interface cho 1 linh kiện trong đề xuất thay thế
export interface ReplacementComponent {
  id: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  componentId: string;
  componentName: string;
  componentSpecs?: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  machineLabel?: string; // Số máy
  reason: string; // Lý do thay thế linh kiện này
  quantity: number; // Số lượng cần thay
}

// Interface cho đề xuất thay thế (chứa nhiều linh kiện)
export interface ReplacementRequestItem {
  id: string;
  requestCode: string; // Mã đề xuất thay thế
  title: string; // Tiêu đề đề xuất
  description: string; // Mô tả tổng quan
  components: ReplacementComponent[]; // Danh sách linh kiện cần thay
  status: ReplacementStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Kỹ thuật viên tạo đề xuất
  approvedBy?: string;
  rejectedReason?: string;
  unit: string;
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
export enum RepairStatus {
  CHỜ_TIẾP_NHẬN = "CHỜ_TIẾP_NHẬN",     // Giảng viên vừa tạo, chờ KTV tiếp nhận
  ĐÃ_TIẾP_NHẬN = "ĐÃ_TIẾP_NHẬN",      // KTV xem yêu cầu sẽ tự dộng chuyển sang trạng thái này
  ĐANG_XỬ_LÝ = "ĐANG_XỬ_LÝ",        // KTV đang trong quá trình kiểm tra, sửa chữa
  CHỜ_THAY_THẾ = "CHỜ_THAY_THẾ",      // Lỗi phần cứng, đã tạo đề xuất thay thế và đang chờ duyệt/mua sắm
  ĐÃ_HOÀN_THÀNH = "ĐÃ_HOÀN_THÀNH",     // Đã sửa chữa hoặc thay thế xong
  ĐÃ_HỦY = "ĐÃ_HỦY",            // Yêu cầu bị hủy bởi giảng viên với yêu cầu là báo lỗi chưa được tiếp nhận
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
  status: RepairStatus;
  reporterId: string;
  assignedTechnicianId?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  feedback?: string;
}

export enum ReplacementStatus {
  CHỜ_TỔ_TRƯỞNG_DUYỆT = "CHỜ_TỔ_TRƯỞNG_DUYỆT",
  CHỜ_XÁC_MINH = "CHỜ_XÁC_MINH",          // Chờ Phòng Quản trị cử người xuống xác minh thực tế
  ĐÃ_DUYỆT = "ĐÃ_DUYỆT",              // Đã được duyệt, chờ mua sắm
  ĐÃ_TỪ_CHỐI = "ĐÃ_TỪ_CHỐI",
  ĐÃ_HOÀN_TẤT_MUA_SẮM = "ĐÃ_HOÀN_TẤT_MUA_SẮM",   // Đã có thiết bị mới
}

// Type cho đề xuất thay thế
export interface ReplacementRequest {
  id: string;
  equipmentId: string;
  reason: string;
  estimatedCost: number;
  technicianId: string;
  status: ReplacementStatus;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RepairInput {
  assetId: string;
  description: string;
}

export interface RepairFilter {
  search?: string;
  status?: RepairStatus;
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
  status: AssetStatus;
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
  INSTALLED = "INSTALLED", // Đang được lắp đặt và hoạt động
  FAULTY = "FAULTY", // Hỏng hóc
  REMOVED = "REMOVED", // Đã gỡ ra
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
  status: RepairStatus;
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
}

// Asset Status enum
export enum AssetStatus {
  DANG_SU_DUNG = "đang_sử_dụng",
  CHO_BAN_GIAO = "chờ_bàn_giao",
  CHO_TIEP_NHAN = "chờ_tiếp_nhận",
  HU_HONG = "hư_hỏng",
  MAT_TICH = "mất_tích",
  DE_XUAT_THANH_LY = "đề_xuất_thanh_lý",
  DA_THANH_LY = "đã_thanh_lý",
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
