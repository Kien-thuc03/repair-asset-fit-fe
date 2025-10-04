"use client";
import { useState } from "react";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";
import { mockReplacementRequestItem } from "@/lib/mockData";
import { Breadcrumb, Modal } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { Pagination } from "@/components/common";
import {
  ProposalFilters,
  ProposalTable,
  STATUS_CONFIG,
  filterProposals,
  sortProposals,
} from "@/components/leadTechnician/proposalApproval";

export default function DuyetDeXuatPage() {
  // State cho Modal xuất Excel
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

  // Lấy các đề xuất CHỜ TỔ TRƯỞNG DUYỆT - Kỹ thuật viên đã lập, chờ tổ trưởng duyệt
  const [requests, setRequests] = useState<ReplacementRequestItem[]>(
    mockReplacementRequestItem
      .filter(
        (proposal) => proposal.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT
      )
      .map((proposal) => ({
        ...proposal,
      }))
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        className="container mx-auto px-2 sm:px-4 py-2 sm:py-2 min-h-screen"
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
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Duyệt đề xuất thay thế linh kiện
              </h1>
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
            />

            {/* Spacer để đảm bảo chiều cao tối thiểu */}
            <div className="flex-1 min-h-[100px]"></div>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
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
        width={500}>
        <div className="text-center py-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xuất Excel thành công!
          </h3>
          <p className="text-gray-600 mb-1">
            File{" "}
            <span className="font-medium">&ldquo;{exportFileName}&rdquo;</span>{" "}
            đã được tải xuống
          </p>
          <p className="text-gray-600">
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
        width={500}>
        <div className="text-center py-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lỗi xuất Excel
          </h3>
          <p className="text-gray-600">{exportError}</p>
        </div>
      </Modal>
    </>
  );
}
