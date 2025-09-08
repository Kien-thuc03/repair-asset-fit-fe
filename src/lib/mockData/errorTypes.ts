export interface ErrorType {
  id: string; // UUID primary key
  name: string; // Tên loại lỗi (unique, not null)
  description?: string; // Mô tả chi tiết về loại lỗi
  createdAt: string; // Timestamp (ISO string)
}

export const errorTypes: ErrorType[] = [
  {
    id: "ET001",
    name: "Máy không khởi động",
    description:
      "Máy tính không thể bật nguồn hoặc không có phản hồi khi nhấn nút nguồn. Có thể do lỗi nguồn điện, mainboard hoặc các linh kiện phần cứng khác.",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "ET002",
    name: "Máy hư phần mềm",
    description:
      "Các lỗi liên quan đến hệ điều hành, ứng dụng không hoạt động, virus, hoặc file hệ thống bị hỏng. Cần cài đặt lại hoặc sửa chữa phần mềm.",
    createdAt: "2024-01-15T08:05:00Z",
  },
  {
    id: "ET003",
    name: "Máy hư bàn phím",
    description:
      "Bàn phím không hoạt động, một số phím bị liệt, hoặc gõ phím không có phản hồi. Có thể do lỗi kết nối USB hoặc bàn phím bị hỏng.",
    createdAt: "2024-01-15T08:10:00Z",
  },
  {
    id: "ET004",
    name: "Máy hư chuột",
    description:
      "Chuột không di chuyển được con trỏ, không click được, hoặc chuột không được nhận dạng bởi hệ thống. Cần kiểm tra kết nối và thay thế nếu cần.",
    createdAt: "2024-01-15T08:15:00Z",
  },
  {
    id: "ET005",
    name: "Máy không sử dụng được",
    description:
      "Máy tính hoàn toàn không thể sử dụng do nhiều lỗi phức tạp, cần kiểm tra tổng thể và có thể phải thay thế nhiều linh kiện.",
    createdAt: "2024-01-15T08:20:00Z",
  },
  {
    id: "ET006",
    name: "Máy không kết nối mạng",
    description:
      "Không thể kết nối internet hoặc mạng nội bộ. Có thể do lỗi card mạng, driver, cấu hình mạng hoặc cáp mạng bị hỏng.",
    createdAt: "2024-01-15T08:25:00Z",
  },
  {
    id: "ET007",
    name: "Máy hư màn hình",
    description:
      "Màn hình không hiển thị, hiển thị bị lỗi, nhấp nháy, hoặc có đường kẻ. Có thể do lỗi màn hình, cáp kết nối hoặc card đồ họa.",
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "ET008",
    name: "Máy mất chuột",
    description:
      "Chuột không còn tại vị trí làm việc, có thể bị mất hoặc lấy nhầm. Cần thay thế chuột mới cho máy tính.",
    createdAt: "2024-01-15T08:35:00Z",
  },
  {
    id: "ET009",
    name: "Máy mất bàn phím",
    description:
      "Bàn phím không còn tại vị trí làm việc, có thể bị mất hoặc lấy nhầm. Cần thay thế bàn phím mới cho máy tính.",
    createdAt: "2024-01-15T08:40:00Z",
  },
  {
    id: "ET010",
    name: "Lỗi khác",
    description:
      "Các lỗi không thuộc các loại trên, cần mô tả chi tiết trong phần ghi chú khi báo cáo để kỹ thuật viên có thể hỗ trợ tốt hơn.",
    createdAt: "2024-01-15T08:45:00Z",
  },
];
