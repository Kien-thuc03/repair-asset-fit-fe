"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb, Button, Modal } from "antd";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, ReplacementRequestItem } from "@/types/repair";
import { Pagination, SortableHeader } from "@/components/common";

type SortField = keyof ReplacementRequestItem;
type SortDirection = "asc" | "desc" | null;

export default function XuLyToTrinhPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    // Lọc dữ liệu: chỉ lấy các tờ trình đang chờ xử lý (trạng thái ĐÃ_LẬP_TỜ_TRÌNH)
    // Đây là những tờ trình mà Tổ trưởng kỹ thuật đã lập và gửi lên Phòng Quản trị để xem xét phê duyệt
    let filtered = mockReplacementRequestItem.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH
    );

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.proposalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting - chỉ sort khi có sortField và sortDirection
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | Date;
        let bValue: string | Date;

        switch (sortField) {
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case "proposalCode":
            aValue = a.proposalCode;
            bValue = b.proposalCode;
            break;
          case "title":
            aValue = a.title;
            bValue = b.title;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "createdBy":
            aValue = a.createdBy || "";
            bValue = b.createdBy || "";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortField, sortDirection]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Cycle through: asc -> desc -> null (default)
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // New field selected, start with asc
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = () => {
    // Chỉ có trạng thái ĐÃ_LẬP_TỜ_TRÌNH nên luôn hiển thị màu xanh dương (chờ xử lý)
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusText = () => {
    // Chỉ có trạng thái ĐÃ_LẬP_TỜ_TRÌNH nên luôn hiển thị "Chờ xử lý"
    return "Chờ xử lý";
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = filteredData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
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
        "Tiêu đề": item.title,
        "Mô tả": item.description || "",
        "Người tạo": item.createdBy || "Chưa xác định",
        "Số lượng linh kiện": item.components.length,
        "Trạng thái": "Chờ xử lý",
        "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
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
        { wch: 15 }, // Số lượng linh kiện
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tạo
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách tờ trình");

      // Xuất file
      const fileName = `Danh_sach_to_trinh_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Hàm xử lý chọn row
  const handleRowSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    }
  };

  // Hàm xử lý chọn tất cả
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const currentPageKeys = paginatedData.map((row) => row.id);
      setSelectedRowKeys((prev) => [...prev, ...currentPageKeys]);
    } else {
      const currentPageKeys = paginatedData.map((row) => row.id);
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !currentPageKeys.includes(key))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
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
              title: (
                <div className="flex items-center">
                  <span>Xử lý tờ trình</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xử lý tờ trình thay thế
        </h1>
        <p className="mt-2 text-gray-600">
          Danh sách các tờ trình đang chờ xử lý từ tổ trưởng kỹ thuật. Tất cả tờ
          trình ở đây đều có trạng thái &ldquo;Đã lập tờ trình&rdquo; và cần
          được xem xét phê duyệt.
        </p>
      </div>

      {/* Search và Xuất Excel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search - chiếm 3 cột */}
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đề xuất, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Nút Xuất Excel - chiếm 1 cột */}
          <div className="md:col-span-1">
            <Button
              type="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportExcel}
              disabled={selectedRowKeys.length === 0}
              className="w-full h-[40px] flex items-center justify-center">
              Xuất Excel ({selectedRowKeys.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((row) =>
                          selectedRowKeys.includes(row.id)
                        )
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả tờ trình"
                    />
                    <span>STT</span>
                  </div>
                </th>
                <SortableHeader<ReplacementRequestItem>
                  field="proposalCode"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[12%]">
                  Mã ĐX
                </SortableHeader>
                <SortableHeader<ReplacementRequestItem>
                  field="title"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[22%]">
                  Tiêu đề
                </SortableHeader>
                <SortableHeader<ReplacementRequestItem>
                  field="createdBy"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[17%]">
                  Người tạo
                </SortableHeader>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Số lượng
                </th>
                <SortableHeader<ReplacementRequestItem>
                  field="status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[12%]">
                  Trạng thái
                </SortableHeader>
                <SortableHeader<ReplacementRequestItem>
                  field="createdAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[11%]">
                  Ngày
                </SortableHeader>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRowKeys.includes(item.id)}
                        onChange={(e) =>
                          handleRowSelect(item.id, e.target.checked)
                        }
                        aria-label={`Chọn tờ trình ${item.proposalCode}`}
                      />
                      <span>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {item.proposalCode}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div
                      className="text-xs text-gray-900 font-medium truncate"
                      title={item.title}>
                      {item.title}
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      title={item.description}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-xs text-gray-900">
                      <div className="flex items-center space-x-1">
                        <span className="truncate text-xs font-medium">
                          {item.createdBy || "Chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.components.length}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                      <span className="hidden lg:inline text-xs">
                        {getStatusText()}
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <Link
                      href={`/phong-quan-tri/xu-ly-to-trinh/${item.id}`}
                      className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Xem chi tiết">
                      <Eye className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có tờ trình nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy tờ trình nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <Pagination
              currentPage={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={() => {}}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* Export Success Modal */}
      <Modal
        open={showExportSuccessModal}
        onCancel={() => setShowExportSuccessModal(false)}
        footer={[
          <button
            key="ok"
            onClick={() => setShowExportSuccessModal(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Đóng
          </button>,
        ]}
        centered
        width={400}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Xuất Excel thành công!
            </h3>
            <p className="text-sm text-gray-500">
              Đã xuất {exportCount} tờ trình ra file {exportFileName} thành
              công.
            </p>
          </div>
        </div>
      </Modal>

      {/* Export Error Modal */}
      <Modal
        open={showExportErrorModal}
        onCancel={() => setShowExportErrorModal(false)}
        footer={[
          <button
            key="ok"
            onClick={() => setShowExportErrorModal(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Đóng
          </button>,
        ]}
        centered
        width={400}>
        <div className="flex items-center space-x-3">
          <XCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Không thể xuất Excel
            </h3>
            <p className="text-sm text-gray-500">
              Không có dữ liệu để xuất hoặc có lỗi xảy ra. Vui lòng chọn ít nhất
              một tờ trình và thử lại.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
