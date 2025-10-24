"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReplacementRequestItem,
  ReplacementStatus,
  SubmissionFormData,
} from "@/types";
import { mockReplacementRequestItem } from "@/lib/mockData";
import { Breadcrumb, Modal, Input, Button } from "antd";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { Pagination } from "@/components/common";
import { users } from "@/lib/mockData/users";
import {
  ProposalFilters,
  ProposalTable,
  ProposalCards,
  STATUS_CONFIG,
  filterProposals,
  sortProposals,
} from "@/components/leadTechnician/proposalApproval";

export default function DuyetDeXuatPage() {
  const router = useRouter();

  // State cho Modal xuất Excel
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

  // Lấy các đề xuất có trạng thái: CHỜ_TỔ_TRƯỞNG_DUYỆT, ĐÃ_DUYỆT, ĐÃ_TỪ_CHỐI
  const [requests, setRequests] = useState<ReplacementRequestItem[]>(
    mockReplacementRequestItem
      .filter(
        (proposal) =>
          proposal.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT ||
          proposal.status === ReplacementStatus.ĐÃ_DUYỆT ||
          proposal.status === ReplacementStatus.ĐÃ_TỪ_CHỐI
      )
      .map((proposal) => ({
        ...proposal,
      }))
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Submission modal state
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedRequestForSubmission, setSelectedRequestForSubmission] =
    useState<ReplacementRequestItem | null>(null);
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

  // Handle actions
  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: ReplacementStatus.ĐÃ_DUYỆT,
            }
          : req
      )
    );
    console.log("Approved request:", requestId);
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: ReplacementStatus.ĐÃ_TỪ_CHỐI,
            }
          : req
      )
    );
    console.log("Rejected request:", requestId);
  };

  const handleCreateSubmission = (requestId: string) => {
    const request = requests.find((req) => req.id === requestId);
    if (request) {
      setSelectedRequestForSubmission(request);

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
    }
  };

  const handleSubmitSubmission = () => {
    if (!selectedRequestForSubmission) return;

    // Simulate submission form creation
    console.log("Creating submission form:", {
      requestId: selectedRequestForSubmission.id,
      proposalCode: selectedRequestForSubmission.proposalCode,
      submissionFormData,
      createdAt: new Date().toISOString(),
    });

    // Update request status to ĐÃ_LẬP_TỜ_TRÌNH
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequestForSubmission.id
          ? {
              ...req,
              status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
            }
          : req
      )
    );

    // Close modal and reset state
    setShowSubmissionModal(false);
    setSelectedRequestForSubmission(null);

    // Redirect immediately
    console.log("Redirecting to /to-truong-ky-thuat/lap-to-trinh");
    router.push("/to-truong-ky-thuat/lap-to-trinh");

    // Show success message without blocking redirect
    Modal.success({
      title: "Lập tờ trình thành công!",
      content: `Tờ trình cho đề xuất ${selectedRequestForSubmission.proposalCode} đã được tạo và gửi tới Phòng Quản trị.`,
      centered: true,
      mask: false,
      keyboard: false,
    });
  };

  // Use helper functions
  const filteredData = filterProposals(requests, selectedStatus, searchTerm);
  const sortedData = sortProposals(filteredData, sortField, sortDirection);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        // Reset về không sắp xếp
        setSortField("");
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Xử lý checkbox
  const handleRowSelect = (itemId: string, checked: boolean) => {
    setSelectedRowKeys((prev) => {
      const newSelected = checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId);
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(paginatedData.map((req) => req.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  // Hàm xuất Excel với Modal thông báo
  const handleExportExcel = async () => {
    const selectedData = sortedData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      setExportError("Vui lòng chọn ít nhất một đề xuất để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import("xlsx");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map((item, index) => ({
        STT: index + 1,
        "Mã đề xuất": item.proposalCode,
        "Tiêu đề": item.title || "Chưa xác định",
        "Mô tả": item.description || "",
        "Người tạo": item.createdBy || "Chưa xác định",
        "Số linh kiện": item.components?.length || 0,
        "Trạng thái":
          STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.text ||
          item.status,
        "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
        "Ngày cập nhật": new Date(item.updatedAt).toLocaleDateString("vi-VN"),
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột tự động
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Mã đề xuất
        { wch: 30 }, // Tiêu đề
        { wch: 40 }, // Mô tả
        { wch: 20 }, // Người tạo
        { wch: 15 }, // Số linh kiện
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tạo
        { wch: 15 }, // Ngày cập nhật
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đề xuất thay thế");

      // Xuất file
      const fileName = `Danh_sach_de_xuat_thay_the_${
        new Date().toISOString().split("T")[0]
      }_${selectedData.length}_ban_ghi.xlsx`;

      XLSX.writeFile(wb, fileName);

      // Hiển thị thông báo thành công
      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất thành công
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
      setShowExportErrorModal(true);
    }
  };

  return (
    <>
      <div
        className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen"
        style={{ position: "relative", zIndex: 1 }}>
        <div className="mb-2">
          <Breadcrumb
            items={[
              {
                href: "/to-truong-ky-thuat",
                title: (
                  <div className="flex items-center">
                    <span>Trang chủ</span>
                  </div>
                ),
              },
              {
                title: (
                  <div className="flex items-center">
                    <span>Duyệt đề xuất</span>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Header*/}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Duyệt đề xuất thay thế linh kiện
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Quản lý và duyệt các đề xuất thay thế linh kiện từ kỹ thuật
                viên. Hiển thị các đề xuất chờ duyệt, đã duyệt và đã từ chối.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProposalFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          selectedCount={selectedRowKeys.length}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
          onExport={handleExportExcel}
        />

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="min-h-[500px] flex flex-col">
            {/* Desktop Table View */}
            <ProposalTable
              paginatedData={paginatedData}
              selectedRowKeys={selectedRowKeys}
              currentPage={currentPage}
              pageSize={pageSize}
              statusConfig={STATUS_CONFIG}
              sortField={sortField}
              sortDirection={sortDirection}
              onSelectAll={handleSelectAll}
              onRowSelect={handleRowSelect}
              onSort={handleSort}
              onApprove={handleApprove}
              onReject={handleReject}
              onCreateSubmission={handleCreateSubmission}
            />

            {/* Mobile Card View */}
            <ProposalCards
              proposals={paginatedData}
              selectedItems={selectedRowKeys}
              selectAll={
                paginatedData.length > 0 &&
                paginatedData.every((item) => selectedRowKeys.includes(item.id))
              }
              statusConfig={STATUS_CONFIG}
              onSelectAll={() => {
                const allSelected =
                  paginatedData.length > 0 &&
                  paginatedData.every((item) =>
                    selectedRowKeys.includes(item.id)
                  );
                handleSelectAll(!allSelected);
              }}
              onSelectItem={(id) => {
                const isSelected = selectedRowKeys.includes(id);
                handleRowSelect(id, !isSelected);
              }}
              onApprove={handleApprove}
              onReject={handleReject}
              onCreateSubmission={handleCreateSubmission}
            />

            {/* Spacer để đảm bảo chiều cao tối thiểu */}
            <div className="flex-1 min-h-[100px]"></div>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-6 py-3">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={sortedData.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 50, 100]}
              showQuickJumper={true}
              showTotal={true}
            />
          </div>
        </div>
      </div>

      {/* Modal thông báo xuất Excel thành công */}
      <Modal
        title={null}
        open={showExportSuccessModal}
        onCancel={() => setShowExportSuccessModal(false)}
        footer={[
          <button
            key="close"
            onClick={() => setShowExportSuccessModal(false)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            style={{
              border: "none",
              borderRadius: "6px",
              fontWeight: "500",
            }}>
            Đóng
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "500px" }}>
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Xuất Excel thành công!
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-1">
            File{" "}
            <span className="font-medium">&ldquo;{exportFileName}&rdquo;</span>{" "}
            đã được tải xuống
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-medium">({exportCount} bản ghi)</span>
          </p>
        </div>
      </Modal>

      {/* Modal thông báo lỗi xuất Excel */}
      <Modal
        title={null}
        open={showExportErrorModal}
        onCancel={() => setShowExportErrorModal(false)}
        footer={[
          <button
            key="close"
            onClick={() => setShowExportErrorModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            style={{
              border: "none",
              borderRadius: "6px",
              fontWeight: "500",
            }}>
            Đóng
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "500px" }}>
        <div className="text-center py-4">
          <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Lỗi xuất Excel
          </h3>
          <p className="text-sm sm:text-base text-gray-600">{exportError}</p>
        </div>
      </Modal>

      {/* Modal lập tờ trình */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Lập tờ trình đề xuất</span>
          </div>
        }
        open={showSubmissionModal}
        onCancel={() => setShowSubmissionModal(false)}
        width="90%"
        style={{ maxWidth: "800px" }}
        footer={[
          <Button key="cancel" onClick={() => setShowSubmissionModal(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitSubmission}
            className="bg-purple-600 hover:bg-purple-700">
            Gửi tờ trình
          </Button>,
        ]}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung tờ trình
            </label>
            <Input.TextArea
              rows={8}
              value={submissionFormData.content}
              onChange={(e) =>
                setSubmissionFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Nội dung chi tiết của tờ trình..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
