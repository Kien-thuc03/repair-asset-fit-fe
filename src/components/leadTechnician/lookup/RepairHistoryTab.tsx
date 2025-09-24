"use client";
import {
  Wrench,
  AlertTriangle,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react";

interface RepairHistory {
  id: string;
  requestCode: string;
  status: string;
  errorType: string;
  description: string;
  solution?: string; // Made optional to match RepairHistoryItem
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

interface RepairHistoryTabProps {
  repairHistory: RepairHistory[];
  formatDate: (dateString: string) => string;
}

export default function RepairHistoryTab({
  repairHistory,
  formatDate,
}: RepairHistoryTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Wrench className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-medium text-gray-900">
          Lịch sử sửa chữa và thay thế linh kiện
        </h4>
      </div>

      {repairHistory.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có lịch sử sửa chữa
          </h3>
          <p className="text-gray-500">
            Thiết bị này chưa từng được báo cáo lỗi hoặc sửa chữa.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {repairHistory.map((repair) => (
            <div
              key={repair.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg text-gray-900">
                      {repair.requestCode}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        repair.status === "ĐÃ_HOÀN_THÀNH"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                      {repair.status === "ĐÃ_HOÀN_THÀNH"
                        ? "Hoàn thành"
                        : "Đang xử lý"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 font-medium">
                    {repair.errorType}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(repair.reportDate)}</span>
                  </div>
                  {repair.completedDate && (
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{formatDate(repair.completedDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-medium text-gray-900 mb-3">Mô tả lỗi:</h6>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {repair.description}
                    </p>
                  </div>

                  {repair.solution && (
                    <>
                      <h6 className="font-medium text-gray-900 mb-3 mt-4">
                        Giải pháp:
                      </h6>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {repair.solution}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>
                      Kỹ thuật viên: <strong>{repair.technicianName}</strong>
                    </span>
                  </div>
                </div>

                {/* Component Changes */}
                {repair.componentChanges &&
                  repair.componentChanges.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">
                        Thay thế linh kiện:
                      </h6>
                      <div className="space-y-3">
                        {repair.componentChanges.map((change, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="font-medium text-sm text-blue-900 mb-2">
                              {change.componentType}
                            </div>
                            {change.oldComponent && (
                              <div className="text-xs text-red-700 mb-1">
                                <span className="font-medium">Cũ:</span>{" "}
                                {change.oldComponent}
                              </div>
                            )}
                            <div className="text-xs text-green-700 mb-1">
                              <span className="font-medium">Mới:</span>{" "}
                              {change.newComponent}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Lý do:</span>{" "}
                              {change.changeReason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
