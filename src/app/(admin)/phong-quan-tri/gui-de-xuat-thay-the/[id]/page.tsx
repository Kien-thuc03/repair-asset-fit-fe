"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Button,
  Tag,
  Typography,
  Descriptions,
  message,
  Breadcrumb,
  Steps,
  Alert,
} from "antd";
import {
  CheckCircle,
  FileText,
  Download,
  PlaneLanding,
  Eye,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
  Package,
} from "lucide-react";
import {
  SignConfirmModal,
  SubmissionPreviewModal,
  InspectionPreviewModal,
} from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import {
  ReplacementProposalStatus,
  SubmissionFormData,
  InspectionFormData,
} from "@/types";
import { replaceComponent, getComponentById } from "@/lib/api/components";
import { getComputerDetail } from "@/lib/api/computers";
import { ReplacementItem } from "@/lib/api/replacement-proposals";
import { RefreshCw, CheckCircle2 } from "lucide-react";

const { Title } = Typography;

// Status mapping cho hiển thị các trạng thái
const statusConfig = {
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: {
    color: "cyan",
    text: "Đã xác minh",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: {
    color: "blue",
    text: "Đã ký biên bản",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: {
    color: "green",
    text: "Đã hoàn tất mua sắm",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

// Helper function để get status config an toàn
const getStatusConfig = (status: ReplacementProposalStatus) => {
  return (
    statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      text: "Không xác định",
      icon: <FileText className="h-4 w-4" />,
    }
  );
};

export default function ChiTietDeXuatThayThePage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  // Fetch proposal data from API
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useReplacementProposal(proposalId);
  const { updateStatus } = useUpdateReplacementProposalStatus();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [showInspectionPreview, setShowInspectionPreview] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Xử lý mở modal xác nhận gửi đề xuất
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  // Helper function to extract filename from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      // Decode URL encoding (e.g., %20 to space)
      return decodeURIComponent(filename);
    } catch {
      return url;
    }
  };

  // Handler để download file
  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetch the file from URL
      const response = await fetch(url);
      const blob = await response.blob();

      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  // Default form data for preview modals
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

  const defaultInspectionFormData: InspectionFormData = useMemo(
    () => ({
      requestedBy: "Khoa CNTT",
      year: new Date().getFullYear().toString(),
      inspectionDay: new Date().getDate().toString(),
      inspectionMonth: (new Date().getMonth() + 1).toString(),
      inspectionYear: new Date().getFullYear().toString(),
      location: "Phòng máy H1",
      departmentRep: "Giảng Thanh Trọn",
      departmentName: "Khoa CNTT",
      adminRep: proposal?.adminVerifier?.fullName || "",
      adminDepartment: "Phòng Quản trị",
      notes: "",
    }),
    [proposal?.adminVerifier?.fullName]
  );

  // Export handlers for downloading DOCX files
  const handleExportSubmissionDocx = () => {
    if (!proposal) return;

    try {
      // Use the same logic as in chi-tiet page
      message.info({
        content: "Chức năng xuất file đang được phát triển.",
        duration: 2,
      });
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      message.error("Không thể xuất file. Vui lòng thử lại.");
    }
  };

  const handleExportInspectionDocx = () => {
    if (!proposal) return;

    try {
      message.info({
        content: "Chức năng xuất file đang được phát triển.",
        duration: 2,
      });
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      message.error("Không thể xuất file. Vui lòng thử lại.");
    }
  };

  // Xử lý xác nhận hoàn tất mua sắm
  const handleConfirmSend = async () => {
    if (!proposal) return;

    try {
      setIsProcessing(true);

      // Gọi API để cập nhật trạng thái lên ĐÃ_HOÀN_TẤT_MUA_SẮM
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
      });

      message.success(
        `Đã cập nhật trạng thái ${proposal.proposalCode} thành công!`
      );

      // Refetch để lấy dữ liệu mới
      await refetch();

      // Đóng modal và chuyển hướng về trang danh sách
      handleCloseModal();

      // Delay chuyển hướng một chút để người dùng thấy thông báo thành công
      setTimeout(() => {
        router.push("/phong-quan-tri/gui-de-xuat-thay-the");
      }, 1500);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý cập nhật linh kiện cho một item
  const handleUpdateComponent = async (item: ReplacementItem) => {
    if (!proposal) {
      message.error("Thiếu thông tin đề xuất");
      return;
    }

    if (!item.oldComponentId) {
      message.error("Thiếu thông tin linh kiện cần thay thế");
      return;
    }

    // Kiểm tra nếu oldComponent đã bị REMOVED (đã được thay thế)
    if (item.oldComponent?.status === "REMOVED") {
      message.info("Linh kiện này đã được thay thế");
      return;
    }

    try {
      setUpdatingItemId(item.id);

      // Lấy computerId từ componentId - cách chính xác nhất
      let computerId: string | null = null;

      try {
        // Sử dụng getComponentById để lấy computerId trực tiếp từ componentId
        const componentInfo = await getComponentById(item.oldComponentId);

        if (componentInfo?.computer?.id) {
          computerId = componentInfo.computer.id;
        } else {
          throw new Error("Không tìm thấy thông tin máy tính từ linh kiện");
        }
      } catch {
        // Fallback: Thử lấy từ repairRequest nếu có
        const repairRequest = proposal.repairRequests?.[0];
        if (repairRequest) {
          const { getRepairById } = await import("@/lib/api/repairs");
          const repairDetail = await getRepairById(repairRequest.id);

          if (repairDetail?.computerAssetId) {
            // Lấy computerId từ assetId
            const computerDetail = await getComputerDetail(
              repairDetail.computerAssetId
            );
            if (computerDetail?.id) {
              computerId = computerDetail.id;
            }
          }
        }

        if (!computerId) {
          throw new Error(
            "Không thể xác định máy tính chứa linh kiện này. Vui lòng kiểm tra lại thông tin."
          );
        }
      }

      // Đảm bảo có computerId trước khi gọi API
      if (!computerId) {
        throw new Error("Không thể xác định máy tính để thay thế linh kiện");
      }

      // Gọi API thay thế linh kiện
      await replaceComponent(computerId, {
        oldComponentId: item.oldComponentId,
        newItemName: item.newItemName,
        newItemSpecs: item.newItemSpecs || "",
        notes: `Thay thế từ đề xuất ${proposal.proposalCode}: ${
          item.reason || "Không có lý do"
        }`,
      });

      message.success(
        `Đã cập nhật linh kiện "${item.newItemName}" thành công!`
      );

      // Refetch để lấy dữ liệu mới (oldComponent.status sẽ là REMOVED)
      await refetch();
    } catch (error) {
      console.error("Error updating component:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật linh kiện!";
      message.error(errorMessage);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Helper function to get status step
  const getStatusStep = (status: ReplacementProposalStatus) => {
    if (!proposal) return 0;

    // Xử lý trường hợp từ chối
    if (
      status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ||
      status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH
    ) {
      return 1; // Bước "Đã duyệt" nhưng với status error
    }

    const steps = [
      ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
      ReplacementProposalStatus.ĐÃ_DUYỆT,
      ReplacementProposalStatus.ĐÃ_XÁC_MINH,
      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    ];

    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đề xuất
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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
            title: "Danh sách mua sắm thiết bị",
            href: "/phong-quan-tri/gui-de-xuat-thay-the",
          },
          {
            title: proposal.proposalCode,
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div>
            <Title level={2} className="m-0">
              {proposal.proposalCode}
            </Title>
            <p className="text-gray-600 mt-1">{proposal.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tag
            color={getStatusConfig(proposal.status).color}
            className="flex items-center gap-1">
            {getStatusConfig(proposal.status).text}
          </Tag>

          {/* Hiển thị nút xử lý chỉ cho trạng thái ĐÃ_KÝ_BIÊN_BẢN */}
          {proposal.status === ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN && (
            <Button
              type="primary"
              onClick={handleOpenConfirmModal}
              loading={isProcessing}>
              Đã mua sắm
            </Button>
          )}
        </div>
      </div>

      {/* Timeline và thao tác */}
      <div className="space-y-6">
        {/* Status Progress */}
        <Card title="Tiến trình xử lý">
          <div className="mt-4">
            <Steps
              current={getStatusStep(proposal.status)}
              status={
                proposal.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ||
                proposal.status ===
                  ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH
                  ? "error"
                  : "process"
              }
              size="small"
              items={[
                {
                  title: "Tạo đề xuất",
                  icon: <Clock className="w-4 h-4" />,
                  description:
                    proposal.status ===
                    ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT
                      ? "Hiện tại"
                      : new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        ),
                },
                {
                  title: "Đã duyệt",
                  icon: <CheckCircle className="w-4 h-4" />,
                  description:
                    proposal.status === ReplacementProposalStatus.ĐÃ_DUYỆT ||
                    proposal.status ===
                      ReplacementProposalStatus.CHỜ_XÁC_MINH ||
                    proposal.status === ReplacementProposalStatus.ĐÃ_XÁC_MINH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                      ? new Date(proposal.updatedAt).toLocaleDateString("vi-VN")
                      : "",
                },
                {
                  title: "Đã xác minh",
                  icon: <CheckCircle className="w-4 h-4" />,
                  description:
                    proposal.status === ReplacementProposalStatus.ĐÃ_XÁC_MINH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                      ? proposal.adminVerifier
                        ? `Bởi: ${proposal.adminVerifier.fullName}`
                        : new Date(proposal.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )
                      : "",
                },
                {
                  title: "Đã ký biên bản",
                  icon: <FileText className="w-4 h-4" />,
                  description:
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH ||
                    proposal.status ===
                      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                      ? new Date(proposal.updatedAt).toLocaleDateString("vi-VN")
                      : "",
                },
                {
                  title: "Đã hoàn tất mua sắm",
                  icon: <Package className="w-4 h-4" />,
                  description:
                    proposal.status ===
                    ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                      ? new Date(proposal.updatedAt).toLocaleDateString("vi-VN")
                      : "",
                },
              ]}
            />
            {/* Status-specific alerts */}
            {(proposal.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ||
              proposal.status ===
                ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH) && (
              <Alert
                className="mt-4"
                message="Đề xuất đã bị từ chối"
                description={`Đề xuất đã bị từ chối lúc ${new Date(
                  proposal.updatedAt
                ).toLocaleString("vi-VN")}.`}
                type="error"
                icon={<XCircle />}
                showIcon
              />
            )}
            {proposal.status ===
              ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
              <Alert
                className="mt-4"
                message="Đề xuất đã hoàn thành"
                description={`Mua sắm đã được hoàn tất lúc ${new Date(
                  proposal.updatedAt
                ).toLocaleString("vi-VN")}.`}
                type="success"
                icon={<CheckCircle />}
                showIcon
              />
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <Card title="Thông tin đề xuất">
            <Descriptions column={2}>
              <Descriptions.Item label="Mã đề xuất">
                {proposal.proposalCode}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {proposal.proposer?.fullName || "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Lần cập nhật cuối">
                {new Date(proposal.updatedAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Mô tả:</h4>
              <p className="text-gray-700">
                {proposal.description || "Không có mô tả"}
              </p>
            </div>
          </Card>

          {/* Danh sách linh kiện */}
          <Card
            title={`Danh sách linh kiện cần thay thế (${
              proposal.itemsCount || 0
            })`}>
            <div className="space-y-4">
              {proposal.items?.map((item, index) => (
                <Card
                  key={item.id}
                  size="small"
                  className="border-l-4 border-l-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">
                        Linh kiện cũ #{index + 1}
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Loại:</strong>{" "}
                          {item.oldComponent?.componentType || "Không xác định"}
                        </p>
                        <p>
                          <strong>Tên linh kiện:</strong>{" "}
                          {item.oldComponent?.name || "Không xác định"}
                        </p>
                        <p>
                          <strong>Thông số:</strong>{" "}
                          {item.oldComponent?.componentSpecs ||
                            "Không xác định"}
                        </p>
                        <p>
                          <strong>Trạng thái:</strong>{" "}
                          {item.oldComponent?.status || "Không xác định"}
                        </p>
                        <p>
                          <strong>Vị trí:</strong>{" "}
                          {item.oldComponent?.roomLocation || "Chưa xác định"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">
                        Linh kiện mới
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Tên linh kiện mới:</strong>{" "}
                          {item.newItemName || "Không xác định"}
                        </p>
                        <p>
                          <strong>Thông số mới:</strong>{" "}
                          {item.newItemSpecs || "Không xác định"}
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {item.quantity || 1}
                        </p>
                        {item.newlyPurchasedComponentId && (
                          <p>
                            <strong>ID linh kiện đã mua:</strong>{" "}
                            <span className="font-mono text-xs">
                              {item.newlyPurchasedComponentId}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm">
                        <strong>Lý do thay thế:</strong>{" "}
                        {item.reason || "Không có lý do"}
                      </p>
                    </div>
                    {/* Nút cập nhật linh kiện - chỉ hiển thị khi status là ĐÃ_HOÀN_TẤT_MUA_SẮM */}
                    {proposal.status ===
                      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM && (
                      <div className="md:col-span-2 flex justify-end pt-2 border-t">
                        {item.oldComponent?.status === "REMOVED" ? (
                          <Button
                            type="default"
                            icon={<CheckCircle2 className="w-4 h-4" />}
                            disabled
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                            Đã cập nhật
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            icon={<RefreshCw className="w-4 h-4" />}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUpdateComponent(item);
                            }}
                            loading={updatingItemId === item.id}
                            disabled={
                              !item.oldComponentId ||
                              item.oldComponent?.status === "REMOVED" ||
                              (updatingItemId !== null &&
                                updatingItemId !== item.id)
                            }>
                            {updatingItemId === item.id
                              ? "Đang cập nhật..."
                              : "Cập nhật linh kiện"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Files đính kèm */}
          <Card title="Tài liệu đính kèm">
            <div className="space-y-3">
              {proposal.submissionFormUrl && (
                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-blue-600">Tờ trình</p>
                        <p className="text-sm text-blue-500 truncate">
                          {getFileNameFromUrl(proposal.submissionFormUrl)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleDownload(
                            proposal.submissionFormUrl!,
                            getFileNameFromUrl(proposal.submissionFormUrl!)
                          )
                        }
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Tải xuống">
                        <Download className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setShowSubmissionPreview(true)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Xem trước">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {proposal.verificationReportUrl && (
                <div className="bg-green-50 px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-600">Biên bản</p>
                        <p className="text-sm text-green-500 truncate">
                          {getFileNameFromUrl(proposal.verificationReportUrl)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          handleDownload(
                            proposal.verificationReportUrl!,
                            getFileNameFromUrl(proposal.verificationReportUrl!)
                          )
                        }
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Tải xuống">
                        <Download className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => setShowInspectionPreview(true)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Xem trước">
                        <Eye className="h-4 w-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!proposal.submissionFormUrl &&
                !proposal.verificationReportUrl && (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có tài liệu đính kèm
                  </p>
                )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal xác nhận hoàn tất mua sắm */}
      <SignConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSend}
        reportTitle={proposal?.title || ""}
        reportNumber={proposal?.proposalCode || ""}
        isLoading={isProcessing}
        actionType="send"
        customTitle="Xác nhận hoàn tất mua sắm"
        customConfirmText="Xác nhận đã mua sắm"
        customDescription="Bạn có chắc chắn muốn xác nhận đã hoàn tất mua sắm cho đề xuất thay thế này?"
        customWarning="Sau khi xác nhận, trạng thái đề xuất sẽ được cập nhật thành ĐÃ HOÀN TẤT MUA SẮM và bạn sẽ được chuyển về trang danh sách."
        icon={PlaneLanding}
      />

      {/* Preview Modals */}
      <SubmissionPreviewModal
        isOpen={showSubmissionPreview}
        onClose={() => setShowSubmissionPreview(false)}
        formData={defaultSubmissionFormData}
        proposal={proposal}
        onExport={handleExportSubmissionDocx}
        onSubmit={() => {}}
        showSubmitButton={false}
      />

      <InspectionPreviewModal
        isOpen={showInspectionPreview}
        onClose={() => setShowInspectionPreview(false)}
        formData={defaultInspectionFormData}
        proposal={proposal}
        onExport={handleExportInspectionDocx}
        onSubmit={() => {}}
        showSubmitButton={false}
      />
    </div>
  );
}
