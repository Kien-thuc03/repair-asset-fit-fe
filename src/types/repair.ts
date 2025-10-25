// Interface cho ErrorTypes - Khớp với database schema
export interface ErrorType {
  id: string; // UUID primary key
  name: string; // Tên loại lỗi (required)
  description?: string; // Mô tả chi tiết (optional)
  createdAt?: string; // Timestamp (ISO string)
}

// Định nghĩa các vai trò trong hệ thống sửa chữa tài sản
export enum UserRole {
  ADMIN = "ADMIN", // Quản trị viên hệ thống
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

// Interface cho bảng trung gian RepairRequestComponents (quan hệ nhiều-nhiều)
export interface RepairRequestComponent {
  repairRequestId: string; // FK to repairRequests.id
  componentId: string; // FK to computerComponents.id
  note?: string; // Ghi chú về linh kiện bị lỗi cụ thể
}

// Interface cho yêu cầu sửa chữa
export interface RepairRequest {
  id: string;
  requestCode: string; // Mã yêu cầu tự tăng: YCSC-2025-0001
  computerAssetId: string; // FK to assets.id (thay đổi từ assetId)
  assetCode?: string; // Mã tài sản QR code được in từ bảng assets (computed)
  assetName?: string; // Tên tài sản (computed)
  componentName?: string; // Tên linh kiện cụ thể bị lỗi (computed for display)
  reporterId: string;
  reporterName?: string; // Tên người báo lỗi (computed)
  reporterRole?: string; // Vai trò: Giảng viên/KTV (computed)
  assignedTechnicianId?: string;
  assignedTechnicianName?: string; // Tên KTV (computed)
  roomName?: string; // Tên phòng máy (computed từ computerAssetId)
  machineLabel?: string; // Số máy từ bảng computers (computed)
  buildingName?: string; // Tên tòa nhà (computed)
  errorTypeId?: string;
  errorTypeName?: string; // Tên loại lỗi (computed)
  description: string; // Mô tả chi tiết lỗi
  mediaUrls?: string[]; // Mảng URL ảnh/video minh họa
  status: RepairStatus;
  resolutionNotes?: string; // Ghi chú KTV về kết quả xử lý
  createdAt: string; // Thời điểm báo lỗi
  acceptedAt?: string; // Thời điểm KTV tiếp nhận
  completedAt?: string; // Thời điểm hoàn tất
  unit?: string; // Đơn vị/Khoa (computed)

  // Optional: Để hiển thị danh sách linh kiện khi cần
  components?: RepairRequestComponent[];
}

// Interface cho RepairRequest với thông tin chi tiết đầy đủ (computed từ join các bảng)
export interface RepairRequestWithDetails extends RepairRequest {
  // Thông tin từ bảng assets
  assetCode: string;
  assetName: string;
  assetSpecs: string;

  // Thông tin từ bảng computers
  machineLabel: string;

  // Thông tin từ bảng rooms (qua computers.roomId)
  roomName: string;
  buildingName: string;

  // Thông tin từ bảng users
  reporterName: string;
  reporterRole: string;
  assignedTechnicianName?: string;

  // Thông tin từ bảng errorTypes
  errorTypeName?: string;

  // Đơn vị từ bảng units (qua rooms.unitId)
  unit: string;

