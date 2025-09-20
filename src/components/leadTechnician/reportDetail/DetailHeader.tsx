import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "antd";
import { RepairRequest, RepairStatus } from "@/types";
import { repairRequestStatusConfig } from "@/lib/mockData";

interface DetailHeaderProps {
  request: RepairRequest;
  onGoBack: () => void;
}

export default function DetailHeader({ request, onGoBack }: DetailHeaderProps) {
  const getStatusBadge = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.color : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.label : status;
  };

  const getStatusIcon = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    const IconComponent = config ? config.icon : ArrowLeft;
    return <IconComponent className="h-5 w-5" />;
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
              href: "/to-truong-ky-thuat/danh-sach-bao-loi",
              title: (
                <div className="flex items-center">
                  <span>Danh sách báo lỗi</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết báo lỗi</span>
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
                Chi tiết báo lỗi {request.requestCode}
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết về báo cáo lỗi từ giảng viên
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(request.status)}
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                request.status
              )}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
