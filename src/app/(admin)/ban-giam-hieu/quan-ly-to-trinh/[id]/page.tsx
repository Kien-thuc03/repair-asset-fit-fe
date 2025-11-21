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
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Breadcrumb } from "antd";
import {
  SignConfirmModal,
  CancelConfirmModal,
  SubmissionPreviewModal,
  SuccessModal,
  ErrorModal,
} from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import { ReplacementProposalStatus, SubmissionFormData } from "@/types";
import { getFileNameFromUrl } from "@/lib/utils";

export default function ChiTietQuanLyToTrinhPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignConfirmModal, setShowSignConfirmModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejectModalB5, setShowRejectModalB5] = useState(false);
  const [showSignConfirmModalB5, setShowSignConfirmModalB5] = useState(false);
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState({ title: "", message: "" });

  // Fetch proposal data từ API
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useReplacementProposal(id);
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Default form data for preview modal
  const defaultSubmissionFormData: SubmissionFormData = useMemo(
    () => ({
      recipientDepartment: "Ban Giám hiệu",
      submittedBy: proposal?.proposer?.fullName || "Giảng Thanh Trọn",
      position: "Tổ trưởng Kỹ thuật",
      department: "Phòng Quản trị",
      subject: proposal?.title || "",
      attachments: "Biên bản kiểm tra kỹ thuật",
      content: proposal?.description || "",
      director: "TS. Lê Nhất Duy",
      rector: "TS. Phan Hồng Hải",
    }),
    [proposal?.title, proposal?.description, proposal?.proposer?.fullName]
  );

  // Handler for downloading submission document
  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      // Fetch the file from URL với mode 'no-cors' nếu cần
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok) {
        // Nếu fetch thất bại, thử download trực tiếp
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        return;
      }

      const blob = await response.blob();

      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.style.display = "none"; // Ẩn link
      document.body.appendChild(link);

      // Đảm bảo link được append trước khi click
      requestAnimationFrame(() => {
        link.click();

        // Cleanup sau một chút delay
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          window.URL.revokeObjectURL(blobUrl);
        }, 200);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: thử download trực tiếp từ URL
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 100);
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        // Cuối cùng, mở trong tab mới
        window.open(url, "_blank");
      }
    }
  };

  // Handler for exporting submission document
  const handleExportSubmissionDocx = () => {
    if (proposal?.submissionFormUrl) {
      const filename =
        getFileNameFromUrl(proposal.submissionFormUrl) || "to-trinh.pdf";
      handleDownloadFile(proposal.submissionFormUrl, filename);
    }
  };

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
          href="/ban-giam-hieu/quan-ly-to-trinh"
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
          href="/ban-giam-hieu/quan-ly-to-trinh"
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
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800 border-lime-200";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt (P.QT)";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã hoàn tất";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Đã từ chối tờ trình";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Khoa đã duyệt tờ trình";
      default:
        return status;
    }
  };

  const handleSignConfirm = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
      });

      setIsProcessing(false);
      setShowSignConfirmModal(false);

      setSuccessMessage({
        title: "Phê duyệt thành công",
        message: `Tờ trình ${proposal.proposalCode} đã được phê duyệt thành công.`,
      });
      setShowSuccessModal(true);

      refetch();
    } catch (error) {
      console.error("Error approving proposal:", error);
      setIsProcessing(false);
      setShowSignConfirmModal(false);

      setErrorMessage({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi phê duyệt tờ trình. Vui lòng thử lại.",
      });
      setShowErrorModal(true);
    }
  };

  const handleVerificationConfirm = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.CHỜ_XÁC_MINH,
      });

      setIsProcessing(false);
      setShowVerificationModal(false);

      setSuccessMessage({
        title: "Yêu cầu xác minh đã được gửi",
        message: `Yêu cầu xác minh tình trạng linh kiện cho tờ trình ${proposal.proposalCode} đã được gửi thành công.`,
      });
      setShowSuccessModal(true);

      refetch();
    } catch (error) {
      console.error("Error requesting verification:", error);
      setIsProcessing(false);
      setShowVerificationModal(false);

      setErrorMessage({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi gửi yêu cầu xác minh. Vui lòng thử lại.",
      });
      setShowErrorModal(true);
    }
  };

  // Hàm xử lý khi xác nhận từ chối tờ trình
  const handleRejectConfirm = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
      });

      setIsProcessing(false);
      setShowRejectModal(false);

      setSuccessMessage({
        title: "Từ chối thành công",
        message: `Tờ trình ${proposal.proposalCode} đã được từ chối.`,
      });
      setShowSuccessModal(true);

      refetch();
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      setIsProcessing(false);
      setShowRejectModal(false);

      setErrorMessage({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi từ chối tờ trình. Vui lòng thử lại.",
      });
      setShowErrorModal(true);
    }
  };

  // Hàm xử lý khi duyệt từ trạng thái B5 (KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH) -> B6 (ĐÃ_DUYỆT_TỜ_TRÌNH)
  const handleApproveFromB5 = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
      });

      setIsProcessing(false);
      setShowSignConfirmModalB5(false);

      setSuccessMessage({
        title: "Duyệt thành công",
        message: `Tờ trình ${proposal.proposalCode} đã được duyệt thành công.`,
      });
      setShowSuccessModal(true);

      refetch();
    } catch (error) {
      console.error("Error approving proposal from B5:", error);
      setIsProcessing(false);
      setShowSignConfirmModalB5(false);

      setErrorMessage({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi duyệt tờ trình. Vui lòng thử lại.",
      });
      setShowErrorModal(true);
    }
  };

  // Hàm xử lý khi từ chối từ trạng thái B5 (KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH) -> B7 (ĐÃ_TỪ_CHỐI_TỜ_TRÌNH)
  const handleRejectFromB5 = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
      });

      setIsProcessing(false);
      setShowRejectModalB5(false);

      setSuccessMessage({
        title: "Từ chối thành công",
        message: `Tờ trình ${proposal.proposalCode} đã được từ chối.`,
      });
      setShowSuccessModal(true);

      refetch();
    } catch (error) {
      console.error("Error rejecting proposal from B5:", error);
      setIsProcessing(false);
      setShowRejectModalB5(false);

      setErrorMessage({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi từ chối tờ trình. Vui lòng thử lại.",
      });
      setShowErrorModal(true);
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
              href: "/ban-giam-hieu",
              title: (
                <div className="flex items-center">
                  <span>Ban giám hiệu</span>
                </div>
              ),
            },
            {
              href: "/ban-giam-hieu/quan-ly-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Quản lý tờ trình</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Chi tiết tờ trình thay thế
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Mã đề xuất: {proposal.proposalCode}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  proposal.status
                )}`}>
                {getStatusText(proposal.status)}
              </span>
              {/* Action buttons - hiển thị khi status là KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH (B5) */}
              {proposal.status ===
                ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRejectModalB5(true)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Từ chối</span>
                  </button>
                  <button
                    onClick={() => setShowSignConfirmModalB5(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Duyệt</span>
                  </button>
                </div>
              )}
              {/* Action buttons - hiển thị khi status là ĐÃ_DUYỆT_TỜ_TRÌNH (B6) */}
              {proposal.status ===
                ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Xác minh</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Từ chối</span>
                  </button>
                  <button
                    onClick={() => setShowSignConfirmModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Phê duyệt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
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
            <div className="space-y-4">
              {proposal.submissionFormUrl && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getFileNameFromUrl(proposal.submissionFormUrl)}
                      </p>
                      <p className="text-xs text-gray-500">DOC Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSubmissionPreview(true)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (proposal.submissionFormUrl) {
                          const filename =
                            getFileNameFromUrl(proposal.submissionFormUrl) ||
                            "to-trinh.pdf";
                          handleDownloadFile(
                            proposal.submissionFormUrl,
                            filename
                          );
                        }
                      }}
                      className="p-2 text-gray-600 hover:bg-blue-100 rounded transition-colors"
                      title="Tải xuống">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
              {proposal.verificationReportUrl && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Biên bản xác minh
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileNameFromUrl(proposal.verificationReportUrl)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={proposal.verificationReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        if (proposal.verificationReportUrl) {
                          const filename =
                            getFileNameFromUrl(
                              proposal.verificationReportUrl
                            ) || "bien-ban-xac-minh.pdf";
                          handleDownloadFile(
                            proposal.verificationReportUrl,
                            filename
                          );
                        }
                      }}
                      className="p-2 text-gray-600 hover:bg-blue-100 rounded transition-colors"
                      title="Tải xuống">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
              {!proposal.submissionFormUrl &&
                !proposal.verificationReportUrl && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Chưa có tài liệu đính kèm</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* SignConfirmModal cho phê duyệt tờ trình */}
      <SignConfirmModal
        isOpen={showSignConfirmModal}
        onClose={() => setShowSignConfirmModal(false)}
        onConfirm={handleSignConfirm}
        reportTitle={proposal.title || "Tờ trình thay thế"}
        reportNumber={proposal.proposalCode}
        isLoading={isProcessing}
        actionType="approve"
      />

      {/* Verification Request Modal - Sử dụng SignConfirmModal với custom config */}
      <SignConfirmModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onConfirm={handleVerificationConfirm}
        reportTitle={proposal.title || "Tờ trình thay thế"}
        reportNumber={proposal.proposalCode}
        isLoading={isProcessing}
        actionType="approve"
        customTitle="Yêu cầu xác minh tình trạng linh kiện"
        customConfirmText="Xác nhận gửi yêu cầu"
        customDescription={`Bạn có chắc chắn muốn gửi yêu cầu xác minh tình trạng các linh kiện trong tờ trình ${proposal.proposalCode}?`}
        customWarning="Sau khi gửi yêu cầu, tờ trình sẽ chuyển sang trạng thái 'Chờ xác minh' và phòng quản trị sẽ tiến hành kiểm tra tình trạng các linh kiện."
        icon={AlertTriangle}
      />

      {/* Reject Confirmation Modal - Sử dụng CancelConfirmModal cho B6 */}
      <CancelConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        title="Xác nhận từ chối tờ trình"
        message={`Bạn có chắc chắn muốn từ chối tờ trình ${proposal.proposalCode}? Sau khi từ chối, tờ trình sẽ chuyển sang trạng thái "Đã từ chối tờ trình" và cần được lập lại từ đầu. Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận từ chối"
        cancelText="Hủy"
        isLoading={isProcessing}
      />

      {/* Reject Confirmation Modal cho B5 - Sử dụng CancelConfirmModal */}
      <CancelConfirmModal
        isOpen={showRejectModalB5}
        onClose={() => setShowRejectModalB5(false)}
        onConfirm={handleRejectFromB5}
        title="Xác nhận từ chối tờ trình"
        message={`Bạn có chắc chắn muốn từ chối tờ trình ${proposal.proposalCode}? Sau khi từ chối, tờ trình sẽ chuyển sang trạng thái "Đã từ chối tờ trình" và cần được lập lại từ đầu. Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận từ chối"
        cancelText="Hủy"
        isLoading={isProcessing}
      />

      {/* SignConfirmModal cho duyệt từ B5 */}
      <SignConfirmModal
        isOpen={showSignConfirmModalB5}
        onClose={() => setShowSignConfirmModalB5(false)}
        onConfirm={handleApproveFromB5}
        reportTitle={proposal.title || "Tờ trình thay thế"}
        reportNumber={proposal.proposalCode}
        isLoading={isProcessing}
        actionType="approve"
        customTitle="Xác nhận duyệt tờ trình"
        customDescription={`Bạn có chắc chắn muốn duyệt tờ trình ${proposal.proposalCode}?`}
        customWarning="Sau khi duyệt, tờ trình sẽ chuyển sang trạng thái 'Đã duyệt tờ trình' và có thể thực hiện các thao tác tiếp theo."
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Nếu là thao tác từ chối, chuyển về danh sách
          if (successMessage.title.includes("Từ chối")) {
            router.push("/ban-giam-hieu/quan-ly-to-trinh");
          }
        }}
        title={successMessage.title}
        message={successMessage.message}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorMessage.title}
        message={errorMessage.message}
        showRetry={false}
      />

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
    </div>
  );
}
