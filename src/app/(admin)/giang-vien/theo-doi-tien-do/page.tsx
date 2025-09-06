"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface RepairRequest {
  id: string;
  requestCode: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  componentId?: string;
  componentName?: string;
  reporterId: string;
  reporterName: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  roomId: string;
  roomName: string;
  errorTypeId?: string;
  errorTypeName?: string;
  description: string;
  mediaUrls?: string[];
  status: "CHỜ_TIẾP_NHẬN" | "ĐANG_XỬ_LÝ" | "HOÀN_THÀNH" | "HỦY_BỎ";
  resolutionNotes?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

const mockRequests: RepairRequest[] = [
  {
    id: "req-001",
    requestCode: "YCSC-2025-0001",
    assetId: "ASSET001",
    assetName: "PC Dell OptiPlex 3080 - Máy 01",
    assetCode: "PC-A101-01",
    componentId: "COMP001",
    componentName: "CPU",
    reporterId: "user-001",
    reporterName: "Nguyễn Văn A",
    assignedTechnicianId: "tech-001",
    assignedTechnicianName: "Kỹ thuật viên Minh",
    roomId: "ROOM001",
    roomName: "Phòng máy tính A101",
    errorTypeId: "ET001",
    errorTypeName: "Không khởi động được",
    description:
      "Máy tính không khởi động được, có tiếng beep liên tục khi bấm nút nguồn. Đèn LED mainboard vẫn sáng bình thường.",
    status: "ĐANG_XỬ_LÝ",
    createdAt: "2025-01-15T08:30:00Z",
    acceptedAt: "2025-01-16T09:15:00Z",
  },
  {
    id: "req-002",
    requestCode: "YCSC-2025-0002",
    assetId: "ASSET002",
    assetName: "PC Dell OptiPlex 3080 - Máy 02",
    assetCode: "PC-A101-02",
    componentId: "COMP015",
    componentName: "Màn hình",
    reporterId: "user-001",
    reporterName: "Nguyễn Văn A",
    assignedTechnicianId: "tech-002",
    assignedTechnicianName: "Kỹ thuật viên Hùng",
    roomId: "ROOM001",
    roomName: "Phòng máy tính A101",
    errorTypeId: "ET002",
    errorTypeName: "Màn hình không hiển thị",
    description:
      "Màn hình không hiển thị hình ảnh, đèn nguồn vẫn bật nhưng màn hình đen. Máy tính khởi động bình thường.",
    status: "HOÀN_THÀNH",
    resolutionNotes:
      "Đã thay thế cáp VGA và cập nhật driver card màn hình. Màn hình hoạt động bình thường.",
    createdAt: "2025-01-10T10:15:00Z",
    acceptedAt: "2025-01-10T14:20:00Z",
    completedAt: "2025-01-12T16:45:00Z",
  },
  {
    id: "req-003",
    requestCode: "YCSC-2025-0003",
    assetId: "ASSET003",
    assetName: "PC HP ProDesk 400 - Máy 03",
    assetCode: "PC-A101-03",
    reporterId: "user-001",
    reporterName: "Nguyễn Văn A",
    roomId: "ROOM001",
    roomName: "Phòng máy tính A101",
    errorTypeId: "ET005",
    errorTypeName: "Chạy chậm",
    description:
      "Máy tính khởi động và chạy rất chậm, mở ứng dụng lâu, thường xuyên bị đơ.",
    status: "CHỜ_TIẾP_NHẬN",
    createdAt: "2025-01-16T14:00:00Z",
  },
  {
    id: "req-004",
    requestCode: "YCSC-2025-0004",
    assetId: "ASSET005",
    assetName: "PC Dell Inspiron - Máy 05",
    assetCode: "PC-A102-01",
    componentId: "COMP008",
    componentName: "Bàn phím",
    reporterId: "user-002",
    reporterName: "Trần Thị B",
    assignedTechnicianId: "tech-001",
    assignedTechnicianName: "Kỹ thuật viên Minh",
    roomId: "ROOM002",
    roomName: "Phòng máy tính A102",
    errorTypeId: "ET006",
    errorTypeName: "Lỗi bàn phím/chuột",
    description:
      "Một số phím trên bàn phím không hoạt động, đặc biệt là phím Space và Enter.",
    status: "ĐANG_XỬ_LÝ",
    createdAt: "2025-01-14T09:20:00Z",
    acceptedAt: "2025-01-14T15:30:00Z",
  },
];

