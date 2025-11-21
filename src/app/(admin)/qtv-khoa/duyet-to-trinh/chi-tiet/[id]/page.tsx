"use client";

import React, { useState } from "react";
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
  Loader2
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import SignConfirmModal from "@/components/modal/SignConfirmModal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import { ReplacementProposalStatus } from "@/types/repair";
export default function ChiTietDuyetToTrinhPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignConfirmModal, setShowSignConfirmModal] = useState(false);

  // Fetch proposal data từ API
  const { data: proposal, loading, error } = useReplacementProposal(id);
  const { updateStatus } = useUpdateReplacementProposalStatus();

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
          href="/qtv-khoa/duyet-to-trinh"
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
          href="/qtv-khoa/duyet-to-trinh"
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
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800 border-lime-200";
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Đã lập tờ trình";
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Khoa đã duyệt tờ trình";
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Ban giám hiệu đã duyệt tờ trình";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Đã từ chối tờ trình";
      default:
        return status;
    }
  };

  const handleConfirmAction = async () => {
    if (!proposal) return;

    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      await updateStatus(proposal.id, {
        status:
          actionType === "approve"
            ? ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH
            : ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
      });

      setIsProcessing(false);
      setActionType(null);
      setAdminNotes("");

      // Hiển thị thông báo thành công
      if (actionType === "reject") {
        Modal.success({
          title: "Từ chối tờ trình thành công",
          content: `Tờ trình ${proposal.proposalCode} đã được từ chối thành công. Tổ trưởng kỹ thuật cần lập lại tờ trình.`,
          okText: "Đóng",
          onOk: () => {
            router.push("/qtv-khoa/duyet-to-trinh?success=rejected");
          },
        });
      } else {
        router.push(
          "/qtv-khoa/duyet-to-trinh?success=" +
            (actionType === "approve" ? "approved" : "rejected")
        );
      }
    } catch (error) {
      console.error("Error processing proposal:", error);
      setIsProcessing(false);

      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi xử lý tờ trình. Vui lòng thử lại.",
        okText: "Đóng",
      });
    }
  };

  const handleSignConfirm = async () => {
    if (!proposal) return;

    setIsProcessing(true);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH,
      });

      setIsProcessing(false);
      setShowSignConfirmModal(false);

      // Hiển thị thông báo thành công và chuyển hướng
      Modal.success({
        title: "Duyệt tờ trình thành công!",
        content: `Tờ trình ${proposal.proposalCode} đã được quản trị viên khoa phê duyệt và chuyển tới Ban giám hiệu.`,
        okText: "Đóng",
        onOk: () => {
          router.push("/qtv-khoa/duyet-to-trinh?success=approved");
        },
      });
    } catch (error) {
      console.error("Error approving proposal:", error);
      setIsProcessing(false);
      setShowSignConfirmModal(false);

      Modal.error({
        title: "Lỗi",
        content: "Có lỗi xảy ra khi duyệt tờ trình. Vui lòng thử lại.",
        okText: "Đóng",
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
              href: "/qtv-khoa",
              title: (
                <div className="flex items-center">
                  <span>Quản trị viên khoa</span>
                </div>
              ),
            },
            {
              href: "/qtv-khoa/duyet-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Duyệt tờ trình</span>
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
              {proposal.status ===
                ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH && (
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
                    onClick={() => setShowSignConfirmModal(true)}
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
                          <div className="shrink-0">
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
                        <p className="text-sm text-gray-900 max-w-xs wrap-break-word">
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {proposal.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tờ trình đề xuất
                      </p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={proposal.submissionFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={proposal.submissionFormUrl}
                      download
                      className="text-gray-600 hover:text-gray-900"
                      title="Tải xuống">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Chỉ cho từ chối */}
      {showConfirmModal && actionType === "reject" && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-2 px-4 py-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận từ chối tờ trình
                </h3>
                <div className="mt-2 px-2 py-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn từ chối tờ trình
                    <strong> {proposal.proposalCode}</strong>?
                  </p>
                  <p className="text-xs text-red-500 mt-2">
                    Sau khi từ chối, tổ trưởng kỹ thuật sẽ cần lập lại tờ trình.
                  </p>
                  {adminNotes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-left">
                      <p className="text-xs text-gray-600">Ghi chú:</p>
                      <p className="text-sm text-gray-800">{adminNotes}</p>
                    </div>
                  )}
                </div>
                <div className="items-center px-4 py-3 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600">
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 text-white text-base font-medium rounded-md shadow-sm bg-red-600 hover:bg-red-700">
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SignConfirmModal cho duyệt tờ trình */}
      <SignConfirmModal
        isOpen={showSignConfirmModal}
        onClose={() => setShowSignConfirmModal(false)}
        onConfirm={handleSignConfirm}
        reportTitle={proposal.title || "Tờ trình thay thế"}
        reportNumber={proposal.proposalCode}
        isLoading={isProcessing}
        actionType="approve"
        customWarning="Sau khi duyệt, trạng thái tờ trình sẽ được chuyển thành 'Khoa đã duyệt tờ trình' và chuyển tới Ban giám hiệu để phê duyệt cuối cùng. Không thể hoàn tác."
      />
    </div>
  );
}
