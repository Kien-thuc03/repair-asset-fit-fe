export interface ErrorType {
  id: string; // UUID primary key
  name: string; // Tên loại lỗi (unique, not null)
  description?: string; // Mô tả chi tiết về loại lỗi
  createdAt: string; // Timestamp (ISO string)
}

// Synchronized with database-sync.json
export const errorTypes: ErrorType[] = [
  {
    id: "error-001",
    name: "Lỗi phần cứng - CPU",
    description:
      "CPU bị quá nhiệt, lỗi xử lý hoặc hỏng hóc. Máy tính có thể tự động tắt hoặc chạy chậm.",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "error-002",
    name: "Lỗi phần cứng - RAM",
    description:
      "RAM bị lỗi, không tương thích hoặc hỏng. Máy có thể không khởi động được hoặc bị treo thường xuyên.",
    createdAt: "2024-01-15T08:05:00Z",
  },
  {
    id: "error-003",
    name: "Lỗi phần cứng - Ổ cứng",
    description:
      "Ổ cứng bị bad sector, hỏng hóc hoặc không nhận dạng được. Dữ liệu có thể bị mất hoặc không truy cập được.",
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
