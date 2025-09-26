"use client";
import {
  Wrench,
  AlertTriangle,
  Calendar,
  CheckCircle,
  User,
  Settings,
  AlertCircle,
} from "lucide-react";

interface RepairHistory {
  id: string;
  requestCode: string;
  status: string;
  errorType: string;
  description: string;
  solution?: string;
  reportDate: string;
  completedDate?: string;
  technicianName: string;
  componentChanges?: Array<{
    componentType: string;
    oldComponent?: string;
    newComponent: string;
    changeReason: string;
  }>;
}

interface TechnicianRepairHistoryTabProps {
  repairHistory: RepairHistory[];
  formatDate: (dateString: string) => string;
}

export default function TechnicianRepairHistoryTab({
  repairHistory,
  formatDate,
}: TechnicianRepairHistoryTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ĐÃ_HOÀN_THÀNH":
        return "bg-green-100 text-green-800 border-green-200";
      case "ĐANG_XỬ_LÝ":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CHỜ_THAY_THẾ":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ĐÃ_HOÀN_THÀNH":
        return "Hoàn thành";
      case "ĐANG_XỬ_LÝ":
        return "Đang xử lý";
      case "CHỜ_THAY_THẾ":
        return "Chờ thay thế";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-medium text-gray-900">
            Lịch sử bảo trì và sửa chữa
          </h4>
        </div>
        <div className="text-sm text-gray-500">
          Tổng: {repairHistory.length} lần bảo trì
        </div>
      </div>

      {repairHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có lịch sử bảo trì
          </h3>
          <p className="text-gray-500">
            Thiết bị này chưa từng được báo cáo lỗi hoặc bảo trì.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {repairHistory.map((repair, index) => (
            <div
              key={repair.id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
              
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {repairHistory.length - index}
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg text-gray-900">
                        {repair.requestCode}
                      </h5>
                      <p className="text-sm text-gray-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {repair.errorType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(repair.status)}`}>
                      {getStatusLabel(repair.status)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(repair.reportDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Mô tả sự cố:
                      </h6>
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {repair.description}
                        </p>
                      </div>
                    </div>

                    {repair.solution && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Giải pháp xử lý:
                        </h6>
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {repair.solution}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Kỹ thuật viên: <strong>{repair.technicianName}</strong></span>
                      </div>
                      {repair.completedDate && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Hoàn thành: {formatDate(repair.completedDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Component Changes */}
                  {repair.componentChanges && repair.componentChanges.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Wrench className="w-4 h-4 mr-2 text-blue-500" />
                        Thay thế linh kiện:
                      </h6>
                      <div className="space-y-3">
                        {repair.componentChanges.map((change, changeIndex) => (
                          <div
                            key={changeIndex}
                            className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="font-medium text-sm text-blue-900 mb-2 flex items-center">
                              <Settings className="w-4 h-4 mr-1" />
                              {change.componentType}
                            </div>
                            {change.oldComponent && (
                              <div className="text-xs text-red-700 mb-1">
                                <span className="font-medium">Linh kiện cũ:</span>{" "}
                                {change.oldComponent}
                              </div>
                            )}
                            <div className="text-xs text-green-700 mb-1">
                              <span className="font-medium">Linh kiện mới:</span>{" "}
                              {change.newComponent}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Lý do thay thế:</span>{" "}
                              {change.changeReason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}