import { ErrorType } from '@/types';

// Mock error types data - Khớp hoàn toàn với database schema
export const mockErrorTypes: ErrorType[] = [
  {
    id: "ET001",
    name: "Máy không khởi động",
    description: "Máy tính không thể bật nguồn hoặc không có phản hồi khi nhấn nút nguồn. Có thể do lỗi nguồn điện, mainboard hoặc các linh kiện phần cứng khác.",
    createdAt: "2024-01-15T01:00:00.000Z",
  },
  {
    id: "ET002",
    name: "Máy hư phần mềm",
    description: "Các lỗi liên quan đến hệ điều hành, ứng dụng không hoạt động, virus, hoặc file hệ thống bị hỏng. Cần cài đặt lại hoặc sửa chữa phần mềm.",
    createdAt: "2024-01-15T01:05:00.000Z",
  },
  {
    id: "ET003",
    name: "Máy hư bàn phím",
    description: "Bàn phím không hoạt động, một số phím bị liệt, hoặc gõ phím không có phản hồi. Có thể do lỗi kết nối USB hoặc bàn phím bị hỏng.",
    createdAt: "2024-01-15T01:10:00.000Z",
  },
  {
    id: "ET004",
    name: "Máy hư chuột",
    description: "Chuột không di chuyển được con trỏ, không click được, hoặc chuột không được nhận dạng bởi hệ thống. Cần kiểm tra kết nối và thay thế nếu cần.",
    createdAt: "2024-01-15T01:15:00.000Z",
  },
  {
    id: "ET005",
    name: "Máy không sử dụng được",
    description: "Máy tính hoàn toàn không thể sử dụng do nhiều lỗi phức tạp, cần kiểm tra tổng thể và có thể phải thay thế nhiều linh kiện.",
    createdAt: "2024-01-15T01:20:00.000Z",
  },
  {
    id: "ET006",
    name: "Máy hư loa",
    description: "Loa máy tính không phát ra âm thanh, tiếng bị rè hoặc không được nhận dạng bởi hệ thống.",
    createdAt: "2024-01-15T01:25:00.000Z",
  },
  {
    id: "ET007",
    name: "Máy hư màn hình",
    description: "Màn hình không hiển thị hình ảnh, bị nhấp nháy, xuất hiện đường kẻ sọc dọc/ngang, hoặc màu sắc không chính xác.",
    createdAt: "2024-01-15T01:30:00.000Z",
  },
  {
    id: "ET008",
    name: "Máy hư ổ cứng",
    description: "Ổ cứng SSD/HDD bị hỏng, xuất hiện bad sectors, không thể truy cập dữ liệu hoặc tốc độ đọc ghi chậm bất thường.",
    createdAt: "2024-01-15T01:35:00.000Z",
  },
  {
    id: "ET009",
    name: "Máy chạy chậm",
    description: "Máy tính hoạt động chậm chạp, đơ máy thường xuyên, khởi động lâu hoặc các ứng dụng phản hồi chậm.",
    createdAt: "2024-01-15T01:40:00.000Z",
  },
  {
    id: "ET010",
    name: "Máy nhiễm virus",
    description: "Máy tính bị nhiễm virus, malware, xuất hiện các cửa sổ quảng cáo bất thường hoặc hành vi đáng ngờ khác.",
    createdAt: "2024-01-15T01:45:00.000Z",
  },
  {
    id: "ET011",
    name: "Máy không kết nối mạng",
    description: "Máy tính mất kết nối internet, không thể truy cập mạng LAN hoặc WiFi, card mạng không hoạt động.",
    createdAt: "2024-01-15T01:50:00.000Z",
  },
  {
    id: "ET012",
    name: "Máy hư RAM",
    description: "Bộ nhớ RAM bị lỗi, máy tính báo lỗi memory, màn hình xanh chết (BSOD) hoặc khởi động không ổn định.",
    createdAt: "2024-01-15T01:55:00.000Z",
  },
  {
    id: "ET013",
    name: "Máy hư nguồn",
    description: "Nguồn điện (PSU) bị hỏng, không cấp điện ổn định, có tiếng kêu bất thường hoặc mùi cháy.",
    createdAt: "2024-01-15T02:00:00.000Z",
  },
  {
    id: "ET014", 
    name: "Máy mất bàn phím",
    description: "Bàn phím bị mất, thất lạc hoặc bị hỏng hoàn toàn không thể sửa chữa, cần thay thế mới.",
    createdAt: "2024-01-15T02:05:00.000Z",
  },
  {
    id: "ET015",
    name: "Máy mất chuột",
    description: "Chuột bị mất, thất lạc hoặc bị hỏng hoàn toàn không thể sửa chữa, cần thay thế mới.",
    createdAt: "2024-01-15T02:10:00.000Z",
  },
];

// Helper functions
export const getErrorTypeById = (id: string): ErrorType | undefined => {
  return mockErrorTypes.find(errorType => errorType.id === id);
};

export const getErrorTypesByCategory = (category: string): ErrorType[] => {
  return mockErrorTypes.filter(errorType => 
    errorType.description?.toLowerCase().includes(category.toLowerCase()) || false
  );
};

export const getErrorTypesByName = (name: string): ErrorType[] => {
  return mockErrorTypes.filter(errorType => 
    errorType.name.toLowerCase().includes(name.toLowerCase())
  );
};