"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Camera, Send, QrCode } from "lucide-react";
import { ReportForm, SimpleAsset as Asset, Component } from "@/types";
import {
  errorTypes,
  mockAssets,
  mockSimpleRooms,
  mockComponents,
} from "@/lib/mockData";
import SuccessModal from "./modal/SuccessModal";

export default function BaoCaoLoiPage() {
  const [formData, setFormData] = useState<ReportForm>({
    assetId: "",
    componentId: "",
    roomId: "",
    errorTypeId: "",
    description: "",
    mediaFiles: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    []
  );
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Debug filteredComponents changes
  useEffect(() => {
    console.log("filteredComponents updated:", filteredComponents);
  }, [filteredComponents]);

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      assetId: "",
      componentId: "",
      roomId: "",
      errorTypeId: "",
      description: "",
      mediaFiles: [],
    });
    setSelectedComponentIds([]);
    setFilteredAssets([]);
    setFilteredComponents([]);
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    // Lọc thiết bị theo phòng đã chọn
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
    setFilteredComponents([]);
  };

  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId, componentId: "" }));
    setSelectedComponentIds([]);
    setFilteredComponents(
      mockComponents.filter((comp) => comp.computerAssetId === assetId)
    );
  };

  const handleQRScan = (qrCode: string) => {
    console.log("QR Code scanned:", qrCode);
    // Tìm asset dựa trên QR code
    const asset = mockAssets.find((asset) => asset.assetCode === qrCode);
    console.log("Found asset:", asset);

    if (asset) {
      // Tự động điền thông tin từ QR code
      const room = mockSimpleRooms.find((room) => room.id === asset.roomId);
      console.log("Found room:", room);

      if (room) {
        // Gọi handleRoomChange trước để set room và filter assets
        handleRoomChange(asset.roomId);

        // Sau đó gọi handleAssetChange để set asset và filter components
        setTimeout(() => {
          handleAssetChange(asset.id);

          const components = mockComponents.filter(
            (comp) => comp.computerAssetId === asset.id
          );
          console.log("Filtered components after QR scan:", components);

          alert(
            `Đã quét thành công!\nMáy: ${asset.name}\nPhòng: ${room.name}\nSố linh kiện: ${components.length}`
          );
        }, 100);
      }
    } else {
      alert("Không tìm thấy thiết bị với mã QR này!");
    }
  };

  const simulateQRScan = () => {
    // Simulate QR scan for demo (in real app, this would use camera)
    const randomAsset =
      mockAssets[Math.floor(Math.random() * mockAssets.length)];
    handleQRScan(randomAsset.assetCode);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo cáo lỗi thiết bị
            </h1>
            <p className="text-gray-600">
              Tạo báo cáo lỗi cho thiết bị gặp sự cố
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Button for Mobile */}
      {isMobile && (
        <div className="bg-blue-50 shadow rounded-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-blue-600" />
              Quét mã QR thiết bị
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Quét mã QR trên thiết bị để tự động điền thông tin
            </p>
            <button
              type="button"
              onClick={simulateQRScan}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center">
              <Camera className="w-4 h-4 mr-2" />
              Mở máy ảnh quét QR
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Bước 1: Room Selection - Chọn phòng trước */}
            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700">
                Bước 1: Chọn phòng/khoa <span className="text-red-500">*</span>
              </label>
              <select
                id="roomId"
                required
                value={formData.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Chọn phòng</option>
                {mockSimpleRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bước 2: Asset Selection - Chọn thiết bị trong phòng */}
            <div>
              <label
                htmlFor="assetId"
                className="block text-sm font-medium text-gray-700">
                Bước 2: Chọn thiết bị <span className="text-red-500">*</span>
              </label>
              <select
                id="assetId"
                required
                value={formData.assetId}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!formData.roomId}>
                <option value="">
                  {!formData.roomId
                    ? "Vui lòng chọn phòng trước"
                    : "Chọn thiết bị"}
                </option>
                {filteredAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.assetCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Component Selection - Click trực tiếp vào linh kiện */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Chọn linh kiện gặp lỗi (có thể chọn nhiều)
              </label>
              {!formData.assetId ? (
                <p className="mt-1 text-sm text-gray-500 italic">
                  Vui lòng chọn thiết bị để xem danh sách linh kiện
                </p>
              ) : filteredComponents.length === 0 ? (
                <p className="mt-1 text-sm text-gray-500 italic">
                  Không có linh kiện nào được tìm thấy cho thiết bị này
                </p>
              ) : (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Click vào linh kiện gặp lỗi:
                    </p>
                    {selectedComponentIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComponentIds([]);
                          setFormData((prev) => ({
                            ...prev,
                            componentId: "",
                          }));
                        }}
                        className="text-xs text-red-600 hover:text-red-800 underline">
                        Bỏ chọn tất cả ({selectedComponentIds.length})
                      </button>
                    )}
                  </div>

                  {/* Hiển thị linh kiện đã chọn */}
                  {selectedComponentIds.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-100 border border-blue-300 rounded">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        ✓ Đã chọn {selectedComponentIds.length} linh kiện:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponentIds.map((componentId) => {
                          const component = filteredComponents.find(
                            (c) => c.id === componentId
                          );
                          return (
                            <span
                              key={componentId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-900">
                              {component?.componentType}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSelectedIds =
                                    selectedComponentIds.filter(
                                      (id) => id !== componentId
                                    );
                                  setSelectedComponentIds(newSelectedIds);
                                  setFormData((prev) => ({
                                    ...prev,
                                    componentId:
                                      newSelectedIds.length > 0
                                        ? newSelectedIds[0]
                                        : "",
                                  }));
                                }}
                                className="ml-1 text-blue-700 hover:text-blue-900">
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {filteredComponents.map((component) => {
                      const isSelected = selectedComponentIds.includes(
                        component.id
                      );
                      const canSelect = component.status === "INSTALLED";
                      return (
                        <div
                          key={component.id}
                          onClick={
                            canSelect
                              ? () => {
                                  let newSelectedIds;
                                  if (isSelected) {
                                    newSelectedIds =
                                      selectedComponentIds.filter(
                                        (id) => id !== component.id
                                      );
                                  } else {
                                    newSelectedIds = [
                                      ...selectedComponentIds,
                                      component.id,
                                    ];
                                  }
                                  setSelectedComponentIds(newSelectedIds);
                                  setFormData((prev) => ({
                                    ...prev,
                                    componentId:
                                      newSelectedIds.length > 0
                                        ? newSelectedIds[0]
                                        : "",
                                  }));
                                }
                              : undefined
                          }
                          className={`p-2 rounded transition-all duration-200 ${
                            !canSelect
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer hover:shadow-md"
                          } ${
                            isSelected
                              ? "bg-blue-200 text-blue-900 border-2 border-blue-400 transform scale-105"
                              : component.status === "FAULTY"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : component.status === "REMOVED"
                              ? "bg-gray-100 text-gray-800 border border-gray-200"
                              : "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                          }`}>
                          <div className="font-medium truncate flex items-center justify-between">
                            <span>{component.componentType}</span>
                            <div className="flex items-center space-x-1">
                              {!canSelect && (
                                <span className="text-gray-500 text-xs">
                                  🚫
                                </span>
                              )}
                              {isSelected && (
                                <span className="text-blue-600 font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-600 truncate">
                            {component.name}
                          </div>
                          {component.componentSpecs && (
                            <div className="text-gray-500 truncate text-xs">
                              {component.componentSpecs}
                            </div>
                          )}
                          <div className="mt-1 flex items-center justify-between">
                            <span
                              className={`px-1 py-0.5 rounded text-xs ${
                                isSelected
                                  ? "bg-blue-300"
                                  : component.status === "INSTALLED"
                                  ? "bg-green-200"
                                  : component.status === "FAULTY"
                                  ? "bg-red-200"
                                  : component.status === "REMOVED"
                                  ? "bg-gray-200"
                                  : "bg-gray-200"
                              }`}>
                              {component.status === "INSTALLED"
                                ? "Hoạt động"
                                : component.status === "FAULTY"
                                ? "Có lỗi"
                                : component.status === "REMOVED"
                                ? "Đã gỡ"
                                : component.status}
                            </span>
                            {!canSelect && (
                              <span className="text-xs text-gray-500">
                                Không thể chọn
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-500 mt-2 italic">
                    💡 Tip: Chỉ có thể chọn các linh kiện đang hoạt động để báo
                    lỗi. Các linh kiện đã có lỗi hoặc đang bảo trì sẽ không thể
                    chọn.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bước 3: Description - Mô tả lỗi chi tiết */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Bước 3: Mô tả chi tiết tình trạng lỗi{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về tình trạng lỗi, triệu chứng, thời điểm xảy ra, các bước đã thực hiện..."
            />
          </div>

          {/* Media Files - Đính kèm hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đính kèm hình ảnh/video minh họa (tùy chọn)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click để upload</span> hoặc
                    kéo thả
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, MP4 (MAX. 10MB mỗi file)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
            </div>
            {formData.mediaFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Đã chọn {formData.mediaFiles.length} file
                </p>
                <div className="mt-2 space-y-1">
                  {formData.mediaFiles.map((file, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-500 flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            mediaFiles: prev.mediaFiles.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 ml-2">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bước 4: Error Type Selection - Chọn loại lỗi */}
          <div>
            <label
              htmlFor="errorTypeId"
              className="block text-sm font-medium text-gray-700">
              Bước 4: Chọn loại lỗi từ danh sách{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="errorTypeId"
              required
              value={formData.errorTypeId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  errorTypeId: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Chọn loại lỗi phổ biến</option>
              {errorTypes.map((errorType) => (
                <option key={errorType.id} value={errorType.id}>
                  {errorType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi báo cáo
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Báo cáo lỗi đã được gửi thành công!"
        message="Cảm ơn bạn đã báo cáo lỗi. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất. Bạn có thể theo dõi tiến độ xử lý trong phần 'Theo dõi tiến độ'."
      />
    </div>
  );
}
