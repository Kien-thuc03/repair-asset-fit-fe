import {
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  Building2,
  User,
  Calendar,
  Eye,
  Search,
} from "lucide-react";
import { RepairRequest, RepairStatus } from "@/types";
import { repairRequestStatusConfig } from "@/lib/mockData";

interface ReportTableProps {
  requests: RepairRequest[];
  selectedItems: string[];
  selectAll: boolean;
  sortField: string;
  sortDirection: "asc" | "desc" | "none";
  onSort: (field: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onViewDetails: (requestId: string) => void;
}

export default function ReportTable({
  requests,
  selectedItems,
  selectAll,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectItem,
  onViewDetails,
}: ReportTableProps) {
  // Hàm lấy icon sắp xếp với trạng thái rõ ràng hơn
  const getSortIcon = (field: string) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const getStatusBadge = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.color : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.label : status;
  };


  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách báo lỗi ({requests.length})
          </h2>
          {selectedItems.length > 0 && (
            <div className="text-xs sm:text-sm text-blue-600 font-medium">
              Đã chọn: {selectedItems.length} mục
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="h-10 sm:h-12">
                <th className="w-10 px-1 py-2 sm:py-3 text-left">
                  <button
                    onClick={() => onSelectAll(!selectAll)}
                    className="text-gray-400 hover:text-gray-600">
                    {selectAll ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th
                  className="w-28 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("requestCode")}>
                  <div className="flex items-center">
                    <span className="truncate">Mã báo lỗi</span>
                    {getSortIcon("requestCode")}
                  </div>
                </th>
                <th
                  className="w-48 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("ktCode")}>
                  <div className="flex items-center">
                    <span className="truncate">Tài sản</span>
                    {getSortIcon("ktCode")}
                  </div>
                </th>
                <th
                  className="w-32 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("reporterName")}>
                  <div className="flex items-center">
                    <span className="truncate">Người báo</span>
                    {getSortIcon("reporterName")}
                  </div>
                </th>
                <th
                  className="w-24 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("errorTypeName")}>
                  <div className="flex items-center">
                    <span className="truncate">Loại lỗi</span>
                    {getSortIcon("errorTypeName")}
                  </div>
                </th>
                <th
                  className="w-28 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("status")}>
                  <div className="flex items-center">
                    <span className="truncate">Trạng thái</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="w-24 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("createdAt")}>
                  <div className="flex items-center">
                    <span className="truncate">Ngày báo</span>
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="w-16 px-1 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 h-14">
                    <td className="px-1 py-2">
                      <button
                        onClick={() =>
                          onSelectItem(
                            request.id,
                            !selectedItems.includes(request.id)
                          )
                        }
                        className="text-gray-400 hover:text-gray-600">
                        {selectedItems.includes(request.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-1 py-2">
                      <div
                        className="text-xs font-medium text-gray-900 truncate"
                        title={request.requestCode}>
                        {request.requestCode}
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <div>
                        <div
                          className="text-xs font-medium text-gray-900 truncate"
                          title={request.ktCode}>
                          {request.ktCode}
                        </div>
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={request.assetName}>
                          {request.assetName}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span
                            className="truncate"
                            title={`${request.roomName} - ${request.buildingName}`}>
                            {request.roomName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <div
                            className="text-xs font-medium text-gray-900 truncate"
                            title={request.reporterName}>
                            {request.reporterName}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={request.reporterRole}>
                            {request.reporterRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <span
                        className="text-xs text-gray-900 truncate block"
                        title={request.errorTypeName || "Chưa xác định"}>
                        {request.errorTypeName || "Chưa xác định"}
                      </span>
                    </td>
                    <td className="px-1 py-2">
                      <div className="flex items-center">
                        <span
                          className={`ml-1 inline-flex px-1 py-1 text-xs font-semibold rounded-full truncate ${getStatusBadge(
                            request.status
                          )}`}
                          title={getStatusText(request.status)}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-1 py-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <span
                          className="text-xs text-gray-900 truncate"
                          title={new Date(request.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}>
                          {new Date(request.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-1 py-2 text-center">
                      <button
                        onClick={() => onViewDetails(request.id)}
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Xem chi tiết">
                        <Eye className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Không tìm thấy kết quả
                      </h3>
                      <p className="text-sm text-gray-500">
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                      </p>
                    </div>
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
