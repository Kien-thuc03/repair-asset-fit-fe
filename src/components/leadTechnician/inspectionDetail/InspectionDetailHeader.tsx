import { ArrowLeft, CheckCircle, Clock, Send } from "lucide-react";
import { Breadcrumb } from "antd";
import React from "react";

interface InspectionDetailHeaderProps {
  reportNumber: string;
  status: string;
  onGoBack: () => void;
}

export default function InspectionDetailHeader({
  reportNumber,
  status,
  onGoBack,
}: InspectionDetailHeaderProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "sent_back":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ ký";
      case "signed":
        return "Đã ký";
      case "sent_back":
        return "Đã gửi lại";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "signed":
        return <CheckCircle className="h-5 w-5" />;
      case "sent_back":
        return <Send className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/to-truong-ky-thuat/bien-ban",
              title: (
                <div className="flex items-center">
                  <span>Xác nhận biên bản</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết biên bản</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onGoBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết biên bản {reportNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết về biên bản kiểm tra
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                status
              )}`}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
