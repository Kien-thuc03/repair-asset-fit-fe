import type { DepartmentStats } from "@/types/stats";

// Mock data cho thống kê tổng quan - Khoa CNTT
export const statsData = [
  {
    title: "Tổng số báo lỗi",
    value: 256,
    suffix: "yêu cầu",
    valueStyle: { color: "#3f8600" },
    precision: 0,
    iconType: "FileText" as const,
  },
  {
    title: "Đang xử lý",
    value: 18,
    suffix: "yêu cầu",
    valueStyle: { color: "#cf1322" },
    precision: 0,
    iconType: "Clock" as const,
  },
  {
    title: "Hoàn thành",
    value: 238,
    suffix: "yêu cầu",
    valueStyle: { color: "#389e0d" },
    precision: 0,
    iconType: "CheckCircle" as const,
  },
  {
    title: "Tỷ lệ hoàn thành",
    value: 93.0,
    suffix: "%",
    valueStyle: { color: "#3f8600" },
    precision: 1,
    iconType: "TrendingUp" as const,
  },
];

// Data cho biểu đồ cột - thống kê theo tháng cho Khoa CNTT
export const monthlyData = [
  { month: "T1", reports: 20, completed: 19, pending: 1 },
  { month: "T2", reports: 24, completed: 22, pending: 2 },
  { month: "T3", reports: 28, completed: 26, pending: 2 },
  { month: "T4", reports: 22, completed: 21, pending: 1 },
  { month: "T5", reports: 26, completed: 24, pending: 2 },
  { month: "T6", reports: 30, completed: 28, pending: 2 },
  { month: "T7", reports: 25, completed: 23, pending: 2 },
  { month: "T8", reports: 32, completed: 30, pending: 2 },
  { month: "T9", reports: 35, completed: 32, pending: 3 },
  { month: "T10", reports: 29, completed: 27, pending: 2 },
  { month: "T11", reports: 18, completed: 17, pending: 1 },
  { month: "T12", reports: 16, completed: 15, pending: 1 },
];

// Data cho biểu đồ tròn - phân loại theo loại lỗi trong Khoa CNTT
export const errorTypeStatsData = [
  {
    name: "Máy không khởi động",
    value: 28,
    color: "#ff4d4f",
    errorTypeId: "ET001",
  },
  {
    name: "Máy hư phần mềm",
    value: 35,
    color: "#1890ff",
    errorTypeId: "ET002",
  },
  {
    name: "Máy hư bàn phím",
    value: 18,
    color: "#52c41a",
    errorTypeId: "ET003",
  },
  { name: "Máy hư chuột", value: 22, color: "#722ed1", errorTypeId: "ET004" },
  {
    name: "Máy không kết nối mạng",
    value: 31,
    color: "#fa8c16",
    errorTypeId: "ET006",
  },
  {
    name: "Máy hư màn hình",
    value: 15,
    color: "#eb2f96",
    errorTypeId: "ET007",
  },
  { name: "Máy mất chuột", value: 12, color: "#13c2c2", errorTypeId: "ET008" },
  {
    name: "Máy mất bàn phím",
    value: 8,
    color: "#a0d911",
    errorTypeId: "ET009",
  },
  {
    name: "Máy không sử dụng được",
    value: 6,
    color: "#fadb14",
    errorTypeId: "ET005",
  },
  { name: "Lỗi khác", value: 21, color: "#8c8c8c", errorTypeId: "ET010" },
];

