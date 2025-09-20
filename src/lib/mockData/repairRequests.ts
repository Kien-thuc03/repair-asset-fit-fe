import {
  RepairRequest,
  RepairStatus,
  RepairRequestComponent,
  RepairRequestWithDetails,
} from "@/types";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  FileCheck,
  CircleAlert,
} from "lucide-react";

export const repairRequestStatusConfig = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: {
    label: "Chờ tiếp nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: {
    label: "Đã tiếp nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertTriangle,
  },
  [RepairStatus.ĐANG_XỬ_LÝ]: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CircleAlert,
  },
  [RepairStatus.CHỜ_THAY_THẾ]: {
    label: "Chờ thay thế",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: FileCheck,
  },
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  [RepairStatus.ĐÃ_HỦY]: {
    label: "Hủy bỏ",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: X,
  },
};

// Data for repair requests list (for quan-ly-bao-loi page) - Synchronized with database-sync.json
export const mockRepairRequests: RepairRequest[] = [
  {
    id: "req-001",
    requestCode: "YCSC-2024-001",
    assetId: "ASSET001",
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
    resolutionNotes: "",
    createdAt: "2024-01-15T08:30:00Z",
    acceptedAt: "",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-002",
    requestCode: "YCSC-2024-002",
    assetId: "ASSET002",
    assetCode: "19-0205/02",
    assetName: "PC Dell OptiPlex 3080",
    machineLabel: "02",
    componentId: "CC013",
    componentName: "Kingston Fury Beast DDR4 16GB",
    reporterId: "user-8",
    reporterName: "Anh Tuấn",
    reporterRole: "Kỹ thuật viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H101",
    machineLabel: "02",
    buildingName: "Tòa H",
    errorTypeId: "ET002",
    errorTypeName: "Lỗi phần cứng - SSD",
    description:
      "SSD Samsung 980 bị bad sectors, máy không khởi động được, mất dữ liệu",
    mediaUrls: [
      "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/131734/Originals/loi-man-hinh-xanh.png",
    ],
    status: RepairStatus.ĐANG_XỬ_LÝ,
    resolutionNotes: "Đã kiểm tra SSD, đang chờ linh kiện mới",
    createdAt: "2024-01-14T14:15:00Z",
    acceptedAt: "2024-01-14T15:00:00Z",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "repair-003",
    requestCode: "YCSC-2024-003",
    assetId: "ASSET003",
    assetCode: "19-0206/01",
    assetName: "PC HP ProDesk 400",
    machineLabel: "03",
    componentId: "CC024",
    componentName: "WD Blue SSD 512GB",
    reporterId: "user-9",
    reporterName: "Văn Đạt",
    reporterRole: "Kỹ thuật viên",
    assignedTechnicianId: "user-4",
    assignedTechnicianName: "Kỹ thuật viên",
    roomName: "H102",
    machineLabel: "03",
    buildingName: "Tòa H",
    errorTypeId: "ET007",
    errorTypeName: "Máy hư màn hình",
    description:
      "Màn hình HP P22v G4 bị nhấp nháy và có đường kẻ, không thể sử dụng được",
    mediaUrls: [],
    status: RepairStatus.ĐÃ_HOÀN_THÀNH,
    resolutionNotes: "Đã thay màn hình mới HP P22v G4, kiểm tra hoạt động tốt",
    createdAt: "2024-01-12T09:00:00Z",
    acceptedAt: "2024-01-12T10:00:00Z",
    completedAt: "2024-01-13T16:00:00Z",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-004",
    requestCode: "YCSC-2025-0004",
    computerAssetId: "ASSET004",
    assetCode: "PC-A102-01",
    assetName: "PC Lenovo ThinkCentre",
    machineLabel: "01",
    componentId: "COMP034",
    componentName: "Lenovo ThinkVision E24-20",
    reporterId: "user-8",
    reporterName: "Anh Tuấn",
    reporterRole: "Kỹ thuật viên",
    assignedTechnicianId: "tech-004",
    assignedTechnicianName: "Hoàng Văn E",
    roomName: "H102",
    machineLabel: "01",
    buildingName: "Tòa H",
    errorTypeId: "ET002",
    errorTypeName: "Lỗi phần mềm",
    description:
      "Màn hình Lenovo ThinkVision E24-20 bị lỗi, không hiển thị hình ảnh, có dấu hiệu hỏng backlight",
    mediaUrls: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=300&fit=crop",
    ],
    status: RepairStatus.CHỜ_TIẾP_NHẬN,
    resolutionNotes: "",
    createdAt: "2024-01-13T11:20:00",
    acceptedAt: "",
    completedAt: "",
    unit: "Phòng Quản trị",
  },
  {
    id: "req-005",
    requestCode: "YCSC-2025-0005",
    computerAssetId: "ASSET005",
    assetCode: "PC-A102-02",
    assetName: "PC Dell Inspiron",
    machineLabel: "02",
    componentId: "COMP041",
    componentName: "Intel Core i3-11100",
    reporterId: "user-9",
    reporterName: "Văn Đạt",
    reporterRole: "Kỹ thuật viên",
    assignedTechnicianId: "tech-005",
    assignedTechnicianName: "Lê Văn C",
    roomName: "H102",
    machineLabel: "02",
    buildingName: "Tòa H",
    errorTypeId: "ET001",
    errorTypeName: "Máy không khởi động",
    description:
      "CPU Intel Core i3-11100 bị quá nhiệt, máy tự động tắt liên tục sau 5-10 phút sử dụng, cần thay tản nhiệt",
    mediaUrls: ["cpu_temp.jpg"],
    status: RepairStatus.ĐANG_XỬ_LÝ,
    resolutionNotes:
      "Đang thay tản nhiệt mới và kiểm tra CPU, có thể cần thay CPU",
    createdAt: "2024-01-16T07:45:00",
    acceptedAt: "2024-01-16T08:30:00",
    completedAt: "",
    unit: "Phòng Quản trị",
  },
];

