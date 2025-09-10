"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Camera,
  Calendar,
  User,
  Wrench,
  Link,
  ArrowLeft,
} from "lucide-react";
import { Asset } from "@/types";
import {
  mockAssetsLookup,
  mockRepairHistoryLookup,
  assetStatusConfig,
  categoryIcons,
} from "@/lib/mockData";

export default function TraCuuThietBiPage() {
  const [assets] = useState<Asset[]>(mockAssetsLookup);
  const [filteredAssets, setFilteredAssets] =
    useState<Asset[]>(mockAssetsLookup);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showRepairHistory, setShowRepairHistory] = useState(false);

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        scrollbar-gutter: stable;
        overflow-y: scroll; /* Fallback cho trình duyệt không hỗ trợ scrollbar-gutter */
      }
      
      body {
        min-height: 100vh; /* Đảm bảo body luôn có chiều cao tối thiểu */
      }
      
      /* Hỗ trợ cho trình duyệt hiện đại */
      @supports (scrollbar-gutter: stable) {
        html {
          overflow-y: auto; /* Reset overflow khi đã có scrollbar-gutter */
        }
      }
      
      /* Đảm bảo container luôn có đủ chiều cao */
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

  // Get repair history for selected asset
  const getRepairHistory = (assetId: string) => {
    return mockRepairHistoryLookup.filter(
      (repair) => repair.assetId === assetId
    );
  };

  // Handle QR scan
  const handleQRScan = (qrCode: string) => {
    const asset = assets.find((asset) => asset.qrCode === qrCode);
    if (asset) {
      setSelectedAsset(asset);
      setShowRepairHistory(true);
    } else {
      alert("Không tìm thấy thiết bị với mã QR này!");
    }
  };

  // Simulate QR scan for demo
  const simulateQRScan = () => {
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    handleQRScan(randomAsset.qrCode);
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
  }, [assets, searchTerm, categoryFilter, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
    <div
      className="space-y-6 main-content"
      style={{
        scrollbarGutter: "stable",
        minHeight: "calc(100vh - 4rem)",
      }}>
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
                Tra cứu tài sản
              </h1>
              <p className="text-gray-600">
                Tìm kiếm và xem thông tin chi tiết tài sản thiết bị
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
            {filteredAssets.map((asset) => {
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
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowRepairHistory(false);
                        }}
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

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Chi tiết tài sản: {selectedAsset.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    setShowRepairHistory(false);
                  }}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setShowRepairHistory(false)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      !showRepairHistory
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    Thông tin thiết bị
                  </button>
                  <button
                    onClick={() => setShowRepairHistory(true)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      showRepairHistory
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    Lịch sử sửa chữa (
                    {getRepairHistory(selectedAsset.id).length})
                  </button>
                </nav>
              </div>

              {/* Content based on active tab */}
              {!showRepairHistory ? (
                // Device Information Tab
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Thông tin cơ bản
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Mã tài sản:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.assetCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Tên tài sản:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Danh mục:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Model:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Serial Number:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.serialNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedAsset.roomName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Trạng thái:
                        </span>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            assetStatusConfig[selectedAsset.status].color
                          }`}>
                          {assetStatusConfig[selectedAsset.status].label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warranty & Maintenance */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Bảo hành & Bảo trì
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Ngày mua:
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(selectedAsset.purchaseDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Hết hạn bảo hành:
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(selectedAsset.warrantyExpiry)}
                        </span>
                      </div>
                      {selectedAsset.lastMaintenanceDate && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Bảo trì lần cuối:
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(selectedAsset.lastMaintenanceDate)}
                          </span>
                        </div>
                      )}
                      {selectedAsset.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Được giao cho:
                          </span>
                          <span className="text-sm text-gray-900">
                            {selectedAsset.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  {selectedAsset.specifications && (
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Thông số kỹ thuật
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(selectedAsset.specifications).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                  {key}:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Repair History Tab
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">
                      Lịch sử sửa chữa và thay thế linh kiện
                    </h4>
                  </div>

                  {getRepairHistory(selectedAsset.id).length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Thiết bị này chưa có lịch sử sửa chữa
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {getRepairHistory(selectedAsset.id).map((repair) => (
                        <div
                          key={repair.id}
                          className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                  {repair.requestCode}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    repair.status === "ĐÃ_HOÀN_THÀNH"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                  {repair.status === "ĐÃ_HOÀN_THÀNH"
                                    ? "Hoàn thành"
                                    : "Đang xử lý"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {repair.errorType}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(repair.reportDate)}</span>
                              </div>
                              {repair.completedDate && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    {formatDate(repair.completedDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2">
                                Mô tả lỗi:
                              </h6>
                              <p className="text-sm text-gray-600">
                                {repair.description}
                              </p>

                              <div className="mt-3">
                                <h6 className="font-medium text-gray-900 mb-2">
                                  Giải pháp:
                                </h6>
                                <p className="text-sm text-gray-600">
                                  {repair.solution}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center space-x-1 text-sm text-gray-500">
                                <User className="w-4 h-4" />
                                <span>
                                  Kỹ thuật viên: {repair.technicianName}
                                </span>
                              </div>
                            </div>

                            {/* Component Changes */}
                            {repair.componentChanges &&
                              repair.componentChanges.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2">
                                    Thay thế linh kiện:
                                  </h6>
                                  <div className="space-y-3">
                                    {repair.componentChanges.map(
                                      (change, index) => (
                                        <div
                                          key={index}
                                          className="bg-blue-50 p-3 rounded-lg">
                                          <div className="font-medium text-sm text-blue-900 mb-1">
                                            {change.componentType}
                                          </div>
                                          {change.oldComponent && (
                                            <div className="text-xs text-red-600 mb-1">
                                              <span className="font-medium">
                                                Cũ:
                                              </span>{" "}
                                              {change.oldComponent}
                                            </div>
                                          )}
                                          <div className="text-xs text-green-600 mb-1">
                                            <span className="font-medium">
                                              Mới:
                                            </span>{" "}
                                            {change.newComponent}
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                              Lý do:
                                            </span>{" "}
                                            {change.changeReason}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
