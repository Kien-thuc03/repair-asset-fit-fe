"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  Card,
  Tag,
  Descriptions,
  Button,
  Timeline,
  Alert,
  Table,
} from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { mockReplacementRequestItem, users } from "@/lib/mockData";
import { ComponentFromRequest } from "@/types/repair";

export default function ChiTietDuyetDeXuatPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for actions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
        ? users.find((u) => u.id === request.teamLeadApproverId)
            ?.fullName || "Không xác định"
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

  const currentStatus = statusConfig[request.status as ReplacementStatusType] || {
    color: "default",
    text: request.status,
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

  const handleApprove = () => {
    console.log("Approving request:", id);
    setShowApproveModal(false);
    // Implement approval logic here
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    console.log("Rejecting request:", id, "Reason:", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    // Implement rejection logic here
  };

  const canApproveOrReject =
    request.status === "CHỜ_TỔ_TRƯỞNG_DUYỆT" ||
    request.status === "CHỜ_XÁC_MINH";

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
    ...(request.status !== "CHỜ_TỔ_TRƯỞNG_DUYỆT"
      ? [
          {
            color: request.status === "ĐÃ_TỪ_CHỐI" ? "red" : "green",
            children: (
              <div>
                <p className="font-medium">
                  {request.status === "ĐÃ_TỪ_CHỐI"
                    ? "Từ chối đề xuất"
                    : "Chấp thuận đề xuất"}
                </p>
                <p className="text-sm text-gray-500">
                  {teamLeadApproverName &&
                    `Người duyệt: ${teamLeadApproverName}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(request.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(request.status === "ĐÃ_DUYỆT"
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
      {canApproveOrReject && (
        <Card className="shadow">
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
        </Card>
      )}

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
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận phê duyệt
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn phê duyệt đề xuất này không?
            </p>
            <div className="flex space-x-3">
              <Button type="primary" onClick={handleApprove} className="flex-1">
                Phê duyệt
              </Button>
              <Button
                onClick={() => setShowApproveModal(false)}
                className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Từ chối đề xuất
            </h3>
            <p className="text-gray-600 mb-4">Vui lòng nhập lý do từ chối:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="w-full p-3 border border-gray-300 rounded-md mb-6 h-24 resize-none"
            />
            <div className="flex space-x-3">
              <Button danger onClick={handleReject} className="flex-1">
                Từ chối
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