// Data for repair request components (bảng trung gian many-to-many) - Synchronized with database-sync.json
export const mockRepairRequestComponents: RepairRequestComponent[] = [
  {
    repairRequestId: "req-001",
    componentId: "CC005",
    note: "Nguồn điện bị cháy, có mùi khét",
  },
  {
    repairRequestId: "req-002",
    componentId: "CC013",
    note: "SSD có bad sectors nghiêm trọng",
  },
  {
    repairRequestId: "req-002",
    componentId: "CC012",
    note: "RAM gây lỗi màn hình xanh",
  },
  {
    repairRequestId: "req-003",
    componentId: "CC024",
    note: "Màn hình nhấp nháy, có đường kẻ",
  },
  {
    repairRequestId: "req-004",
    componentId: "CC031",
    note: "Màn hình không hiển thị, hỏng backlight",
  },
  {
    repairRequestId: "req-005",
    componentId: "CC032",
    note: "CPU quá nhiệt, cần thay tản nhiệt",
  },
];

// Import other required data
import { mockComputerComponents } from "./computerComponents";
import { comprehensiveAssets } from "./assets";
import { mockComputers } from "./computers";
import { mockRooms } from "./rooms";
import { users } from "../sampleData/database-sync.json";
import { errorTypes } from "./errorTypes";

// Helper function để join dữ liệu và tạo RepairRequestWithDetails
export function getRepairRequestWithDetails(
  requestId: string
): RepairRequestWithDetails | null {
  const request = mockRepairRequests.find((r) => r.id === requestId);
  if (!request) return null;

  // Lấy thông tin asset từ comprehensiveAssets
  const asset = comprehensiveAssets.find(
    (a) => a.id === request.computerAssetId
  );

  // Lấy thông tin computer
  const computer = mockComputers.find(
    (c) => c.assetId === request.computerAssetId
  );

  // Lấy thông tin room
  const room = computer
    ? mockRooms.find((r) => r.id === computer.roomId)
    : null;

  // Lấy thông tin reporter
  const reporter = users.find((u) => u.id === request.reporterId);

  // Lấy thông tin technician
  const technician = request.assignedTechnicianId
    ? users.find((u) => u.id === request.assignedTechnicianId)
    : null;

  // Lấy thông tin error type
  const errorType = request.errorTypeId
    ? errorTypes.find((e) => e.id === request.errorTypeId)
    : null;

  // Lấy danh sách linh kiện bị lỗi
  const requestComponents = mockRepairRequestComponents.filter(
    (rc) => rc.repairRequestId === requestId
  );

  const faultyComponents = requestComponents.map((rc) => {
    const component = mockComputerComponents.find(
      (c) => c.id === rc.componentId
    );
    return {
      componentId: rc.componentId,
      componentName: component?.name || "Unknown",
      componentType: component?.componentType || "OTHER",
      componentSpecs: component?.componentSpecs || "",
      serialNumber: component?.serialNumber,
      note: rc.note,
    };
  });

  const detailedRequest: RepairRequestWithDetails = {
    ...request,
    // Asset info
    assetCode: asset?.ktCode || request.assetCode || "",
    assetName: asset?.name || request.assetName || "",
    assetSpecs: asset?.specs || "",

    // Computer info
    machineLabel: computer?.machineLabel || request.machineLabel || "",

    // Room info
    roomName: room?.roomNumber || request.roomName || "",
    buildingName: room?.building || request.buildingName || "",

    // User info
    reporterName: reporter?.fullName || request.reporterName || "",
    reporterRole: request.reporterRole || "Unknown",
    assignedTechnicianName:
      technician?.fullName || request.assignedTechnicianName,

    // Error type info
    errorTypeName: errorType?.name || request.errorTypeName,

    // Unit info (from room)
    unit: request.unit || "Unknown",

    // Faulty components details
    faultyComponents,
  };

  return detailedRequest;
}

// Helper function để lấy tất cả RepairRequests với details
export function getAllRepairRequestsWithDetails(): RepairRequestWithDetails[] {
  return mockRepairRequests
    .map((request) => getRepairRequestWithDetails(request.id))
    .filter((req): req is RepairRequestWithDetails => req !== null);
}

// Helper function để lấy RepairRequests theo status với details
export function getRepairRequestsWithDetailsByStatus(
  status: RepairStatus
): RepairRequestWithDetails[] {
  return getAllRepairRequestsWithDetails().filter(
    (req) => req.status === status
  );
}

// Helper function để lấy RepairRequests theo reporter với details
export function getRepairRequestsWithDetailsByReporter(
  reporterId: string
): RepairRequestWithDetails[] {
  return getAllRepairRequestsWithDetails().filter(
    (req) => req.reporterId === reporterId
  );
}
