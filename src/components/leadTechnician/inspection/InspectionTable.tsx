import {
  FileText,
  User,
  Signature,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckSquare,
  Square,
  Search,
  Send,
} from "lucide-react";

interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  createdBy: string;
  inspectionDate: string;
  status: "pending" | "signed" | "sent_back";
}

interface InspectionTableProps {
  reports: InspectionReport[];
  selectedItems: string[];
  selectAll: boolean;
  sortField: string;
  sortDirection: "asc" | "desc" | "none";
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onSort: (field: string) => void;
  onViewDetail: (report: InspectionReport) => void;
  onSignReport: (report: InspectionReport) => void;
  onSendBack: (reportId: string) => void;
}

export default function InspectionTable({
  reports,
  selectedItems,
  selectAll,
  sortField,
  sortDirection,
  onSelectAll,
  onSelectItem,
  onSort,
  onViewDetail,
  onSignReport,
  onSendBack,
}: InspectionTableProps) {
  const getSortIcon = (field: string) => {
    return (
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`h-3 w-3 ${
            sortField === field && sortDirection === "asc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortField === field && sortDirection === "desc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg lg:block hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách biên bản ({reports.length})
          </h2>
        </div>
      </div>

      <div className="flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-auto">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="w-[5%] px-3 py-3 text-center">
                  <button
                    onClick={() => onSelectAll(!selectAll)}
                    className="flex items-center justify-center">
                    {selectAll ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="w-[28%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                    onClick={() => onSort("reportNumber")}>
                    <span>Số biên bản</span>
                    {getSortIcon("reportNumber")}
                  </button>
                </th>
                <th className="w-[32%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                    onClick={() => onSort("relatedReportTitle")}>
                    <span>Tờ trình liên quan</span>
                    {getSortIcon("relatedReportTitle")}
                  </button>
                </th>
                <th className="w-[15%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                    onClick={() => onSort("createdBy")}>
                    <span>Người lập</span>
                    {getSortIcon("createdBy")}
                  </button>
                </th>
                <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase"
                    onClick={() => onSort("inspectionDate")}>
                    <span>Ngày lập</span>
                    {getSortIcon("inspectionDate")}
                  </button>
                </th>
                <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() =>
                          onSelectItem(
                            report.id,
                            !selectedItems.includes(report.id)
                          )
                        }>
                        {selectedItems.includes(report.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {report.reportNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-sm text-gray-900 truncate">
                        {report.relatedReportTitle.length > 50
                          ? `${report.relatedReportTitle.substring(0, 50)}...`
                          : report.relatedReportTitle}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 truncate">
                          {report.createdBy.length > 12
                            ? `${report.createdBy.substring(0, 12)}...`
                            : report.createdBy}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(report.inspectionDate).toLocaleDateString(
                          "vi-VN",
                          { day: "2-digit", month: "2-digit", year: "numeric" }
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onViewDetail(report)}
                          className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Xem chi tiết">
                          <Eye className="h-4 w-4" />
                        </button>
                        {report.status === "pending" && (
                          <button
                            onClick={() => onSignReport(report)}
                            className="inline-flex items-center px-2 py-1 border border-green-300 rounded text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                            title="Ký xác nhận">
                            <Signature className="h-3 w-3" />
                            <span className="ml-1 hidden xl:inline">Ký</span>
                          </button>
                        )}
                        {report.status === "signed" && (
                          <button
                            onClick={() => onSendBack(report.id)}
                            className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                            title="Gửi lại">
                            <Send className="h-3 w-3" />
                            <span className="ml-1 hidden xl:inline">Gửi</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-xs text-gray-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
