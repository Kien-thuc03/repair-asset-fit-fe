import { RepairStatus, RepairLog, RepairHistoryItem } from "@/types";

// Mock logs data based on database-sync.json Logs section
export const mockRepairLogs: RepairLog[] = [
  {
    id: "LOG001",
    repairRequestId: "req-001",
    actorId: "user-5",
    actorName: "Giảng viên",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: RepairStatus.CHỜ_TIẾP_NHẬN,
    comment: "Báo cáo lỗi máy không khởi động",
    createdAt: "2024-01-15T08:30:00Z"
  },
  {
    id: "LOG002",
    repairRequestId: "req-002",
    actorId: "user-5",
    actorName: "Giảng viên",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: RepairStatus.CHỜ_TIẾP_NHẬN,
    comment: "Báo cáo lỗi RAM",
    createdAt: "2024-01-14T14:15:00Z"
  },
  {
    id: "LOG003",
    repairRequestId: "req-002",
    actorId: "user-4",
    actorName: "Kỹ thuật viên",
    action: "Tiếp nhận xử lý",
    fromStatus: RepairStatus.CHỜ_TIẾP_NHẬN,
    toStatus: RepairStatus.ĐÃ_TIẾP_NHẬN,
    comment: "Đã tiếp nhận yêu cầu sửa chữa",
    createdAt: "2024-01-14T15:00:00Z"
  },
  {
    id: "LOG004",
    repairRequestId: "req-002",
    actorId: "user-4",
    actorName: "Kỹ thuật viên",
    action: "Bắt đầu xử lý",
    fromStatus: RepairStatus.ĐÃ_TIẾP_NHẬN,
    toStatus: RepairStatus.ĐANG_XỬ_LÝ,
    comment: "Bắt đầu kiểm tra và sửa chữa",
    createdAt: "2024-01-14T15:30:00Z"
  },
  {
    id: "LOG005",
    repairRequestId: "req-003",
    actorId: "user-5",
    actorName: "Giảng viên",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: RepairStatus.CHỜ_TIẾP_NHẬN,
    comment: "Báo cáo lỗi màn hình",
    createdAt: "2024-01-12T09:00:00Z"
  },
  {
    id: "LOG006",
    repairRequestId: "req-003",
    actorId: "user-4",
    actorName: "Kỹ thuật viên",
    action: "Tiếp nhận xử lý",
    fromStatus: RepairStatus.CHỜ_TIẾP_NHẬN,
    toStatus: RepairStatus.ĐÃ_TIẾP_NHẬN,
    comment: "Đã tiếp nhận yêu cầu sửa chữa",
    createdAt: "2024-01-12T10:00:00Z"
  },
  {
    id: "LOG007",
    repairRequestId: "req-003",
    actorId: "user-4",
    actorName: "Kỹ thuật viên",
    action: "Hoàn tất",
    fromStatus: RepairStatus.ĐANG_XỬ_LÝ,
    toStatus: RepairStatus.ĐÃ_HOÀN_THÀNH,
    comment: "Đã thay màn hình mới thành công",
    createdAt: "2024-01-13T16:00:00Z"
  }
];

// CHÍNH XÁC theo database-sync.json - CHỈ có 3 repair requests
export const mockRepairHistory: RepairHistoryItem[] = [
  // req-001 - ASSET001 (PC Dell OptiPlex 3080 - Máy 01)
  {
    id: "req-001",
    assetId: "ASSET001",
    requestCode: "YCSC-2025-0001",
    errorType: "Máy không khởi động",
    description: "Máy tính không khởi động được, có mùi cháy từ nguồn điện 500W, cần thay thay nguồn mới ngay lập tức",
    solution: undefined,
    status: "Chờ tiếp nhận",
    reportDate: "2024-01-15T08:30:00Z",
    completedDate: undefined,
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-001")
  },
  // req-002 - ASSET002 (PC Dell OptiPlex 3080 - Máy 02)
  {
    id: "req-002",
    assetId: "ASSET002",
    requestCode: "YCSC-2025-0002",
    errorType: "Máy hư phần mềm",
    description: "SSD Samsung 980 bị bad sectors, máy không khởi động được, mất dữ liệu",
    solution: "Đã kiểm tra SSD, đang chờ linh kiện mới",
    status: "Đang xử lý",
    reportDate: "2024-01-14T14:15:00Z",
    completedDate: undefined,
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-002")
  },
  // req-003 - ASSET003 (PC HP ProDesk 400 - Máy 03)
  {
    id: "req-003",
    assetId: "ASSET003",
    requestCode: "YCSC-2025-0003",
    errorType: "Máy hư màn hình",
    description: "Màn hình HP P22v G4 bị nhấp nháy và có đường kẻ, không thể sử dụng được",
    solution: "Đã thay màn hình mới HP P22v G4, kiểm tra hoạt động tốt",
    status: "Đã hoàn thành",
    reportDate: "2024-01-12T09:00:00Z",
    completedDate: "2024-01-13T16:00:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-003")
  }
];