import { ReplacementRequestForList } from "@/types";

export interface ReplacementList {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  totalItems: number;
  totalCost: number;
  requests: ReplacementRequestForList[];
}

export const mockReplacementLists: ReplacementList[] = [
  {
    id: "LIST-001",
    title: "Danh sách đề xuất thay thế thiết bị tháng 12/2024",
    description:
      "Tổng hợp các thiết bị cần thay thế khẩn cấp cho phòng Lab H8.1, H8.2, H8.3",
    createdAt: "2024-12-15T10:30:00",
    createdBy: "Giảng Thanh Trọn",
    status: "draft",
    totalItems: 3,
    totalCost: 12500000,
    requests: [
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
        id: "REQ-007",
        assetCode: "PC-H301-15",
        assetName: "Máy tính Desktop Dell Inspiron",
        requestedBy: "Nguyễn Thị G",
        unit: "Khoa Công nghệ Thông tin",
        location: "Tòa H - Phòng H301",
        reason: "Mainboard Intel B460 hỏng, không khởi động được",
        status: "approved",
        
        requestDate: "2024-01-18",
        estimatedCost: 4200000,
        description:
          "Mainboard bị short mạch sau sự cố mất điện, cần thay mainboard mới tương đương.",
      },
      {
        id: "REQ-008",
        assetCode: "PC-H205-20",
        assetName: "Máy tính Desktop HP Pavilion",
        requestedBy: "Trần Văn H",
        unit: "Khoa Công nghệ Thông tin",
        location: "Tòa H - Phòng H205",
        reason: "Card đồ họa GTX 1660 hỏng, không hiển thị hình ảnh",
        status: "approved",
        
        requestDate: "2024-01-20",
        estimatedCost: 5500000,
        description:
          "Card đồ họa bị lỗi chip, cần thay card mới có hiệu năng tương đương.",
      },
    ],
  },
  {
    id: "LIST-002",
    title: "Đề xuất thay thế thiết bị phòng H9",
    description:
      "Các thiết bị trong phòng H9 cần được thay thế do hết hạn sử dụng",
    createdAt: "2024-12-10T14:20:00",
    createdBy: "Giảng Thanh Trọn",
    status: "submitted",
    totalItems: 2,
    totalCost: 8700000,
    requests: [
      {
        id: "REQ-009",
        assetCode: "PC-H901-05",
        assetName: "Máy tính Desktop Lenovo IdeaCentre",
        requestedBy: "Phan Thị I",
        unit: "Khoa Công nghệ Thông tin",
        location: "Tòa H - Phòng H901",
        reason: "RAM DDR3 4GB hỏng, máy chạy chậm",
        status: "approved",
        
        requestDate: "2024-01-22",
        estimatedCost: 1200000,
        description:
          "RAM cũ không tương thích với hệ thống mới, cần nâng cấp lên DDR4.",
      },
      {
        id: "REQ-010",
        assetCode: "PC-H901-12",
        assetName: "Máy tính Desktop MSI Modern",
        requestedBy: "Hoàng Văn K",
        unit: "Khoa Công nghệ Thông tin",
        location: "Tòa H - Phòng H901",
        reason: "Nguồn điện 450W không ổn định",
        status: "approved",
        
        requestDate: "2024-01-25",
        estimatedCost: 7500000,
        description:
          "Nguồn điện cũ không đủ công suất, cần thay nguồn mới có công suất cao hơn.",
      },
    ],
  },
];
