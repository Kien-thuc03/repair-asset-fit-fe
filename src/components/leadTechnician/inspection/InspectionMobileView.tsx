import React from "react";
import { FileText, Eye, CheckSquare, Square, Search } from "lucide-react";

interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  createdBy: string;
  inspectionDate: string;
  status: "pending" | "signed" | "sent_back";
}

interface InspectionMobileViewProps {
  reports: InspectionReport[];
  selectedItems: string[];
  onSelectItem: (itemId: string, checked: boolean) => void;
  onViewDetail: (report: InspectionReport) => void;
  onSignReport: (report: InspectionReport) => void;
  onSendBack: (reportId: string) => void;
  getStatusBadge: (status: string) => string;
  getStatusText: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function InspectionMobileView({
  reports,
  selectedItems,
  onSelectItem,
  onViewDetail,
  onSignReport,
  onSendBack,
  getStatusBadge,
  getStatusText,
  getStatusIcon,
}: InspectionMobileViewProps) {
  return (
    <div className="block sm:hidden">
      <div className="p-3 space-y-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      onSelectItem(
                        report.id,
                        !selectedItems.includes(report.id)
                      )
                    }
                    className="mr-2 flex-shrink-0">
                    {selectedItems.includes(report.id) ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {report.reportNumber}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Tờ trình: {report.relatedReportTitle}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    report.status
                  )}`}>
                  {getStatusIcon(report.status)}
                  <span className="ml-1">{getStatusText(report.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <div className="text-gray-500">Người lập</div>
                  <div className="text-gray-900 font-medium">
                    {report.createdBy}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Ngày kiểm tra</div>
                  <div className="text-gray-900">
                    {new Date(report.inspectionDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => onViewDetail(report)}
                  className="text-indigo-600 hover:text-indigo-900 p-1"
                  title="Xem chi tiết">
                  <Eye className="h-4 w-4" />
                </button>
                {report.status === "pending" && (
                  <button
                    onClick={() => onSignReport(report)}
                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200">
                    Ký xác nhận
                  </button>
                )}
                {report.status === "signed" && (
                  <button
                    onClick={() => onSendBack(report.id)}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200">
                    Gửi lại
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-xs text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
