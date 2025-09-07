import { AlertTriangle, Clock, CheckCircle, FileText } from "lucide-react";

export interface StatItem {
  name: string;
  value: string;
  changeType: "positive" | "negative" | "warning";
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
