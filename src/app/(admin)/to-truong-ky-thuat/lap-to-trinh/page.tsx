"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, FileText, ChevronUp, ChevronDown } from "lucide-react";

import { Breadcrumb } from "antd";
import { ReplacementRequestForList, ReplacementStatus } from "@/types";
import {
  mockReportLists,
  getReportListsByStatus,
} from "@/lib/mockData/reportLists";

export default function LapToTrinhPage() {
  const router = useRouter();

  // Lấy tất cả các items từ các danh sách đã tạo có trạng thái "CHỜ_LẬP_TỜ_TRÌNH"
  const [replacementRequests] = useState<ReplacementRequestForList[]>(() => {
    const reportLists = getReportListsByStatus("CHỜ_LẬP_TỜ_TRÌNH");
    return reportLists.flatMap((list) => list.items);
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

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
      request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

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
      case "assetName":
        aValue = a.assetName;
        bValue = b.assetName;
        break;
      case "requestedBy":
        aValue = a.requestedBy;
        bValue = b.requestedBy;
        break;
      case "unit":
        aValue = a.unit;
        bValue = b.unit;
        break;
      case "estimatedCost":
        aValue = a.estimatedCost;
        bValue = b.estimatedCost;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "requestDate":
        aValue = new Date(a.requestDate);
        bValue = new Date(b.requestDate);
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
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800";
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
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "Từ chối";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã mua sắm";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 main-content">
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
              Lập tờ trình cho các danh sách đề xuất thay thế linh kiện đã được
              tạo
            </p>
          </div>
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
                <option value={ReplacementStatus.ĐÃ_DUYỆT}>Đã duyệt</option>
                <option value={ReplacementStatus.ĐÃ_TỪ_CHỐI}>Từ chối</option>
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
            Danh sách linh kiện chờ lập tờ trình ({sortedRequests.length})
          </h2>
        </div>

        <div className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="flex-1 overflow-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="p-3 space-y-3">
                {sortedRequests.length > 0 ? (
                  sortedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {request.assetName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              Mã: {request.id}
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
                          <div className="text-gray-500">Người đề xuất</div>
                          <div className="text-gray-900 font-medium">
                            {request.requestedBy}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Đơn vị</div>
                          <div className="text-gray-900 font-medium">
                            {request.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Chi phí ước tính</div>
                          <div className="text-green-600 font-semibold">
                            {request.estimatedCost.toLocaleString("vi-VN")} VNĐ
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Ngày đề xuất</div>
                          <div className="text-gray-900">
                            {new Date(request.requestDate).toLocaleDateString(
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
                            if (request.status === ReplacementStatus.ĐÃ_DUYỆT) {
                              router.push(
                                `/to-truong-ky-thuat/lap-to-trinh/lap-to-trinh/${request.id}`
                              );
                            }
                          }}
                          disabled={
                            request.status !== ReplacementStatus.ĐÃ_DUYỆT
                          }
                          className={`px-3 py-1 text-xs font-medium border rounded-md transition-colors ${
                            request.status === ReplacementStatus.ĐÃ_DUYỆT
                              ? "text-blue-700 bg-blue-100 border-blue-300 hover:bg-blue-200 cursor-pointer"
                              : "text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
                          }`}>
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
                    <th className="w-[30%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                        onClick={() => handleSort("assetName")}>
                        <span>Linh kiện</span>
                        {getSortIcon("assetName")}
                      </button>
                    </th>
                    <th className="w-[14%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                        onClick={() => handleSort("requestedBy")}>
                        <span>Người đề xuất</span>
                        {getSortIcon("requestedBy")}
                      </button>
                    </th>
                    <th className="w-[8%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                        onClick={() => handleSort("unit")}>
                        <span>Đơn vị</span>
                        {getSortIcon("unit")}
                      </button>
                    </th>
                    <th className="w-[12%] px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-end space-x-1 hover:text-gray-700 ml-auto uppercase whitespace-nowrap"
                        onClick={() => handleSort("estimatedCost")}>
                        <span>Chi phí</span>
                        {getSortIcon("estimatedCost")}
                      </button>
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        onClick={() => handleSort("requestDate")}>
                        <span>Ngày đề xuất</span>
                        {getSortIcon("requestDate")}
                      </button>
                    </th>
                    <th className="w-[16%] lg:w-[16%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRequests.length > 0 ? (
                    sortedRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap w-[30%]">
                          <div className="flex items-center min-w-0">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div
                                className="text-sm font-medium text-gray-900 truncate"
                                title={request.assetName}>
                                {request.assetName}
                              </div>
                              <div
                                className="text-xs text-gray-500 truncate"
                                title={request.id}>
                                #{request.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap w-[14%]">
                          <div
                            className="text-sm text-gray-900 truncate"
                            title={request.requestedBy}>
                            {request.requestedBy}
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-center w-[8%]">
                          <div
                            className="text-xs text-gray-900 truncate"
                            title={request.unit}>
                            {request.unit}
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-right w-[12%]">
                          <div className="text-sm font-semibold text-green-600">
                            {(request.estimatedCost / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500">VNĐ</div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-center w-[10%]">
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
                            {new Date(request.requestDate).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap w-[16%]">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                router.push(
                                  `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                                );
                              }}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  request.status === ReplacementStatus.ĐÃ_DUYỆT
                                ) {
                                  router.push(
                                    `/to-truong-ky-thuat/lap-to-trinh/lap-to-trinh/${request.id}`
                                  );
                                }
                              }}
                              disabled={
                                request.status !== ReplacementStatus.ĐÃ_DUYỆT
                              }
                              className={`inline-flex items-center px-3 py-1.5 border rounded text-xs font-medium whitespace-nowrap transition-colors ${
                                request.status === ReplacementStatus.ĐÃ_DUYỆT
                                  ? "text-blue-700 bg-blue-50 border-blue-300 hover:bg-blue-100 cursor-pointer"
                                  : "text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
                              }`}
                              title={
                                request.status === ReplacementStatus.ĐÃ_DUYỆT
                                  ? "Lập tờ trình"
                                  : "Chỉ được lập tờ trình khi đã duyệt"
                              }>
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
      </div>
    </div>
  );
}
