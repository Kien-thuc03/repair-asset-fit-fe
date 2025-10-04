"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Card,
  Tag,
  Descriptions,
  Button,
  Timeline,
  Alert,
  Table,
  Modal,
  Input,
} from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { mockReplacementRequestItem, users } from "@/lib/mockData";
import { ComponentFromRequest, SubmissionFormData } from "@/types/repair";

export default function ChiTietDuyetDeXuatPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for actions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // State for request status updates
  const [currentRequestStatus, setCurrentRequestStatus] = useState<string>("");

  // State for submission flow
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionFormData, setSubmissionFormData] =
    useState<SubmissionFormData>({
      submittedBy: "Giảng Thanh Trọn",
      position: "Tổ trưởng kỹ thuật",
      department: "Khoa Công Nghệ Thông Tin",
      recipientDepartment: "Phòng Quản trị",
      subject: "Đề xuất thay thế linh kiện thiết bị",
      content: "",
      attachments: "",
      director: "TS. Lê Nhất Duy",
      rector: "TS. Phan Hồng Hải",
    });

  const request = useMemo(
    () => mockReplacementRequestItem.find((r) => r.id === id),
    [id]
  );

  // Get replacement components for this proposal
  const replacementItems = useMemo(() => request?.components || [], [request]);

  // Get user names
  const proposerName = useMemo(
    () =>
      users.find((u) => u.id === request?.proposerId)?.fullName ||
      "Không xác định",
    [request?.proposerId]
  );

  const teamLeadApproverName = useMemo(
    () =>
      request?.teamLeadApproverId
        ? users.find((u) => u.id === request.teamLeadApproverId)?.fullName ||
          "Không xác định"
        : undefined,
    [request?.teamLeadApproverId]
  );

  if (!request) {
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { href: "/to-truong-ky-thuat", title: "Trang chủ" },
            {
              href: "/to-truong-ky-thuat/duyet-de-xuat",
              title: "Duyệt đề xuất",
            },
            { title: "Chi tiết" },
          ]}
        />
        <h1 className="text-2xl font-bold text-gray-900">
          Không tìm thấy đề xuất
        </h1>
      </div>
    );
  }

  // Define the possible statuses as a union type
  type ReplacementStatusType =
    | "CHỜ_TỔ_TRƯỞNG_DUYỆT"
    | "CHỜ_XÁC_MINH"
    | "ĐÃ_DUYỆT"
    | "ĐÃ_TỪ_CHỐI"
    | "ĐÃ_XÁC_MINH"
    | "ĐÃ_LẬP_TỜ_TRÌNH"
    | "ĐÃ_DUYỆT_TỜ_TRÌNH"
    | "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH"
    | "ĐÃ_HOÀN_TẤT_MUA_SẮM";

  // Status configuration
  const statusConfig: Record<
    ReplacementStatusType,
    {
      color: string;
      text: string;
      icon: React.ElementType;
    }
  > = {
    CHỜ_TỔ_TRƯỞNG_DUYỆT: {
      color: "orange",
      text: "Chờ tổ trưởng duyệt",
      icon: Clock,
    },
    CHỜ_XÁC_MINH: {
      color: "blue",
      text: "Chờ xác minh",
      icon: AlertTriangle,
    },
    ĐÃ_DUYỆT: {
      color: "green",
      text: "Đã duyệt",
      icon: CheckCircle,
    },
    ĐÃ_TỪ_CHỐI: {
      color: "red",
      text: "Đã từ chối",
      icon: XCircle,
    },
    ĐÃ_XÁC_MINH: {
      color: "purple",
      text: "Đã xác minh",
      icon: CheckCircle,
    },
    ĐÃ_LẬP_TỜ_TRÌNH: {
      color: "geekblue",
      text: "Đã lập tờ trình",
      icon: CheckCircle,
    },
    ĐÃ_DUYỆT_TỜ_TRÌNH: {
      color: "lime",
      text: "Đã duyệt tờ trình",
      icon: CheckCircle,
    },
    ĐÃ_TỪ_CHỐI_TỜ_TRÌNH: {
      color: "volcano",
      text: "Đã từ chối tờ trình",
      icon: XCircle,
    },
    ĐÃ_HOÀN_TẤT_MUA_SẮM: {
      color: "green",
      text: "Đã hoàn tất mua sắm",
      icon: CheckCircle,
    },
  };

  // Get current status - use updated status if available, otherwise use original request status
  const displayStatus = currentRequestStatus || request.status;
  const currentStatus = statusConfig[
    displayStatus as ReplacementStatusType
  ] || {
    color: "default",
    text: displayStatus,
    icon: Clock,
  };

  // Component columns configuration
  const componentColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên linh kiện hiện tại",
      dataIndex: "componentName",
      key: "componentName",
      render: (text: string, record: ComponentFromRequest) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">
            Loại: {record.componentType}
          </div>
        </div>
      ),
    },
    {
      title: "Linh kiện thay thế",
      key: "newItem",
      render: (record: ComponentFromRequest) => (
        <div>
          <div className="font-medium">{record.newItemName}</div>
          <div className="text-sm text-gray-500">{record.newItemSpecs}</div>
        </div>
      ),
    },
    {
      title: "Tài sản",
      key: "asset",
      render: (record: ComponentFromRequest) => (
        <div>
          <div className="font-medium">{record.assetName}</div>
          <div className="text-sm text-gray-500">Mã: {record.assetCode}</div>
          {record.machineLabel && (
            <div className="text-sm text-blue-600">
              Máy số: {record.machineLabel}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Vị trí",
      key: "location",
      render: (record: ComponentFromRequest) => (
        <div>
          <div className="font-medium">{record.roomName}</div>
          <div className="text-sm text-gray-500">{record.buildingName}</div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: 100,
      render: (quantity: number) => (
        <span className="font-medium text-blue-600">{quantity}</span>
      ),
    },
    {
      title: "Lý do thay thế",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        <div className="text-sm text-gray-700">{reason}</div>
      ),
    },
  ];

  const handleApprovalConfirm = () => {
    setShowApproveModal(false);
    // Update status to ĐÃ_DUYỆT
    setCurrentRequestStatus("ĐÃ_DUYỆT");
    console.log("Request approved, status updated to ĐÃ_DUYỆT");

    // Show success message and ask about creating submission form
    Modal.confirm({
      title: "Phê duyệt thành công!",
      content:
        "Đề xuất đã được phê duyệt. Bạn có muốn lập tờ trình ngay bây giờ không?",
      okText: "Có",
      cancelText: "Không",
      centered: true,
      onOk: () => {
        handleCreateSubmissionForm();
      },
      onCancel: () => {
        router.push("/to-truong-ky-thuat/duyet-de-xuat");
      },
    });
  };

  const handleCreateSubmissionForm = () => {
    if (!request) return;

    // Auto-generate content based on the request
    const proposer = users.find((u) => u.id === request.proposerId);
    const componentsList = request.components
      .map(
        (comp) =>
          `- ${comp.componentName} (${comp.assetCode}) tại ${comp.roomName}: ${comp.reason} → Thay thế bằng ${comp.newItemName} (${comp.newItemSpecs})`
      )
      .join("\n");

    const locations = [
      ...new Set(
        request.components.map((c) => `${c.buildingName} - ${c.roomName}`)
      ),
    ].join(", ");

    const autoContent = `Phòng Lab ${locations} của Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.

Thông tin chi tiết về đề xuất thay thế:

${componentsList}

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin tổng hợp:
- Mã đề xuất: ${request.proposalCode}
- Tiêu đề: ${request.title}
- Người đề xuất: ${proposer?.fullName || "Không xác định"}
- Tổng số linh kiện cần thay: ${request.components.length}
- Lý do chung: ${[...new Set(request.components.map((c) => c.reason))].join(
      "; "
    )}

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`;

    setSubmissionFormData((prev) => ({
      ...prev,
      content: autoContent,
      attachments: `Đề xuất ${request.proposalCode}`,
      submittedBy: proposer?.fullName || "Giảng Thanh Trọn",
    }));

    setShowSubmissionModal(true);
  };

  const handleSubmitSubmission = () => {
    if (!request) return;

    // Simulate submission form creation
    console.log("Creating submission form:", {
      requestId: request.id,
      proposalCode: request.proposalCode,
      submissionFormData,
      createdAt: new Date().toISOString(),
    });

    // Update request status to ĐÃ_LẬP_TỜ_TRÌNH
    setCurrentRequestStatus("ĐÃ_LẬP_TỜ_TRÌNH");
    console.log("Status updated to ĐÃ_LẬP_TỜ_TRÌNH");

    // Close modal and reset state
    setShowSubmissionModal(false);

    // Show success message
    Modal.success({
      title: "Lập tờ trình thành công!",
      content: `Tờ trình cho đề xuất ${request.proposalCode} đã được tạo và gửi tới Phòng Quản trị.`,
      centered: true,
      onOk: () => {
        router.push("/to-truong-ky-thuat/duyet-de-xuat");
      },
    });
  };

  const handleReject = () => {
    console.log("Rejecting request:", id);
    setShowRejectModal(false);

    // Update status to ĐÃ_TỪ_CHỐI
    setCurrentRequestStatus("ĐÃ_TỪ_CHỐI");
    console.log("Status updated to ĐÃ_TỪ_CHỐI");

    // Show success message and redirect
    Modal.success({
      title: "Từ chối thành công!",
      content: "Đề xuất đã được từ chối.",
      centered: true,
      onOk: () => {
        router.push("/to-truong-ky-thuat/duyet-de-xuat");
      },
    });
  };

  const canApproveOrReject =
    displayStatus === "CHỜ_TỔ_TRƯỞNG_DUYỆT" || displayStatus === "CHỜ_XÁC_MINH";

  // Timeline items
  const timelineItems = [
    {
      color: "blue",
      children: (
        <div>
          <p className="font-medium">Tạo đề xuất thay thế</p>
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      ),
    },
    ...(displayStatus !== "CHỜ_TỔ_TRƯỞNG_DUYỆT"
      ? [
          {
            color: displayStatus === "ĐÃ_TỪ_CHỐI" ? "red" : "green",
            children: (
              <div>
                <p className="font-medium">
                  {displayStatus === "ĐÃ_TỪ_CHỐI"
                    ? "Từ chối đề xuất"
                    : "Chấp thuận đề xuất"}
                </p>
                <p className="text-sm text-gray-500">
                  {teamLeadApproverName &&
                    `Người duyệt: ${teamLeadApproverName}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleString("vi-VN")}
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(displayStatus === "ĐÃ_DUYỆT"
      ? [
          {
            color: "green",
            children: (
              <div>
                <p className="font-medium">Hoàn tất duyệt đề xuất</p>
                <p className="text-sm text-gray-500">
                  Đề xuất đã được phê duyệt và chuyển đi xử lý
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(displayStatus === "ĐÃ_LẬP_TỜ_TRÌNH"
      ? [
          {
            color: "blue",
            children: (
              <div>
                <p className="font-medium">Đã lập tờ trình</p>
                <p className="text-sm text-gray-500">
                  Tờ trình đã được tạo và gửi tới Phòng Quản trị
                </p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleString("vi-VN")}
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/to-truong-ky-thuat",
            title: "Trang chủ",
          },
          {
            href: "/to-truong-ky-thuat/duyet-de-xuat",
            title: (
              <div className="flex items-center gap-1">
                <span>Duyệt đề xuất thay thế linh kiện</span>
              </div>
            ),
          },
          {
            title: `Chi tiết • ${request.proposalCode}`,
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Chi tiết đề xuất • {request.proposalCode}
          </h1>
          <p className="mt-2 text-gray-600">
            Thông tin chi tiết về đề xuất thay thế linh kiện
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {request.status === "ĐÃ_TỪ_CHỐI" && (
        <Alert
          message="Đề xuất đã bị từ chối"
          description="Đề xuất này đã bị từ chối bởi tổ trưởng kỹ thuật"
          type="error"
          showIcon
        />
      )}

      {request.status === "ĐÃ_DUYỆT" && (
        <Alert
          message="Đề xuất đã được phê duyệt"
          description="Đề xuất này đã được phê duyệt và chuyển tiếp để xử lý."
          type="success"
          showIcon
        />
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Thông tin cơ bản" className="shadow">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã đề xuất" span={1}>
                <span className="font-mono font-medium text-blue-600">
                  {request.proposalCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={currentStatus.color}
                  icon={<currentStatus.icon className="w-3 h-3" />}>
                  {currentStatus.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người đề xuất" span={1}>
                <div className="font-medium">{proposerName}</div>
              </Descriptions.Item>
              {canApproveOrReject ? (
                <Descriptions.Item label="Hành động">
                  <div className="flex space-x-3">
                    <Button
                      type="primary"
                      icon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => setShowApproveModal(true)}>
                      Phê duyệt
                    </Button>
                    <Button
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => setShowRejectModal(true)}>
                      Từ chối
                    </Button>
                  </div>
                </Descriptions.Item>
              ) : (
                <Descriptions.Item label="Ngày tạo" span={1}>
                  <div>
                    {new Date(request.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Descriptions.Item>
              )}
              {canApproveOrReject && (
                <Descriptions.Item label="Ngày tạo" span={2}>
                  <div>
                    {new Date(request.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Số lượng linh kiện" span={2}>
                <span className="font-medium text-blue-600">
                  {replacementItems.length} linh kiện
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Components List */}
          <Card
            title={`Danh sách linh kiện cần thay thế (${replacementItems.length})`}
            className="shadow">
            <Table
              dataSource={replacementItems}
              columns={componentColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <Card title="Tiến trình xử lý" className="shadow">
            <Timeline items={timelineItems} />
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        title="Xác nhận phê duyệt"
        open={showApproveModal}
        onCancel={() => setShowApproveModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowApproveModal(false)}>
            Hủy
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprovalConfirm}>
            Phê duyệt
          </Button>,
        ]}
        centered>
        <p className="text-gray-600">
          Bạn có chắc chắn muốn phê duyệt đề xuất này không?
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối đề xuất"
        open={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowRejectModal(false)}>
            Hủy
          </Button>,
          <Button key="reject" danger onClick={handleReject}>
            Từ chối
          </Button>,
        ]}
        centered>
        <p className="text-gray-600">
          Bạn có chắc chắn muốn từ chối đề xuất này không?
        </p>
      </Modal>

      {/* Submission Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Lập tờ trình</span>
          </div>
        }
        open={showSubmissionModal}
        onCancel={() => setShowSubmissionModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSubmissionModal(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitSubmission}>
            Lập tờ trình
          </Button>,
        ]}
        width={600}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <Input
              value={submissionFormData.subject}
              onChange={(e) =>
                setSubmissionFormData({
                  ...submissionFormData,
                  subject: e.target.value,
                })
              }
              placeholder="Nhập tiêu đề tờ trình"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung
            </label>
            <Input.TextArea
              value={submissionFormData.content}
              onChange={(e) =>
                setSubmissionFormData({
                  ...submissionFormData,
                  content: e.target.value,
                })
              }
              placeholder="Nhập nội dung tờ trình"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tài liệu đính kèm
            </label>
            <Input.TextArea
              value={submissionFormData.attachments}
              onChange={(e) =>
                setSubmissionFormData({
                  ...submissionFormData,
                  attachments: e.target.value,
                })
              }
              placeholder="Mô tả tài liệu đính kèm (nếu có)"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
