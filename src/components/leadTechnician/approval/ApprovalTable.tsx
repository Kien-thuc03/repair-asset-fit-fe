import {
  Eye,
  CheckCircle,
  XCircle,
  Package,
  User,
  Building2,
  Calendar,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReplacementRequestForList, ReplacementStatus } from "@/types";
import StatusBadge, { getComponentInfo, getUserRole } from "./ApprovalHelpers";

interface ApprovalTableProps {
  filteredRequests: ReplacementRequestForList[];
  selectedItems: string[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSelectItem: (itemId: string) => void;
  onSelectAll: () => void;
  onSort: (field: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export default function ApprovalTable({
  filteredRequests,
  selectedItems,
  sortField,
  sortDirection,
  onSelectItem,
  onSelectAll,
  onSort,
  onApprove,
  onReject,
}: ApprovalTableProps) {
  const router = useRouter();

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      // Hiển thị icon active cho cột đang được sắp xếp
      if (sortDirection === "asc") {
        return (
          <div className="flex flex-col ml-1">
            <ChevronUp className="h-3 w-3 text-blue-600" />
            <ChevronDown className="h-3 w-3 text-gray-300 -mt-1" />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col ml-1">
            <ChevronUp className="h-3 w-3 text-gray-300" />
            <ChevronDown className="h-3 w-3 text-blue-600 -mt-1" />
          </div>
        );
      }
    } else {
      // Hiển thị icon mặc định cho các cột khác
      return (
        <div className="flex flex-col ml-1 opacity-50 hover:opacity-100 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
        </div>
      );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách đề xuất ({filteredRequests.length})
          </h2>
          {selectedItems.length > 0 && (
            <div className="text-xs sm:text-sm text-blue-600 font-medium">
              Đã chọn: {selectedItems.length} mục
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* Desktop Table View */}
        <div className="hidden sm:block flex-1 overflow-y-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-5">
              <tr className="h-10 sm:h-12">
                <th className="w-12 px-2 py-2 sm:py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={
                      filteredRequests.length > 0 &&
                      selectedItems.length === filteredRequests.length
                    }
                    onChange={onSelectAll}
                  />
                </th>
                <th
                  className="w-64 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("componentName")}>
                  <div className="flex items-center">
                    <span className="truncate">Linh kiện</span>
                    {getSortIcon("componentName")}
                  </div>
                </th>
                <th
                  className="w-40 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("requestedBy")}>
                  <div className="flex items-center">
                    <span className="truncate">Người yêu cầu</span>
                    {getSortIcon("requestedBy")}
                  </div>
                </th>
                <th
                  className="w-48 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("location")}>
                  <div className="flex items-center">
                    <span className="truncate">Vị trí</span>
                    {getSortIcon("location")}
                  </div>
                </th>
                <th
                  className="w-36 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("status")}>
                  <div className="flex items-center">
                    <span className="truncate">Trạng thái</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="w-32 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort("requestDate")}>
                  <div className="flex items-center">
                    <span className="truncate">Ngày yêu cầu</span>
                    {getSortIcon("requestDate")}
                  </div>
                </th>
                <th className="w-24 px-2 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 h-12 sm:h-14">
                    <td className="w-12 px-2 py-1 sm:py-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded"
                        checked={selectedItems.includes(request.id)}
                        onChange={() => onSelectItem(request.id)}
                      />
                    </td>
                    <td className="w-64 px-2 py-1 sm:py-2">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {getComponentInfo().componentName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {getComponentInfo().componentSpecs}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="w-40 px-2 py-1 sm:py-2">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {request.requestedBy}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {getUserRole()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="w-48 px-2 py-1 sm:py-2">
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">
                          {request.location}
                        </span>
                      </div>
                    </td>
                    <td className="w-36 px-2 py-1 sm:py-2 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="w-32 px-2 py-1 sm:py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <span className="text-sm text-gray-900">
                          {new Date(request.requestDate).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="w-24 px-2 py-1 sm:py-2 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            router.push(
                              `/to-truong-ky-thuat/duyet-de-xuat/chi-tiet/${request.id}`
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Xem chi tiết">
                          <Eye className="h-3 w-3" />
                        </button>
                        {(request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
                          request.status ===
                            ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT) && (
                          <>
                            <button
                              onClick={() => onApprove(request.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Phê duyệt">
                              <CheckCircle className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => onReject(request.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Từ chối">
                              <XCircle className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-16 sm:h-20">
                  <td colSpan={7} className="h-16 sm:h-20">
                    <div className="h-16 sm:h-20 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <Search className="h-6 w-6 text-gray-300 mb-2" />
                        <h3 className="text-xs font-medium text-gray-900 mb-1">
                          Không tìm thấy kết quả
                        </h3>
                        <p className="text-xs text-gray-500">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </p>
                      </div>
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
