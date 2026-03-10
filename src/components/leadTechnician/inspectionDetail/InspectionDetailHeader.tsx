
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
