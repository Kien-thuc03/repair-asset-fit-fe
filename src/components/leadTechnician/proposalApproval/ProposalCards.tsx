"use client";

"use client";

import { useState } from "react";
import { Tag } from "antd";
import { Check, X, Eye, Calendar, Package, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplacementRequestItem } from "@/types";
import { ReplacementProposalStatus } from "@/types/repair";
import { useUpdateReplacementProposalStatus } from "@/hooks/useReplacementProposals";
import { SuccessModal, ErrorModal } from "@/components/modal";

interface ProposalCardsProps {
  proposals: ReplacementRequestItem[];
  selectedItems: string[];
  selectAll: boolean;
  statusConfig: Record<string, { text: string; color: string }>;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onApprove?: (requestId: string) => void; // Optional - using internal API call
  onReject?: (requestId: string) => void; // Optional - using internal API call
  onCreateSubmission: (requestId: string) => void;
  onDataChange?: () => void; // Callback to refresh data after status update
}

export default function ProposalCards({
  proposals,
  selectedItems,
  selectAll,
  statusConfig,
  onSelectAll,
  onSelectItem,
  onCreateSubmission,
  onDataChange,
}: ProposalCardsProps) {
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
    <div className="lg:hidden">
      {/* Mobile Select All */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={onSelectAll}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            {selectAll
              ? `Bỏ chọn tất cả`
              : `Chọn tất cả (${proposals.length} mục trang này)`}
          </span>
        </label>
      </div>

      <div className="space-y-4 p-4">
        {proposals.map((proposal) => {
          const config = statusConfig[
            proposal.status as keyof typeof statusConfig
          ] || {
            text: proposal.status,
            color: "default",
          };

          return (
            <div
              key={proposal.id}
              className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              {/* Header with checkbox and proposal code */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(proposal.id)}
                    onChange={() => onSelectItem(proposal.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-blue-600">
                      {proposal.proposalCode}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
                <Tag color={config.color}>{config.text}</Tag>
              </div>

              {/* Title and Description */}
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  {proposal.title}
                </div>
                {proposal.description && (
                  <div
                    className="text-xs text-gray-500 line-clamp-2"
                    title={proposal.description}>
                    {proposal.description}
                  </div>
                )}
              </div>

              {/* Components Count */}
              <div className="flex items-center text-sm">
                <Package className="w-4 h-4 text-gray-400 mr-2" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {proposal.components.length} linh kiện
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                <Link
                  href={`/to-truong-ky-thuat/duyet-de-xuat/chi-tiet/${proposal.id}`}>
                  <button
                    title="Xem chi tiết"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Eye className="w-3 h-3 mr-1" />
                    Chi tiết
                  </button>
                </Link>

                {proposal.status === ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT && (
                  <>
                    <button
                      onClick={() => handleApproveClick(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleRejectClick(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <X className="w-3 h-3 mr-1" />
                      Từ chối
                    </button>
                  </>
                )}

                {proposal.status === ReplacementProposalStatus.ĐÃ_DUYỆT && (
                  <button
                    onClick={() => onCreateSubmission(proposal.id)}
                    title="Lập tờ trình"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <FileText className="w-3 h-3 mr-1" />
                    Lập tờ trình
                  </button>
                )}
              </div>
            </div>
          );
        })}

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
    </div>
  );
}
