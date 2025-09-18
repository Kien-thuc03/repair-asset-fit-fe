"use client";

import { Eye } from "lucide-react";
import { RepairRequest } from "@/types";
import { repairRequestStatusConfig } from "@/lib/mockData";
import SortableHeader from "@/components/common/SortableHeader";

interface RequestTableProps {
  requests: RepairRequest[];
  selectedItems: string[];
  selectAll: boolean;
  sortField: keyof RepairRequest | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (field: keyof RepairRequest) => void;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onViewDetails: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function RequestTable({
  requests,
  selectedItems,
  selectAll,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectItem,
  onViewDetails,
  formatDate,
}: RequestTableProps) {
  return (
    <div className="hidden lg:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </th>
            <SortableHeader
              field="requestCode"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Mã yêu cầu
            </SortableHeader>
            <SortableHeader
              field="assetName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Tài sản
            </SortableHeader>
            <SortableHeader
              field="roomName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Phòng
            </SortableHeader>
            <SortableHeader
              field="errorTypeName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Loại lỗi
            </SortableHeader>
            <SortableHeader
              field="status"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Trạng thái
            </SortableHeader>
            <SortableHeader
              field="assignedTechnicianName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Người xử lý
            </SortableHeader>
            <SortableHeader
              field="createdAt"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Ngày tạo
            </SortableHeader>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => {
            const StatusIcon = repairRequestStatusConfig[request.status].icon;
            return (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(request.id)}
                    onChange={() => onSelectItem(request.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  <div
                    className="max-w-[120px] truncate"
                    title={request.requestCode}>
                    {request.requestCode}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[160px]">
                    <div
                      className="text-sm font-medium text-gray-900 truncate"
                      title={request.assetName}>
                      {request.assetName}
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      title={request.assetCode}>
                      {request.assetCode}
                    </div>
                    {request.componentName && (
                      <div
                        className="text-xs text-blue-600 truncate"
                        title={request.componentName}>
                        Linh kiện: {request.componentName}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div
                    className="max-w-[100px] truncate"
                    title={request.roomName}>
                    {request.roomName}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div
                    className="max-w-[120px] truncate"
                    title={request.errorTypeName || "Chưa phân loại"}>
                    {request.errorTypeName || "Chưa phân loại"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                      repairRequestStatusConfig[request.status].color
                    }`}>
                    <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    {repairRequestStatusConfig[request.status].label}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div
                    className="max-w-[120px] truncate"
                    title={request.assignedTechnicianName || "Chưa phân công"}>
                    {request.assignedTechnicianName || "Chưa phân công"}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div
                    className="max-w-[120px] truncate"
                    title={formatDate(request.createdAt)}>
                    {formatDate(request.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(request.id)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
