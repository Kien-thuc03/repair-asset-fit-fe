"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Camera,
} from "lucide-react";
import { Asset } from "@/types";
import {
  mockAssetsLookup,
  assetStatusConfig,
  categoryIcons,
} from "@/lib/mockData";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";

export default function TraCuuThietBiPage() {
  const router = useRouter();
  const [assets] = useState<Asset[]>(mockAssetsLookup);
  const [filteredAssets, setFilteredAssets] =
    useState<Asset[]>(mockAssetsLookup);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 12 items per page for grid layout
  const [paginatedAssets, setPaginatedAssets] = useState<Asset[]>([]);

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

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Simulate QR scan for demo
  const simulateQRScan = () => {
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    router.push(`/giang-vien/tra-cuu-thiet-bi/chi-tiet/${randomAsset.id}`);
  };

  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((asset) => asset.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    setFilteredAssets(filtered);

    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [assets, searchTerm, categoryFilter, statusFilter]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredAssets.slice(startIndex, endIndex);
    setPaginatedAssets(paginated);
  }, [filteredAssets, currentPage, pageSize]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const today = new Date();
    const expiry = new Date(warrantyExpiry);
    const daysLeft = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return { status: "expired", label: "Hết hạn", color: "text-red-600" };
    } else if (daysLeft < 30) {
      return {
        status: "expiring",
        label: `Còn ${daysLeft} ngày`,
        color: "text-orange-600",
      };
    } else {
      return {
        status: "valid",
        label: `Còn ${Math.ceil(daysLeft / 30)} tháng`,
        color: "text-green-600",
      };
    }
  };

  const categories = Array.from(new Set(assets.map((asset) => asset.category)));

  return (
    <div className="space-y-6 main-content">
      <div className="mb-2">
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
                  <span>Tra cứu thiết bị</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tra cứu thiết bị
              </h1>
              <p className="text-gray-600">
                Tìm kiếm và xem thông tin chi tiết thiết bị
              </p>
            </div>
          </div>

          {/* QR Scanner Button - Mobile Only */}
          {isMobile && (
            <button
              onClick={simulateQRScan}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition flex items-center justify-center shadow-lg"
              title="Quét mã QR thiết bị">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang sử dụng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.filter((e) => e.status === "đang_sử_dụng").length}
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
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chờ xử lý
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      assets.filter(
                        (e) =>
                          e.status === "chờ_bàn_giao" ||
                          e.status === "chờ_tiếp_nhận"
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
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hư hỏng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.filter((e) => e.status === "hư_hỏng").length}
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
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, model, phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="đang_sử_dụng">Đang sử dụng</option>
              <option value="chờ_bàn_giao">Chờ bàn giao</option>
              <option value="chờ_tiếp_nhận">Chờ tiếp nhận</option>
              <option value="hư_hỏng">Hư hỏng</option>
              <option value="mất_tích">Mất tích</option>
              <option value="đề_xuất_thanh_lý">Đề xuất thanh lý</option>
              <option value="đã_thanh_lý">Đã thanh lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid Header */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách thiết bị ({filteredAssets.length} tổng)
          </h3>
        </div>
      </div>

      {/* Asset Grid */}
      <div style={{ minHeight: "400px" }}>
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy tài sản
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không có tài sản nào phù hợp với bộ lọc.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedAssets.map((asset) => {
              const StatusIcon = assetStatusConfig[asset.status].icon;
              const CategoryIcon = categoryIcons[asset.category] || Monitor;
              const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);

              return (
                <div
                  key={asset.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CategoryIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {asset.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {asset.assetCode}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                          assetStatusConfig[asset.status].color
                        }`}>
                        <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {assetStatusConfig[asset.status].label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Model:</span>
                        <span className="text-gray-900">{asset.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phòng:</span>
                        <span className="text-gray-900">{asset.roomName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Bảo hành:</span>
                        <span className={`font-medium ${warrantyStatus.color}`}>
                          {warrantyStatus.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/giang-vien/tra-cuu-thiet-bi/chi-tiet/${asset.id}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="w-3 h-3 mr-1" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAssets.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredAssets.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={true}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </div>
      )}
    </div>
  );
}
