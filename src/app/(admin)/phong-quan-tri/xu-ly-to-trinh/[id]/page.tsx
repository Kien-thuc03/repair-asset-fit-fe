"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  Building,
  MapPin,
  AlertTriangle,
  Download,
  Package,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Loader2,
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import { SubmissionPreviewModal, SuccessModal } from "@/components/modal";
import { exportSubmissionDocx } from "@/components/common";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import { ReplacementProposalStatus, SubmissionFormData } from "@/types";
import { getFileNameFromUrl } from "@/lib/utils";

export default function XuLyToTrinhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // note: no loading spinner needed; modal handles confirmation flow
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  // Fetch proposal data từ API
  const { data: proposal, loading, error } = useReplacementProposal(id);
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Default form data for preview modal
  const defaultSubmissionFormData: SubmissionFormData = useMemo(
    () => ({
      recipientDepartment: "Ban Giám hiệu",
      submittedBy: "Giảng Thanh Trọn",
      position: "Tổ trưởng Kỹ thuật",
      department: "Phòng Quản trị",
      subject: proposal?.title || "",
      attachments: "Biên bản kiểm tra kỹ thuật",
      content: proposal?.description || "",
      director: "TS. Lê Nhất Duy",
      rector: "TS. Phan Hồng Hải",
    }),
    [proposal?.title, proposal?.description]
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h3 className="text-lg font-medium text-gray-900">Lỗi tải dữ liệu</h3>
        <p className="text-gray-500">{error}</p>
        <Link
          href="/phong-quan-tri/xu-ly-to-trinh"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy tờ trình
        </h3>
        <p className="text-gray-500">
          Tờ trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/phong-quan-tri/xu-ly-to-trinh"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const getComponentIcon = (type: string) => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case "RAM":
        return <MemoryStick className="h-4 w-4" />;
      case "STORAGE":
      case "SSD":
      case "HDD":
        return <HardDrive className="h-4 w-4" />;
      case "CPU":
        return <Cpu className="h-4 w-4" />;
      case "PSU":
        return <Package className="h-4 w-4" />;
      case "MAINBOARD":
      case "GPU":
      case "MONITOR":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800 border-lime-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Khoa đã duyệt tờ trình";
      default:
        return status;
    }
  };

  // Hàm xử lý duyệt tờ trình
  const handleApprove = async () => {
    if (!proposal) return;

    setShowConfirmModal(false);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_XÁC_MINH,
      });

      setActionType(null);

      // Hiển thị modal thành công
      setSuccessMessage({
        title: "Duyệt tờ trình thành công!",
        message: `Tờ trình ${proposal.proposalCode} đã được xác minh thành công.`,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error approving proposal:", error);
      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi xác minh tờ trình. Vui lòng thử lại.",
        okText: "Đóng",
      });
    }
  };

  // Hàm xử lý từ chối tờ trình
  const handleReject = async () => {
    if (!proposal) return;

    setShowConfirmModal(false);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.CHỜ_XÁC_MINH,
      });

      setActionType(null);

      // Hiển thị modal thành công
      setSuccessMessage({
        title: "Từ chối tờ trình thành công!",
        message: `Tờ trình ${proposal.proposalCode} đã được từ chối.`,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi từ chối tờ trình. Vui lòng thử lại.",
        okText: "Đóng",
      });
    }
  };

  // Note: xuất DOCX được xử lý bằng hàm exportSubmissionDocx (docx builder)

  // Hàm xử lý export tờ trình
  const handleExportSubmissionDocx = async () => {
    if (!proposal) return;

    try {
      await exportSubmissionDocx(
        defaultSubmissionFormData,
        proposal.proposalCode
      );

      Modal.success({
        title: "Xuất file thành công!",
        content: `File tờ trình đã được tải xuống.`,
        centered: true,
      });
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể xuất file. Vui lòng thử lại.",
        centered: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri",
              title: (
                <div className="flex items-center">
                  <span>Phòng quản trị</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri/xu-ly-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Xử lý tờ trình</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết tờ trình {proposal.proposalCode}</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Proposal Info Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Chi tiết tờ trình thay thế
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Mã đề xuất: {proposal.proposalCode}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                proposal.status
              )}`}>
              {getStatusText(proposal.status)}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin cơ bản
              </h3>
              {proposal.status === ReplacementProposalStatus.CHỜ_XÁC_MINH && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setActionType("reject");
                      setShowConfirmModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-500">
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      setActionType("approve");
                      setShowConfirmModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500">
                    Duyệt
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề đề xuất
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {proposal.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tạo
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md leading-relaxed">
                {proposal.description}
              </p>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin vị trí
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tổng số linh kiện cần thay thế:
                  </span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {proposal.itemsCount || proposal.items?.length || 0}
                  </span>
                </div>
                {proposal.items && proposal.items.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Vị trí:
                    </span>
                    <span className="text-sm text-gray-900">
                      {proposal.items[0].oldComponent?.roomLocation ||
                        "Chưa xác định"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Components Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách linh kiện cần thay thế ({proposal.itemsCount || 0}{" "}
                linh kiện)
              </h3>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện hiện tại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện thay thế
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lý do thay thế
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposal.items?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs">
                              {item.oldComponent?.roomLocation ||
                                "Chưa xác định"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getComponentIcon(
                              item.oldComponent?.componentType || "UNKNOWN"
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.oldComponent?.name || "Không xác định"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.oldComponent?.componentType || "N/A"}
                            </div>
                            {item.oldComponent?.componentSpecs && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.oldComponent.componentSpecs}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.newItemName}
                          </div>
                          {item.newItemSpecs && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.newItemSpecs}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.quantity} {item.quantity > 1 ? "cái" : "cái"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs">
                          {item.reason || "Không có lý do"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tài liệu đính kèm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-blue-50">
              {proposal.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getFileNameFromUrl(proposal.submissionFormUrl)}
                      </p>
                      <p className="text-xs text-gray-500">DOC Document</p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportSubmissionDocx}
                    className="text-gray-600 hover:bg-blue-100 rounded transition-colors"
                    title="Tải xuống">
                    <Download className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <Modal
          open={showConfirmModal}
          onCancel={() => {
            setShowConfirmModal(false);
            setActionType(null);
          }}
          footer={[
            <button
              key="cancel"
              onClick={() => {
                setShowConfirmModal(false);
                setActionType(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 mr-2">
              Hủy
            </button>,
            <button
              key="confirm"
              onClick={actionType === "approve" ? handleApprove : handleReject}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}>
              {actionType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </button>,
          ]}
          centered
          width={500}
          title={
            actionType === "approve"
              ? "Xác nhận duyệt tờ trình"
              : "Xác nhận từ chối tờ trình"
          }>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {actionType === "approve" ? (
                <AlertTriangle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {actionType === "approve"
                    ? "Bạn có chắc chắn muốn duyệt tờ trình này?"
                    : "Bạn có chắc chắn muốn từ chối tờ trình này?"}
                </h3>
                <p
                  className={`text-sm mt-1 font-medium ${
                    actionType === "approve" ? "text-green-600" : "text-red-600"
                  }`}>
                  {actionType === "approve"
                    ? "Sau khi duyệt, trạng thái tờ trình sẽ được chuyển thành 'Đã xác minh' và không thể hoàn tác."
                    : "Sau khi từ chối, trạng thái tờ trình sẽ được chuyển thành 'Đã từ chối' và không thể hoàn tác."}
                </p>
              </div>
            </div>

            {proposal && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Mã tờ trình:</div>
                  <div className="font-medium">{proposal.proposalCode}</div>

                  <div className="text-gray-600">Tiêu đề:</div>
                  <div className="font-medium">{proposal.title}</div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Submission Preview Modal */}
      {proposal && (
        <SubmissionPreviewModal
          isOpen={showSubmissionPreview}
          onClose={() => setShowSubmissionPreview(false)}
          formData={defaultSubmissionFormData}
          proposal={proposal}
          onExport={handleExportSubmissionDocx}
          onSubmit={() => {}}
          showSubmitButton={false}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Redirect sau khi đóng modal
          if (successMessage.title.includes("Duyệt")) {
            router.push("/phong-quan-tri/lap-bien-ban");
          } else if (successMessage.title.includes("Từ chối")) {
            router.push("/phong-quan-tri/xu-ly-to-trinh");
          }
        }}
        title={successMessage.title}
        message={successMessage.message}
      />
    </div>
  );
}
