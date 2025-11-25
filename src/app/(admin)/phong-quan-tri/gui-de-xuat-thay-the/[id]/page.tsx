"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Button,
  Tag,
  Typography,
  Descriptions,
  Timeline,
  message,
  Breadcrumb,
} from "antd";
import {
  CheckCircle,
  FileText,
  Download,
  PlaneLanding,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SignConfirmModal } from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import { ReplacementProposalStatus } from "@/types";

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

  // Xử lý mở modal xác nhận gửi đề xuất
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowConfirmModal(false);
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

  // Tạo timeline dựa trên trạng thái hiện tại
  const getTimelineItems = () => {
    if (!proposal) return [];

    const items = [
      {
        color: "green",
        children: (
          <div>
            <p className="font-medium">Tạo đề xuất</p>
            <p className="text-sm text-gray-500">
              {new Date(proposal.createdAt).toLocaleString("vi-VN")}
            </p>
            <p className="text-sm">
              Bởi: {proposal.proposer?.fullName || "Không xác định"}
            </p>
          </div>
        ),
      },
    ];

    const statusOrder = [
      ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
      ReplacementProposalStatus.ĐÃ_DUYỆT,
      ReplacementProposalStatus.CHỜ_XÁC_MINH,
      ReplacementProposalStatus.ĐÃ_XÁC_MINH,
      ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN,
      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
      ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    ];

    const currentStatusIndex = statusOrder.indexOf(proposal.status);

    statusOrder.forEach((status, index) => {
      if (index === 0) return; // Skip CHỜ_TỔ_TRƯỞNG_DUYỆT vì đã có "Tạo đề xuất"

      const isPassed = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      const isRejected =
        proposal.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ||
        proposal.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH;

      let color = "gray";
      if (isRejected && isCurrent) {
        color = "red";
      } else if (isPassed) {
        color = "green";
      } else if (isCurrent) {
        color = "blue";
      }

      items.push({
        color,
        children: (
          <div>
            <p className="font-medium">{getStatusConfig(status).text}</p>
            {isPassed && (
              <p className="text-sm text-gray-500">
                {new Date(proposal.updatedAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        ),
      });
    });

    return items;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        Linh kiện #{index + 1}
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Loại:</strong>{" "}
                          {item.oldComponent?.componentType || "Không xác định"}
                        </p>
                        <p>
                          <strong>Linh kiện cũ:</strong>{" "}
                          {item.oldComponent?.name || "Không xác định"}
                        </p>
                        <p>
                          <strong>Linh kiện mới:</strong>{" "}
                          {item.newItemName || "Không xác định"}
                        </p>
                        <p>
                          <strong>Thông số mới:</strong>{" "}
                          {item.newItemSpecs || "Không xác định"}
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">
                        Thông tin tài sản
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Linh kiện ID:</strong>{" "}
                          {item.oldComponent?.id || "Không xác định"}
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
                    <div className="md:col-span-2">
                      <p>
                        <strong>Lý do thay thế:</strong>{" "}
                        {item.reason || "Không có lý do"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Files đính kèm */}
          <Card title="Tài liệu đính kèm">
            <div className="space-y-3">
              {proposal.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Tờ trình</p>
                      <p className="text-sm text-gray-500">
                        {proposal.submissionFormUrl.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="link"
                      icon={<Eye className="h-4 w-4" />}
                      href={proposal.submissionFormUrl}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"></Button>
                    <Button
                      type="link"
                      icon={<Download className="h-4 w-4" />}
                      href={proposal.submissionFormUrl}
                      target="_blank"
                      download></Button>
                  </div>
                </div>
              )}

              {proposal.verificationReportUrl && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Biên bản</p>
                      <p className="text-sm text-gray-500">
                        {proposal.verificationReportUrl.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="link"
                      icon={<Eye className="h-4 w-4" />}
                      href={proposal.verificationReportUrl}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"></Button>
                    <Button
                      type="link"
                      icon={<Download className="h-4 w-4" />}
                      href={proposal.verificationReportUrl}
                      target="_blank"
                      download></Button>
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

        {/* Timeline và thao tác */}
        <div className="space-y-6">
          {/* Timeline trạng thái */}
          <Card title="Tiến trình xử lý">
            <Timeline items={getTimelineItems()} />
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
    </div>
  );
}
