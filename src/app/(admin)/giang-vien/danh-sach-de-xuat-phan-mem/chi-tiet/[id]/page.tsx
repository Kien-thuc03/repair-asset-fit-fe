"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Monitor,
  User,
  Building,
  Calendar,
  FileText,
  Package,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Breadcrumb, Steps, Divider, Alert } from "antd";
import { SoftwareProposalStatus, SoftwareProposal } from "@/types/software";
import {
  CancelConfirmModal,
  SuccessModal,
  ErrorModal,
} from "@/components/modal";
import { useSoftwareProposalDetail } from "@/hooks/useSoftwareProposals";
import { SOFTWARE_PROPOSAL_STATUS_CONFIG } from "@/lib/constants";

// Helper functions to get names from nested objects
const getUserName = (proposal: SoftwareProposal): string => {
  return proposal.proposer?.fullName || proposal.proposerId;
};

const getRoomName = (proposal: SoftwareProposal): string => {
  return proposal.room?.name || proposal.room?.roomNumber || proposal.roomId;
};

const getTechnicianName = (proposal: SoftwareProposal): string => {
  return (
    proposal.technician?.fullName || proposal.technicianId || "Chưa phân công"
  );
};
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

export default function SoftwareProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Use API hook to fetch proposal details
  const {
    data: proposal,
    loading,
    error,
  } = useSoftwareProposalDetail(proposalId);

  // Hàm mở modal xác nhận hủy
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  // Hàm hủy đề xuất (TODO: implement API call)
  const handleCancelProposal = async () => {
    try {
      setIsDeleting(true);

      // TODO: Call API to cancel proposal
      // await cancelSoftwareProposal(proposalId);

      // Giả lập delay API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowCancelModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowCancelModal(false);
      setErrorMessage("Có lỗi xảy ra khi hủy đề xuất. Vui lòng thử lại.");
      setShowErrorModal(true);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hàm xử lý sau khi thành công
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien/danh-sach-de-xuat-phan-mem");
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

  const statusConfig = SOFTWARE_PROPOSAL_STATUS_CONFIG[proposal.status];
  const StatusIcon = statusConfig?.icon || Monitor;

  // Helper function to get status step
  const getStatusStep = (status: SoftwareProposalStatus) => {
    // Xử lý trường hợp từ chối - hiển thị ở bước 1 (Đã duyệt) với status error
    if (status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI) {
      return 1; // Bước "Đã duyệt" nhưng với status error
    }

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
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/giang-vien/danh-sach-de-xuat-phan-mem",
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
                statusConfig?.color ||
                "text-gray-600 bg-gray-50 border-gray-200"
              }`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusConfig?.label ||
                proposal.status}
            </span>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Tạo lúc: {new Date(proposal.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Nút hủy đề xuất - chỉ hiển thị khi trạng thái là Chờ duyệt */}
        {proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT && (
          <>
            <Divider />
            <div className="flex items-center justify-end">
              <button
                onClick={handleOpenCancelModal}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash2 className="h-4 w-4 mr-2" />
                Hủy đề xuất
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
      <div className="grid  gap-6">
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
                          {item.softwareName} {item.version}
                        </p>
                        {item.publisher && (
                          <p className="text-sm text-gray-500">
                            {item.publisher}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Số lượng</p>
                      <p className="font-medium text-gray-900">
                        {item.quantity}
                      </p>
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

      {/* Modals */}
      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelProposal}
        title="Xác nhận hủy đề xuất"
        message="Bạn có chắc chắn muốn hủy đề xuất phần mềm này không? Hành động này không thể hoàn tác."
        confirmText="Hủy đề xuất"
        cancelText="Đóng"
        isLoading={isDeleting}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Hủy đề xuất thành công!"
        message="Đề xuất phần mềm đã được hủy thành công."
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Có lỗi xảy ra!"
        message={errorMessage}
        showRetry={false}
      />
    </div>
  );
}
