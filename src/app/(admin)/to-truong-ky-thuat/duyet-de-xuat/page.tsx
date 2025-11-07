"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubmissionFormData } from "@/types";
import { Breadcrumb, Modal, Input, Button } from "antd";
import { CheckCircle, XCircle, FileText, Download } from "lucide-react";
import { Pagination } from "@/components/common";
import {
  ProposalFilters,
  ProposalTable,
  ProposalCards,
  STATUS_CONFIG,
} from "@/components/leadTechnician/proposalApproval";
import {
  useReplacementProposals,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import {
  ReplacementProposal,
  ReplacementProposalStatus,
} from "@/lib/api/replacement-proposals";

// Map table field names to API field names - outside component to avoid recreation
const mapSortFieldToAPI = (
  field: string
): "createdAt" | "updatedAt" | "proposalCode" | "status" | null => {
  const fieldMap: Record<
    string,
    "createdAt" | "updatedAt" | "proposalCode" | "status" | null
  > = {
    requestCode: "proposalCode",
    proposalCode: "proposalCode",
    status: "status",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    // Fields not supported by API - will ignore
    title: null,
    componentsCount: null,
  };
  return fieldMap[field] ?? null;
};

export default function DuyetDeXuatPage() {
  const router = useRouter();

  // State cho Modal xuất Excel
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

  // Filter and pagination states
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Submission modal state
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [selectedRequestForSubmission, setSelectedRequestForSubmission] =
    useState<ReplacementProposal | null>(null);
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

  // Memoize query params to prevent unnecessary re-renders
  const queryParams = useMemo(() => {
    const mappedSortBy =
      sortField && mapSortFieldToAPI(sortField)
        ? mapSortFieldToAPI(sortField)!
        : "createdAt";

    return {
      // Không filter theo status ở API, sẽ filter ở frontend
      status: undefined,
      search: searchTerm || undefined,
      // Lấy ALL data để filter ở frontend
      page: 1,
      limit: 1000, // Lấy tối đa 1000 records
      sortBy: mappedSortBy,
      sortOrder: sortDirection.toUpperCase() as "ASC" | "DESC",
    };
  }, [searchTerm, sortField, sortDirection]);

  // Fetch data from API
  const { data: apiData, refetch } = useReplacementProposals(queryParams);

  // Update status hook
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Transform API data to match component expectations
  // Filter chỉ lấy 3 trạng thái: CHỜ_TỔ_TRƯỞNG_DUYỆT, ĐÃ_DUYỆT, ĐÃ_TỪ_CHỐI
  const proposals = useMemo(() => {
    if (!apiData?.data) return [];

    // Allowed statuses for this page
    const ALLOWED_STATUSES = [
      ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
      ReplacementProposalStatus.ĐÃ_DUYỆT,
      ReplacementProposalStatus.ĐÃ_TỪ_CHỐI,
    ];

    // Filter theo trạng thái cho phép
    const filteredByStatus = apiData.data.filter((proposal) =>
      ALLOWED_STATUSES.includes(proposal.status)
    );

    // Nếu user chọn filter status, áp dụng thêm
    if (selectedStatus) {
      return filteredByStatus.filter(
        (proposal) => proposal.status === selectedStatus
      );
    }

    return filteredByStatus;
  }, [apiData, selectedStatus]);

  // Transform to ReplacementRequestItem format for components
  const transformedData = useMemo(() => {
    return proposals.map((proposal) => ({
      id: proposal.id,
      proposalCode: proposal.proposalCode,
      title: proposal.title || "Chưa xác định",
      description: proposal.description || "",
      createdBy: proposal.proposer?.fullName || "Chưa xác định",
      components:
        proposal.items?.map((item) => ({
          id: item.id,
          componentName: item.oldComponent?.name || "Chưa xác định",
          componentType: (item.oldComponent?.componentType || "OTHER") as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          assetId: "", // Not available in API
          assetName: "", // Not available in API
          assetCode: "", // Not available in API
          buildingName: "", // Not available in API
          roomName: "", // Not available in API
          newItemName: item.newItemName || "",
          newItemSpecs: item.newItemSpecs || "",
          quantity: item.quantity || 1,
          reason: item.reason || "",
          replacementSolution: "", // Not available in API
          priority: "MEDIUM", // Default value
          estimatedCost: 0, // Not available in API
        })) || [],
      status: proposal.status as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      proposerId: proposal.proposerId,
    }));
  }, [proposals]);

  // Phân trang ở frontend
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transformedData.slice(startIndex, endIndex);
  }, [transformedData, currentPage, pageSize]);

  // totalFiltered phải dùng số lượng đã filter
  const totalFiltered = transformedData.length;

  const handleCreateSubmission = (requestId: string) => {
    const request = proposals.find((req) => req.id === requestId);
    if (request) {
      setSelectedRequestForSubmission(request);

      // Auto-generate content based on the request
      const proposerName = request.proposer?.fullName || "Không xác định";
      const componentsList =
        request.items
          ?.map(
            (item) =>
              `- ${item.newItemName}${
                item.newItemSpecs ? ` (${item.newItemSpecs})` : ""
              }: ${item.reason || "Cần thay thế"} (Số lượng: ${item.quantity})`
          )
          .join("\n") || "";

      const autoContent = `Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.

Thông tin chi tiết về đề xuất thay thế:

${componentsList}

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin tổng hợp:
- Mã đề xuất: ${request.proposalCode}
- Tiêu đề: ${request.title || "Đề xuất thay thế linh kiện"}
- Người đề xuất: ${proposerName}
- Tổng số linh kiện cần thay: ${request.items?.length || 0}
- Mô tả: ${request.description || "Không có mô tả"}

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`;

      setSubmissionFormData((prev) => ({
        ...prev,
        content: autoContent,
        attachments: `Đề xuất ${request.proposalCode}`,
        submittedBy: proposerName,
      }));

      setShowSubmissionModal(true);
    }
  };

  const handleSubmitSubmission = async () => {
    if (!selectedRequestForSubmission) return;

    try {
      await updateStatus(selectedRequestForSubmission.id, {
        status: ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      });

      // Close modal and reset state
      setShowSubmissionModal(false);
      setSelectedRequestForSubmission(null);

      // Redirect immediately
      router.push("/to-truong-ky-thuat/lap-to-trinh");

      // Show success message
      Modal.success({
        title: "Lập tờ trình thành công!",
        content: `Tờ trình cho đề xuất ${selectedRequestForSubmission.proposalCode} đã được tạo và gửi tới Phòng Quản trị.`,
        centered: true,
        mask: false,
        keyboard: false,
      });

      refetch();
    } catch (err) {
      console.error("Error creating submission:", err);
      Modal.error({
        title: "Lỗi",
        content: err instanceof Error ? err.message : "Không thể lập tờ trình.",
        centered: true,
      });
    }
  };

  // Hàm xuất file DOCX cho tờ trình (sử dụng HTML)
  const handleExportSubmissionDocx = async () => {
    if (!selectedRequestForSubmission) return;

    try {
      // Tạo nội dung HTML cho tờ trình
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; margin: 40px; }
            .header-table { width: 100%; border: none; margin-bottom: 10px; }
            .header-table td { border: none; padding: 0; vertical-align: top; font-size: 11pt; }
            .header-left { text-align: center; width: 50%; }
            .header-right { text-align: center; width: 50%; }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            table.data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table.data-table th, table.data-table td { border: 1px solid black; padding: 8px; }
            table.data-table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .signature-table { width: 100%; border: none; margin-top: 40px; }
            .signature-table td { border: none; text-align: center; padding: 10px; vertical-align: top; }
            h2 { font-size: 14pt; font-weight: bold; text-align: center; margin: 20px 0 10px 0; }
            h3 { font-size: 13pt; font-weight: normal; text-align: center; margin: 5px 0 20px 0; }
            h4 { font-size: 13pt; font-weight: bold; text-align: center; margin: 15px 0; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="header-left">
                <p>BỘ CÔNG THƯƠNG</p>
                <p class="bold">TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP</p>
                <p class="bold">THÀNH PHỐ HỒ CHÍ MINH</p>
                <p class="bold underline">${submissionFormData.department.toUpperCase()}</p>
              </td>
              <td class="header-right">
                <p class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p class="bold underline">Độc lập – Tự do – Hạnh phúc</p>
                <p><em>Tp. Hồ Chí Minh, ngày ___ tháng ___ năm 2025</em></p>
              </td>
            </tr>
          </table>
          
          <h2>PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC</h2>
          <h3>${submissionFormData.subject}</h3>
          
          <p><strong>Kính gửi:</strong> ${
            submissionFormData.recipientDepartment
          }</p>
          <p><strong>Người đề nghị:</strong> ${
            submissionFormData.submittedBy
          }</p>
          <p><strong>Chức vụ:</strong> ${submissionFormData.position}</p>
          <p><strong>Đơn vị:</strong> ${submissionFormData.department}</p>
          <p><strong>Đề nghị:</strong> ${submissionFormData.subject}</p>
          <p><strong>Văn bản kèm theo:</strong> ${
            submissionFormData.attachments
          }</p>
          
          <h4>NỘI DUNG</h4>
          <p style="text-align: justify; white-space: pre-wrap;">${
            submissionFormData.content
          }</p>
          
          <p><strong>Danh sách linh kiện đề xuất thay thế:</strong></p>
          <table class="data-table">
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th width="25%">Linh kiện cũ</th>
                <th width="30%">Linh kiện mới đề xuất</th>
                <th width="10%">SL</th>
                <th width="30%">Lý do</th>
              </tr>
            </thead>
            <tbody>
              ${
                selectedRequestForSubmission.items
                  ?.map(
                    (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>
                    <strong>${
                      item.oldComponent?.name || "Không xác định"
                    }</strong><br>
                    <small>${item.oldComponent?.componentSpecs || ""}</small>
                  </td>
                  <td>
                    <strong>${item.newItemName || "Không xác định"}</strong><br>
                    <small>${item.newItemSpecs || ""}</small>
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td>${item.reason || "Cần thay thế"}</td>
                </tr>
              `
                  )
                  .join("") || ""
              }
            </tbody>
          </table>
          
          <p><strong>${
            submissionFormData.department
          } kính trình Ban Giám hiệu xem xét và phê duyệt.</strong></p>
          
          <table class="signature-table">
            <tr>
              <td width="33%">
                <p><strong>Trưởng phòng</strong></p>
                <br><br><br>
                <p>${submissionFormData.director}</p>
              </td>
              <td width="33%">
                <p><strong>Hiệu trưởng</strong></p>
                <br><br><br>
                <p>${submissionFormData.rector}</p>
              </td>
              <td width="33%">
                <p><strong>${submissionFormData.position}</strong></p>
                <p><em>(Ký và ghi rõ họ tên)</em></p>
                <br><br>
                <p>${submissionFormData.submittedBy}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // Tạo Blob và download
      const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `To_trinh_${selectedRequestForSubmission.proposalCode}_${
        new Date().toISOString().split("T")[0]
      }.doc`;
      link.click();
      window.URL.revokeObjectURL(url);

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

  const handleSort = (field: string) => {
    const apiField = mapSortFieldToAPI(field);

    // If field is not supported by API, ignore
    if (!apiField) {
      console.warn(`Sort by ${field} is not supported by API`);
      return;
    }

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
    setCurrentPage(1); // Reset to first page when sorting
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
      setSelectedRowKeys(
        paginatedData.map((req: ReplacementProposal) => req.id)
      );
    } else {
      setSelectedRowKeys([]);
    }
  };

  // Hàm xuất Excel với Modal thông báo
  const handleExportExcel = async () => {
    const selectedData = proposals.filter((item: ReplacementProposal) =>
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
      const excelData = selectedData.map(
        (item: ReplacementProposal, index: number) => ({
          STT: index + 1,
          "Mã đề xuất": item.proposalCode,
          "Tiêu đề": item.title || "Chưa xác định",
          "Mô tả": item.description || "",
          "Người tạo": item.proposer?.fullName || "Chưa xác định",
          "Số linh kiện": item.items?.length || 0,
          "Trạng thái":
            STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.text ||
            item.status,
          "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
          "Ngày cập nhật": new Date(item.updatedAt).toLocaleDateString("vi-VN"),
        })
      );

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
              onCreateSubmission={handleCreateSubmission}
              onDataChange={refetch}
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
              onCreateSubmission={handleCreateSubmission}
              onDataChange={refetch}
            />

            {/* Spacer để đảm bảo chiều cao tối thiểu */}
            <div className="flex-1 min-h-[100px]"></div>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-6 py-3">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={totalFiltered}
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
            key="export"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportSubmissionDocx}>
            Xuất file
          </Button>,
          <Button
            key="preview"
            onClick={() => setShowSubmissionPreview(true)}
            className="bg-green-600 hover:bg-green-700 text-white">
            Xem trước
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

      {/* Modal xem trước tờ trình */}
      <Modal
        title={null}
        open={showSubmissionPreview}
        onCancel={() => setShowSubmissionPreview(false)}
        footer={
          <div className="flex flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setShowSubmissionPreview(false)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Đóng
            </button>
            <button
              type="button"
              onClick={handleExportSubmissionDocx}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất file
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSubmissionPreview(false);
                handleSubmitSubmission();
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
              Gửi tờ trình
            </button>
          </div>
        }
        width="90%"
        style={{ maxWidth: 1000 }}
        centered>
        <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">
              TRƯỜNG ĐẠI HỌC CÔNG
              NGHIỆP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CỘNG
              HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mb-2">
              THÀNH PHỐ HỒ CHÍ
              MINH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Độc
              lập - Tự do - Hạnh phúc
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mb-4">
              {submissionFormData.department.toUpperCase()}
            </div>
            <div className="text-right text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Thành phố Hồ Chí Minh, ngày ___ tháng ___ năm 2025
            </div>
            <div className="text-lg sm:text-xl font-bold text-center mb-2">
              PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC
            </div>
            <div className="text-sm sm:text-base font-semibold text-center mb-4 sm:mb-6">
              {submissionFormData.subject}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Thông tin chung */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="font-medium">Kính gửi: </span>
                <span>{submissionFormData.recipientDepartment}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Người đề nghị: </span>
                  <span>{submissionFormData.submittedBy}</span>
                </div>
                <div>
                  <span className="font-medium">Chức vụ: </span>
                  <span>{submissionFormData.position}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Đơn vị: </span>
                <span>{submissionFormData.department}</span>
              </div>
              <div>
                <span className="font-medium">Đề nghị: </span>
                <span>{submissionFormData.subject}</span>
              </div>
              <div>
                <span className="font-medium">Văn bản kèm theo: </span>
                <span>{submissionFormData.attachments}</span>
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="font-medium text-center">NỘI DUNG</div>
              <div className="whitespace-pre-wrap text-justify">
                {submissionFormData.content}
              </div>
            </div>

            {/* Bảng linh kiện */}
            {selectedRequestForSubmission?.items &&
              selectedRequestForSubmission.items.length > 0 && (
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <div className="font-medium text-xs sm:text-sm mb-2">
                    Danh sách linh kiện đề xuất thay thế:
                  </div>
                  <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                          STT
                        </th>
                        <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                          Linh kiện cũ
                        </th>
                        <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                          Linh kiện mới đề xuất
                        </th>
                        <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                          SL
                        </th>
                        <th className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center font-medium">
                          Lý do
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequestForSubmission.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                            <div className="font-medium">
                              {item.oldComponent?.name || "Không xác định"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.oldComponent?.componentSpecs || ""}
                            </div>
                          </td>
                          <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                            <div className="font-medium">
                              {item.newItemName || "Không xác định"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.newItemSpecs || ""}
                            </div>
                          </td>
                          <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-400 px-1 sm:px-2 py-1 sm:py-2">
                            {item.reason || "Cần thay thế"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Kết luận và chữ ký */}
            <div className="space-y-4 sm:space-y-6 mt-6">
              <div className="text-xs sm:text-sm">
                <span className="font-medium">
                  {submissionFormData.department} kính trình Ban Giám hiệu xem
                  xét và phê duyệt.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8">
                <div className="text-center">
                  <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                    Trưởng phòng
                  </div>
                  <div className="font-medium text-xs sm:text-sm">
                    {submissionFormData.director}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-12 sm:mb-16 text-xs sm:text-sm">
                    Hiệu trưởng
                  </div>
                  <div className="font-medium text-xs sm:text-sm">
                    {submissionFormData.rector}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2 text-xs sm:text-sm">
                    {submissionFormData.position}
                  </div>
                  <div className="text-xs text-gray-600 mb-10 sm:mb-12">
                    (Ký và ghi rõ họ tên)
                  </div>
                  <div className="font-medium text-xs sm:text-sm">
                    {submissionFormData.submittedBy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
