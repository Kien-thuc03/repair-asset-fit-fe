"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Building,
  Package,
  User,
  Calendar,
  Printer,
  AlertTriangle,
  CheckCircle,
  MemoryStick,
  HardDrive,
  Cpu,
  Monitor,
} from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import {
  ReplacementStatus,
  ComponentType,
} from "@/types/repair";

export default function RequestDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Tìm replacement request theo ID
  const request = mockReplacementRequestItem.find((r) => r.id === id);

  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case ComponentType.RAM:
        return <MemoryStick className="h-4 w-4" />;
      case ComponentType.STORAGE:
        return <HardDrive className="h-4 w-4" />;
      case ComponentType.CPU:
        return <Cpu className="h-4 w-4" />;
      case ComponentType.PSU:
        return <Package className="h-4 w-4" />;
      case ComponentType.MAINBOARD:
      case ComponentType.GPU:
      case ComponentType.MONITOR:
        return <Monitor className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt - Cần lập biên bản";
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy tờ trình
        </h3>
        <p className="text-gray-500">
          Tờ trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/phong-quan-tri/lap-bien-ban"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Quay lại danh sách
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/phong-quan-tri/lap-bien-ban"
            className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <Printer className="w-4 h-4 mr-2" />
            In tờ trình
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FileText className="w-4 h-4 mr-2" />
            Gửi biên bản cho phòng kỹ thuật
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Chi tiết tờ trình thay thế linh kiện
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Mã tờ trình: {request.proposalCode}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                request.status
              )}`}>
              {getStatusIcon(request.status)}
              <span className="ml-2">{getStatusText(request.status)}</span>
            </span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Request Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin tờ trình
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã tờ trình
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.proposalCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tiêu đề
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{request.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tạo
                  </label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Người tạo
                  </label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {request.createdBy}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Components List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Danh sách linh kiện cần thay thế ({request.components.length}{" "}
              loại)
            </h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng/Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện hiện tại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện thay thế
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lý do
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.components.map((component, index) => (
                    <tr
                      key={component.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            {component.buildingName} - {component.roomName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Máy: {component.machineLabel}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getComponentIcon(component.componentType)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {component.componentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {component.assetName} ({component.assetCode})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {component.newItemName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {component.newItemSpecs}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {component.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {component.reason}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Ngày tạo:</span>
                <span className="ml-2">
                  {new Date(request.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <div>
                <span className="font-medium">Cập nhật lần cuối:</span>
                <span className="ml-2">
                  {new Date(request.updatedAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <div>
                <span className="font-medium">Người tạo:</span>
                <span className="ml-2">{request.createdBy}</span>
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span>
                <span className="ml-2">{getStatusText(request.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
