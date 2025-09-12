import { ReplacementRequestForList, ReplacementStatus } from "@/types";

// Interface cho danh sách đề xuất thay thế linh kiện (từ KTV)
export interface ReplacementRequestItem {
  id: string;
  requestCode: string; // Mã đề xuất thay thế
  assetId: string;
  assetCode: string;
  assetName: string;
  componentId: string;
  componentName: string;
  componentSpecs?: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  technicianId: string;
  technicianName: string;
  reason: string; // Lý do thay thế
  estimatedCost: number;
  status: ReplacementStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  rejectedReason?: string;
  unit: string;
}

// Mock data cho trang quản lý thay thế linh kiện của KTV
export const mockReplacementRequestsForTechnician: ReplacementRequestItem[] = [
  {
    id: "repl-001",
    requestCode: "DXTL-2025-0001",
    assetId: "asset-001",
    assetCode: "PC-H301-01",
    assetName: "Máy tính Dell OptiPlex 3070",
    componentId: "comp-001",
    componentName: "Nguồn điện",
    componentSpecs: "500W 80+ Bronze",
    roomId: "room-001",
    roomName: "H301",
    buildingName: "Tòa H",
    technicianId: "tech-001",
    technicianName: "Trần Thị B",
    reason: "Nguồn điện bị cháy, có mùi cháy và không thể khởi động máy",
    estimatedCost: 1200000,
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
    createdAt: "2024-01-15T09:00:00",
    updatedAt: "2024-01-15T09:00:00",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "repl-002",
    requestCode: "DXTL-2025-0002",
    assetId: "asset-002",
    assetCode: "PC-H205-15",
    assetName: "Máy tính HP EliteDesk 800",
    componentId: "comp-002",
    componentName: "RAM DDR4",
    componentSpecs: "8GB DDR4 2666MHz",
    roomId: "room-002",
    roomName: "H205",
    buildingName: "Tòa H",
    technicianId: "tech-002",
    technicianName: "Phạm Văn D",
    reason: "RAM bị lỗi, máy không khởi động được",
    estimatedCost: 800000,
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    createdAt: "2024-01-14T15:30:00",
    updatedAt: "2024-01-16T10:00:00",
    approvedBy: "Trưởng phòng KT",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "repl-003",
    requestCode: "DXTL-2025-0003",
    assetId: "asset-003",
    assetCode: "PC-H704-08",
    assetName: "Máy tính Asus VivoPC",
    componentId: "comp-003",
    componentName: "SSD",
    componentSpecs: "256GB SATA SSD",
    roomId: "room-003",
    roomName: "H704",
    buildingName: "Tòa H",
    technicianId: "tech-003",
    technicianName: "Nguyễn Văn F",
    reason: "SSD bị bad sector nghiêm trọng, không thể sửa được",
    estimatedCost: 1500000,
    status: ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    createdAt: "2024-01-12T10:30:00",
    updatedAt: "2024-01-13T16:00:00",
    approvedBy: "QTV Khoa CNTT",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "repl-004",
    requestCode: "DXTL-2025-0004",
    assetId: "asset-004",
    assetCode: "PC-H508-11",
    assetName: "Máy tính MSI Pro",
    componentId: "comp-004",
    componentName: "Card đồ họa",
    componentSpecs: "NVIDIA GTX 1050 2GB",
    roomId: "room-004",
    roomName: "H508",
    buildingName: "Tòa H",
    technicianId: "tech-004",
    technicianName: "Hoàng Văn E",
    reason: "Card đồ họa bị lỗi chip, không hiển thị hình ảnh",
    estimatedCost: 3500000,
    status: ReplacementStatus.CHỜ_QTV_KHOA_DUYỆT,
    createdAt: "2024-01-13T12:00:00",
    updatedAt: "2024-01-16T14:30:00",
    approvedBy: "Trưởng phòng KT",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "repl-005",
    requestCode: "DXTL-2025-0005",
    assetId: "asset-005",
    assetCode: "PC-H109-22",
    assetName: "Máy tính Lenovo ThinkCentre",
    componentId: "comp-005",
    componentName: "CPU",
    componentSpecs: "Intel i5-8400 3.0GHz",
    roomId: "room-005",
    roomName: "H109",
    buildingName: "Tòa H",
    technicianId: "tech-005",
    technicianName: "Lê Văn C",
    reason: "CPU bị quá nhiệt và không thể sửa được do hỏng chip",
    estimatedCost: 4500000,
    status: ReplacementStatus.ĐÃ_TỪ_CHỐI,
    createdAt: "2024-01-16T08:45:00",
    updatedAt: "2024-01-17T09:15:00",
    rejectedReason: "Chi phí quá cao, đề nghị tìm giải pháp khác",
    unit: "Khoa Công nghệ Thông tin",
  },
];

