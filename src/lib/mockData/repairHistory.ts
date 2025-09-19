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

// Enhanced mock data with logs included - using interface from types
export const mockRepairHistory: RepairHistoryItem[] = [
  // ASSET001 - PC Dell OptiPlex 3080 - Máy 01  
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
    technicianName: "user-4",
    reporterName: "user-5",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-001")
  },
  {
    id: "hist-002",
    assetId: "ASSET001",
    requestCode: "YCSC-2024-0015",
    errorType: "Máy hư bàn phím",
    description: "Bàn phím Dell KB216 một số phím không hoạt động, phím Space và Enter bị liệt",
    solution: "Đã thay bàn phím mới Dell KB216, kiểm tra hoạt động bình thường",
    status: "Đã hoàn thành",
    reportDate: "2024-12-10T09:15:00Z",
    completedDate: "2024-12-10T14:30:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên"
  },
  {
    id: "hist-003",
    assetId: "ASSET001",
    requestCode: "YCSC-2024-0008",
    errorType: "Máy hư phần mềm",
    description: "Windows 11 Pro bị lỗi, máy khởi động chậm và thường xuyên bị treo",
    solution: "Đã cài đặt lại Windows 11 Pro và các driver cần thiết, cập nhật hệ thống",
    status: "Đã hoàn thành",
    reportDate: "2024-11-22T10:30:00Z",
    completedDate: "2024-11-23T16:00:00Z",
    technicianName: "Anh Tuấn",
    reporterName: "Giảng viên"
  },

  // ASSET002 - PC Dell OptiPlex 3080 - Máy 02
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
    technicianName: "user-4",
    reporterName: "user-5",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-002")
  },
  {
    id: "hist-005",
    assetId: "ASSET002",
    requestCode: "YCSC-2024-0012",
    errorType: "Máy không kết nối mạng",
    description: "Máy không thể kết nối internet, card mạng không nhận dạng được",
    solution: "Đã cập nhật driver card mạng và kiểm tra cáp mạng, hoạt động bình thường",
    status: "Đã hoàn thành",
    reportDate: "2024-12-05T13:20:00Z",
    completedDate: "2024-12-05T15:45:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên"
  },

  // ASSET003 - PC HP ProDesk 400 - Máy 03
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
    technicianName: "user-4",
    reporterName: "user-5",
    logs: mockRepairLogs.filter(log => log.repairRequestId === "req-003")
  },
  {
    id: "hist-007",
    assetId: "ASSET003",
    requestCode: "YCSC-2024-0009",
    errorType: "Máy hư chuột",
    description: "Chuột Dell MS116 không hoạt động, không di chuyển được con trỏ",
    solution: "Đã thay chuột mới Dell MS116, hoạt động bình thường",
    status: "Đã hoàn thành",
    reportDate: "2024-11-18T11:00:00Z",
    completedDate: "2024-11-18T14:20:00Z",
    technicianName: "Văn Đạt",
    reporterName: "Giảng viên"
  },
  {
    id: "hist-008",
    assetId: "ASSET003",
    requestCode: "YCSC-2024-0003",
    errorType: "Máy hư phần mềm",
    description: "Windows 11 Pro bị virus, máy chạy chậm và có popup quảng cáo",
    solution: "Đã quét virus, cài đặt lại một số phần mềm bị nhiễm, cập nhật antivirus",
    status: "Đã hoàn thành",
    reportDate: "2024-10-15T08:45:00Z",
    completedDate: "2024-10-15T16:30:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên"
  },

  // ASSET004 - PC Lenovo ThinkCentre
  {
    id: "hist-009",
    assetId: "ASSET004",
    requestCode: "YCSC-2024-0014",
    errorType: "Máy không khởi động",
    description: "Máy tính đôi khi không khởi động được, phải nhấn nút nguồn nhiều lần",
    solution: "Đã kiểm tra và vệ sinh nút nguồn, thay pin CMOS mới",
    status: "Đã hoàn thành",
    reportDate: "2024-12-08T09:30:00Z",
    completedDate: "2024-12-08T11:15:00Z",
    technicianName: "Anh Tuấn",
    reporterName: "Giảng viên"
  },
  {
    id: "hist-010",
    assetId: "ASSET004",
    requestCode: "YCSC-2024-0007",
    errorType: "Máy hư phần mềm",
    description: "Microsoft Office 2021 không hoạt động, báo lỗi license",
    solution: "Đã kích hoạt lại license Office 2021, cập nhật phiên bản mới nhất",
    status: "Đã hoàn thành",
    reportDate: "2024-11-20T14:10:00Z",
    completedDate: "2024-11-20T15:30:00Z",
    technicianName: "Văn Đạt",
    reporterName: "Giảng viên"
  },

  // ASSET005 - PC Dell Inspiron - Máy 02
  {
    id: "hist-011",
    assetId: "ASSET005",
    requestCode: "YCSC-2024-0013",
    errorType: "Máy không khởi động",
    description: "CPU Intel Core i3-11100 chạy quá nóng, máy tự động tắt khi sử dụng lâu",
    solution: "Đang thay keo tản nhiệt CPU, vệ sinh quạt tản nhiệt",
    status: "Đang xử lý",
    reportDate: "2024-12-07T10:20:00Z",
    completedDate: undefined,
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên"
  },
  {
    id: "hist-012",
    assetId: "ASSET005",
    requestCode: "YCSC-2024-0006",
    errorType: "Máy mất chuột",
    description: "Chuột của máy số 2 bị mất, không tìm thấy",
    solution: "Đã thay chuột mới Dell MS116 cho máy số 2",
    status: "Đã hoàn thành",
    reportDate: "2024-11-12T13:40:00Z",
    completedDate: "2024-11-12T14:00:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Giảng viên"
  },

  // ASSET006 - PC HP Pavilion - Máy 03
  {
    id: "hist-013",
    assetId: "ASSET006",
    requestCode: "YCSC-2024-0011",
    errorType: "Máy hư phần mềm",
    description: "Windows 11 Home báo lỗi update, không thể cập nhật hệ thống",
    solution: "Đã sửa lỗi Windows Update, cập nhật thành công lên phiên bản mới nhất",
    status: "Đã hoàn thành",
    reportDate: "2024-12-02T11:15:00Z",
    completedDate: "2024-12-02T16:45:00Z",
    technicianName: "Văn Đạt",
    reporterName: "Giảng viên"
  },
  {
    id: "hist-014",
    assetId: "ASSET006",
    requestCode: "YCSC-2024-0004",
    errorType: "Máy không kết nối mạng",
    description: "Máy không thể truy cập internet, hiển thị lỗi DNS",
    solution: "Đã cấu hình lại DNS, reset network adapter, hoạt động bình thường",
    status: "Đã hoàn thành",
    reportDate: "2024-10-28T09:50:00Z",
    completedDate: "2024-10-28T11:30:00Z",
    technicianName: "Anh Tuấn",
    reporterName: "Giảng viên"
  },

  // Additional historical records for better context
  {
    id: "hist-015",
    assetId: "ASSET001",
    requestCode: "YCSC-2024-0001",
    errorType: "Máy hư phần mềm",
    description: "Cài đặt ban đầu Windows 11 Pro và các phần mềm cần thiết",
    solution: "Đã cài đặt đầy đủ hệ điều hành và phần mềm theo yêu cầu",
    status: "Đã hoàn thành",
    reportDate: "2024-01-15T08:00:00Z",
    completedDate: "2024-01-15T16:00:00Z",
    technicianName: "Kỹ thuật viên",
    reporterName: "Phòng Quản trị"
  }
];