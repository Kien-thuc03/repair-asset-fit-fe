import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Users,
  FileCheck,
} from "lucide-react";

export interface StatItem {
  name: string;
  value: string;
  changeType: "positive" | "negative" | "warning" | "neutral";
  icon: typeof FileText;
  color: string;
}

export const lecturerStats: StatItem[] = [
  {
    name: "Báo cáo đã gửi",
    value: "12",
    changeType: "positive",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    name: "Đang xử lý",
    value: "3",
    changeType: "warning",
    icon: Clock,
    color: "bg-yellow-500",
  },
  {
    name: "Đã hoàn thành",
    value: "8",
    changeType: "positive",
    icon: CheckCircle,
    color: "bg-green-500",
  },
  {
    name: "Cần theo dõi",
    value: "1",
    changeType: "negative",
    icon: AlertTriangle,
    color: "bg-red-500",
  },
];

export const teamLeaderStats: StatItem[] = [
  {
    name: "Kỹ thuật viên",
    value: "5",
    changeType: "neutral",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Đề xuất chờ duyệt",
    value: "12",
    changeType: "warning",
    icon: FileCheck,
    color: "bg-orange-500",
  },
  {
    name: "Báo cáo đang xử lý",
    value: "8",
    changeType: "positive",
    icon: Clock,
    color: "bg-yellow-500",
  },
  {
    name: "Hoàn thành tháng này",
    value: "156",
    changeType: "positive",
    icon: CheckCircle,
    color: "bg-green-500",
  },
];
