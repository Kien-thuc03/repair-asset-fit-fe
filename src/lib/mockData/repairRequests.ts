import { RepairRequest, RepairStatus } from "@/types";
import { CheckCircle, Clock, Wrench, XCircle, Pause } from "lucide-react";

// Mock repair requests data - Synchronized with database
export const mockRepairRequests: RepairRequest[] = [
  {
    id: "req-001",
    requestCode: "YCSC-2025-0001",
    computerAssetId: "ASSET001",
    assetCode: "19-0205/01",
    assetName: "PC Dell OptiPlex 3080",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H101",
    machineLabel: "01",
    buildingName: "Tòa H",
    errorTypeId: "ET001",
    errorTypeName: "Máy không khởi động",
    description:
      "Máy tính không khởi động được, có mùi cháy từ nguồn điện 500W, cần thay thay nguồn mới ngay lập tức",
    mediaUrls: [
      "https://vr360.vn/wp-content/uploads/2015/07/nguyen-nhan-khien-may-tinh-khong-the-khoi-dong-vao-windows-300x138.jpg",
      "https://ictsaigon.com.vn/storage/news/may-tinh-khong-khoi-dong-duoc/may-tinh-khong-khoi-dong-duoc-8.webp",
    ],
    status: RepairStatus.CHỜ_TIẾP_NHẬN,
    resolutionNotes: undefined,
    createdAt: "2024-01-15T01:30:00.000Z",
    acceptedAt: undefined,
    completedAt: undefined,
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-002",
    requestCode: "YCSC-2025-0002",
    computerAssetId: "ASSET002",
    assetCode: "19-0205/02",
    assetName: "PC Dell OptiPlex 3080",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H101",
    machineLabel: "02",
    buildingName: "Tòa H",
    errorTypeId: "ET002",
    errorTypeName: "Máy hư phần mềm",
    description:
      "SSD Samsung 980 bị bad sectors, máy không khởi động được, mất dữ liệu",
    mediaUrls: [
      "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/131734/Originals/loi-man-hinh-xanh.png",
    ],
    status: RepairStatus.ĐANG_XỬ_LÝ,
    resolutionNotes: "Đã kiểm tra SSD, đang chờ linh kiện mới",
    createdAt: "2024-01-14T07:15:00.000Z",
    acceptedAt: "2024-01-14T08:00:00.000Z",
    completedAt: undefined,
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-004",
    requestCode: "YCSC-2025-0004",
    computerAssetId: "ASSET004",
    assetCode: "19-0207/01",
    assetName: "PC Lenovo ThinkCentre",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-8",
    assignedTechnicianName: "Anh Tuấn",
    roomName: "H102",
    machineLabel: "01",
    buildingName: "Tòa H",
    errorTypeId: "ET002",
    errorTypeName: "Máy hư phần mềm",
    description: "Máy không kết nối được mạng, không thể truy cập internet",
    mediaUrls: [],
    status: RepairStatus.ĐÃ_TIẾP_NHẬN,
    resolutionNotes: undefined,
    createdAt: "2024-01-16T03:30:00.000Z",
    acceptedAt: "2024-01-16T04:00:00.000Z",
    completedAt: undefined,
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-005",
    requestCode: "YCSC-2025-0005",
    computerAssetId: "ASSET005",
    assetCode: "19-0208/01",
    assetName: "PC Dell Inspiron",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-9",
    assignedTechnicianName: "Văn Đạt",
    roomName: "H102",
    machineLabel: "02",
    buildingName: "Tòa H",
    errorTypeId: "ET008",
    errorTypeName: "Máy mất chuột",
    description: "Chuột máy tính bị mất, cần thay thế chuột mới",
    mediaUrls: [],
    status: RepairStatus.CHỜ_THAY_THẾ,
    resolutionNotes: "Đã xác nhận chuột bị mất, đang chờ chuột mới",
    createdAt: "2024-01-17T07:20:00.000Z",
    acceptedAt: "2024-01-17T08:00:00.000Z",
    completedAt: undefined,
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-006",
    requestCode: "YCSC-2025-0006",
    computerAssetId: "ASSET009",
    assetCode: "19-0210/01",
    assetName: "PC ASUS VivoBook",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H103",
    machineLabel: "01",
    buildingName: "Tòa H",
    errorTypeId: "ET004",
    errorTypeName: "Máy hư chuột",
    description: "Chuột không hoạt động được, con trỏ không di chuyển",
    mediaUrls: [],
    status: RepairStatus.CHỜ_TIẾP_NHẬN,
    resolutionNotes: undefined,
    createdAt: "2024-01-18T02:15:00.000Z",
    acceptedAt: undefined,
    completedAt: undefined,
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-003",
    requestCode: "YCSC-2025-0003",
    computerAssetId: "ASSET003",
    assetCode: "19-0206/01",
    assetName: "PC HP Pavilion",
    reporterId: "user-5",
    reporterName: "Giảng viên",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H101",
    machineLabel: "03",
    buildingName: "Tòa H",
    errorTypeId: "ET002",
    errorTypeName: "Máy hư phần mềm",
    description: "Windows bị lỗi, không thể khởi động được hệ điều hành",
    mediaUrls: [],
    status: RepairStatus.ĐÃ_HOÀN_THÀNH,
    resolutionNotes: "Đã cài đặt lại Windows 11, khôi phục dữ liệu người dùng",
    createdAt: "2024-01-13T09:00:00.000Z",
    acceptedAt: "2024-01-13T09:30:00.000Z",
    completedAt: "2024-01-13T14:30:00.000Z",
    unit: "Khoa Công nghệ Thông tin",
  },
];