// Mock data cho trang duyệt đề xuất của Tổ trưởng KT
export const mockReplacementRequests: ReplacementRequestForList[] = [
  {
    id: "REQ-001",
    assetCode: "PC-H301-01",
    assetName: "Máy tính Desktop Dell OptiPlex 3070",
    requestedBy: "Nguyễn Văn A",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H301",
    reason: "Hỏng mainboard Intel H310, không thể sửa chữa",
    status: "pending",
    requestDate: "2024-01-15",
    estimatedCost: 8500000,
    description:
      "Máy tính bị hỏng mainboard sau 4 năm sử dụng, đã kiểm tra và xác định cần thay thế mainboard mới Intel H310 hoặc tương đương.",
  },
  {
    id: "REQ-002",
    assetCode: "PC-H205-15",
    assetName: "Máy tính Desktop HP EliteDesk 800",
    requestedBy: "Trần Thị B",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H205",
    reason: "RAM DDR4 8GB hỏng, máy không khởi động được",
    status: "pending",
    requestDate: "2024-01-14",
    estimatedCost: 1200000,
    description:
      "RAM DDR4 8GB bị lỗi sau 3 năm sử dụng, máy báo lỗi memory test failed, cần thay RAM mới cùng loại.",
  },
  {
    id: "REQ-003",
    assetCode: "PC-H704-08",
    assetName: "Máy tính Desktop Asus VivoPC",
    requestedBy: "Lê Văn C",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H704",
    reason: "Ổ cứng SSD 256GB hỏng, mất dữ liệu",
    status: "approved",
    requestDate: "2024-01-12",
    estimatedCost: 2800000,
    description:
      "Ổ cứng SSD Samsung 256GB bị bad sector nghiêm trọng, không thể phục hồi dữ liệu, cần thay SSD mới cùng dung lượng.",
  },
  {
    id: "REQ-004",
    assetCode: "PC-H109-22",
    assetName: "Máy tính Desktop Lenovo ThinkCentre",
    requestedBy: "Phạm Thị D",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H109",
    reason: "Nguồn điện 500W bị cháy, có mùi khét",
    status: "pending",
    requestDate: "2024-01-16",
    estimatedCost: 1800000,
    description:
      "Nguồn điện Cooler Master 500W bị short mạch, có tiếng nổ nhỏ và mùi cháy, cần thay nguồn mới ngay lập tức để đảm bảo an toàn.",
  },
  {
    id: "REQ-005",
    assetCode: "PC-H508-11",
    assetName: "Máy tính Desktop MSI Pro",
    requestedBy: "Hoàng Văn E",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H508",
    reason: "Card đồ họa GTX 1050 hỏng, không hiển thị hình ảnh",
    status: "pending",
    requestDate: "2024-01-13",
    estimatedCost: 4200000,
    description:
      "Card đồ họa NVIDIA GTX 1050 2GB bị lỗi chip, màn hình không hiển thị gì, cần thay card đồ họa mới tương đương hoặc cao hơn.",
  },
  {
    id: "REQ-006",
    assetCode: "PC-H902-03",
    assetName: "Máy tính Desktop Acer Veriton",
    requestedBy: "Võ Thị F",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H902",
    reason: "CPU Intel i5-8400 quá nóng, máy tự động tắt",
    status: "rejected",
    requestDate: "2024-01-10",
    estimatedCost: 5500000,
    description:
      "CPU Intel i5-8400 bị quá nhiệt do tản nhiệt hỏng, đã thay tản nhiệt mới nhưng CPU vẫn bị lỗi, cần thay CPU mới.",
  },
];