// Thống kê chi tiết theo loại lỗi
export const detailedErrorStats = [
  {
    key: "ET002",
    errorType: "Máy hư phần mềm",
    count: 35,
    percentage: 18.2,
    avgRepairTime: "1.5 ngày",
    difficulty: "Trung bình",
    commonCauses: ["Virus/Malware", "Lỗi hệ điều hành", "Ứng dụng lỗi"],
  },
  {
    key: "ET006",
    errorType: "Máy không kết nối mạng",
    count: 31,
    percentage: 16.1,
    avgRepairTime: "0.8 ngày",
    difficulty: "Dễ",
    commonCauses: ["Cáp mạng lỏng", "Cấu hình IP", "Driver card mạng"],
  },
  {
    key: "ET001",
    errorType: "Máy không khởi động",
    count: 28,
    percentage: 14.6,
    avgRepairTime: "2.3 ngày",
    difficulty: "Khó",
    commonCauses: ["Lỗi nguồn", "RAM hỏng", "Mainboard lỗi"],
  },
  {
    key: "ET004",
    errorType: "Máy hư chuột",
    count: 22,
    percentage: 11.5,
    avgRepairTime: "0.3 ngày",
    difficulty: "Rất dễ",
    commonCauses: ["Chuột hỏng", "USB lỏng", "Driver thiếu"],
  },
  {
    key: "ET010",
    errorType: "Lỗi khác",
    count: 21,
    percentage: 10.9,
    avgRepairTime: "2.1 ngày",
    difficulty: "Khác",
    commonCauses: ["Lỗi đa dạng", "Vấn đề phức tạp", "Cần chẩn đoán"],
  },
  {
    key: "ET003",
    errorType: "Máy hư bàn phím",
    count: 18,
    percentage: 9.4,
    avgRepairTime: "0.4 ngày",
    difficulty: "Rất dễ",
    commonCauses: ["Bàn phím hỏng", "USB lỏng", "Phím dính"],
  },
  {
    key: "ET007",
    errorType: "Máy hư màn hình",
    count: 15,
    percentage: 7.8,
    avgRepairTime: "1.8 ngày",
    difficulty: "Trung bình",
    commonCauses: ["Màn hình hỏng", "Cáp VGA/HDMI", "Card đồ họa"],
  },
  {
    key: "ET008",
    errorType: "Máy mất chuột",
    count: 12,
    percentage: 6.3,
    avgRepairTime: "0.2 ngày",
    difficulty: "Rất dễ",
    commonCauses: ["Mất trộm", "Lấy nhầm", "Hỏng và thải bỏ"],
  },
  {
    key: "ET009",
    errorType: "Máy mất bàn phím",
    count: 8,
    percentage: 4.2,
    avgRepairTime: "0.2 ngày",
    difficulty: "Rất dễ",
    commonCauses: ["Mất trộm", "Lấy nhầm", "Hỏng và thải bỏ"],
  },
  {
    key: "ET005",
    errorType: "Máy không sử dụng được",
    count: 6,
    percentage: 3.1,
    avgRepairTime: "4.5 ngày",
    difficulty: "Rất khó",
    commonCauses: [
      "Nhiều lỗi phức hợp",
      "Cần thay thế toàn bộ",
      "Lỗi nghiêm trọng",
    ],
  },
];

// Data cho biểu đồ đường - xu hướng theo tuần
export const weeklyTrendData = [
  { week: "T1", reports: 8, avgTime: 2.1 },
  { week: "T2", reports: 6, avgTime: 1.8 },
  { week: "T3", reports: 9, avgTime: 2.3 },
  { week: "T4", reports: 12, avgTime: 1.9 },
  { week: "T5", reports: 7, avgTime: 2.0 },
  { week: "T6", reports: 10, avgTime: 2.2 },
  { week: "T7", reports: 11, avgTime: 1.7 },
];

