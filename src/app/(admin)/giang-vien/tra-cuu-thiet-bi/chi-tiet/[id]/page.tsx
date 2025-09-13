"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  ArrowLeft,
  Monitor,
  Calendar,
  User,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  mockAssetsLookup,
  mockRepairHistoryLookup,
  assetStatusConfig,
  categoryIcons,
} from "@/lib/mockData";

export default function ChiTietThietBiPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for tabs
  const [showRepairHistory, setShowRepairHistory] = useState(false);

  const asset = useMemo(() => mockAssetsLookup.find((a) => a.id === id), [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const today = new Date();
    const expiry = new Date(warrantyExpiry);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Hết hạn", color: "text-red-600" };
    } else if (diffDays <= 30) {
      return { label: "Sắp hết hạn", color: "text-yellow-600" };
    } else {
      return { label: "Còn hiệu lực", color: "text-green-600" };
    }
  };

  const getRepairHistory = (assetId: string) => {
    return mockRepairHistoryLookup.filter(
      (repair) => repair.assetId === assetId
    );
  };

  if (!asset) {
    return (
      <div className="space-y-4">
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
              href: "/giang-vien/tra-cuu-thiet-bi",
              title: (
                <div className="flex items-center">
                  <span>Tra cứu thiết bị</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết</span>
                </div>
              ),
            },
          ]}
        />
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Không tìm thấy thiết bị
          </h1>
          <p className="mt-2 text-gray-600">
            Thiết bị với ID này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = assetStatusConfig[asset.status].icon;
  const CategoryIcon = categoryIcons[asset.category] || Monitor;
  const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);

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
            href: "/giang-vien/tra-cuu-thiet-bi",
            title: (
              <div className="flex items-center">
                <span>Tra cứu thiết bị</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết • {asset.name}</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CategoryIcon className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {asset.name}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {asset.assetCode} • {asset.category}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            {/* Status badge */}
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${
                assetStatusConfig[asset.status].color
              }`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {assetStatusConfig[asset.status].label}
            </div>
            {/* Warranty status */}
            <div className={`text-sm font-medium ${warrantyStatus.color}`}>
              Bảo hành: {warrantyStatus.label}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setShowRepairHistory(false)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                !showRepairHistory
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Thông tin thiết bị</span>
              </div>
            </button>
            <button
              onClick={() => setShowRepairHistory(true)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                showRepairHistory
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4" />
                <span>
                  Lịch sử sửa chữa ({getRepairHistory(asset.id).length})
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {!showRepairHistory ? (
            // Device Information Tab
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span>Thông tin cơ bản</span>
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Mã tài sản:
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      {asset.assetCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Tên tài sản:
                    </span>
                    <span className="text-sm text-gray-900">{asset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Danh mục:
                    </span>
                    <span className="text-sm text-gray-900">
                      {asset.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Model:
                    </span>
                    <span className="text-sm text-gray-900">{asset.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Serial Number:
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      {asset.serialNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Phòng:
                    </span>
                    <span className="text-sm text-gray-900">
                      {asset.roomName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Trạng thái:
                    </span>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        assetStatusConfig[asset.status].color
                      }`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {assetStatusConfig[asset.status].label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty & Maintenance */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Bảo hành & Bảo trì</span>
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Ngày mua:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(asset.purchaseDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Hết hạn bảo hành:
                    </span>
                    <span
                      className={`text-sm ${warrantyStatus.color} font-medium`}>
                      {formatDate(asset.warrantyExpiry)}
                    </span>
                  </div>
                  {asset.lastMaintenanceDate && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Bảo trì lần cuối:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(asset.lastMaintenanceDate)}
                      </span>
                    </div>
                  )}
                  {asset.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Được giao cho:
                      </span>
                      <span className="text-sm text-gray-900">
                        {asset.assignedTo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications */}
              {asset.specifications && (
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Thông số kỹ thuật</span>
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(asset.specifications).map(
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

              {getRepairHistory(asset.id).length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có lịch sử sửa chữa
                  </h3>
                  <p className="text-gray-500">
                    Thiết bị này chưa từng được báo cáo lỗi hoặc sửa chữa.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getRepairHistory(asset.id).map((repair) => (
                    <div
                      key={repair.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-lg text-gray-900">
                              {repair.requestCode}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                repair.status === "ĐÃ_HOÀN_THÀNH"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                              {repair.status === "ĐÃ_HOÀN_THÀNH"
                                ? "Hoàn thành"
                                : "Đang xử lý"}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1 font-medium">
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
                              <span>{formatDate(repair.completedDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium text-gray-900 mb-3">
                            Mô tả lỗi:
                          </h6>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              {repair.description}
                            </p>
                          </div>

                          <h6 className="font-medium text-gray-900 mb-3 mt-4">
                            Giải pháp:
                          </h6>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              {repair.solution}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              Kỹ thuật viên:{" "}
                              <strong>{repair.technicianName}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Component Changes */}
                        {repair.componentChanges &&
                          repair.componentChanges.length > 0 && (
                            <div>
                              <h6 className="font-medium text-gray-900 mb-3">
                                Thay thế linh kiện:
                              </h6>
                              <div className="space-y-3">
                                {repair.componentChanges.map(
                                  (change, index) => (
                                    <div
                                      key={index}
                                      className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                      <div className="font-medium text-sm text-blue-900 mb-2">
                                        {change.componentType}
                                      </div>
                                      {change.oldComponent && (
                                        <div className="text-xs text-red-700 mb-1">
                                          <span className="font-medium">
                                            Cũ:
                                          </span>{" "}
                                          {change.oldComponent}
                                        </div>
                                      )}
                                      <div className="text-xs text-green-700 mb-1">
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
  );
}
