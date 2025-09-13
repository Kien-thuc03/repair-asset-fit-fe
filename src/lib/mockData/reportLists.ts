import { ReplacementRequestForList, ReplacementStatus } from "@/types";

// Interface cho danh sách tờ trình
export interface ReportList {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: "CHỜ_LẬP_TỜ_TRÌNH" | "ĐÃ_LẬP_TỜ_TRÌNH" | "HOÀN_TẤT";
  totalItems: number;
  totalEstimatedCost: number;
  items: ReplacementRequestForList[];
}

// Mock data cho các danh sách tờ trình đã được tạo
export const mockReportLists: ReportList[] = [
  {
    id: "RL-2024-001",
    title: "Danh sách thay thế linh kiện tháng 12/2024",
    description:
      "Danh sách tổng hợp các đề xuất thay thế linh kiện cần thiết cho tháng 12/2024, bao gồm các thiết bị hư hỏng nặng cần thay thế gấp.",
    createdAt: "2024-12-01T08:30:00.000Z",
    createdBy: "Nguyễn Văn Hưng",
    status: "CHỜ_LẬP_TỜ_TRÌNH",
    totalItems: 8,
    totalEstimatedCost: 45000000,
    items: [
      {
        id: "REQ-2024-001",
        assetName: "Card mạng Gigabit Ethernet",
        assetCode: "PC-H101-01",
        requestedBy: "Nguyễn Văn A",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H101",
        estimatedCost: 2500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-15",
        reason: "Card mạng bị hỏng, không thể kết nối mạng",
        description: "Card mạng bị hỏng, không thể kết nối mạng",
      },
      {
        id: "REQ-2024-002",
        assetName: "RAM DDR4 8GB",
        assetCode: "PC-H102-05",
        requestedBy: "Trần Thị B",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H102",
        estimatedCost: 3200000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-16",
        reason: "RAM bị lỗi, máy không khởi động được",
        description: "RAM bị lỗi, máy không khởi động được",
      },
      {
        id: "REQ-2024-003",
        assetName: "Ổ cứng SSD 256GB",
        assetCode: "PC-H704-08",
        requestedBy: "Lê Văn C",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H704",
        estimatedCost: 4500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-18",
        reason: "SSD bị bad sector nghiêm trọng",
        description: "SSD bị bad sector nghiêm trọng",
      },
      {
        id: "REQ-2024-004",
        assetName: "Card đồ họa NVIDIA GTX 1050",
        assetCode: "PC-H508-11",
        requestedBy: "Phạm Thị D",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H508",
        estimatedCost: 8500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-20",
        reason: "Card đồ họa bị lỗi chip",
        description: "Card đồ họa bị lỗi chip",
      },
      {
        id: "REQ-2024-005",
        assetName: "CPU Intel i5-8400",
        assetCode: "PC-H109-22",
        requestedBy: "Hoàng Văn E",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H109",
        estimatedCost: 12000000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-22",
        reason: "CPU bị quá nhiệt, máy tự động tắt",
        description: "CPU bị quá nhiệt, máy tự động tắt",
      },
      {
        id: "REQ-2024-006",
        assetName: "Nguồn điện 500W",
        assetCode: "PC-H203-07",
        requestedBy: "Nguyễn Văn A",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H203",
        estimatedCost: 3500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-25",
        reason: "Nguồn cung cấp điện không ổn định",
        description: "Nguồn cung cấp điện không ổn định",
      },
      {
        id: "REQ-2024-007",
        assetName: "Bo mạch chủ Intel B460",
        assetCode: "PC-H301-12",
        requestedBy: "Trần Thị B",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H301",
        estimatedCost: 6800000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-28",
        reason: "Bo mạch chủ bị chập cháy",
        description: "Bo mạch chủ bị chập cháy",
      },
      {
        id: "REQ-2024-008",
        assetName: "Ổ cứng HDD 1TB",
        assetCode: "PC-H205-15",
        requestedBy: "Lê Văn C",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H205",
        estimatedCost: 4000000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-30",
        reason: "HDD có bad sector, tốc độ chậm",
        description: "HDD có bad sector, tốc độ chậm",
      },
    ],
  },
  {
    id: "RL-2024-002",
    title: "Danh sách thay thế linh kiện khẩn cấp - Phòng máy H3",
    description:
      "Danh sách các thiết bị trong phòng máy H3 cần thay thế khẩn cấp do sự cố mất điện gây hư hỏng đồng loạt.",
    createdAt: "2024-11-28T14:15:00.000Z",
    createdBy: "Nguyễn Văn Hưng",
    status: "ĐÃ_LẬP_TỜ_TRÌNH",
    totalItems: 5,
    totalEstimatedCost: 28500000,
    items: [
      {
        id: "REQ-2024-009",
        assetName: "Bo mạch chủ Intel H310",
        assetCode: "PC-H301-01",
        requestedBy: "Phạm Thị D",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H301",
        estimatedCost: 5500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-26",
        reason: "Bo mạch chủ bị hỏng do sự cố điện",
        description: "Bo mạch chủ bị hỏng do sự cố điện",
      },
      {
        id: "REQ-2024-010",
        assetName: "CPU Intel i5-8400",
        assetCode: "PC-H902-03",
        requestedBy: "Hoàng Văn E",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H902",
        estimatedCost: 12000000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-26",
        reason: "CPU bị quá nhiệt do sự cố",
        description: "CPU bị quá nhiệt do sự cố",
      },
      {
        id: "REQ-2024-011",
        assetName: "RAM DDR4 16GB",
        assetCode: "PC-H301-02",
        requestedBy: "Nguyễn Văn A",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H301",
        estimatedCost: 4500000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-27",
        reason: "RAM bị lỗi sau sự cố điện",
        description: "RAM bị lỗi sau sự cố điện",
      },
      {
        id: "REQ-2024-012",
        assetName: "Nguồn điện 650W",
        assetCode: "PC-H301-03",
        requestedBy: "Trần Thị B",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H301",
        estimatedCost: 4200000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-27",
        reason: "Nguồn điện bị cháy do quá tải",
        description: "Nguồn điện bị cháy do quá tải",
      },
      {
        id: "REQ-2024-013",
        assetName: "Card mạng WiFi",
        assetCode: "PC-H301-04",
        requestedBy: "Lê Văn C",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng H301",
        estimatedCost: 2300000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-28",
        reason: "Card WiFi không hoạt động",
        description: "Card WiFi không hoạt động",
      },
    ],
  },
  {
    id: "RL-2024-003",
    title: "Danh sách nâng cấp thiết bị phòng thí nghiệm",
    description:
      "Nâng cấp các thiết bị trong phòng thí nghiệm để phục vụ các nghiên cứu và thí nghiệm mới.",
    createdAt: "2024-11-20T10:00:00.000Z",
    createdBy: "Nguyễn Văn Hưng",
    status: "HOÀN_TẤT",
    totalItems: 3,
    totalEstimatedCost: 18200000,
    items: [
      {
        id: "REQ-2024-014",
        assetName: "Card đồ họa RTX 3060",
        assetCode: "PC-LAB-01",
        requestedBy: "Phạm Thị D",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng Lab",
        estimatedCost: 12000000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-15",
        reason: "Nâng cấp card đồ họa cho tính toán AI",
        description: "Nâng cấp card đồ họa cho tính toán AI",
      },
      {
        id: "REQ-2024-015",
        assetName: "RAM DDR4 32GB",
        assetCode: "PC-LAB-02",
        requestedBy: "Hoàng Văn E",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng Lab",
        estimatedCost: 4200000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-16",
        reason: "Tăng RAM để xử lý dữ liệu lớn",
        description: "Tăng RAM để xử lý dữ liệu lớn",
      },
      {
        id: "REQ-2024-016",
        assetName: "SSD NVMe 1TB",
        assetCode: "PC-LAB-03",
        requestedBy: "Nguyễn Văn A",
        unit: "Khoa Công nghệ Thông tin",
        location: "Phòng Lab",
        estimatedCost: 2000000,
        status: ReplacementStatus.ĐÃ_DUYỆT,
        requestDate: "2024-11-18",
        reason: "Tăng tốc độ truy xuất dữ liệu",
        description: "Tăng tốc độ truy xuất dữ liệu",
      },
    ],
  },
];

// Function để lấy danh sách theo trạng thái
export const getReportListsByStatus = (status?: string) => {
  if (!status || status === "all") {
    return mockReportLists;
  }
  return mockReportLists.filter((list) => list.status === status);
};

// Function để lấy chi tiết danh sách theo ID
export const getReportListById = (id: string) => {
  return mockReportLists.find((list) => list.id === id);
};

// Function để lấy tổng thống kê
export const getReportListsStats = () => {
  return {
    total: mockReportLists.length,
    choLapToTrinh: mockReportLists.filter(
      (list) => list.status === "CHỜ_LẬP_TỜ_TRÌNH"
    ).length,
    daLapToTrinh: mockReportLists.filter(
      (list) => list.status === "ĐÃ_LẬP_TỜ_TRÌNH"
    ).length,
    hoanTat: mockReportLists.filter((list) => list.status === "HOÀN_TẤT")
      .length,
    totalCost: mockReportLists.reduce(
      (sum, list) => sum + list.totalEstimatedCost,
      0
    ),
    totalItems: mockReportLists.reduce((sum, list) => sum + list.totalItems, 0),
  };
};
