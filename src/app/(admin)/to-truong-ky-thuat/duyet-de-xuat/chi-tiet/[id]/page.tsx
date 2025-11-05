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
  Spin,
} from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { SubmissionFormData } from "@/types/repair";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/lib/api/replacement-proposals";

export default function ChiTietDuyetDeXuatPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for actions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApprovalConfirmModal, setShowApprovalConfirmModal] =
    useState(false);

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

  // Debug log
  console.log("showSubmissionModal state:", showSubmissionModal);

  // Fetch proposal detail from API
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useReplacementProposal(id);

  // Update status hook
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Get replacement components for this proposal
  const replacementItems = useMemo(() => proposal?.items || [], [proposal]);

  // Transform items for table display
  const tableData = useMemo(() => {
    return replacementItems.map((item) => ({
      id: item.id,
      componentName: item.oldComponent?.name || "Chưa xác định",
      componentType: item.oldComponent?.componentType || "Chưa xác định",
      newItemName: item.newItemName || "",
      newItemSpecs: item.newItemSpecs || "",
      assetName: "N/A", // Not available in API
      assetCode: "N/A", // Not available in API
      roomName: "N/A", // Not available in API
      buildingName: "N/A", // Not available in API
      quantity: item.quantity || 1,
      reason: item.reason || "",
      machineLabel: undefined,
    }));
  }, [replacementItems]);

  // Get user names from API response
  const proposerName = useMemo(
    () => proposal?.proposer?.fullName || "Không xác định",
    [proposal?.proposer]
  );

  const teamLeadApproverName = useMemo(
    () => proposal?.teamLeadApprover?.fullName || undefined,
    [proposal?.teamLeadApprover]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
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
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!proposal) {
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
    | "ĐÃ_GỬI_BIÊN_BẢN"
    | "ĐÃ_KÝ_BIÊN_BẢN"
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
    ĐÃ_GỬI_BIÊN_BẢN: {
      color: "cyan",
      text: "Đã gửi biên bản",
      icon: CheckCircle,
    },
    ĐÃ_KÝ_BIÊN_BẢN: {
      color: "geekblue",
      text: "Đã ký biên bản",
      icon: CheckCircle,
    },
    ĐÃ_HOÀN_TẤT_MUA_SẮM: {
      color: "green",
      text: "Đã hoàn tất mua sắm",
      icon: CheckCircle,
    },
  };

  // Get current status - use updated status if available, otherwise use original proposal status
  const displayStatus = currentRequestStatus || proposal.status;
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
      width: 50,
      responsive: ["md"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Linh kiện",
      dataIndex: "componentName",
      key: "componentName",
      ellipsis: true,
      render: (text: string, record: (typeof tableData)[0]) => (
        <div className="min-w-0">
          <div className="font-medium truncate text-xs sm:text-sm">{text}</div>
          <div className="text-xs text-gray-500 truncate">
            Loại: {record.componentType}
          </div>
          {/* Show replacement item on mobile and tablet */}
          <div className="xl:hidden mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">Thay thế:</div>
            <div className="font-medium text-xs sm:text-sm truncate">
              {record.newItemName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {record.newItemSpecs}
            </div>
          </div>
          {/* Show reason on mobile */}
          <div className="xl:hidden mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">Lý do:</div>
            <div className="text-xs whitespace-pre-wrap break-words">
              {record.reason}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thay thế",
      key: "newItem",
      ellipsis: true,
      responsive: ["xl"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
      render: (record: (typeof tableData)[0]) => (
        <div className="min-w-0">
          <div className="font-medium truncate text-xs sm:text-sm">
            {record.newItemName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {record.newItemSpecs}
          </div>
        </div>
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: 50,
      render: (quantity: number) => (
        <span className="font-medium text-blue-600 text-xs sm:text-sm">
          {quantity}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      responsive: ["xl"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
      render: (reason: string) => (
        <div className="text-xs text-gray-700 whitespace-pre-wrap break-words max-w-xs">
          {reason}
        </div>
      ),
    },
  ];

  const handleApprovalConfirm = async () => {
    setShowApproveModal(false);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_DUYỆT,
      });

      // Update local status
      setCurrentRequestStatus("ĐÃ_DUYỆT");
      console.log("Proposal approved, status updated to ĐÃ_DUYỆT");

      // Refetch to get latest data
      refetch();

      // Show confirmation modal for submission form
      setShowApprovalConfirmModal(true);
    } catch (err) {
      console.error("Error approving proposal:", err);
      Modal.error({
        title: "Lỗi",
        content:
          err instanceof Error ? err.message : "Không thể duyệt đề xuất.",
        centered: true,
      });
    }
  };

  const handleCreateSubmissionForm = () => {
    console.log("handleCreateSubmissionForm called, proposal:", proposal);
    if (!proposal) {
      console.log("No proposal found, returning");
      return;
    }

    // Auto-generate content based on the proposal
    const proposerName = proposal.proposer?.fullName || "Không xác định";
    const componentsList =
      proposal.items
        ?.map(
          (item) =>
            `- ${item.oldComponent?.name || "N/A"}: ${
              item.reason
            } → Thay thế bằng ${item.newItemName} (${
              item.newItemSpecs
            }) - SL: ${item.quantity}`
        )
        .join("\n") || "";

    const autoContent = `Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.

Thông tin chi tiết về đề xuất thay thế:

${componentsList}

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin tổng hợp:
- Mã đề xuất: ${proposal.proposalCode}
- Tiêu đề: ${proposal.title || "Đề xuất thay thế linh kiện"}
- Người đề xuất: ${proposerName}
- Tổng số linh kiện cần thay: ${proposal.items?.length || 0}
- Mô tả: ${proposal.description || "Không có mô tả"}

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`;

    setSubmissionFormData((prev) => ({
      ...prev,
      content: autoContent,
      attachments: `Đề xuất ${proposal.proposalCode}`,
      submittedBy: proposerName,
    }));

    console.log("Setting showSubmissionModal to true");
    setShowSubmissionModal(true);
    console.log("showSubmissionModal should now be:", true);
  };

  const handleSubmitSubmission = async () => {
    if (!proposal) return;

    try {
      // Update proposal status to ĐÃ_LẬP_TỜ_TRÌNH
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      });

      // Update local status
      setCurrentRequestStatus("ĐÃ_LẬP_TỜ_TRÌNH");
      console.log("Status updated to ĐÃ_LẬP_TỜ_TRÌNH");

      // Close modal first
      setShowSubmissionModal(false);

      // Redirect immediately
      console.log("Redirecting to /to-truong-ky-thuat/lap-to-trinh");
      router.push("/to-truong-ky-thuat/lap-to-trinh");

      // Show success message without blocking redirect
      Modal.success({
        title: "Lập tờ trình thành công!",
        content: `Tờ trình cho đề xuất ${proposal.proposalCode} đã được tạo và gửi tới Phòng Quản trị.`,
        centered: true,
        mask: false,
        keyboard: false,
      });
    } catch (err) {
      console.error("Error creating submission:", err);
      Modal.error({
        title: "Lỗi",
        content: err instanceof Error ? err.message : "Không thể lập tờ trình.",
        centered: true,
      });
    }
  };

  const handleReject = async () => {
    console.log("Rejecting proposal:", id);
    setShowRejectModal(false);

    try {
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_TỪ_CHỐI,
      });

      // Update local status
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
    } catch (err) {
      console.error("Error rejecting proposal:", err);
      Modal.error({
        title: "Lỗi",
        content:
          err instanceof Error ? err.message : "Không thể từ chối đề xuất.",
        centered: true,
      });
    }
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
            {new Date(proposal.createdAt).toLocaleString("vi-VN")}
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
    <div className="space-y-4 sm:space-y-6">
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
            title: `Chi tiết • ${proposal.proposalCode}`,
          },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Chi tiết đề xuất • {proposal.proposalCode}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Thông tin chi tiết về đề xuất thay thế linh kiện
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {proposal.status === "ĐÃ_TỪ_CHỐI" && (
        <Alert
          message="Đề xuất đã bị từ chối"
          description="Đề xuất này đã bị từ chối bởi tổ trưởng kỹ thuật"
          type="error"
          showIcon
          className="text-xs sm:text-sm"
        />
      )}

      {proposal.status === "ĐÃ_DUYỆT" && (
        <Alert
          message="Đề xuất đã được phê duyệt"
          description="Đề xuất này đã được phê duyệt và chuyển tiếp để xử lý."
          type="success"
          showIcon
          className="text-xs sm:text-sm"
        />
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <Card title="Thông tin cơ bản" className="shadow">
            <Descriptions
              column={{ xs: 1, sm: 1, md: 2 }}
              bordered
              size="small"
              labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item
                label="Mã đề xuất"
                span={{ xs: 1, sm: 1, md: 1 }}>
                <span className="font-mono font-medium text-blue-600 text-xs sm:text-sm">
                  {proposal.proposalCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item
                label="Trạng thái"
                span={{ xs: 1, sm: 1, md: 1 }}>
                <Tag
                  color={currentStatus.color}
                  icon={<currentStatus.icon className="w-3 h-3" />}
                  className="text-xs">
                  {currentStatus.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label="Người đề xuất"
                span={{ xs: 1, sm: 1, md: 1 }}>
                <div className="font-medium text-xs sm:text-sm">
                  {proposerName}
                </div>
              </Descriptions.Item>
              <Descriptions.Item
                label="Ngày tạo"
                span={{ xs: 1, sm: 1, md: 1 }}>
                <div className="text-xs sm:text-sm">
                  {new Date(proposal.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </Descriptions.Item>
              <Descriptions.Item
                label="Số lượng linh kiện"
                span={{ xs: 1, sm: 1, md: 2 }}>
                <span className="font-medium text-blue-600 text-xs sm:text-sm">
                  {replacementItems.length} linh kiện
                </span>
              </Descriptions.Item>
              {canApproveOrReject && (
                <Descriptions.Item
                  label="Hành động"
                  span={{ xs: 1, sm: 1, md: 2 }}>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="primary"
                      icon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => setShowApproveModal(true)}
                      className="w-full sm:w-auto text-sm"
                      size="middle">
                      Phê duyệt
                    </Button>
                    <Button
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => setShowRejectModal(true)}
                      className="w-full sm:w-auto text-sm"
                      size="middle">
                      Từ chối
                    </Button>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <Card
            title={
              <span className="text-sm sm:text-base">Tiến trình xử lý</span>
            }
            className="shadow">
            <Timeline items={timelineItems} className="text-xs sm:text-sm" />
          </Card>
        </div>
      </div>

      <div>
        {/* Components List */}
        <Card
          title={
            <span className="text-sm sm:text-base">
              Danh sách linh kiện cần thay thế ({replacementItems.length})
            </span>
          }
          className="shadow">
          <Table
            dataSource={tableData}
            columns={componentColumns}
            rowKey="id"
            pagination={false}
            size="small"
            className="responsive-table"
          />
        </Card>
      </div>

      {/* Approve Modal */}
      <Modal
        title={<span className="text-sm sm:text-base">Xác nhận phê duyệt</span>}
        open={showApproveModal}
        onCancel={() => setShowApproveModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowApproveModal(false)}
            size="middle"
            className="text-xs sm:text-sm">
            Hủy
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={handleApprovalConfirm}
            size="middle"
            className="text-xs sm:text-sm">
            Phê duyệt
          </Button>,
        ]}
        centered>
        <p className="text-gray-600 text-xs sm:text-sm">
          Bạn có chắc chắn muốn phê duyệt đề xuất này không?
        </p>
      </Modal>

      {/* Approval Confirmation Modal */}
      <Modal
        title={
          <span className="text-sm sm:text-base">Phê duyệt thành công!</span>
        }
        open={showApprovalConfirmModal}
        onCancel={() => {
          setShowApprovalConfirmModal(false);
          router.push("/to-truong-ky-thuat/duyet-de-xuat");
        }}
        footer={[
          <Button
            key="no"
            onClick={() => {
              setShowApprovalConfirmModal(false);
              router.push("/to-truong-ky-thuat/duyet-de-xuat");
            }}
            size="middle"
            className="text-xs sm:text-sm">
            Không
          </Button>,
          <Button
            key="yes"
            type="primary"
            onClick={() => {
              setShowApprovalConfirmModal(false);
              handleCreateSubmissionForm();
            }}
            size="middle"
            className="text-xs sm:text-sm">
            Có - Lập tờ trình
          </Button>,
        ]}
        centered>
        <p className="text-gray-600 text-xs sm:text-sm">
          Đề xuất đã được phê duyệt. Bạn có muốn lập tờ trình ngay bây giờ
          không?
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={<span className="text-sm sm:text-base">Từ chối đề xuất</span>}
        open={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowRejectModal(false)}
            size="middle"
            className="text-xs sm:text-sm">
            Hủy
          </Button>,
          <Button
            key="reject"
            danger
            onClick={handleReject}
            size="middle"
            className="text-xs sm:text-sm">
            Từ chối
          </Button>,
        ]}
        centered>
        <p className="text-gray-600 text-xs sm:text-sm">
          Bạn có chắc chắn muốn từ chối đề xuất này không?
        </p>
      </Modal>

      {/* Modal lập tờ trình */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-sm sm:text-base">Lập tờ trình đề xuất</span>
          </div>
        }
        open={showSubmissionModal}
        onCancel={() => setShowSubmissionModal(false)}
        width="95%"
        style={{ maxWidth: "800px", top: 20 }}
        destroyOnClose={false}
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowSubmissionModal(false)}
            className="text-xs sm:text-sm"
            size="middle">
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitSubmission}
            className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
            size="middle">
            Gửi tờ trình
          </Button>,
        ]}>
        <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Người đề nghị
              </label>
              <Input
                value={submissionFormData.submittedBy}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    submittedBy: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Chức vụ
              </label>
              <Input
                value={submissionFormData.position}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Đơn vị đề nghị
              </label>
              <Input
                value={submissionFormData.department}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Đơn vị tiếp nhận
              </label>
              <Input
                value={submissionFormData.recipientDepartment}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    recipientDepartment: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Đề nghị
            </label>
            <Input
              value={submissionFormData.subject}
              onChange={(e) =>
                setSubmissionFormData((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              className="text-xs sm:text-sm"
              size="middle"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Nội dung tờ trình
            </label>
            <Input.TextArea
              rows={6}
              value={submissionFormData.content}
              onChange={(e) =>
                setSubmissionFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Nội dung chi tiết của tờ trình..."
              className="text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Văn bản kèm theo
            </label>
            <Input
              value={submissionFormData.attachments}
              onChange={(e) =>
                setSubmissionFormData((prev) => ({
                  ...prev,
                  attachments: e.target.value,
                }))
              }
              className="text-xs sm:text-sm"
              size="middle"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Giám đốc
              </label>
              <Input
                value={submissionFormData.director}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    director: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Hiệu trưởng
              </label>
              <Input
                value={submissionFormData.rector}
                onChange={(e) =>
                  setSubmissionFormData((prev) => ({
                    ...prev,
                    rector: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm"
                size="middle"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
