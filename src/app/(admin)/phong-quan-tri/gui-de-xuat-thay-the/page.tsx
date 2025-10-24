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
import { Breadcrumb, message, Button, Modal } from "antd";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementRequestItem, ReplacementStatus } from "@/types/repair";
import { Pagination, SortableHeader } from "@/components/common";
import { SignConfirmModal } from "@/components/modal";

type SortField =
  | "proposalCode"
  | "createdAt"
  | "title"
  | "status"
  | "createdBy";
type SortDirection = "asc" | "desc" | null;

export default function GuiDeXuatThayThePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ReplacementRequestItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");

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
        "Mô tả": item.description,
        "Người tạo": item.createdBy || "Chưa xác định",
        "Số lượng linh kiện": item.components.length,
        "Trạng thái": getStatusText(item.status),
        "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột tự động
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 15 }, // Mã đề xuất
        { wch: 30 }, // Tiêu đề
        { wch: 40 }, // Mô tả
        { wch: 20 }, // Người tạo
        { wch: 15 }, // Số lượng linh kiện
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tạo
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đề xuất thay thế");

      // Xuất file
      const fileName = `Danh_sach_de_xuat_thay_the_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Thông báo thành công với modal
      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất thành công
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  const filteredData = useMemo(() => {
    // Lọc dữ liệu: chỉ lấy các đề xuất có trạng thái ĐÃ_KÝ_BIÊN_BẢN và ĐÃ_HOÀN_TẤT_MUA_SẮM
    let filtered = mockReplacementRequestItem.filter(
      (item) =>
        item.status === ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN ||
        item.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
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

    // Apply sorting (only if sortField and sortDirection are set)
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
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      // New field, start with asc
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "Đã ký biên bản";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã hoàn tất mua sắm";
      default:
        return status;
    }
  };

  // Xử lý mở modal xác nhận
  const handleOpenConfirmModal = (item: ReplacementRequestItem) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setSelectedItem(null);
  };

  // Xử lý xác nhận hoàn tất mua sắm
  const handleConfirmSend = async () => {
    if (!selectedItem) return;

    try {
      setIsProcessing(true);

      // Trong thực tế sẽ gọi API để cập nhật trạng thái thành ĐÃ_HOÀN_TẤT_MUA_SẮM
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Cập nhật trạng thái trong mockData
      const itemIndex = mockReplacementRequestItem.findIndex(
        (item) => item.id === selectedItem.id
      );

      if (itemIndex !== -1) {
        // Cập nhật trạng thái của item trong mockData
        mockReplacementRequestItem[itemIndex] = {
          ...mockReplacementRequestItem[itemIndex],
          status: ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
          updatedAt: new Date().toISOString(),
        };
      }

      message.success(
        `Đã cập nhật trạng thái ${selectedItem.proposalCode} thành công!`
      );

      // Đóng modal và reset state
      handleCloseModal();

      // Cập nhật state để render lại UI thay vì reload trang
      // Force một re-render bằng cách cập nhật searchTerm và reset lại
      const currentSearch = searchTerm;
      setSearchTerm(currentSearch + " ");
      setTimeout(() => setSearchTerm(currentSearch), 10);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
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
                  <span>Danh sách mua sắm thiết bị</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Danh sách mua sắm thiết bị
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Quản lý và theo dõi các đề xuất thay thế linh kiện, thiết bị đã được
              tổ trưởng ký biên bản hoặc đã hoàn tất mua sắm.
            </p>
          </div>
        </div>
      </div>

      {/* Search và xuất file Excel  */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Search - 3 columns on desktop, full width on mobile */}
          <div className="sm:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đề xuất, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Export Excel Button - 1 column on desktop, full width on mobile */}
          <div className="sm:col-span-1 flex justify-end">
            <Button
              onClick={handleExportExcel}
              icon={<Download className="w-3 h-3" />}
              size="middle"
              className={`w-full ${
                selectedRowKeys.length > 0
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : ""
              }`}
              type={selectedRowKeys.length > 0 ? "primary" : "default"}>
              <span className="hidden sm:inline">Xuất Excel</span>
              <span className="sm:hidden">Excel</span>
              {selectedRowKeys.length > 0 && ` (${selectedRowKeys.length})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Danh sách đề xuất ({filteredData.length})
          </h2>
        </div>

        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                  <input
                    type="checkbox"
                    checked={
                      selectedRowKeys.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRowKeys(
                          paginatedData.map((item) => item.id)
                        );
                      } else {
                        setSelectedRowKeys([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <SortableHeader
                  field="proposalCode"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[14%]">
                  Mã ĐX
                </SortableHeader>
                <SortableHeader
                  field="title"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[23%]">
                  Tiêu đề
                </SortableHeader>
                <SortableHeader
                  field="createdBy"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[18%]">
                  Người tạo
                </SortableHeader>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Số lượng
                </th>
                <SortableHeader
                  field="status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[12%]">
                  Trạng thái
                </SortableHeader>
                <SortableHeader
                  field="createdAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[10%]">
                  Ngày
                </SortableHeader>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRowKeys.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRowKeys([...selectedRowKeys, item.id]);
                        } else {
                          setSelectedRowKeys(
                            selectedRowKeys.filter((key) => key !== item.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
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
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}>
                      <span className="hidden lg:inline text-xs">
                        {getStatusText(item.status)}
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
                    <div className="flex items-center justify-center space-x-1">
                      <Link
                        href={`/phong-quan-tri/gui-de-xuat-thay-the/${item.id}`}
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Xem chi tiết">
                        <Eye className="w-3 h-3" />
                      </Link>

                      {/* Chỉ hiển thị nút xử lý cho những trạng thái ĐÃ_KÝ_BIÊN_BẢN */}
                      {item.status === ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN && (
                        <button
                          onClick={() => handleOpenConfirmModal(item)}
                          className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Đã hoàn tất mua sắm">
                          <CheckCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
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
              Không có đề xuất nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy đề xuất nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Danh sách đề xuất ({filteredData.length})
          </h2>
        </div>

        {/* Mobile Cards */}
        <div className="p-4 space-y-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.proposalCode}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedRowKeys.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRowKeys([...selectedRowKeys, item.id]);
                      } else {
                        setSelectedRowKeys(
                          selectedRowKeys.filter((key) => key !== item.id)
                        );
                      }
                    }}
                    className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Người tạo:</span>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {item.createdBy || "Chưa xác định"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Số lượng:</span>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {item.components.length} linh kiện
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày tạo:</span>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>
                    <div className="mt-0.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer with Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Link
                    href={`/phong-quan-tri/gui-de-xuat-thay-the/${item.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Xem chi tiết</span>
                  </Link>
                  {item.status === ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN && (
                    <button
                      onClick={() => handleOpenConfirmModal(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Hoàn tất</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Không tìm thấy đề xuất nào
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 sm:mt-6">
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <Pagination
              currentPage={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={() => {}}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {/* Modal xác nhận hoàn tất mua sắm */}
      <SignConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSend}
        reportTitle={selectedItem?.title || ""}
        reportNumber={selectedItem?.proposalCode || ""}
        isLoading={isProcessing}
        actionType="send"
        customTitle="Xác nhận hoàn tất mua sắm"
        customConfirmText="Xác nhận đã mua sắm"
        customDescription="Bạn có chắc chắn muốn xác nhận đã hoàn tất mua sắm cho đề xuất thay thế này?"
        customWarning="Sau khi xác nhận, trạng thái đề xuất sẽ được cập nhật thành ĐÃ HOÀN TẤT MUA SẮM."
        icon={CheckCircle}
      />

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
              Đã xuất {exportCount} đề xuất ra file {exportFileName} thành công.
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
              Vui lòng chọn ít nhất một đề xuất để xuất Excel.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