  // Danh sách chi tiết linh kiện bị lỗi với thông tin đầy đủ
  faultyComponents: Array<{
    componentId: string;
    componentName: string;
    componentType: string;
    componentSpecs: string;
    serialNumber?: string;
    note?: string; // Ghi chú từ RepairRequestComponents
  }>;
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
  machineLabel: string; // Số máy
  reason: string; // Lý do thay thế linh kiện này
  quantity: number; // Số lượng cần thay
}

// Định nghĩa thông tin chi tiết về vai trò
export const RoleInfo = {
  [UserRole.ADMIN]: {
    name: "Quản trị viên hệ thống",
    description: "Quản lý toàn bộ hệ thống",
    defaultRoute: "/qtv-khoa", // Admin có thể truy cập tất cả, mặc định là QTV_KHOA
    permissions: [
      "full_access",
      "manage_users",
      "manage_roles",
      "system_oversight",
    ],
  },
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
  CHỜ_TIẾP_NHẬN = "CHỜ_TIẾP_NHẬN", // Giảng viên vừa tạo, chờ KTV tiếp nhận
  ĐÃ_TIẾP_NHẬN = "ĐÃ_TIẾP_NHẬN", // KTV xem yêu cầu sẽ tự dộng chuyển sang trạng thái này
  ĐANG_XỬ_LÝ = "ĐANG_XỬ_LÝ", // KTV đang trong quá trình kiểm tra, sửa chữa
  CHỜ_THAY_THẾ = "CHỜ_THAY_THẾ", // Lỗi phần cứng, đã tạo đề xuất thay thế và đang chờ duyệt/mua sắm
  ĐÃ_HOÀN_THÀNH = "ĐÃ_HOÀN_THÀNH", // Đã sửa chữa hoặc thay thế xong
  ĐÃ_HỦY = "ĐÃ_HỦY", // Yêu cầu bị hủy bởi giảng viên với yêu cầu là báo lỗi chưa được tiếp nhận
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
  CHỜ_TỔ_TRƯỞNG_DUYỆT = "CHỜ_TỔ_TRƯỞNG_DUYỆT", // kỹ thuật viên lập đề xuất, chờ tổ trưởng duyệt
  ĐÃ_DUYỆT = "ĐÃ_DUYỆT", // Đã được tổ trưởng duyệt
  ĐÃ_TỪ_CHỐI = "ĐÃ_TỪ_CHỐI", // Tổ trưởng từ chối đề xuất, cần lập lại
  ĐÃ_LẬP_TỜ_TRÌNH = "ĐÃ_LẬP_TỜ_TRÌNH", // Tổ trưởng kỹ thuật đã lập tờ trình gửi Phòng Quản trị
  ĐÃ_DUYỆT_TỜ_TRÌNH = "ĐÃ_DUYỆT_TỜ_TRÌNH", // Phòng Quản trị đã duyệt tờ trình, chờ mua sắm
  ĐÃ_TỪ_CHỐI_TỜ_TRÌNH = "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH", // Phòng Quản trị từ chối tờ trình, cần lập lại
  CHỜ_XÁC_MINH = "CHỜ_XÁC_MINH", // Chờ Phòng Quản trị cử người xuống xác minh thực tế
  ĐÃ_XÁC_MINH = "ĐÃ_XÁC_MINH", // Phòng Quản trị đã xác minh xong, chờ lập tờ trình
  ĐÃ_GỬI_BIÊN_BẢN = "ĐÃ_GỬI_BIÊN_BẢN", // Đã gửi biên bản cho tổ trưởng kỹ thuật
  ĐÃ_KÝ_BIÊN_BẢN = "ĐÃ_KÝ_BIÊN_BẢN", // Tổ trưởng kỹ thuật đã ký biên bản
  ĐÃ_HOÀN_TẤT_MUA_SẮM = "ĐÃ_HOÀN_TẤT_MUA_SẮM", // Đã có thiết bị mới
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
  MAINBOARD = "MAINBOARD", // Updated to match database
  STORAGE = "STORAGE",
  GPU = "GPU",
  PSU = "PSU",
  CASE = "CASE",
  MONITOR = "MONITOR",
  KEYBOARD = "KEYBOARD",
  MOUSE = "MOUSE",
  NETWORK = "NETWORK", // Updated to match database
  OPTICAL_DRIVE = "OPTICAL_DRIVE",
  COOLER = "COOLER", // Updated to match database
  UPS = "UPS", // Added from database
  OTHER = "OTHER",
  NETWORK_CARD = "NETWORK_CARD", // Added from database
  SOUND_CARD = "SOUND_CARD", // Added from database
  SPEAKER = "SPEAKER", // Added from database
  WEBCAM = "WEBCAM", // Added from database
}

// Component Status enum
export enum ComponentStatus {
  INSTALLED = "INSTALLED", // Đang được lắp đặt và hoạt động
  FAULTY = "FAULTY", // Hỏng hóc
  REMOVED = "REMOVED", // Đã gỡ ra
  IN_STOCK = "IN_STOCK", // linh kiện mới chờ lắp đặt
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
  id: string; // This would be the repairRequestId
  assetId: string; // Computer asset ID
  requestCode: string; // Request code like YCSC-2025-0001
  reportDate: string; // Initial creation date
  completedDate?: string; // Completion date if completed
  errorType: string; // Type of error reported
  description: string; // Description of the issue
  technicianName: string; // Name of assigned technician
  reporterName: string; // Name of person who reported
  solution?: string; // Solution applied (from resolutionNotes)
  status: RepairStatus; // Current status
  logs: RepairLog[]; // Array of all log entries for this repair request
  componentChanges?: {
    componentType: string;
    oldComponent?: string;
    newComponent: string;
    changeReason: string;
  }[]; // Optional component changes
}

// Interface for individual repair log entries (matches RepairLogs table)
export interface RepairLog {
  id: string; // UUID
  repairRequestId: string; // FK to RepairRequests
  actorId: string; // FK to users - person who performed the action
  actorName: string; // Name of the person who performed the action
  action: string; // Action performed, e.g., "Tạo yêu cầu", "Tiếp nhận xử lý", "Hoàn tất"
  fromStatus: RepairStatus | null; // Status before change
  toStatus: RepairStatus; // Status after change
  comment: string; // Notes for this action
  createdAt: string; // ISO timestamp when action was performed
}

// Interface for repair history items used in HistoryCard component
export interface RepairHistoryItem {
  id: string;
  assetId: string;
  requestCode: string;
  errorType: string;
  description: string;
  solution?: string;
  status: string;
  reportDate: string;
  completedDate?: string;
  technicianName: string;
  reporterName: string;
  logs?: RepairLog[]; // Optional logs for detailed history
}

// Interface for replacement requests displayed in technician pages - Khớp với database ReplacementProposals
export interface ReplacementRequestItem {
  id: string;
  proposalCode: string; // Thay đổi từ requestCode để khớp database
  proposerId: string;
  teamLeadApproverId?: string;
  adminVerifierId?: string;
  title: string; // Tiêu đề đề xuất (từ database)
  description: string; // Mô tả chi tiết (từ database)
  status: ReplacementStatus;
  submissionFormUrl?: string;
  verificationReportUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // Tên người tạo (computed từ proposerId)
  components: ComponentFromRequest[];
}

// Interface for individual components in a replacement request
export interface ComponentFromRequest {
  id: string;
  componentName: string;
  componentType: ComponentType;
  assetId: string;
  assetName: string;
  assetCode: string;
  buildingName: string;
  roomName: string;
  newItemName: string;
  newItemSpecs: string;
  quantity: number;
  reason: string;
  machineLabel?: string;
}

// Extended interface for component replacement with additional info (for proposal creation)
export interface ComponentFromReport {
  id: string;
  proposalId: string;
  oldComponentId: string;
  newItemName: string;
  newItemSpecs: string;
  quantity: number;
  reason: string;
  newlyPurchasedAssetId: string | null;
  componentName: string;
  componentType: ComponentType;
  assetId: string;
  assetName: string;
  assetCode: string;
  buildingName: string;
  roomName: string;
  status: ReplacementStatus;
  reportDate: string;
  machineLabel?: string;
  location: string;
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

// Asset Type enum - Synchronized with database-sync.json
export enum AssetType {
  TSCD = "TSCD", // Tài sản cố định
  CCDC = "CCDC", // Công cụ dụng cụ
}

// Asset Shape enum
export enum AssetShape {
  GENERIC = "GENERIC", // Tài sản thông thường
  COMPUTER = "COMPUTER", // Máy tính
}

// Asset Status enum - Synchronized with database-sync.json
export enum AssetStatus {
  DANG_SU_DUNG = "đang_sử_dụng",
  CHO_BAN_GIAO = "chờ_bàn_giao",
  CHO_TIEP_NHAN = "chờ_tiếp_nhận",
  HU_HONG = "hư_hỏng",
  DA_MAT = "đã_mất", // Updated from MAT_TICH
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
  categoryId: string; // FK to categories.id
  shape: AssetShape; // Hình dạng tài sản (COMPUTER, GENERIC)
  status: AssetStatus; // Trạng thái tài sản
  createdBy: string; // FK to users.id - Người tạo
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt?: string; // ISO timestamp (soft delete)
}

// Interface cho bảng TechnicianAssignments - Phân công kỹ thuật viên theo khu vực
export interface TechnicianAssignment {
  id: string; // UUID primary key
  technicianId: string; // FK to users.id (kỹ thuật viên)
  building: string; // Tòa nhà được phân công (vd: "Tòa A", "Tòa H")
  floors: string[]; // Danh sách tầng được phân công (vd: ["1", "2", "3"])
  isActive: boolean; // Trạng thái phân công có hiệu lực
  assignedBy: string; // FK to users.id (tổ trưởng kỹ thuật phân công)
  assignedAt: string; // Thời điểm phân công (ISO timestamp)
  notes?: string; // Ghi chú phân công
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Categories interface based on database schema
export interface Category {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
}

// Interface cho SubmissionForm - Tờ trình đệ trình lên Phòng Quản trị
export interface SubmissionForm {
  id: string; // UUID primary key
  proposalId: string; // FK to ReplacementProposals.id
  proposalCode: string; // Mã đề xuất (copied từ proposal)
  submissionFormUrl: string; // Đường dẫn file tờ trình (PDF)
  submittedBy: string; // FK to users.id (Tổ trưởng kỹ thuật)
  submittedAt: string; // Thời điểm nộp tờ trình (ISO timestamp)

  // Nội dung tờ trình
  formData: {
    submittedBy: string; // Tên người đề nghị
    position: string; // Chức vụ
    department: string; // Đơn vị đề nghị
    recipientDepartment: string; // Đơn vị tiếp nhận
    subject: string; // Đề nghị (vấn đề)
    content: string; // Nội dung tờ trình
    attachments: string; // Các văn bản kèm theo
    director: string; // Tên giám đốc
    rector: string; // Tên hiệu trưởng
  };

  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Interface cho dữ liệu form tờ trình (sử dụng trong component)
export interface SubmissionFormData {
  submittedBy: string;
  position: string;
  department: string;
  recipientDepartment: string;
  subject: string;
  content: string;
  attachments: string;
  director: string;
  rector: string;
}
