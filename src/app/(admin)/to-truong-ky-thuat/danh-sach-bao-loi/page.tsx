"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  User,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Calculator,
  Download,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { RepairRequest, RepairStatus } from "@/types";
import {
  mockRepairRequests,
  repairRequestStatusConfig,
  errorTypes,
} from "@/lib/mockData";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";

export default function DanhSachBaoLoiPage() {
  const router = useRouter();
  const [requests] = useState<RepairRequest[]>(mockRepairRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedErrorType, setSelectedErrorType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        overflow-y: scroll;
        scrollbar-gutter: stable;
      }
      
      body {
        min-height: 100vh;
        overflow-x: hidden;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
        width: 100vw;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Cố định width để tránh nhảy khi scrollbar xuất hiện/biến mất */
      .table-container {
        overflow-y: scroll;
        scrollbar-gutter: stable;
      }
      
      .container {
        width: 100% !important;
        max-width: none !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      
      /* Cố định layout cho filter section */
      .filter-section {
        position: relative;
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Hàm lấy icon sắp xếp với trạng thái rõ ràng hơn
  const getSortIcon = (field: string) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesErrorType =
      selectedErrorType === "all" ||
      request.errorTypeName === selectedErrorType;
    const matchesSearch =
      searchTerm === "" ||
      request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesErrorType && matchesSearch;
  });

  // Sắp xếp dữ liệu đã lọc
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortField || sortDirection === "none") return 0;

    let aValue: string | Date = "";
    let bValue: string | Date = "";

    switch (sortField) {
      case "requestCode":
        aValue = a.requestCode;
        bValue = b.requestCode;
        break;
      case "assetCode":
        aValue = a.assetCode;
        bValue = b.assetCode;
        break;
      case "reporterName":
        aValue = a.reporterName;
        bValue = b.reporterName;
        break;
      case "errorTypeName":
        aValue = a.errorTypeName || "";
        bValue = b.errorTypeName || "";
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

  const getStatusBadge = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.color : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.label : status;
  };

  const getStatusIcon = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    const IconComponent = config ? config.icon : Clock;
    return <IconComponent className="h-4 w-4" />;
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
  }, [selectedStatus, selectedErrorType, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-2 main-content">
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
                  <span>Danh sách báo lỗi</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách báo lỗi
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các báo cáo lỗi từ giảng viên
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chờ tiếp nhận
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      requests.filter(
                        (r) => r.status === RepairStatus.CHỜ_TIẾP_NHẬN
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang xử lý
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      requests.filter(
                        (r) => r.status === RepairStatus.ĐANG_XỬ_LÝ
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoàn thành
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      requests.filter(
                        (r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calculator className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng cộng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 filter-section">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mã tài sản, tên thiết bị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value={RepairStatus.CHỜ_TIẾP_NHẬN}>Chờ tiếp nhận</option>
              <option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>Đã tiếp nhận</option>
              <option value={RepairStatus.ĐANG_XỬ_LÝ}>Đang xử lý</option>
              <option value={RepairStatus.CHỜ_THAY_THẾ}>Chờ thay thế</option>
              <option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>Hoàn thành</option>
              <option value={RepairStatus.ĐÃ_HỦY}>Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại lỗi
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedErrorType}
              onChange={(e) => setSelectedErrorType(e.target.value)}>
              <option value="all">Tất cả</option>
              {errorTypes.map((errorType) => (
                <option key={errorType.id} value={errorType.name}>
                  {errorType.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Danh sách báo lỗi ({sortedRequests.length})
            </h2>
            {selectedItems.length > 0 && (
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Đã chọn: {selectedItems.length} mục
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="h-10 sm:h-12">
                  <th className="w-10 px-1 py-2 sm:py-3 text-left">
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
                  <th
                    className="w-28 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("requestCode")}>
                    <div className="flex items-center">
                      <span className="truncate">Mã báo lỗi</span>
                      {getSortIcon("requestCode")}
                    </div>
                  </th>
                  <th
                    className="w-48 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("assetCode")}>
                    <div className="flex items-center">
                      <span className="truncate">Tài sản</span>
                      {getSortIcon("assetCode")}
                    </div>
                  </th>
                  <th
                    className="w-32 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("reporterName")}>
                    <div className="flex items-center">
                      <span className="truncate">Người báo</span>
                      {getSortIcon("reporterName")}
                    </div>
                  </th>
                  <th
                    className="w-24 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("errorTypeName")}>
                    <div className="flex items-center">
                      <span className="truncate">Loại lỗi</span>
                      {getSortIcon("errorTypeName")}
                    </div>
                  </th>
                  <th
                    className="w-28 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      <span className="truncate">Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="w-24 px-1 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center">
                      <span className="truncate">Ngày báo</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="w-16 px-1 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentData().length > 0 ? (
                  getCurrentData().map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 h-14">
                      <td className="px-1 py-2">
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
                      <td className="px-1 py-2">
                        <div
                          className="text-xs font-medium text-gray-900 truncate"
                          title={request.requestCode}>
                          {request.requestCode}
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <div>
                          <div
                            className="text-xs font-medium text-gray-900 truncate"
                            title={request.assetCode}>
                            {request.assetCode}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={request.assetName}>
                            {request.assetName}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span
                              className="truncate"
                              title={`${request.roomName} - ${request.buildingName}`}>
                              {request.roomName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <div className="flex items-center">
                          <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <div
                              className="text-xs font-medium text-gray-900 truncate"
                              title={request.reporterName}>
                              {request.reporterName}
                            </div>
                            <div
                              className="text-xs text-gray-500 truncate"
                              title={request.reporterRole}>
                              {request.reporterRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <span
                          className="text-xs text-gray-900 truncate block"
                          title={request.errorTypeName || "Chưa xác định"}>
                          {request.errorTypeName || "Chưa xác định"}
                        </span>
                      </td>
                      <td className="px-1 py-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getStatusIcon(request.status)}
                          </div>
                          <span
                            className={`ml-1 inline-flex px-1 py-1 text-xs font-semibold rounded-full truncate ${getStatusBadge(
                              request.status
                            )}`}
                            title={getStatusText(request.status)}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span
                            className="text-xs text-gray-900 truncate"
                            title={new Date(
                              request.createdAt
                            ).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}>
                            {new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <button
                          onClick={() => {
                            router.push(
                              `/to-truong-ky-thuat/danh-sach-bao-loi/chi-tiet?id=${request.id}`
                            );
                          }}
                          className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
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

        {/* Pagination */}
        <div className="border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={sortedRequests.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
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
                  Đã xuất {exportCount} báo lỗi thành công.
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
