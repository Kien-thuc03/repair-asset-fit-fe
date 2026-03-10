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
    <div className="lg:hidden bg-white shadow rounded-lg">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-medium text-gray-900">
          Danh sách biên bản ({reports.length})
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              {/* Header with icon, number, and checkbox */}
              <div className="flex items-start gap-3 mb-3">
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {report.reportNumber}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {report.relatedReportTitle}
                  </p>
                </div>
                <button
                  onClick={() =>
                    onSelectItem(report.id, !selectedItems.includes(report.id))
                  }
                  className="flex-shrink-0">
                  {selectedItems.includes(report.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Info grid */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">
                      Người lập
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {report.createdBy}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">
                      Ngày kiểm tra
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(report.inspectionDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with status and actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    report.status
                  )}`}>
                  {getStatusIcon(report.status)}
                  <span className="ml-1">{getStatusText(report.status)}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetail(report)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    title="Xem chi tiết">
                    <Eye className="h-4 w-4" />
                    <span>Xem</span>
                  </button>
                  {/* Chỉ hiển thị nút "Ký" cho status pending (B10) */}
                  {report.status === "pending" && (
                    <button
                      onClick={() => onSignReport(report)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                      Ký
                    </button>
                  )}
                  {/* Status "signed" (B11) chỉ có nút xem chi tiết, không có nút gửi lại */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
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