// Data cho bảng chi tiết theo tầng tòa H - Khoa CNTT
export const detailedTableData: DepartmentStats[] = [
  {
    key: "1",
    department: "Tầng 1 - Tòa H",
    totalReports: 32,
    completed: 30,
    pending: 2,
    avgTime: "1.8 ngày",
    efficiency: 93.8,
    status: "Tốt",
  },
  {
    key: "2",
    department: "Tầng 2 - Tòa H",
    totalReports: 28,
    completed: 26,
    pending: 2,
    avgTime: "2.1 ngày",
    efficiency: 92.9,
    status: "Tốt",
  },
  {
    key: "3",
    department: "Tầng 3 - Tòa H",
    totalReports: 35,
    completed: 33,
    pending: 2,
    avgTime: "1.9 ngày",
    efficiency: 94.3,
    status: "Tốt",
  },
  {
    key: "4",
    department: "Tầng 4 - Tòa H",
    totalReports: 24,
    completed: 22,
    pending: 2,
    avgTime: "2.3 ngày",
    efficiency: 91.7,
    status: "Tốt",
  },
  {
    key: "5",
    department: "Tầng 5 - Tòa H",
    totalReports: 30,
    completed: 28,
    pending: 2,
    avgTime: "2.0 ngày",
    efficiency: 93.3,
    status: "Tốt",
  },
  {
    key: "6",
    department: "Tầng 6 - Tòa H",
    totalReports: 26,
    completed: 25,
    pending: 1,
    avgTime: "1.7 ngày",
    efficiency: 96.2,
    status: "Xuất sắc",
  },
  {
    key: "7",
    department: "Tầng 7 - Tòa H",
    totalReports: 29,
    completed: 27,
    pending: 2,
    avgTime: "2.2 ngày",
    efficiency: 93.1,
    status: "Tốt",
  },
  {
    key: "8",
    department: "Tầng 8 - Tòa H",
    totalReports: 27,
    completed: 25,
    pending: 2,
    avgTime: "2.1 ngày",
    efficiency: 92.6,
    status: "Tốt",
  },
  {
    key: "9",
    department: "Tầng 9 - Tòa H",
    totalReports: 25,
    completed: 22,
    pending: 3,
    avgTime: "2.4 ngày",
    efficiency: 88.0,
    status: "Khá",
  },
];

// Data cho timeline hoạt động - Khoa CNTT
export const activityTimelineData = [
  {
    color: "green" as const,
    time: "09:15",
    description: "Hoàn thành sửa máy tính H301",
    timeAgo: "5 phút trước",
  },
  {
    color: "blue" as const,
    time: "08:45",
    description: "Báo cáo mới từ phòng H502 - Lỗi máy chiếu",
    timeAgo: "35 phút trước",
  },
  {
    color: "orange" as const,
    time: "08:30",
    description: "Kỹ thuật viên đến H701 kiểm tra mạng",
    timeAgo: "50 phút trước",
  },
  {
    color: "green" as const,
    time: "08:15",
    description: "Hoàn thành cài đặt phần mềm H102",
    timeAgo: "1 giờ trước",
  },
  {
    color: "red" as const,
    time: "07:45",
    description: "Báo cáo khẩn từ H801 - Mất điện",
    timeAgo: "1 giờ 30 phút trước",
  },
];

// Thống kê theo kỹ thuật viên quản lý Khoa CNTT
export const technicianPerformanceData = [
  {
    name: "Nguyễn Văn An - Tầng 1-3",
    completed: 28,
    pending: 2,
    efficiency: 93.3,
    avgTime: 1.9,
  },
  {
    name: "Trần Thị Bình - Tầng 4-6",
    completed: 25,
    pending: 1,
    efficiency: 96.2,
    avgTime: 2.0,
  },
  {
    name: "Lê Văn Cường - Tầng 7-9",
    completed: 24,
    pending: 3,
    efficiency: 88.9,
    avgTime: 2.2,
  },
];

// Thống kê theo thiết bị trong Khoa CNTT
export const equipmentStatsData = [
  { category: "Máy tính", total: 270, faulty: 12, percentage: 4.4 },
  { category: "Máy chiếu", total: 18, faulty: 2, percentage: 11.1 },
  { category: "Máy in", total: 27, faulty: 3, percentage: 11.1 },
  { category: "Điều hòa", total: 36, faulty: 1, percentage: 2.8 },
  { category: "Switch mạng", total: 18, faulty: 1, percentage: 5.6 },
];
