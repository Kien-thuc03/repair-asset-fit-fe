"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  FileText,
  ChevronUp,
  ChevronDown,
  Download,
  CheckSquare,
  Square,
  X,
} from "lucide-react";

import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";
import { ReplacementStatus, ReplacementRequestItem } from "@/types/repair";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";

export default function LapToTrinhPage() {
  const router = useRouter();

  // Lấy các đề xuất thay thế đã được TỔ TRƯỞNG DUYỆT - sẵn sàng lập tờ trình
  const [replacementRequests] = useState<ReplacementRequestItem[]>(() => {
    return mockReplacementRequestItem.filter(
      (request) => request.status === ReplacementStatus.ĐÃ_DUYỆT
    );
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export states
  const [exportCount, setExportCount] = useState(0);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-y: auto;
      }
      
      body {
        min-height: 100vh;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filteredRequests = replacementRequests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.proposalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.components.some(
        (component) =>
          component.assetName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          component.componentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sắp xếp dữ liệu
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortField === "" || sortDirection === "none") return 0;

    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "title":
        aValue = a.title;
        bValue = b.title;
        break;
      case "proposalCode":
        aValue = a.proposalCode;
        bValue = b.proposalCode;
        break;
      case "createdBy":
        aValue = a.createdBy || "";
        bValue = b.createdBy || "";
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Hàm hiển thị icon sắp xếp
  const getSortIcon = (field: string) => {
    return (
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`h-3 w-3 ${
            sortField === field && sortDirection === "asc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortField === field && sortDirection === "desc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "bg-yellow-100 text-yellow-800";
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800";
      case ReplacementStatus.ĐÃ_XÁC_MINH:
        return "bg-cyan-100 text-cyan-800";
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-indigo-100 text-indigo-800";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-orange-100 text-orange-800";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "Chờ duyệt";
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh";
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Đã lập tờ trình";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "Từ chối";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt tờ trình";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Từ chối tờ trình";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã mua sắm";
      default:
        return status;
    }
  };

  // Pagination logic
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRequests.slice(startIndex, endIndex);
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(
      checked ? sortedRequests.map((request) => request.id) : []
    );
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      setSelectAll(false);
    }
  };

  // Export handler
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? sortedRequests.filter((request) => selectedItems.includes(request.id))
        : sortedRequests;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Reset pagination when changing filters or search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [selectedStatus, searchTerm]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2 main-content">
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
                  <span>Lập tờ trình</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lập tờ trình
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Lập tờ trình cho các đề xuất thay thế linh kiện đã được tổ trưởng
              duyệt
            </p>
          </div>
          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            <span>
              {selectedItems.length > 0
                ? `Xuất Excel (${selectedItems.length} mục)`
                : `Xuất Excel (${sortedRequests.length} mục)`}
            </span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 items-end">
          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Tìm kiếm
            </label>
            <div className="relative flex-1 min-w-0 h-9 sm:h-10">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none flex-shrink-0 z-10" />
              <input
                type="text"
                className="absolute inset-0 w-full h-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                placeholder="Tên linh kiện, mã đề xuất..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Trạng thái
            </label>
            <div className="flex-1 h-9 sm:h-10">
              <select
                className="w-full h-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value={ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT}>
                  Chờ duyệt
                </option>
                <option value={ReplacementStatus.CHỜ_XÁC_MINH}>
                  Chờ xác minh
                </option>
                <option value={ReplacementStatus.ĐÃ_XÁC_MINH}>
                  Đã xác minh
                </option>
                <option value={ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH}>
                  Đã lập tờ trình
                </option>
                <option value={ReplacementStatus.ĐÃ_DUYỆT}>Đã duyệt</option>
                <option value={ReplacementStatus.ĐÃ_TỪ_CHỐI}>Từ chối</option>
                <option value={ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH}>
                  Đã duyệt tờ trình
                </option>
                <option value={ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH}>
                  Từ chối tờ trình
                </option>
                <option value={ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM}>
                  Đã mua sắm
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách đề xuất chờ lập tờ trình ({sortedRequests.length})
          </h2>
        </div>

        <div className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="flex-1 overflow-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="p-3 space-y-3">
                {getCurrentData().length > 0 ? (
                  getCurrentData().map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 relative">
                      {/* Selection checkbox */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() =>
                            handleSelectItem(
                              request.id,
                              !selectedItems.includes(request.id)
                            )
                          }
                          className="text-gray-400 hover:text-gray-600">
                          {selectedItems.includes(request.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-start justify-between mb-2 pr-8">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {request.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              Mã: {request.proposalCode}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            request.status
                          )}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <div className="text-gray-500">Người tạo</div>
                          <div className="text-gray-900 font-medium">
                            {request.createdBy || "Không xác định"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Số linh kiện</div>
                          <div className="text-gray-900 font-medium">
                            {request.components.length} linh kiện
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Ngày tạo</div>
                          <div className="text-gray-900">
                            {new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            router.push(
                              `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            router.push(
                              `/to-truong-ky-thuat/lap-to-trinh/lap-to-trinh/${request.id}`
                            );
                          }}
                          className="px-3 py-1 text-xs font-medium border rounded-md transition-colors text-blue-700 bg-blue-100 border-blue-300 hover:bg-blue-200 cursor-pointer"
                          title="Lập tờ trình">
                          Lập tờ trình
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-xs text-gray-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Table View - Optimized for full width display */}
            <div className="hidden sm:block">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="w-[5%] px-3 py-3 text-left">
                      <button
                        onClick={() => handleSelectAll(!selectAll)}
                        className="text-gray-400 hover:text-gray-600">
                        {selectAll ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="w-[13%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                        onClick={() => handleSort("proposalCode")}>
                        <span>Mã đề xuất</span>
                        {getSortIcon("proposalCode")}
                      </button>
                    </th>
                    <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                        onClick={() => handleSort("title")}>
                        <span>Tiêu đề đề xuất</span>
                        {getSortIcon("title")}
                      </button>
                    </th>
                    <th className="w-[8%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                        onClick={() => handleSort("createdBy")}>
                        <span>Người tạo</span>
                        {getSortIcon("createdBy")}
                      </button>
                    </th>
                    <th className="w-[15%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                        onClick={() => handleSort("status")}>
                        <span>Trạng thái</span>
                        {getSortIcon("status")}
                      </button>
                    </th>
                    <th className="w-[10%] hidden lg:table-cell px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                        onClick={() => handleSort("createdAt")}>
                        <span>Ngày tạo</span>
                        {getSortIcon("createdAt")}
                      </button>
                    </th>
                    <th className="w-[18%] lg:w-[18%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentData().length > 0 ? (
                    getCurrentData().map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="w-[5%] px-3 py-4">
                          <button
                            onClick={() =>
                              handleSelectItem(
                                request.id,
                                !selectedItems.includes(request.id)
                              )
                            }
                            className="text-gray-400 hover:text-gray-600">
                            {selectedItems.includes(request.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap w-[13%]">
                          <div
                            className="text-sm text-gray-900 truncate font-mono"
                            title={request.proposalCode}>
                            {request.proposalCode}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap w-[25%]">
                          <div className="flex items-center min-w-0">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div
                                className="text-sm font-medium text-gray-900 truncate"
                                title={request.title}>
                                {request.title}
                              </div>
                              <div
                                className="text-xs text-gray-500 truncate"
                                title={request.description}>
                                {request.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-center w-[8%]">
                          <div
                            className="text-xs text-gray-900 truncate"
                            title={request.createdBy || "Không xác định"}>
                            {request.createdBy || "N/A"}
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-center w-[15%]">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusBadge(
                              request.status
                            )}`}
                            title={getStatusText(request.status)}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-2 py-4 whitespace-nowrap text-center w-[10%]">
                          <div className="text-xs text-gray-900">
                            {new Date(request.createdAt).toLocaleDateString(
                            "vi-VN",
                            { day: "2-digit", month: "2-digit", year: "numeric" }
                          )}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap w-[18%]">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                router.push(
                                  `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                                );
                              }}
                              className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                router.push(
                                  `/to-truong-ky-thuat/lap-to-trinh/lap-to-trinh/${request.id}`
                                );
                              }}
                              className="inline-flex items-center px-3 py-1.5 border rounded text-xs font-medium whitespace-nowrap transition-colors text-blue-700 bg-blue-50 border-blue-300 hover:bg-blue-100 cursor-pointer"
                              title="Lập tờ trình">
                              <FileText className="h-3 w-3 mr-1" />
                              <span>Lập tờ trình</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          Không tìm thấy kết quả
                        </h3>
                        <p className="text-xs text-gray-500">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={sortedRequests.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Export Success Modal */}
      {showExportSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xuất Excel thành công!
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Đã xuất {exportCount} tờ trình thành công.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowExportSuccessModal(false)}
                  className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Error Modal */}
      {showExportErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Không thể xuất Excel
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Không có dữ liệu để xuất. Vui lòng kiểm tra lại.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowExportErrorModal(false)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
