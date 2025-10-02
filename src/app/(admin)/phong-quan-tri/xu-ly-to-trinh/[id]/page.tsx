"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Package,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Check,
  X,
  Eye,
} from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, ComponentType } from "@/types/repair";

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

  // State cho việc check components
  const [checkedComponents, setCheckedComponents] = useState<Set<string>>(
    new Set()
  );
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);

  // State cho việc theo dõi trạng thái từng component (chỉ cần rejected)
  const [componentStatus, setComponentStatus] = useState<
    Record<string, "pending" | "rejected">
  >({});
  const [showComponentActionModal, setShowComponentActionModal] =
    useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [componentActionType, setComponentActionType] = useState<
    "reject" | null
  >(null);

  // Tìm proposal theo ID
  const proposal = useMemo(() => {
    return mockReplacementRequestItem.find((item) => item.id === id);
  }, [id]);

  // Xử lý check/uncheck component (không cho check nếu đã từ chối)
  const handleComponentCheck = (componentId: string, checked: boolean) => {
    // Không cho check nếu component đã bị từ chối
    if (componentStatus[componentId] === "rejected") {
      return;
    }

    const newCheckedComponents = new Set(checkedComponents);
    if (checked) {
      newCheckedComponents.add(componentId);
    } else {
      newCheckedComponents.delete(componentId);
    }
    setCheckedComponents(newCheckedComponents);
  };

  // Xử lý check/uncheck tất cả (chỉ check những component chưa bị từ chối)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableComponentIds =
        proposal?.components
          .filter((comp) => componentStatus[comp.id] !== "rejected")
          .map((comp) => comp.id) || [];
      setCheckedComponents(new Set(availableComponentIds));
    } else {
      setCheckedComponents(new Set());
    }
  };

  // Lập biên bản cho các components đã check
  const handleCreateReport = () => {
    const checkedComponentsList =
      proposal?.components.filter((comp) => checkedComponents.has(comp.id)) ||
      [];

    console.log("Lập biên bản cho các linh kiện:", checkedComponentsList);
    // TODO: Implement logic tạo biên bản
    setShowCreateReportModal(false);
    setCheckedComponents(new Set());
  };

  // Xử lý thao tác riêng cho từng component (chỉ từ chối)
  const handleComponentAction = (componentId: string, action: "reject") => {
    setSelectedComponent(componentId);
    setComponentActionType(action);
    setShowComponentActionModal(true);
  };

  // Xác nhận thao tác cho component (chỉ từ chối)
  const handleConfirmComponentAction = () => {
    if (selectedComponent && componentActionType === "reject") {
      setComponentStatus((prev) => ({
        ...prev,
        [selectedComponent]: "rejected",
      }));

      // Nếu component đã từ chối, bỏ khỏi danh sách checked
      setCheckedComponents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedComponent);
        return newSet;
      });

      console.log("Từ chối linh kiện:", selectedComponent);
      // TODO: Implement API call
    }

    setShowComponentActionModal(false);
    setSelectedComponent(null);
    setComponentActionType(null);
  };

  // Lấy màu sắc cho status của component
  const getComponentStatusColor = (componentId: string) => {
    const status = componentStatus[componentId] || "pending";
    switch (status) {
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  const getStatusIcon = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return <FileText className="w-4 h-4" />;
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return <CheckCircle className="w-4 h-4" />;
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
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

  const canProcess = proposal.status === ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH;

  const handleAction = (action: "approve" | "reject") => {
    setActionType(action);
    setShowConfirmModal(true);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/phong-quan-tri/xu-ly-to-trinh"
            className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {canProcess && (
            <>
              <button
                onClick={() => handleAction("reject")}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                <X className="w-4 h-4 mr-2" />
                Từ chối
              </button>
              <button
                onClick={() => handleAction("approve")}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                <Check className="w-4 h-4 mr-2" />
                Duyệt tờ trình
              </button>
            </>
          )}
        </div>
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
              <span className="mr-2">{getStatusIcon(proposal.status)}</span>
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
              {checkedComponents.size > 0 && (
                <button
                  onClick={() => setShowCreateReportModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FileText className="w-4 h-4 mr-2" />
                  Lập biên bản ({checkedComponents.size} loại)
                </button>
              )}
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={(() => {
                          const availableComponents =
                            proposal.components.filter(
                              (comp) => componentStatus[comp.id] !== "rejected"
                            );
                          return (
                            checkedComponents.size ===
                              availableComponents.length &&
                            availableComponents.length > 0
                          );
                        })()}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposal.components.map((component, index) => (
                    <tr
                      key={component.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={checkedComponents.has(component.id)}
                          disabled={
                            componentStatus[component.id] === "rejected"
                          }
                          onChange={(e) =>
                            handleComponentCheck(component.id, e.target.checked)
                          }
                        />
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {componentStatus[component.id] === "rejected" ? (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComponentStatusColor(
                                component.id
                              )}`}>
                              <XCircle className="w-3 h-3 mr-1" />
                              Đã từ chối
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleComponentAction(component.id, "reject")
                              }
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                              title="Từ chối linh kiện này">
                              <X className="w-3 h-3" />
                              <span className="ml-1 hidden sm:inline">
                                Từ chối
                              </span>
                            </button>
                          )}
                        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {proposal.verificationReportUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Báo cáo xác minh
                      </p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={proposal.verificationReportUrl}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={proposal.verificationReportUrl}
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

      {/* Action Section - Only show if can process */}
      {canProcess && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Xử lý tờ trình
            </h3>
          </div>
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú của Phòng Quản trị (tuỳ chọn)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập ghi chú về quyết định xử lý tờ trình..."
                />
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                  <Check className="w-5 h-5 mr-2" />
                  Duyệt tờ trình
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
                  <X className="w-5 h-5 mr-2" />
                  Từ chối tờ trình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Component Action Modal */}
      {showComponentActionModal && selectedComponent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100`}>
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-2 px-4 py-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Từ chối linh kiện
                </h3>
                <div className="mt-2 px-2 py-2">
                  {(() => {
                    const component = proposal?.components.find(
                      (c) => c.id === selectedComponent
                    );
                    return (
                      <div className="text-sm text-gray-500">
                        <p className="mb-2">
                          Bạn có chắc chắn muốn từ chối linh kiện này?
                        </p>
                        <div className="bg-gray-50 p-3 rounded-md text-left">
                          <p className="text-xs text-gray-600 mb-1">
                            Linh kiện:
                          </p>
                          <p className="font-medium text-gray-900">
                            {component?.componentName} →{" "}
                            {component?.newItemName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Phòng: {component?.roomName} | Số lượng:{" "}
                            {component?.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="items-center px-4 py-3 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowComponentActionModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600">
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmComponentAction}
                    className="px-4 py-2 text-white text-base font-medium rounded-md shadow-sm bg-red-600 hover:bg-red-700">
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-2 px-4 py-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Lập biên bản kiểm tra
                </h3>
                <div className="mt-2 px-2 py-2">
                  <p className="text-sm text-gray-500">
                    Bạn đã chọn <strong>{checkedComponents.size}</strong> loại
                    linh kiện để lập biên bản kiểm tra thực tế.
                  </p>
                  <div className="mt-3 max-h-32 overflow-y-auto">
                    <div className="text-left space-y-1">
                      {proposal.components
                        .filter((comp) => checkedComponents.has(comp.id))
                        .map((component, index) => (
                          <div
                            key={component.id}
                            className="text-xs text-gray-600 flex items-center space-x-2">
                            <span className="w-4 text-center">
                              {index + 1}.
                            </span>
                            <span className="flex-1">
                              {component.roomName} - {component.componentType}{" "}
                              (x{component.quantity})
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="items-center px-4 py-3 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCreateReportModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600">
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateReport}
                    className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700">
                    Lập biên bản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-2 px-4 py-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận {actionType === "approve" ? "duyệt" : "từ chối"} tờ
                  trình
                </h3>
                <div className="mt-2 px-2 py-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn{" "}
                    {actionType === "approve" ? "duyệt" : "từ chối"} tờ trình
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
                    className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm ${
                      actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}>
                    {actionType === "approve" ? "Duyệt" : "Từ chối"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
