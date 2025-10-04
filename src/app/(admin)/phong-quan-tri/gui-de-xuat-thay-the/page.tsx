"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Plane,
  PlaneLanding,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb, message } from "antd";
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
  const itemsPerPage = 10;

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ReplacementRequestItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredData = useMemo(() => {
    // Lọc dữ liệu: chỉ lấy các đề xuất có trạng thái ĐÃ_XÁC_MINH (Tổ trưởng đã ký biên bản xác nhận)
    let filtered = mockReplacementRequestItem.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_XÁC_MINH
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
      case ReplacementStatus.ĐÃ_XÁC_MINH:
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh";
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

  // Xử lý xác nhận gửi đề xuất
  const handleConfirmSend = async () => {
    if (!selectedItem) return;

    try {
      setIsProcessing(true);

      // Trong thực tế sẽ gọi API để cập nhật trạng thái
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      message.success(
        `Đã gửi đề xuất ${selectedItem.proposalCode} thành công!`
      );

      // Đóng modal và reset state
      handleCloseModal();

      // Reload trang để cập nhật dữ liệu
      window.location.reload();
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi đề xuất!");
      console.error(error);
    } finally {
      setIsProcessing(false);
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
                  <span>Gửi đề xuất thay thế</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gửi đề xuất thay thế
        </h1>
        <p className="mt-2 text-gray-600">
          Quản lý các đề xuất thay thế đã được tổ trưởng xác minh
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tìm kiếm đề xuất
          </h3>
          <p className="text-sm text-gray-600">
            Tìm kiếm các đề xuất thay thế đã được tổ trưởng kỹ thuật xác minh và
            sẵn sàng để gửi lên cấp trên phê duyệt.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader
                  field="proposalCode"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[15%]">
                  Mã ĐX
                </SortableHeader>
                <SortableHeader
                  field="title"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[25%]">
                  Tiêu đề
                </SortableHeader>
                <SortableHeader
                  field="createdBy"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[20%]">
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

                      {/* Chỉ hiển thị nút xử lý cho những trạng thái ĐÃ_XÁC_MINH */}
                      {item.status === ReplacementStatus.ĐÃ_XÁC_MINH && (
                        <button
                          onClick={() => handleOpenConfirmModal(item)}
                          className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Gửi đề xuất">
                          <Plane className="w-3 h-3" />
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

      {/* Modal xác nhận gửi đề xuất */}
      <SignConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSend}
        reportTitle={selectedItem?.title || ""}
        reportNumber={selectedItem?.proposalCode || ""}
        isLoading={isProcessing}
        actionType="send"
        customTitle="Xác nhận gửi đề xuất thay thế"
        customConfirmText="Gửi đề xuất"
        customDescription="Bạn có chắc chắn muốn gửi đề xuất thay thế này lên cấp trên để phê duyệt?"
        customWarning="Sau khi gửi, đề xuất sẽ được chuyển lên Phòng Quản trị để xem xét và phê duyệt. Bạn không thể chỉnh sửa đề xuất sau khi đã gửi."
        icon={PlaneLanding}
      />
    </div>
  );
}
