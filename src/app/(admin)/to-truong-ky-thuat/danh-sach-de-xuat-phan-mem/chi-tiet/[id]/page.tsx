"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Breadcrumb, message, Steps, Divider, Alert } from "antd";
import { SoftwareProposalStatus, SoftwareProposal } from "@/types/software";
import { useSoftwareProposalDetail } from "@/hooks/useSoftwareProposals";
import { useUpdateSoftwareProposalStatus } from "@/hooks/useSoftwareProposals";
import { useAuth } from "@/contexts/AuthContext";
import { SoftwareProposalConfirmModal } from "@/components/modal";

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
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: {
    label: "Đang trang bị",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    icon: Wrench,
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

export default function SoftwareProposalDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const proposalId = params.id as string;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<"approve" | "reject">(
    "approve"
  );

  // Use API hook to fetch proposal details
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useSoftwareProposalDetail(proposalId);

  // Update status hook
  const { updateStatus, loading: isUpdatingStatus } =
    useUpdateSoftwareProposalStatus();

  // Handle approve
  const handleApproveClick = () => {
    if (!user?.id) {
      message.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setModalActionType("approve");
    setIsModalOpen(true);
  };

  // Handle reject
  const handleRejectClick = () => {
    if (!user?.id) {
      message.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setModalActionType("reject");
    setIsModalOpen(true);
  };

  // Handle modal confirm
  const handleModalConfirm = async () => {
    if (!proposal || !user?.id) {
      message.error("Không thể xác định thông tin. Vui lòng thử lại.");
      return;
    }

    try {
      const status =
        modalActionType === "approve"
          ? SoftwareProposalStatus.ĐÃ_DUYỆT
          : SoftwareProposalStatus.ĐÃ_TỪ_CHỐI;

      await updateStatus(proposalId, {
        status,
        approverId: user.id,
      });

      message.success(
        modalActionType === "approve"
          ? "Đã duyệt đề xuất phần mềm thành công!"
          : "Đã từ chối đề xuất phần mềm!"
      );
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        `Error ${
          modalActionType === "approve" ? "approving" : "rejecting"
        } proposal:`,
        error
      );
      message.error(
        error instanceof Error
          ? error.message
          : `Không thể ${
              modalActionType === "approve" ? "duyệt" : "từ chối"
            } đề xuất.`
      );
      throw error; // Re-throw để modal không đóng khi có lỗi
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!isUpdatingStatus) {
      setIsModalOpen(false);
    }
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

  const StatusIcon =
    softwareProposalStatusConfig[proposal.status]?.icon || Monitor;
  const canApprove = proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;

  // Helper function to get status step
  const getStatusStep = (status: SoftwareProposalStatus) => {
    const steps = [
      SoftwareProposalStatus.CHỜ_DUYỆT,
      SoftwareProposalStatus.ĐÃ_DUYỆT,
      SoftwareProposalStatus.ĐANG_TRANG_BỊ,
      SoftwareProposalStatus.ĐÃ_TRANG_BỊ,
    ];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

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

      {/* Header with Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Monitor className="w-8 h-8 text-blue-600" />
              {proposal.proposalCode}
            </h1>
            <p className="mt-2 text-gray-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Chi tiết đề xuất phần mềm
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                softwareProposalStatusConfig[proposal.status].color
              }`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {softwareProposalStatusConfig[proposal.status].label}
            </span>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Tạo lúc: {new Date(proposal.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Action buttons - chỉ hiển thị khi trạng thái là Chờ duyệt */}
        {canApprove && (
          <>
            <Divider />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleApproveClick}
                disabled={isUpdatingStatus}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircle className="h-4 w-4 mr-2" />
                Duyệt đề xuất
              </button>
              <button
                onClick={handleRejectClick}
                disabled={isUpdatingStatus}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </button>
            </div>
          </>
        )}

        {/* Status Progress */}
        <Divider />
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Tiến độ xử lý
          </h3>
          <Steps
            current={getStatusStep(proposal.status)}
            status={
              proposal.status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI
                ? "error"
                : "process"
            }
            size="small"
            items={[
              {
                title: "Chờ duyệt",
                icon: <Clock className="w-4 h-4" />,
                description:
                  proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT
                    ? "Hiện tại"
                    : "",
              },
              {
                title: "Đã duyệt",
                icon: <CheckCircle className="w-4 h-4" />,
                description:
                  proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT &&
                  proposal.approverId
                    ? `Bởi: ${
                        proposal.approver?.fullName || proposal.approverId
                      }`
                    : proposal.approverId
                    ? new Date(proposal.updatedAt).toLocaleDateString("vi-VN")
                    : "",
              },
              {
                title: "Đang trang bị",
                icon: <Wrench className="w-4 h-4" />,
                description:
                  proposal.status === SoftwareProposalStatus.ĐANG_TRANG_BỊ
                    ? proposal.technician
                      ? `Kỹ thuật viên: ${proposal.technician.fullName}`
                      : "Hiện tại"
                    : "",
              },
              {
                title: "Đã trang bị",
                icon: <Package className="w-4 h-4" />,
                description:
                  proposal.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ
                    ? proposal.technician
                      ? `Hoàn thành bởi: ${proposal.technician.fullName}`
                      : new Date(proposal.updatedAt).toLocaleDateString("vi-VN")
                    : "",
              },
            ]}
          />
          {/* Status-specific alerts */}
          {proposal.status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI && (
            <Alert
              className="mt-4"
              message="Đề xuất đã bị từ chối"
              description={
                proposal.approverId
                  ? `Đề xuất đã bị từ chối bởi ${
                      proposal.approver?.fullName || proposal.approverId
                    } lúc ${new Date(proposal.updatedAt).toLocaleString(
                      "vi-VN"
                    )}.`
                  : `Đề xuất đã bị từ chối lúc ${new Date(
                      proposal.updatedAt
                    ).toLocaleString("vi-VN")}.`
              }
              type="error"
              icon={<XCircle />}
              showIcon
            />
          )}
          {proposal.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ && (
            <Alert
              className="mt-4"
              message="Đề xuất đã hoàn thành"
              description={`Phần mềm đã được trang bị thành công lúc ${new Date(
                proposal.updatedAt
              ).toLocaleString("vi-VN")}.${
                proposal.technician
                  ? ` Hoàn thành bởi: ${proposal.technician.fullName}.`
                  : ""
              }`}
              type="success"
              icon={<CheckCircle />}
              showIcon
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Left Column - Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>

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
      </div>

      {/* Software Proposal Confirm Modal */}
      {proposal && (
        <SoftwareProposalConfirmModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          proposalCode={proposal.proposalCode}
          actionType={modalActionType}
          isLoading={isUpdatingStatus}
        />
      )}
    </div>
  );
}
