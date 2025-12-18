"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Card,
  Tag,
  Button,
  Alert,
  Table,
  Modal,
  Spin,
  Timeline,
} from "antd";
import { Clock, CheckCircle, XCircle, FileText, Package } from "lucide-react";
import { getReplacementProposalStatusConfig } from "@/lib/constants/replacement-proposal-status";
import { SubmissionFormData } from "@/types/repair";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/types";
import {
  SubmissionFormModal,
  SubmissionPreviewModal,
} from "@/components/modal";
import {
  exportSubmissionDocx,
  generateSubmissionDocBlob,
} from "@/components/common";
import { uploadFile } from "@/lib/api/upload";

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
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Team Lead Approver ID - Tổ trưởng kỹ thuật
  const TEAM_LEAD_APPROVER_ID = "e30e5ae1-eed1-42f9-82ba-090a4ee27837";

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
      ktCode: "N/A", // Not available in API
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

  // Get current status - use updated status if available, otherwise use original proposal status
  const displayStatus = currentRequestStatus || proposal.status;
  const currentStatus = getReplacementProposalStatusConfig(
    displayStatus as ReplacementProposalStatus
  ) || {
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
      // CHỜ_TỔ_TRƯỞNG_DUYỆT → ĐÃ_DUYỆT
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

    // Guard: Nếu modal đã mở, không mở lại
    if (showSubmissionModal) {
      console.log("Submission modal already open, skipping...");
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
      // submittedBy luôn là "Giảng Thanh Trọn" (Tổ trưởng kỹ thuật), không thay đổi
    }));

    console.log("Setting showSubmissionModal to true");
    setShowSubmissionModal(true);
    console.log("showSubmissionModal should now be:", true);
  };

  const handleSubmitSubmission = async () => {
    if (!proposal) return;

    setIsSubmitting(true);
    try {
      // 1. Tạo file DOCX từ helper common
      const blob = await generateSubmissionDocBlob(submissionFormData);
      const fileName = `To_trinh_${proposal.proposalCode}_${
        new Date().toISOString().split("T")[0]
      }.docx`;
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 2. Upload file lên Cloudinary
      Modal.info({
        title: "Đang xử lý...",
        content: "Đang tải file tờ trình lên server...",
        centered: true,
      });

      const uploadResult = await uploadFile(file, "submissions");

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Upload file thất bại");
      }

      console.log("✅ File uploaded successfully:", {
        url: uploadResult.url,
        proposalId: proposal.id,
        proposalCode: proposal.proposalCode,
      });

      // Validate URL
      if (!uploadResult.url || uploadResult.url.trim() === "") {
        throw new Error("URL file tờ trình không hợp lệ");
      }

      // 3. Cập nhật trạng thái với URL file và teamLeadApproverId
      const updateData = {
        status: ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH,
        submissionFormUrl: uploadResult.url.trim(),
        teamLeadApproverId: TEAM_LEAD_APPROVER_ID,
      };

      console.log("📤 Sending update request with data:", {
        ...updateData,
        submissionFormUrl:
          updateData.submissionFormUrl.substring(0, 100) + "...", // Log một phần URL để debug
      });

      const updatedProposal = await updateStatus(proposal.id, updateData);

      // Verify that submissionFormUrl was saved
      if (updatedProposal.submissionFormUrl) {
        console.log(
          "✅ submissionFormUrl saved successfully:",
          updatedProposal.submissionFormUrl.substring(0, 100) + "..."
        );
      } else {
        console.warn(
          "⚠️ Warning: submissionFormUrl not found in response:",
          updatedProposal
        );
      }

      console.log(
        "✅ Status updated successfully with submissionFormUrl:",
        uploadResult.url
      );

      // Update local status
      setCurrentRequestStatus("ĐÃ_LẬP_TỜ_TRÌNH");
      console.log("Status updated to ĐÃ_LẬP_TỜ_TRÌNH");

      // Refetch để lấy dữ liệu mới nhất (bao gồm submissionFormUrl)
      await refetch();
      console.log("✅ Data refetched after status update");

      // Close modal and reset state
      setShowSubmissionModal(false);
      setShowSubmissionPreview(false);

      // Show success message
      Modal.success({
        title: "Lập tờ trình thành công!",
        content: `Tờ trình cho đề xuất ${proposal.proposalCode} đã được tạo và gửi tới Phòng Quản trị.`,
        centered: true,
        mask: false,
        keyboard: false,
        onOk: () => {
          // Redirect sau khi đóng modal
          router.push("/to-truong-ky-thuat/lap-to-trinh");
        },
      });
    } catch (err) {
      console.error("Error creating submission:", err);
      Modal.error({
        title: "Lỗi",
        content: err instanceof Error ? err.message : "Không thể lập tờ trình.",
        centered: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xuất file DOCX cho tờ trình (sử dụng helper common)
  const handleExportSubmissionDocx = async () => {
    if (!proposal) return;

    try {
      await exportSubmissionDocx(submissionFormData, proposal.proposalCode);
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

  const handleReject = async () => {
    console.log("Rejecting proposal:", id);
    setShowRejectModal(false);

    try {
      // CHỜ_TỔ_TRƯỞNG_DUYỆT → ĐÃ_TỪ_CHỐI
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

  // Only show action buttons for CHỜ_TỔ_TRƯỞNG_DUYỆT status
  const canApproveOrReject = displayStatus === "CHỜ_TỔ_TRƯỞNG_DUYỆT";
  // Show "Lập tờ trình" button for ĐÃ_DUYỆT status
  const canCreateSubmission = displayStatus === "ĐÃ_DUYỆT";

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

      {/* Main layout - 3 columns (2 for info, 1 for timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Info */}
          <Card title="Thông tin chi tiết" className="shadow">
            <Table
              dataSource={[
                {
                  key: "1",
                  field: "Mã đề xuất",
                  value: (
                    <span className="font-mono font-medium text-blue-600 text-xs sm:text-sm">
                      {proposal.proposalCode}
                    </span>
                  ),
                },
                {
                  key: "2",
                  field: "Tiêu đề",
                  value: (
                    <div className="font-medium text-xs sm:text-sm text-gray-900">
                      {proposal.title || "Không có tiêu đề"}
                    </div>
                  ),
                },
                {
                  key: "3",
                  field: "Trạng thái",
                  value: (
                    <Tag
                      color={currentStatus.color}
                      className="text-xs inline-flex items-center gap-1">
                      {currentStatus.text}
                    </Tag>
                  ),
                },
                {
                  key: "4",
                  field: "Người đề xuất",
                  value: (
                    <div className="font-medium text-xs sm:text-sm">
                      {proposerName}
                    </div>
                  ),
                },
                {
                  key: "5",
                  field: "Ngày tạo",
                  value: (
                    <div className="text-xs sm:text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  ),
                },
                {
                  key: "6",
                  field: "Ngày cập nhật",
                  value: (
                    <div className="text-xs sm:text-sm">
                      {new Date(proposal.updatedAt).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  ),
                },
                {
                  key: "7",
                  field: "Số lượng linh kiện",
                  value: (
                    <span className="font-medium text-blue-600 text-xs sm:text-sm">
                      {replacementItems.length} linh kiện
                    </span>
                  ),
                },
                {
                  key: "8",
                  field: "Tổng số lượng",
                  value: (
                    <span className="font-medium text-green-600 text-xs sm:text-sm">
                      {replacementItems.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                      )}{" "}
                      sản phẩm
                    </span>
                  ),
                },
                ...(proposal.description
                  ? [
                      {
                        key: "9",
                        field: "Mô tả",
                        value: (
                          <div className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap max-w-md">
                            {proposal.description}
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(teamLeadApproverName &&
                (displayStatus === "ĐÃ_DUYỆT" ||
                  displayStatus === "ĐÃ_LẬP_TỜ_TRÌNH" ||
                  displayStatus === "ĐÃ_TỪ_CHỐI")
                  ? [
                      {
                        key: "10",
                        field: "Người duyệt",
                        value: (
                          <div className="font-medium text-xs sm:text-sm text-green-700">
                            {teamLeadApproverName}
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(proposal.repairRequests &&
                proposal.repairRequests.length > 0
                  ? [
                      {
                        key: "11",
                        field: "YCSC liên quan",
                        value: (
                          <div className="flex flex-wrap gap-1">
                            {proposal.repairRequests.map((rr) => (
                              <Tag
                                key={rr.id}
                                color="blue"
                                className="text-xs font-mono">
                                {rr.requestCode}
                              </Tag>
                            ))}
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(proposal.submissionFormUrl
                  ? [
                      {
                        key: "12",
                        field: "Tờ trình",
                        value: (
                          <a
                            href={proposal.submissionFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm underline flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Xem tờ trình
                          </a>
                        ),
                      },
                    ]
                  : []),
                ...(canApproveOrReject
                  ? [
                      {
                        key: "13",
                        field: "Hành động",
                        value: (
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
                        ),
                      },
                    ]
                  : []),
                ...(canCreateSubmission
                  ? [
                      {
                        key: "14",
                        field: "Hành động",
                        value: (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              type="primary"
                              icon={<FileText className="h-4 w-4" />}
                              onClick={handleCreateSubmissionForm}
                              className="w-full sm:w-auto text-sm bg-purple-600 hover:bg-purple-700"
                              size="middle">
                              Lập tờ trình
                            </Button>
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
              columns={[
                {
                  title: "Trường",
                  dataIndex: "field",
                  key: "field",
                  width: "30%",
                  className: "font-medium",
                },
                {
                  title: "Giá trị",
                  dataIndex: "value",
                  key: "value",
                },
              ]}
              pagination={false}
              size="small"
              bordered
              showHeader={true}
            />
          </Card>

          {/* Components List */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="text-sm sm:text-base">
                  Danh sách linh kiện cần thay thế
                </span>
                <Tag color="blue" className="ml-auto text-xs sm:text-sm">
                  {replacementItems.length} linh kiện
                </Tag>
              </div>
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

          {/* Files - Tài liệu đính kèm */}
          {proposal.submissionFormUrl && (
            <Card title="Tài liệu đính kèm" className="shadow">
              <div className="space-y-2">
                <div>
                  <a
                    href={proposal.submissionFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm underline flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Tờ trình đề xuất
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Timeline - Right column */}
        <div className="lg:col-span-1">
          <Card
            title={
              <span className="text-sm sm:text-base">Tiến trình xử lý</span>
            }
            className="shadow">
            <Timeline
              items={[
                {
                  color: "blue",
                  children: (
                    <div>
                      <p className="font-medium">Tạo đề xuất thay thế</p>
                      <p className="text-sm text-gray-500">
                        Người tạo: {proposerName}
                      </p>
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
                            {teamLeadApproverName && (
                              <p className="text-sm text-gray-500">
                                Người duyệt: {teamLeadApproverName}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.updatedAt).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(displayStatus === "ĐÃ_LẬP_TỜ_TRÌNH"
                  ? [
                      {
                        color: "purple",
                        children: (
                          <div>
                            <p className="font-medium">Đã lập tờ trình</p>
                            <p className="text-sm text-gray-500">
                              {teamLeadApproverName &&
                                `Người lập: ${teamLeadApproverName}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tờ trình đã được tạo và gửi tới Phòng Quản trị
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(proposal.adminVerifier && displayStatus === "ĐÃ_XÁC_MINH"
                  ? [
                      {
                        color: "cyan",
                        children: (
                          <div>
                            <p className="font-medium">Đã xác minh</p>
                            <p className="text-sm text-gray-500">
                              Người xác minh: {proposal.adminVerifier.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.updatedAt).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(displayStatus === "ĐÃ_HOÀN_TẤT_MUA_SẮM"
                  ? [
                      {
                        color: "green",
                        children: (
                          <div>
                            <p className="font-medium">Hoàn tất mua sắm</p>
                            <p className="text-sm text-gray-500">
                              Linh kiện đã sẵn sàng để thay thế
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </Card>
        </div>
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
              // Đợi một chút để modal approval đóng hoàn toàn trước khi mở modal submission
              setTimeout(() => {
                handleCreateSubmissionForm();
              }, 100);
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
      <SubmissionFormModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        formData={submissionFormData}
        onFormDataChange={setSubmissionFormData}
        onExport={handleExportSubmissionDocx}
        onPreview={() => setShowSubmissionPreview(true)}
        onSubmit={handleSubmitSubmission}
        isSubmitting={isSubmitting}
      />

      {/* Modal xem trước tờ trình */}
      <SubmissionPreviewModal
        isOpen={showSubmissionPreview}
        onClose={() => setShowSubmissionPreview(false)}
        formData={submissionFormData}
        proposal={proposal}
        onExport={handleExportSubmissionDocx}
        onSubmit={handleSubmitSubmission}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
