import type { DepartmentStats } from "@/types/stats";

// Mock data cho thống kê tổng quan
export const statsData = [
  {
    title: "Tổng số báo lỗi",
    value: 1234,
    suffix: "yêu cầu",
    valueStyle: { color: "#3f8600" },
    precision: 0,
    iconType: "FileText" as const,
  },
  {
    title: "Đang xử lý",
    value: 89,
    suffix: "yêu cầu",
    valueStyle: { color: "#cf1322" },
    precision: 0,
    iconType: "Clock" as const,
  },
  {
    title: "Hoàn thành",
    value: 1098,
    suffix: "yêu cầu",
    valueStyle: { color: "#389e0d" },
    precision: 0,
    iconType: "CheckCircle" as const,
  },
  {
    title: "Tỷ lệ hoàn thành",
    value: 88.98,
    suffix: "%",
    valueStyle: { color: "#3f8600" },
    precision: 2,
    iconType: "TrendingUp" as const,
  },
];

// Data cho biểu đồ cột - thống kê theo tháng
export const monthlyData = [
  { month: "T1", reports: 65, completed: 58, pending: 7 },
  { month: "T2", reports: 78, completed: 71, pending: 7 },
  { month: "T3", reports: 90, completed: 82, pending: 8 },
  { month: "T4", reports: 81, completed: 75, pending: 6 },
  { month: "T5", reports: 95, completed: 87, pending: 8 },
  { month: "T6", reports: 102, completed: 94, pending: 8 },
  { month: "T7", reports: 87, completed: 79, pending: 8 },
  { month: "T8", reports: 119, completed: 108, pending: 11 },
  { month: "T9", reports: 134, completed: 121, pending: 13 },
  { month: "T10", reports: 125, completed: 115, pending: 10 },
  { month: "T11", reports: 98, completed: 89, pending: 9 },
  { month: "T12", reports: 88, completed: 80, pending: 8 },
];

// Data cho biểu đồ tròn - phân loại theo loại lỗi
export const errorTypeStatsData = [
  { name: "Phần cứng", value: 45, color: "#8884d8" },
  { name: "Phần mềm", value: 25, color: "#82ca9d" },
  { name: "Mạng", value: 15, color: "#ffc658" },
  { name: "Bảo trì", value: 10, color: "#ff7300" },
  { name: "Khác", value: 5, color: "#e74c3c" },
];

// Data cho biểu đồ đường - xu hướng theo tuần
export const weeklyTrendData = [
  { week: "T1", reports: 12, avgTime: 4.2 },
  { week: "T2", reports: 15, avgTime: 3.8 },
  { week: "T3", reports: 18, avgTime: 4.5 },
  { week: "T4", reports: 22, avgTime: 3.2 },
  { week: "T5", reports: 19, avgTime: 3.9 },
  { week: "T6", reports: 25, avgTime: 4.1 },
  { week: "T7", reports: 28, avgTime: 3.6 },
];

// Data cho bảng chi tiết theo khoa/phòng ban
export const detailedTableData: DepartmentStats[] = [
  {
    key: "1",
    department: "Khoa CNTT",
    totalReports: 234,
    completed: 210,
    pending: 24,
    avgTime: "3.2 ngày",
    efficiency: 89.7,
    status: "Tốt",
  },
  {
    key: "2",
    department: "Khoa Cơ khí",
    totalReports: 189,
    completed: 165,
    pending: 24,
    avgTime: "4.1 ngày",
    efficiency: 87.3,
    status: "Tốt",
  },
  {
    key: "3",
    department: "Khoa Điện",
    totalReports: 156,
    completed: 135,
    pending: 21,
    avgTime: "3.8 ngày",
    efficiency: 86.5,
    status: "Tốt",
  },
  {
    key: "4",
    department: "Khoa Kinh tế",
    totalReports: 98,
    completed: 82,
    pending: 16,
    avgTime: "5.2 ngày",
    efficiency: 83.7,
    status: "Trung bình",
  },
  {
    key: "5",
    department: "Khoa Hóa học",
    totalReports: 145,
    completed: 128,
    pending: 17,
    avgTime: "3.9 ngày",
    efficiency: 88.3,
    status: "Tốt",
  },
  {
    key: "6",
    department: "Khoa Vật lý",
    totalReports: 67,
    completed: 58,
    pending: 9,
    avgTime: "4.5 ngày",
    efficiency: 86.6,
    status: "Tốt",
  },
];

// Data cho timeline hoạt động
export const activityTimelineData = [
  {
    color: "green" as const,
    time: "09:00",
    description: "Báo cáo mới từ Khoa CNTT",
    timeAgo: "2 phút trước",
  },
  {
    color: "blue" as const,
    time: "08:45",
    description: "Hoàn thành sửa chữa máy chiếu P.301",
    timeAgo: "17 phút trước",
  },
  {
    color: "red" as const,
    time: "08:30",
    description: "Báo cáo khẩn từ Khoa Cơ khí",
    timeAgo: "32 phút trước",
  },
  {
    color: "default" as const,
    time: "08:00",
    description: "Bắt đầu ca làm việc",
    timeAgo: "1 giờ trước",
  },
  {
    color: "orange" as const,
    time: "07:45",
    description: "Hoàn tất báo cáo tuần",
    timeAgo: "1 giờ 15 phút trước",
  },
];

// Thống kê theo kỹ thuật viên
export const technicianPerformanceData = [
  {
    name: "Nguyễn Văn A",
    completed: 45,
    pending: 3,
    efficiency: 93.8,
    avgTime: 2.5,
  },
  {
    name: "Trần Thị B",
    completed: 38,
    pending: 4,
    efficiency: 90.5,
    avgTime: 3.1,
  },
  {
    name: "Lê Văn C",
    completed: 42,
    pending: 5,
    efficiency: 89.4,
    avgTime: 3.3,
  },
  {
    name: "Phạm Thị D",
    completed: 35,
    pending: 2,
    efficiency: 94.6,
    avgTime: 2.8,
  },
];

// Thống kê theo thiết bị
export const equipmentStatsData = [
  { category: "Máy tính", total: 450, faulty: 23, percentage: 5.1 },
  { category: "Máy chiếu", total: 85, faulty: 8, percentage: 9.4 },
  { category: "Máy in", total: 120, faulty: 15, percentage: 12.5 },
  { category: "Điều hòa", total: 200, faulty: 12, percentage: 6.0 },
  { category: "Khác", total: 180, faulty: 9, percentage: 5.0 },
];
