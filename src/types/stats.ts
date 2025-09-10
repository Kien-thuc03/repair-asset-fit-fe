export interface DepartmentStats {
  key: string;
  department: string;
  totalReports: number;
  completed: number;
  pending: number;
  avgTime: string;
  efficiency: number;
  status: "Xuất sắc" | "Tốt" | "Khá" | "Trung bình" | "Kém";
}

export interface MonthlyData {
  month: string;
  reports: number;
  completed: number;
  pending: number;
}

export interface ErrorTypeData {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyTrendData {
  week: string;
  reports: number;
  avgTime: number;
}

export interface StatData {
  title: string;
  value: number;
  suffix: string;
  valueStyle: { color: string };
  precision: number;
  iconType: "FileText" | "Clock" | "CheckCircle" | "TrendingUp";
}

export interface ActivityTimelineData {
  color: "green" | "blue" | "red" | "default" | "orange";
  time: string;
  description: string;
  timeAgo: string;
}

export interface TechnicianPerformanceData {
  name: string;
  completed: number;
  pending: number;
  efficiency: number;
  avgTime: number;
}

export interface EquipmentStatsData {
  category: string;
  total: number;
  faulty: number;
  percentage: number;
}
