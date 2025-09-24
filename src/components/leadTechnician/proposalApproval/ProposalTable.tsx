import { Tag } from "antd";
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";

// Define sorting field mapping
type SortField =
  | "requestCode"
  | "title"
  | "componentsCount"
  | "status"
  | "createdAt";

interface ProposalTableProps {
  paginatedData: ReplacementRequestItem[];
  selectedRowKeys: string[];
  currentPage: number;
  pageSize: number;
  statusConfig: Record<string, { text: string; color: string }>;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSelectAll: (checked: boolean) => void;
  onRowSelect: (itemId: string, checked: boolean) => void;
  onSort: (field: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

// Custom Sortable Header Component for Proposals
interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

const ProposalSortableHeader = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
  className = "",
}: SortableHeaderProps) => {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap ${className}`}
      onClick={() => onSort(field)}>
      <div className="flex items-center space-x-1">
        <span className="whitespace-nowrap">{children}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "desc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </th>
  );
};

export default function ProposalTable({
  paginatedData,
  selectedRowKeys,
  currentPage,
  pageSize,
  statusConfig,
  sortField,
  sortDirection,
  onSelectAll,
  onRowSelect,
  onSort,
  onApprove,
  onReject,
}: ProposalTableProps) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((row) =>
                      selectedRowKeys.includes(row.id)
                    )
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Chọn tất cả đề xuất"
                />
                <span>STT</span>
              </div>
            </th>
            <ProposalSortableHeader
              field="requestCode"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Mã yêu cầu
            </ProposalSortableHeader>
            <ProposalSortableHeader
              field="title"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Tiêu đề đề xuất
            </ProposalSortableHeader>
            <ProposalSortableHeader
              field="componentsCount"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Số linh kiện
            </ProposalSortableHeader>
            <ProposalSortableHeader
              field="status"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Trạng thái
            </ProposalSortableHeader>
            <ProposalSortableHeader
              field="createdAt"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}>
              Ngày tạo
            </ProposalSortableHeader>
            <th className="px-4 py-3 text-center text-xs uppercase font-medium text-gray-500 tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((record, index) => {
            const config = statusConfig[
              record.status as keyof typeof statusConfig
            ] || {
              text: record.status,
              color: "default",
            };
            return (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRowKeys.includes(record.id)}
                      onChange={(e) => onRowSelect(record.id, e.target.checked)}
                      aria-label={`Chọn đề xuất ${record.requestCode}`}
                    />
                    <span>{(currentPage - 1) * pageSize + index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                  {record.requestCode}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>
                    <div className="font-medium">{record.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {record.description}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.components.length} linh kiện
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Tag color={config.color}>{config.text}</Tag>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {new Date(record.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 items-center whitespace-nowrap text-center text-sm space-x-2">
                  <Link
                    href={`/to-truong-ky-thuat/duyet-de-xuat/chi-tiet/${record.id}`}>
                    <button
                      title="Xem chi tiết"
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  {record.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT && (
                    <>
                      <button
                        onClick={() => onApprove(record.id)}
                        className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs">
                        Duyệt
                      </button>
                      <button
                        onClick={() => onReject(record.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs">
                        Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
