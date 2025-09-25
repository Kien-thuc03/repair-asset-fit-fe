// Mock error types data - Synchronized with actual database via MCP
export const mockErrorTypes = [
  {
    id: "ET001",
    name: "Máy không khởi động",
    code: "NO_BOOT",
    description: "Máy tính không thể bật nguồn hoặc không có phản hồi khi nhấn nút nguồn. Có thể do lỗi nguồn điện, mainboard hoặc các linh kiện phần cứng khác.",
    createdAt: "2024-01-15T01:00:00Z",
  },
  {
    id: "ET002",
    name: "Máy hư phần mềm",
    code: "SOFTWARE_ERROR",
    description: "Các lỗi liên quan đến hệ điều hành, ứng dụng không hoạt động, virus, hoặc file hệ thống bị hỏng. Cần cài đặt lại hoặc sửa chữa phần mềm.",
    createdAt: "2024-01-15T01:05:00Z",
  },
  {
    id: "ET003",
    name: "Máy hư bàn phím",
    code: "KEYBOARD_ERROR",
    description: "Bàn phím không hoạt động, một số phím bị hỏng",
  },
  {
    id: "ET004",
    name: "Máy hư chuột",
    code: "MOUSE_ERROR",
    description: "Chuột không hoạt động, con trỏ không di chuyển",
  },
  {
    id: "ET005",
    name: "Máy hư màn hình",
    code: "MONITOR_ERROR",
    description: "Màn hình không hiển thị, mờ, hoặc có sọc",
  },
  {
    id: "ET006",
    name: "Máy hư loa",
    code: "SPEAKER_ERROR",
    description: "Không có âm thanh, loa bị hỏng",
  },
  {
    id: "ET007",
    name: "Máy mất bàn phím",
    code: "KEYBOARD_MISSING",
    description: "Bàn phím bị mất hoặc không có",
  },
  {
    id: "ET008",
    name: "Máy mất chuột",
    code: "MOUSE_MISSING",
    description: "Chuột bị mất hoặc không có",
  },
  {
    id: "ET009",
    name: "Máy chạy chậm",
    code: "SLOW_PERFORMANCE",
    description: "Máy tính chạy chậm, lag, đơ",
  },
  {
    id: "ET010",
    name: "Máy nhiễm virus",
    code: "VIRUS_INFECTED",
    description: "Máy tính bị nhiễm virus, malware",
  },
  {
    id: "ET011",
    name: "Máy không kết nối mạng",
    code: "NETWORK_ERROR",
    description: "Không thể kết nối internet, mạng LAN",
  },
  {
    id: "ET012",
    name: "Máy hư ổ cứng",
    code: "HDD_ERROR",
    description: "Ổ cứng bị hỏng, bad sector, không đọc được",
  },
  {
    id: "ET013",
    name: "Máy hư RAM",
    code: "RAM_ERROR",
    description: "RAM bị lỗi, máy báo lỗi memory",
  },
  {
    id: "ET014",
    name: "Máy hư nguồn",
    code: "PSU_ERROR",
    description: "Nguồn điện bị hỏng, không cấp điện",
  },
  {
    id: "ET015",
    name: "Khác",
    code: "OTHER",
    description: "Các lỗi khác không thuộc danh mục trên",
  },
];

// Helper functions
export const getErrorTypeById = (id: string) => {
  return mockErrorTypes.find(errorType => errorType.id === id);
};

export const getErrorTypeByCode = (code: string) => {
  return mockErrorTypes.find(errorType => errorType.code === code);
};

export const getErrorTypesByCategory = (category: string) => {
  return mockErrorTypes.filter(errorType => 
    errorType.description.toLowerCase().includes(category.toLowerCase())
  );
};