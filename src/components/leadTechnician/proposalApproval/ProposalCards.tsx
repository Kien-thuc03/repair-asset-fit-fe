"use client";

import { Tag } from "antd";
import { Eye, Check, X, FileText, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";

interface ProposalCardsProps {
  proposals: ReplacementRequestItem[];
  selectedItems: string[];
  selectAll: boolean;
  statusConfig: Record<string, { text: string; color: string }>;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onCreateSubmission: (requestId: string) => void;
}

export default function ProposalCards({
  proposals,
  selectedItems,
  selectAll,
  statusConfig,
  onSelectAll,
  onSelectItem,
  onApprove,
  onReject,
  onCreateSubmission,
}: ProposalCardsProps) {
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

                {proposal.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT && (
                  <>
                    <button
                      onClick={() => onApprove(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => onReject(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <X className="w-3 h-3 mr-1" />
                      Từ chối
                    </button>
                  </>
                )}

                {proposal.status === ReplacementStatus.ĐÃ_DUYỆT && (
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
      </div>
    </div>
  );
}
