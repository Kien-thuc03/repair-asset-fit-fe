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

import { Breadcrumb, Modal, Row, Col, Input, Button } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
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
  const [selectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states - Thay đổi để phù hợp với logic mới
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Export modals state
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");

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

  // Selection handlers - Cập nhật để phù hợp với selectedRowKeys
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(sortedRequests.map((request) => request.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, itemId]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Hàm xuất Excel với modal thông báo Ant Design
  const handleExportExcel = async () => {
    const selectedData = sortedRequests.filter((item) =>
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
        "Tiêu đề": item.title || "Chưa xác định",
        "Mô tả": item.description || "",
        "Người tạo": item.createdBy || "Chưa xác định",
        "Số linh kiện": item.components?.length || 0,
        "Trạng thái": getStatusText(item.status),
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
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đề xuất lập tờ trình");

      // Xuất file
      const fileName = `danh-sach-de-xuat-lap-to-trinh-${
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

  // Reset pagination when changing filters or search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Lập tờ trình
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Lập tờ trình cho các đề xuất thay thế linh kiện đã được tổ trưởng
            duyệt
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Input
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              placeholder="Tìm theo tiêu đề, mã đề xuất, người tạo, linh kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Button
              type="primary"
              icon={<Download className="h-4 w-4" />}
              onClick={handleExportExcel}
              disabled={selectedRowKeys.length === 0}
              className={`w-full ${
                selectedRowKeys.length > 0
                  ? "bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                  : ""
              }`}
              style={{
                backgroundColor:
                  selectedRowKeys.length > 0 ? "#16a34a" : undefined,
                borderColor: selectedRowKeys.length > 0 ? "#16a34a" : undefined,
              }}>
              <span className="hidden sm:inline">
                Xuất Excel{" "}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </span>
              <span className="sm:hidden">Xuất</span>
            </Button>
          </Col>
        </Row>

        {/* Search Info */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            <span>Đang tìm kiếm: </span>
            <span className="font-medium text-blue-600">
              &quot;{searchTerm}&quot;
            </span>
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4 inline" />
            </button>
          </div>
        )}
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
                              !selectedRowKeys.includes(request.id)
                            )
                          }
                          className="text-gray-400 hover:text-gray-600">
                          {selectedRowKeys.includes(request.id) ? (
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
                        onClick={() =>
                          handleSelectAll(selectedRowKeys.length === 0)
                        }
                        className="text-gray-400 hover:text-gray-600">
                        {selectedRowKeys.length > 0 ? (
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
                                !selectedRowKeys.includes(request.id)
                              )
                            }
                            className="text-gray-400 hover:text-gray-600">
                            {selectedRowKeys.includes(request.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap w-[13%]">
                          <div
                            className="text-sm text-blue-600 truncate font-medium"
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
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
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
              Vui lòng chọn ít nhất một đề xuất để xuất Excel hoặc có lỗi xảy
              ra. Vui lòng thử lại.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