// Configuration for repair request status display
export const repairRequestStatusConfig = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: {
    label: "Chờ tiếp nhận",
    color: "border-yellow-200 text-yellow-800 bg-yellow-50",
    icon: Clock,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
  },
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: {
    label: "Đã tiếp nhận",
    color: "border-blue-200 text-blue-800 bg-blue-50",
    icon: CheckCircle,
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
  },
  [RepairStatus.ĐANG_XỬ_LÝ]: {
    label: "Đang xử lý",
    color: "border-purple-200 text-purple-800 bg-purple-50",
    icon: Wrench,
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    borderColor: "border-purple-200",
  },
  [RepairStatus.CHỜ_THAY_THẾ]: {
    label: "Chờ thay thế",
    color: "border-orange-200 text-orange-800 bg-orange-50",
    icon: Pause,
    bgColor: "bg-orange-50",
    textColor: "text-orange-800",
    borderColor: "border-orange-200",
  },
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: {
    label: "Đã hoàn thành",
    color: "border-green-200 text-green-800 bg-green-50",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  [RepairStatus.ĐÃ_HỦY]: {
    label: "Đã hủy",
    color: "border-red-200 text-red-800 bg-red-50",
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
} as const;

// Helper function để lấy repair requests theo status
export const getRepairRequestsByStatus = (
  status: RepairStatus
): RepairRequest[] => {
  return mockRepairRequests.filter((request) => request.status === status);
};

// Helper function để lấy repair requests theo technician
export const getRepairRequestsByTechnician = (
  technicianId: string
): RepairRequest[] => {
  return mockRepairRequests.filter(
    (request) => request.assignedTechnicianId === technicianId
  );
};

// Helper function để lấy repair requests gần đây nhất
export const getRecentRepairRequests = (limit: number = 6): RepairRequest[] => {
  return mockRepairRequests
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
};

// Helper function để đếm số lượng requests theo status
export const countRepairRequestsByStatus = (status: RepairStatus): number => {
  return mockRepairRequests.filter((request) => request.status === status)
    .length;
};

// Helper function để lấy repair request theo ID
export const getRepairRequestById = (id: string): RepairRequest | undefined => {
  return mockRepairRequests.find((request) => request.id === id);
};

// Helper function để cập nhật trạng thái repair request (mock)
export const updateRepairRequestStatus = (
  id: string,
  status: RepairStatus,
  notes?: string
): RepairRequest | null => {
  const request = mockRepairRequests.find((r) => r.id === id);
  if (!request) return null;

  // Cập nhật trạng thái và thời gian
  request.status = status;
  if (notes) request.resolutionNotes = notes;

  const now = new Date().toISOString();
  if (status === RepairStatus.ĐÃ_TIẾP_NHẬN && !request.acceptedAt) {
    request.acceptedAt = now;
  }
  if (status === RepairStatus.ĐÃ_HOÀN_THÀNH && !request.completedAt) {
    request.completedAt = now;
  }

  return request;
};

// Helper function để lấy repair request với chi tiết đầy đủ
export const getRepairRequestWithDetails = (
  id: string
): RepairRequest | null => {
  const request = mockRepairRequests.find((r) => r.id === id);
  if (!request) {
    return null;
  }
  return request;
};

// Hàm hủy yêu cầu sửa chữa (chỉ cho mock data)
export const cancelRepairRequest = (requestId: string): boolean => {
  const index = mockRepairRequests.findIndex(request => request.id === requestId);
  if (index !== -1) {
    // Xóa request khỏi mảng
    mockRepairRequests.splice(index, 1);
    return true;
  }
  return false;
};
