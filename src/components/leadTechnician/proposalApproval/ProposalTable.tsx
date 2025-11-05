"use client";

import { useState } from "react";
import { Tag } from "antd";
import { Eye, ChevronUp, ChevronDown, Check, X, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";
import { ReplacementProposalStatus } from "@/lib/api/replacement-proposals";
import { useUpdateReplacementProposalStatus } from "@/hooks/useReplacementProposals";
import { SuccessModal, ErrorModal } from "@/components/modal";

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
  onApprove?: (requestId: string) => void; // Optional - using internal API call
  onReject?: (requestId: string) => void; // Optional - using internal API call
  onCreateSubmission: (requestId: string) => void;
  onDataChange?: () => void; // Callback to refresh data after status update
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
  onCreateSubmission,
  onDataChange,
}: ProposalTableProps) {
  const router = useRouter();
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Modal states
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [showSuccessReject, setShowSuccessReject] = useState(false);
  const [showAskSubmission, setShowAskSubmission] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentProposalId, setCurrentProposalId] = useState<string>("");

  // Handle approve action with API call
  const handleApproveClick = (proposalId: string) => {
    setCurrentProposalId(proposalId);
    setShowConfirmApprove(true);
  };

  const handleConfirmApprove = async () => {
    setShowConfirmApprove(false);
    try {
      await updateStatus(currentProposalId, {
        status: ReplacementProposalStatus.ĐÃ_DUYỆT,
      });

      // Refresh data first
      if (onDataChange) {
        onDataChange();
      }

      // Show success and ask about submission
      setShowAskSubmission(true);
    } catch (err) {
      console.error("Error approving proposal:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Không thể phê duyệt đề xuất."
      );
      setShowError(true);
    }
  };

  // Handle reject action with API call
  const handleRejectClick = (proposalId: string) => {
    setCurrentProposalId(proposalId);
    setShowConfirmReject(true);
  };

  const handleConfirmReject = async () => {
    setShowConfirmReject(false);
    try {
      await updateStatus(currentProposalId, {
        status: ReplacementProposalStatus.ĐÃ_TỪ_CHỐI,
      });

      // Refresh data
      if (onDataChange) {
        onDataChange();
      }

      // Show success
      setShowSuccessReject(true);
    } catch (err) {
      console.error("Error rejecting proposal:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Không thể từ chối đề xuất."
      );
      setShowError(true);
    }
  };

  return (
    <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-lg">
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
              Mã đề xuất
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
                      aria-label={`Chọn đề xuất ${record.proposalCode}`}
                    />
                    <span>{(currentPage - 1) * pageSize + index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                  {record.proposalCode}
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
                      className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  {record.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT && (
                    <>
                      <button
                        onClick={() => handleApproveClick(record.id)}
                        title="Phê duyệt"
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <Check className="inline w-4 h-4 mr-1" />
                      </button>
                      <button
                        onClick={() => handleRejectClick(record.id)}
                        title="Từ chối"
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <X className="inline w-4 h-4 mr-1" />
                      </button>
                    </>
                  )}
                  {record.status === ReplacementStatus.ĐÃ_DUYỆT && (
                    <button
                      onClick={() => onCreateSubmission(record.id)}
                      title="Lập tờ trình"
                      className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Confirm Approve Modal */}
      {showConfirmApprove && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 mx-4 w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận phê duyệt
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn phê duyệt đề xuất này không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmApprove(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reject Modal */}
      {showConfirmReject && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 mx-4 w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Từ chối đề xuất
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn từ chối đề xuất này không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmReject(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Submission Modal */}
      {showAskSubmission && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 mx-4 w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phê duyệt thành công!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Đề xuất đã được phê duyệt. Bạn có muốn lập tờ trình ngay bây giờ
              không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAskSubmission(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Không
              </button>
              <button
                onClick={() => {
                  setShowAskSubmission(false);
                  router.push(
                    `/to-truong-ky-thuat/duyet-de-xuat/chi-tiet/${currentProposalId}`
                  );
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Có - Lập tờ trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessReject}
        onClose={() => setShowSuccessReject(false)}
        title="Từ chối thành công!"
        message="Đề xuất đã được từ chối."
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Lỗi"
        message={errorMessage}
        showRetry={false}
      />
    </div>
  );
}
