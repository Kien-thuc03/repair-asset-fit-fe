"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  Building,
  MapPin,
  AlertTriangle,
  Download,
  Package,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Eye,
} from "lucide-react";
import { Breadcrumb } from "antd";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, ComponentType } from "@/types/repair";
import SignConfirmModal from "@/components/modal/SignConfirmModal";

export default function XuLyToTrinhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignConfirmModal, setShowSignConfirmModal] = useState(false);

  // State cho việc theo dõi trạng thái từng component

  // Tìm proposal theo ID
  const proposal = useMemo(() => {
    return mockReplacementRequestItem.find((item) => item.id === id);
  }, [id]);

  if (!proposal) {
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
          href="/phong-quan-tri/xu-ly-to-trinh"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

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
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Chờ xử lý";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In thực tế, sẽ gọi API để cập nhật status
    console.log(
      `${actionType === "approve" ? "Duyệt" : "Từ chối"} tờ trình ${
        proposal.id
      }`,
      {
        adminNotes,
        newStatus:
          actionType === "approve"
            ? ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH
            : ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
      }
    );

    setIsProcessing(false);
    setActionType(null);
    setAdminNotes("");

    // Redirect về danh sách sau khi xử lý xong
    router.push(
      "/phong-quan-tri/xu-ly-to-trinh?success=" +
        (actionType === "approve" ? "approved" : "rejected")
    );
  };

  const handleSignConfirm = async () => {
    setIsProcessing(true);
    setShowSignConfirmModal(false);

    // Simulate API call để duyệt tờ trình
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In thực tế, sẽ gọi API để cập nhật status thành ĐÃ_DUYỆT_TỜ_TRÌNH
    console.log(`Duyệt tờ trình ${proposal.id}`, {
      newStatus: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
      signedAt: new Date().toISOString(),
    });

    setIsProcessing(false);

    // Redirect về danh sách sau khi xử lý xong
    router.push("/phong-quan-tri/xu-ly-to-trinh?success=approved");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri",
              title: (
                <div className="flex items-center">
                  <span>Phòng quản trị</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri/xu-ly-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Xử lý tờ trình</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết tờ trình {proposal.proposalCode}</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Proposal Info Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Chi tiết tờ trình thay thế
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Mã đề xuất: {proposal.proposalCode}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                proposal.status
              )}`}>
              {getStatusText(proposal.status)}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề đề xuất
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {proposal.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tạo
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md leading-relaxed">
                {proposal.description}
              </p>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin vị trí
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                // Lấy danh sách các phòng duy nhất từ tất cả components
                const uniqueRooms = Array.from(
                  new Set(
                    proposal.components.map(
                      (comp) => `${comp.buildingName}-${comp.roomName}`
                    )
                  )
                ).map((roomKey) => {
                  const [buildingName, roomName] = roomKey.split("-");
                  return { buildingName, roomName };
                });

                // Đếm số lượng linh kiện theo từng phòng
                const roomCounts = proposal.components.reduce((acc, comp) => {
                  const roomKey = `${comp.buildingName}-${comp.roomName}`;
                  acc[roomKey] = (acc[roomKey] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                // Nếu chỉ có 1 phòng, hiển thị đơn giản
                if (uniqueRooms.length === 1) {
                  const room = uniqueRooms[0];
                  return (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Tòa nhà:
                        </span>
                        <span className="text-sm text-gray-900">
                          {room.buildingName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {room.roomName}
                        </span>
                      </div>
                    </div>
                  );
                }

                // Nếu có nhiều phòng, hiển thị danh sách
                return (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Tòa nhà:
                      </span>
                      <span className="text-sm text-gray-900">
                        {uniqueRooms[0].buildingName}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-sm font-medium text-gray-700">
                          Các phòng thực hiện:
                        </span>
                      </div>
                      <div className="ml-7 space-y-2">
                        {uniqueRooms.map((room, index) => {
                          const roomKey = `${room.buildingName}-${room.roomName}`;
                          const componentCount = roomCounts[roomKey];
                          const machineCount = Math.floor(componentCount / 2); // Chia 2 vì mỗi máy có 2 linh kiện (SSD + RAM)

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-2 rounded ">
                              <span className="text-sm font-medium text-gray-900">
                                {room.roomName}
                              </span>
                              <div className="text-xs text-gray-500">
                                {machineCount > 0 && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {machineCount} máy
                                  </span>
                                )}
                                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {componentCount} linh kiện
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            Tổng cộng:
                          </span>
                          <div className="space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {uniqueRooms.reduce((total, room) => {
                                const roomKey = `${room.buildingName}-${room.roomName}`;
                                return (
                                  total + Math.floor(roomCounts[roomKey] / 2)
                                );
                              }, 0)}{" "}
                              máy
                            </span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {proposal.components.length} linh kiện
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Components Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách linh kiện cần thay thế ({proposal.components.length}{" "}
                loại linh kiện)
              </h3>
            </div>
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
                      Lý do thay thế
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposal.components.map((component, index) => (
                    <tr
                      key={component.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">
                              {component.buildingName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {component.roomName}
                            </span>
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
                            <div className="text-xs text-gray-500">
                              Loại: {component.componentType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {component.newItemName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {component.newItemSpecs}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {component.quantity}{" "}
                          {component.quantity > 1 ? "cái" : "cái"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs">
                          {component.reason}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tài liệu đính kèm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {proposal.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tờ trình đề xuất
                      </p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={proposal.submissionFormUrl}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={proposal.submissionFormUrl}
                      download
                      className="text-gray-600 hover:text-gray-900"
                      title="Tải xuống">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Chỉ cho từ chối */}
      {showConfirmModal && actionType === "reject" && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-2 px-4 py-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận từ chối tờ trình
                </h3>
                <div className="mt-2 px-2 py-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn từ chối tờ trình
                    <strong> {proposal.proposalCode}</strong>?
                  </p>
                  {adminNotes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-left">
                      <p className="text-xs text-gray-600">Ghi chú:</p>
                      <p className="text-sm text-gray-800">{adminNotes}</p>
                    </div>
                  )}
                </div>
                <div className="items-center px-4 py-3 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600">
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 text-white text-base font-medium rounded-md shadow-sm bg-red-600 hover:bg-red-700">
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SignConfirmModal cho duyệt tờ trình */}
      <SignConfirmModal
        isOpen={showSignConfirmModal}
        onClose={() => setShowSignConfirmModal(false)}
        onConfirm={handleSignConfirm}
        reportTitle={proposal.title}
        reportNumber={proposal.proposalCode}
        isLoading={isProcessing}
        actionType="approve"
      />
    </div>
  );
}
