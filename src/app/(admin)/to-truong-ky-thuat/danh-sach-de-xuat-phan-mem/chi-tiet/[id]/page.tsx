"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Monitor,
  User,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { Breadcrumb, Modal, message } from "antd";
import { SoftwareProposalStatus, SoftwareProposal } from "@/types/software";
import { useSoftwareProposalDetail } from "@/hooks/useSoftwareProposals";
import { useUpdateSoftwareProposalStatus } from "@/hooks/useSoftwareProposals";
import { useAuth } from "@/contexts/AuthContext";

// Helper functions to get names from nested objects
const getUserName = (proposal: SoftwareProposal): string => {
  return proposal.proposer?.fullName || proposal.proposerId;
};

const getRoomName = (proposal: SoftwareProposal): string => {
  return (
    proposal.room?.name ||
    proposal.room?.roomNumber ||
    `${proposal.room?.building || ""}.${proposal.room?.floor || ""}${
      proposal.room?.roomNumber || ""
    }` ||
    proposal.roomId
  );
};

const getTechnicianName = (proposal: SoftwareProposal): string => {
  return (
    proposal.technician?.fullName || proposal.technicianId || "Chưa phân công"
  );
};

// Config cho trạng thái đề xuất
const softwareProposalStatusConfig = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: "Chờ duyệt",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: "Đã duyệt",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: "Đã từ chối",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

export default function SoftwareProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const proposalId = params.id as string;

  const [isProcessing, setIsProcessing] = useState(false);

  // Use API hook to fetch proposal details
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useSoftwareProposalDetail(proposalId);

  // Update status hook
  const { updateStatus } = useUpdateSoftwareProposalStatus();

  // Handle approve
  const handleApprove = async () => {
    if (!proposal) return;

    Modal.confirm({
      title: "Xác nhận duyệt đề xuất",
      content: "Bạn có chắc chắn muốn duyệt đề xuất phần mềm này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          setIsProcessing(true);
          await updateStatus(proposalId, {
            status: SoftwareProposalStatus.ĐÃ_DUYỆT,
            approverId: user?.id,
          });
          message.success("Đã duyệt đề xuất phần mềm thành công!");
          refetch();
        } catch (error) {
          console.error("Error approving proposal:", error);
          message.error(
            error instanceof Error ? error.message : "Không thể duyệt đề xuất."
          );
        } finally {
          setIsProcessing(false);
        }
      },
    });
  };

  // Handle reject
  const handleReject = async () => {
    if (!proposal) return;

    Modal.confirm({
      title: "Xác nhận từ chối đề xuất",
      content: "Bạn có chắc chắn muốn từ chối đề xuất phần mềm này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          setIsProcessing(true);
          await updateStatus(proposalId, {
            status: SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
            approverId: user?.id,
          });
          message.success("Đã từ chối đề xuất phần mềm!");
          refetch();
        } catch (error) {
          console.error("Error rejecting proposal:", error);
          message.error(
            error instanceof Error
              ? error.message
              : "Không thể từ chối đề xuất."
          );
        } finally {
          setIsProcessing(false);
        }
      },
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {error || "Không tìm thấy đề xuất"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Đề xuất phần mềm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  const StatusIcon = softwareProposalStatusConfig[proposal.status].icon;
  const canApprove = proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;
  const canReject = proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/to-truong-ky-thuat",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/to-truong-ky-thuat/danh-sach-de-xuat-phan-mem",
            title: (
              <div className="flex items-center">
                <span>Danh sách đề xuất phần mềm</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết đề xuất</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Monitor className="h-6 w-6 text-blue-600" />
              Chi tiết đề xuất phần mềm
            </h1>
            <p className="mt-1 text-gray-600">
              Mã đề xuất:{" "}
              <span className="font-medium">{proposal.proposalCode}</span>
            </p>
          </div>
        </div>

        {/* Action buttons - chỉ hiển thị khi trạng thái là Chờ duyệt */}
        {canApprove && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <CheckCircle className="h-4 w-4 mr-2" />
              Duyệt đề xuất
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                  softwareProposalStatusConfig[proposal.status].color
                }`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {softwareProposalStatusConfig[proposal.status].label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Người đề xuất</p>
                  <p className="font-medium text-gray-900">
                    {getUserName(proposal)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phòng</p>
                  <p className="font-medium text-gray-900">
                    {getRoomName(proposal)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium text-gray-900">
                    {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Kỹ thuật viên</p>
                  <p className="font-medium text-gray-900">
                    {getTechnicianName(proposal)}
                  </p>
                </div>
              </div>

              {proposal.approverId &&
                proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Đã được duyệt</p>
                      <p className="font-medium text-gray-900">
                        Bởi:{" "}
                        {proposal.approver?.fullName || proposal.approverId}
                      </p>
                    </div>
                  </div>
                )}

              {proposal.approverId &&
                proposal.status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI && (
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Đã bị từ chối</p>
                      <p className="font-medium text-gray-900">
                        Bởi:{" "}
                        {proposal.approver?.fullName || proposal.approverId}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {proposal.reason && (
              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Lý do đề xuất</p>
                    <p className="mt-1 text-gray-900">{proposal.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danh sách phần mềm */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách phần mềm đề xuất
            </h2>

            <div className="space-y-3">
              {proposal.items && proposal.items.length > 0 ? (
                proposal.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.softwareName}
                        </p>
                        {item.version && (
                          <p className="text-sm text-gray-500">
                            Phiên bản: {item.version}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Chưa có phần mềm nào trong đề xuất này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tiến trình xử lý
            </h2>

            <div className="space-y-4">
              {/* Tạo đề xuất */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tạo đề xuất</p>
                  <p className="text-sm text-gray-500">
                    {new Date(proposal.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Duyệt đề xuất */}
              {proposal.approverId &&
                proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Đã duyệt</p>
                      <p className="text-sm text-gray-500">
                        Bởi:{" "}
                        {proposal.approver?.fullName || proposal.approverId}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(proposal.updatedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}

              {/* Từ chối */}
              {proposal.status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã từ chối</p>
                    {proposal.approverId && (
                      <p className="text-sm text-gray-500">
                        Bởi:{" "}
                        {proposal.approver?.fullName || proposal.approverId}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}

              {/* Hoàn thành */}
              {proposal.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã trang bị</p>
                    <p className="text-sm text-gray-500">
                      Hoàn thành cài đặt phần mềm
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
