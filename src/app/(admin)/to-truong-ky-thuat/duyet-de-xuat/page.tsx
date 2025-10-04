"use client";
import { useState, useEffect } from "react";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";
import { mockReplacementRequestItem } from "@/lib/mockData";
import { Breadcrumb, message } from "antd";
import { Pagination, ExcelExportButton } from "@/components/common";
import {
  ProposalFilters,
  ProposalTable,
  STATUS_CONFIG,
  filterProposals,
  sortProposals,
} from "@/components/leadTechnician/proposalApproval";

export default function DuyetDeXuatPage() {
  // Cấu hình message để đảm bảo hiển thị đúng
  useEffect(() => {
    message.config({
      top: 100,
      duration: 5,
      maxCount: 3,
      rtl: false,
      prefixCls: "ant-message",
      getContainer: () => document.body,
    });
  }, []);
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

  // Hàm xuất Excel với message thông báo
  const handleExportExcel = async () => {
    const selectedData = sortedData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      message.warning({
        content: "Vui lòng chọn ít nhất một đề xuất để xuất Excel!",
        duration: 4,
        style: {
          marginTop: "100px",
          zIndex: 10000,
        },
      });
      return;
    }

    // Hiển thị loading message với z-index cao
    const hideLoading = message.loading({
      content: "Đang tạo file Excel...",
      duration: 0,
      style: {
        marginTop: "100px",
        zIndex: 10000,
      },
    });

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

      // Ẩn loading và hiển thị thông báo thành công
      hideLoading();
      message.success({
        content: `Xuất Excel thành công! File "${fileName}" đã được tải xuống (${selectedData.length} bản ghi)`,
        duration: 6,
        style: {
          marginTop: "100px",
          zIndex: 10000,
        },
      });

      // Reset selection sau khi xuất thành công
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);

      // Ẩn loading và hiển thị thông báo lỗi
      hideLoading();
      message.error({
        content: `Lỗi xuất Excel: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`,
        duration: 6,
        style: {
          marginTop: "100px",
          zIndex: 10000,
        },
      });
    }
  };

  return (
    <>
      {/* CSS để đảm bảo message hiển thị đúng */}
      <style jsx global>{`
        .ant-message {
          z-index: 9999 !important;
          position: fixed !important;
          top: 24px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .ant-message-notice {
          pointer-events: auto !important;
        }
        .ant-message-notice-content {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid #d9d9d9 !important;
          box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
            0 3px 6px -4px rgba(0, 0, 0, 0.12),
            0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>

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

            <ExcelExportButton
              totalCount={sortedData.length}
              selectedCount={selectedRowKeys.length}
              onExport={handleExportExcel}
              label="Xuất Excel"
            />
          </div>
        </div>

        {/* Filters */}
        <ProposalFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
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
    </>
  );
}
