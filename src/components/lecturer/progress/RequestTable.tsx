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
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr className="whitespace-nowrap">
            <th className="px-2 py-3 text-left whitespace-nowrap w-12">
              {/* Cột checkbox - 48px */}
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
              onSort={onSort}
              className="w-30">
              {/* 112px */}
              Mã yêu cầu
            </SortableHeader>
            <SortableHeader
              field="assetName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-40">
              {/* 160px */}
              Tài sản
            </SortableHeader>
            <SortableHeader
              field="roomName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-24">
              {/* 96px */}
              Phòng
            </SortableHeader>
            <SortableHeader
              field="errorTypeName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-28">
              {/* 112px */}
              Loại lỗi
            </SortableHeader>
            <SortableHeader
              field="status"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-32">
              {/* 128px */}
              Trạng thái
            </SortableHeader>
            <SortableHeader
              field="assignedTechnicianName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-28">
              {/* 112px */}
              Người xử lý
            </SortableHeader>
            <SortableHeader
              field="createdAt"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              className="w-24">
              {/* 96px */}
              Ngày tạo
            </SortableHeader>
            <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">
              {/* 80px */}
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => {
           
            return (
              <tr key={request.id} className="hover:bg-gray-50 h-16">
                <td className="px-2 py-4 align-middle">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(request.id)}
                    onChange={() => onSelectItem(request.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-2 py-4 text-sm font-medium text-blue-600 align-middle">
                  <div
                    className="max-w-[150px] truncate"
                    title={request.requestCode}>
                    {request.requestCode}
                  </div>
                </td>
                <td className="px-2 py-4 align-middle">
                  <div className="max-w-[150px]">
                    <div
                      className="text-sm font-medium text-gray-900 truncate"
                      title={`${request.assetName} (${request.ktCode})${
                        request.componentName
                          ? ` - ${request.componentName}`
                          : ""
                      }`}>
                      {request.assetName}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500 align-middle">
                  <div
                    className="max-w-[80px] "
                    title={request.roomName}>
                    {request.roomName}
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500 align-middle">
                  <div
                    className="max-w-[100px] "
                    title={request.errorTypeName || "Chưa phân loại"}>
                    {request.errorTypeName || "Chưa phân loại"}
                  </div>
                </td>
                <td className="px-2 py-4 align-middle">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                      repairRequestStatusConfig[request.status].color
                    }`}>
                  
                    {repairRequestStatusConfig[request.status].label}
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500 align-middle">
                  <div
                    className="max-w-[100px] "
                    title={request.assignedTechnicianName || "Chưa phân công"}>
                    {request.assignedTechnicianName || "Chưa phân công"}
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500 align-middle">
                  <div
                    className="max-w-[80px] truncate"
                    title={formatDate(request.createdAt)}>
                    {formatDate(request.createdAt)}
                  </div>
                </td>
                <td className="px-2 py-4 text-center text-sm font-medium align-middle">
                  <button
                    onClick={() => onViewDetails(request.id)}
                    className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Eye className="w-3 h-3 mr-1" />
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
