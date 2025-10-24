"use client";

import { Eye, User, Building, Calendar, LucideIcon } from "lucide-react";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types";

interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

interface SoftwareProposalCardsProps {
  proposals: SoftwareProposal[];
  selectedItems: string[];
  selectAll: boolean;
  statusConfig: Record<SoftwareProposalStatus, StatusConfig>;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onViewDetails: (proposal: SoftwareProposal) => void;
  getUserName: (userId: string) => string;
  getRoomName: (roomId: string) => string;
}

export default function SoftwareProposalCards({
  proposals,
  selectedItems,
  selectAll,
  statusConfig,
  onSelectAll,
  onSelectItem,
  onViewDetails,
  getUserName,
  getRoomName,
}: SoftwareProposalCardsProps) {
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
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    statusConfig[proposal.status].color
                  }`}>
                  {statusConfig[proposal.status].label}
                </div>
              </div>

              {/* Proposer and Room Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 flex items-center mb-1">
                    <User className="w-3 h-3 mr-1" />
                    Người đề xuất:
                  </div>
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={getUserName(proposal.proposerId)}>
                    {getUserName(proposal.proposerId)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 flex items-center mb-1">
                    <Building className="w-3 h-3 mr-1" />
                    Phòng:
                  </div>
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={getRoomName(proposal.roomId)}>
                    {getRoomName(proposal.roomId)}
                  </div>
                </div>
              </div>

              {/* Reason */}
              {proposal.reason && (
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Lý do:</div>
                  <div
                    className="text-gray-900 line-clamp-2"
                    title={proposal.reason}>
                    {proposal.reason}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onViewDetails(proposal)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="w-3 h-3 mr-1" />
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

