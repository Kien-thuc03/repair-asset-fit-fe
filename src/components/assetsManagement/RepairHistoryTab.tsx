"use client";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  User,
  Settings,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { RepairHistoryItem } from "@/types";

interface TechnicianRepairHistoryTabProps {
  repairHistory: RepairHistoryItem[];
  formatDate: (dateString: string) => string;
}

export default function TechnicianRepairHistoryTab({
  repairHistory,
  formatDate,
}: TechnicianRepairHistoryTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ tiếp nhận":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Đã tiếp nhận":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Đang xử lý":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Chờ thay thế":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800 border-green-200";
      case "Đã hủy":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStepStatusColor = (toStatus: string) => {
    switch (toStatus) {
      case "CHỜ_TIẾP_NHẬN":
        return "bg-orange-100 text-orange-800";
      case "ĐÃ_TIẾP_NHẬN":
        return "bg-yellow-100 text-yellow-800";
      case "ĐANG_XỬ_LÝ":
        return "bg-blue-100 text-blue-800";
      case "CHỜ_THAY_THẾ":
        return "bg-purple-100 text-purple-800";
      case "ĐÃ_HOÀN_THÀNH":
        return "bg-green-100 text-green-800";
      case "ĐÃ_HỦY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Tạo yêu cầu":
        return <AlertCircle className="w-4 h-4" />;
      case "Tiếp nhận xử lý":
        return <User className="w-4 h-4" />;
      case "Bắt đầu xử lý":
        return <Settings className="w-4 h-4" />;
      case "Chờ thay thế":
        return <Clock className="w-4 h-4" />;
      case "Hoàn tất":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
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
                      {repair.status}
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
                        Mô tả sự cố ban đầu:
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
                        <span>Người báo: <strong>{repair.reporterName}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>KTV xử lý: <strong>{repair.technicianName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Process Steps */}
                  <div>
                    <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-blue-500" />
                      Các bước xử lý:
                    </h6>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {repair.steps.map((step, stepIndex) => (
                        <div
                          key={step.id}
                          className="relative flex items-start space-x-3 pb-3">
                          {/* Timeline line */}
                          {stepIndex < repair.steps.length - 1 && (
                            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                          )}
                          
                          {/* Step icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getStepStatusColor(step.toStatus)}`}>
                            {getActionIcon(step.action)}
                          </div>
                          
                          {/* Step content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {step.action}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(step.createdAt)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Bởi: <span className="font-medium">{step.actorName}</span>
                            </p>
                            {step.comment && (
                              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                {step.comment}
                              </p>
                            )}
                            {step.fromStatus && (
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="inline-flex items-center">
                                  <span className={`px-2 py-0.5 rounded text-xs ${getStepStatusColor(step.fromStatus)}`}>
                                    {step.fromStatus.replace(/_/g, ' ')}
                                  </span>
                                  <ArrowRight className="w-3 h-3 mx-1" />
                                  <span className={`px-2 py-0.5 rounded text-xs ${getStepStatusColor(step.toStatus)}`}>
                                    {step.toStatus.replace(/_/g, ' ')}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}