const statusConfig = {
  CHỜ_TIẾP_NHẬN: {
    label: "Chờ tiếp nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  ĐANG_XỬ_LÝ: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertTriangle,
  },
  HOÀN_THÀNH: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  HỦY_BỎ: {
    label: "Hủy bỏ",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: X,
  },
};

export default function TheoDaoTienDoPage() {
  const [requests] = useState<RepairRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] =
    useState<RepairRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(
    null
  );
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof RepairRequest | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Handle sorting
  const handleSort = (field: keyof RepairRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.requestCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue: string | undefined = a[sortField] as string | undefined;
        const bValue: string | undefined = b[sortField] as string | undefined;

        // Handle null/undefined values
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === "asc" ? -1 : 1;
        if (!bValue) return sortDirection === "asc" ? 1 : -1;

        // Handle date comparison
        if (sortField === "createdAt" || sortField === "acceptedAt" || sortField === "completedAt") {
          const aTime = new Date(aValue).getTime();
          const bTime = new Date(bValue).getTime();
          return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
        }

        // Handle string comparison
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();

        if (aLower < bLower) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aLower > bLower) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Sortable header component
  const SortableHeader = ({ 
    field, 
    children 
  }: { 
    field: keyof RepairRequest, 
    children: React.ReactNode 
  }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp 
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "asc" 
                ? "text-blue-600" 
                : "text-gray-400"
            }`} 
          />
          <ChevronDown 
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "desc" 
                ? "text-blue-600" 
                : "text-gray-400"
            }`} 
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Theo dõi tiến độ
            </h1>
            <p className="text-gray-600">
              Theo dõi trạng thái xử lý các báo cáo đã gửi
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã yêu cầu, tài sản, phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="CHỜ_TIẾP_NHẬN">Chờ tiếp nhận</option>
              <option value="ĐANG_XỬ_LÝ">Đang xử lý</option>
              <option value="HOÀN_THÀNH">Hoàn thành</option>
              <option value="HỦY_BỎ">Hủy bỏ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách yêu cầu ({filteredRequests.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="requestCode">
                  Mã yêu cầu
                </SortableHeader>
                <SortableHeader field="assetName">
                  Tài sản
                </SortableHeader>
                <SortableHeader field="roomName">
                  Phòng
                </SortableHeader>
                <SortableHeader field="errorTypeName">
                  Loại lỗi
                </SortableHeader>
                <SortableHeader field="status">
                  Trạng thái
                </SortableHeader>
                <SortableHeader field="assignedTechnicianName">
                  Người xử lý
                </SortableHeader>
                <SortableHeader field="createdAt">
                  Ngày tạo
                </SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.requestCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.assetName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.assetCode}
                        </div>
                        {request.componentName && (
                          <div className="text-xs text-gray-400">
                            Linh kiện: {request.componentName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.roomName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.errorTypeName || "Chưa phân loại"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusConfig[request.status].color
                        }`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[request.status].label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.assignedTechnicianName || "Chưa tiếp nhận"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có yêu cầu
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy yêu cầu nào phù hợp với bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết yêu cầu {selectedRequest.requestCode}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tài sản
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.assetName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.assetCode}
                    </p>
                    {selectedRequest.componentName && (
                      <p className="text-xs text-gray-400">
                        Linh kiện: {selectedRequest.componentName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phòng
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.roomName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại lỗi
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.errorTypeName || "Chưa phân loại"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${
                        statusConfig[selectedRequest.status].color
                      }`}>
                      {statusConfig[selectedRequest.status].label}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                  {selectedRequest.acceptedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày tiếp nhận
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedRequest.acceptedAt)}
                      </p>
                    </div>
                  )}
                  {selectedRequest.completedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày hoàn thành
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedRequest.completedAt)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người báo cáo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.reporterName}
                    </p>
                  </div>
                  {selectedRequest.assignedTechnicianName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Người xử lý
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRequest.assignedTechnicianName}
                      </p>
                    </div>
                  )}
                </div>

                {selectedRequest.resolutionNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú xử lý
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
