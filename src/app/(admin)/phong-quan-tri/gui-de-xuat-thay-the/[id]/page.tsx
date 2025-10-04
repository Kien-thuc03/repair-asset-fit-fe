"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  CheckCircle,
  FileText,
  Download,
  PlaneLanding,
} from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementRequestItem, ReplacementStatus } from "@/types/repair";
import { SignConfirmModal } from "@/components/modal";

const { Title } = Typography;

// Status mapping cho hiển thị - chỉ cho trạng thái ĐÃ_XÁC_MINH
const statusConfig = {
  [ReplacementStatus.ĐÃ_XÁC_MINH]: {
    color: "cyan",
    text: "Đã xác minh",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

// Helper function để get status config an toàn
const getStatusConfig = (status: ReplacementStatus) => {
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
  const [proposal, setProposal] = useState<ReplacementRequestItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lấy dữ liệu đề xuất theo ID
  useEffect(() => {
    const proposalId = params.id as string;
    const foundProposal = mockReplacementRequestItem.find(
      (item) => item.id === proposalId
    );

    if (foundProposal) {
      setProposal(foundProposal);
    } else {
      message.error("Không tìm thấy đề xuất!");
      router.push("/phong-quan-tri/gui-de-xuat-thay-the");
    }
  }, [params.id, router]);

  // Xử lý mở modal xác nhận gửi đề xuất
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  // Xử lý xác nhận gửi đề xuất
  const handleConfirmSend = async () => {
    if (!proposal) return;

    try {
      setIsProcessing(true);

      // Trong thực tế sẽ gọi API để cập nhật trạng thái lên ĐÃ_LẬP_TỜ_TRÌNH
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const updatedProposal = {
        ...proposal,
        status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
        updatedAt: new Date().toISOString(),
      };

      setProposal(updatedProposal);
      message.success(`Đã gửi đề xuất ${proposal.proposalCode} thành công!`);

      // Đóng modal và reset state
      handleCloseModal();
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi đề xuất!");
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
            <p className="text-sm">Bởi: {proposal.createdBy}</p>
          </div>
        ),
      },
    ];

    const statusOrder = [
      ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
      ReplacementStatus.ĐÃ_DUYỆT,
      ReplacementStatus.CHỜ_XÁC_MINH,
      ReplacementStatus.ĐÃ_XÁC_MINH,
      ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
      ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    ];

    const currentStatusIndex = statusOrder.indexOf(proposal.status);

    statusOrder.forEach((status, index) => {
      if (index === 0) return; // Skip CHỜ_TỔ_TRƯỞNG_DUYỆT vì đã có "Tạo đề xuất"

      const isPassed = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      const isRejected =
        proposal.status === ReplacementStatus.ĐÃ_TỪ_CHỐI ||
        proposal.status === ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH;

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

  if (!proposal) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: "Phòng Quản trị",
          },
          {
            title: "Gửi đề xuất thay thế",
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
          <Button
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.back()}>
            Quay lại
          </Button>
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

          {/* Hiển thị nút xử lý chỉ cho trạng thái ĐÃ_XÁC_MINH */}
          {proposal.status === ReplacementStatus.ĐÃ_XÁC_MINH && (
            <Button
              type="primary"
              onClick={handleOpenConfirmModal}
              loading={isProcessing}>
              Gửi đề xuất
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
                {proposal.createdBy}
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
              <p className="text-gray-700">{proposal.description}</p>
            </div>
          </Card>

          {/* Danh sách linh kiện */}
          <Card
            title={`Danh sách linh kiện cần thay thế (${proposal.components.length})`}>
            <div className="space-y-4">
              {proposal.components.map((component, index) => (
                <Card
                  key={component.id}
                  size="small"
                  className="border-l-4 border-l-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">
                        Linh kiện #{index + 1}
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Loại:</strong> {component.componentType}
                        </p>
                        <p>
                          <strong>Linh kiện cũ:</strong>{" "}
                          {component.componentName}
                        </p>
                        <p>
                          <strong>Linh kiện mới:</strong>{" "}
                          {component.newItemName}
                        </p>
                        <p>
                          <strong>Thông số mới:</strong>{" "}
                          {component.newItemSpecs}
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {component.quantity}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">
                        Thông tin tài sản
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Tài sản:</strong> {component.assetName}
                        </p>
                        <p>
                          <strong>Mã tài sản:</strong> {component.assetCode}
                        </p>
                        <p>
                          <strong>Vị trí:</strong> {component.buildingName} -{" "}
                          {component.roomName}
                        </p>
                        {component.machineLabel && (
                          <p>
                            <strong>Số máy:</strong> {component.machineLabel}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p>
                        <strong>Lý do thay thế:</strong> {component.reason}
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
                      <p className="font-medium">
                        Phiếu đề nghị giải quyết công việc
                      </p>
                      <p className="text-sm text-gray-500">
                        {proposal.submissionFormUrl.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="link"
                    icon={<Download className="h-4 w-4" />}
                    href={proposal.submissionFormUrl}
                    target="_blank">
                    Tải xuống
                  </Button>
                </div>
              )}

              {proposal.verificationReportUrl && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">
                        Biên bản kiểm tra tình trạng kỹ thuật
                      </p>
                      <p className="text-sm text-gray-500">
                        {proposal.verificationReportUrl.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="link"
                    icon={<Download className="h-4 w-4" />}
                    href={proposal.verificationReportUrl}
                    target="_blank">
                    Tải xuống
                  </Button>
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

      {/* Modal xác nhận gửi đề xuất */}
      <SignConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSend}
        reportTitle={proposal?.title || ""}
        reportNumber={proposal?.proposalCode || ""}
        isLoading={isProcessing}
        actionType="send"
        customTitle="Xác nhận gửi đề xuất thay thế"
        customConfirmText="Gửi đề xuất"
        customDescription="Bạn có chắc chắn muốn gửi đề xuất thay thế này lên cấp trên để phê duyệt?"
        customWarning="Sau khi gửi, đề xuất sẽ được chuyển lên Phòng Quản trị để xem xét và phê duyệt. Bạn không thể chỉnh sửa đề xuất sau khi đã gửi."
        icon={PlaneLanding}
      />
    </div>
  );
}
