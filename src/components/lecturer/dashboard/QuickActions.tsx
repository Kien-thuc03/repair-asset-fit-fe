import React from "react";
import Link from "next/link";
import { AlertTriangle, Clock, FileText, FolderCode } from "lucide-react";

const QuickActions: React.FC = () => {
  const quickActions = [
    {
      href: "/giang-vien/bao-cao-loi",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      focusColor: "focus-within:ring-red-500",
      iconBg: "bg-red-600",
      icon: AlertTriangle,
      title: "Quản lý báo lỗi",
      description: "Tạo báo cáo lỗi cho thiết bị gặp sự cố",
    },
    {
      href: "/giang-vien/danh-sach-yeu-cau-sua-chua",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      focusColor: "focus-within:ring-blue-500",
      iconBg: "bg-blue-600",
      icon: Clock,
      title: "Quản lý yêu cầu sửa chữa",
      description: "Xem tiến độ xử lý các yêu cầu sửa chữa đã gửi",
    },
    {
      href: "/giang-vien/danh-sach-de-xuat-phan-mem",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      focusColor: "focus-within:ring-orange-500",
      iconBg: "bg-orange-600",
      icon: FileText,
      title: "Danh sách đề xuất phần mềm",
      description: "Xem và quản lý các đề xuất phần mềm đã gửi",
    },
    {
      href: "/giang-vien/de-xuat-phan-mem",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      focusColor: "focus-within:ring-green-500",
      iconBg: "bg-green-600",
      icon: FolderCode,
      title: "Đề xuất phần mềm",
      description: "Đề xuất phần mềm mới cho phòng máy",
    },

  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`relative group ${action.bgColor} p-6 focus-within:ring-2 focus-within:ring-inset ${action.focusColor} rounded-lg ${action.hoverColor} transition-colors block`}>
              <span
                className={`rounded-lg inline-flex p-3 ${action.iconBg} text-white`}>
                <action.icon className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
