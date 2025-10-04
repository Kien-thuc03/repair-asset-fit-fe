"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Monitor,
  Calendar,
  User,
  Building,
  Download,
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types/software";
import { mockSoftwareProposals } from "@/lib/mockData/softwareProposals";
import { users } from "@/lib/mockData/users";
import { mockRooms } from "@/lib/mockData/rooms";
import { Pagination } from "@/components/common";

// Helper functions
const getUserName = (userId: string): string => {
  const user = users.find((u) => u.id === userId);
  return user ? user.fullName : userId;
};

const getRoomName = (roomId: string): string => {
  const room = mockRooms.find((r) => r.id === roomId);
  return room ? room.roomNumber : roomId;
};

// Config cho trạng thái đề xuất
const softwareProposalStatusConfig = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: "Chờ duyệt",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: "Đã duyệt",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: "Đã từ chối",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

export default function SoftwareProposalsPage() {
  const router = useRouter();

  // State
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]); // Reset selection when filter changes

    // Lọc dữ liệu
    const filtered = mockSoftwareProposals.filter(
      (proposal: SoftwareProposal) => {
        const matchesSearch = searchText
          ? [
              proposal.proposalCode,
              proposal.reason,
              getUserName(proposal.proposerId),
              getRoomName(proposal.roomId),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          : true;

        return matchesSearch;
      }
    );

    return filtered;
  }, [searchText]);

  // Dữ liệu phân trang
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(paginatedData.map((item) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = filteredAndSortedData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      Modal.warning({
        title: "Thông báo",
        content: "Vui lòng chọn ít nhất một đề xuất để xuất Excel.",
        centered: true,
        okText: "Đồng ý",
        icon: <Download className="text-orange-500" />,
      });
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import("xlsx");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map((item, index) => ({
        STT: index + 1,
        "Mã đề xuất": item.proposalCode,
        "Người đề xuất": getUserName(item.proposerId),
        Phòng: getRoomName(item.roomId),
        "Lý do đề xuất": item.reason || "",
        "Trạng thái": softwareProposalStatusConfig[item.status].label,
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
        { wch: 25 }, // Người đề xuất
        { wch: 15 }, // Phòng
        { wch: 40 }, // Lý do đề xuất
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tạo
        { wch: 15 }, // Ngày cập nhật
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đề xuất phần mềm");

      // Xuất file
      const fileName = `Danh_sach_de_xuat_phan_mem_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Modal thông báo thành công với thông tin chi tiết
      Modal.success({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            <span>Xuất Excel thành công!</span>
          </div>
        ),
        content: (
          <div className="space-y-2">
            <p>
              ✅ <strong>Số lượng đề xuất:</strong> {selectedData.length}
            </p>
            <p>
              📁 <strong>Tên file:</strong> {fileName}
            </p>
            <p>
              📍 <strong>Vị trí:</strong> Thư mục Downloads
            </p>
            <p className="text-sm text-gray-500 mt-3">
              File Excel đã được tải xuống thành công. Bạn có thể tìm thấy file
              trong thư mục Downloads của máy tính.
            </p>
          </div>
        ),
        centered: true,
        okText: "Đồng ý",
        width: 500,
        onOk: () => {
          // Reset selection sau khi người dùng đóng modal
          setSelectedRowKeys([]);
        },
      });
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);

      // Modal thông báo lỗi chi tiết
      Modal.error({
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500" />
            <span>Lỗi xuất Excel</span>
          </div>
        ),
        content: (
          <div className="space-y-2">
            <p>❌ Có lỗi xảy ra khi xuất file Excel</p>
            <p className="text-sm text-gray-600">
              <strong>Chi tiết lỗi:</strong>{" "}
              {error instanceof Error ? error.message : "Lỗi không xác định"}
            </p>
            <div className="bg-gray-50 p-3 rounded mt-3">
              <p className="text-sm font-medium text-gray-700">
                Hướng dẫn khắc phục:
              </p>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Kiểm tra kết nối internet</li>
                <li>• Đảm bảo trình duyệt cho phép tải xuống file</li>
                <li>• Thử lại sau vài giây</li>
              </ul>
            </div>
          </div>
        ),
        centered: true,
        okText: "Đồng ý",
        width: 500,
      });
    }
  };

  // Navigation handlers
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(
      `/giang-vien/danh-sach-de-xuat-phan-mem/chi-tiet/${proposal.id}`
    );
  };

  // Page change handler với reset selection
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowKeys([]); // Reset selection when changing page
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setSelectedRowKeys([]); // Reset selection when changing page size
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Danh sách đề xuất phần mềm</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="h-6 w-6 text-blue-600" />
            Danh sách đề xuất phần mềm
          </h1>
          <p className="mt-2 text-gray-600">
            Theo dõi tiến độ xử lý các đề xuất cài đặt phần mềm.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportExcel}
          disabled={selectedRowKeys.length === 0}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
            selectedRowKeys.length > 0
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-colors`}>
          <Download className="h-4 w-4 mr-2" />
          Xuất Excel{" "}
          {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className=" gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm đề xuất phần mềm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập mã đề xuất, lý do, người đề xuất..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((item) =>
                        selectedRowKeys.includes(item.id)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đề xuất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người đề xuất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((proposal) => {
                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(proposal.id)}
                        onChange={(e) =>
                          handleSelectRow(proposal.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {proposal.proposalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getUserName(proposal.proposerId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getRoomName(proposal.roomId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          softwareProposalStatusConfig[proposal.status].color
                        }`}>
                        {softwareProposalStatusConfig[proposal.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        title="Xem chi tiết"
                        onClick={() => handleViewProposal(proposal)}
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="h-4 w-4 items-center" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có đề xuất nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Chưa có đề xuất phần mềm nào được tạo.
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={filteredAndSortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />
      </div>
    </div>
  );
}
