"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Send, Laptop } from "lucide-react";
import { SimpleAsset as Asset } from "@/types";
import {
  mockAssets,
  mockSimpleRooms,
  mockComputers,
  mockSoftware,
  mockAssetSoftware,
  softwareCategories,
  softwareErrorTypes,
} from "@/lib/mockData";
import SuccessModal from "../modal/SuccessModal";
import { Breadcrumb } from "antd";

interface SoftwareReportForm {
  assetId: string;
  roomId: string;
  errorTypeId: string;
  softwareCategory: string;
  softwareId: string; // ID of existing software from mockSoftware
  softwareName: string; // For custom software name if not in list
  isCustomSoftware: boolean; // Flag to indicate if user is adding new software
  softwareVersion: string; // Version of the software
  description: string;
  mediaFiles: File[];
}

interface Software {
  id: string;
  name: string;
  category: string;
  version?: string;
  description?: string;
  license?: string;
}

export default function BaoCaoLoiPhanMemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SoftwareReportForm>({
    assetId: "",
    roomId: "",
    errorTypeId: "",
    softwareCategory: "",
    softwareId: "",
    softwareName: "",
    isCustomSoftware: false,
    softwareVersion: "",
    description: "",
    mediaFiles: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [availableSoftware, setAvailableSoftware] = useState<Software[]>([]);
  const [installedSoftware, setInstalledSoftware] = useState<Software[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Effect to filter software when category or asset changes
  useEffect(() => {
    if (formData.softwareCategory) {
      // Filter software by category
      const categorySoftware = mockSoftware.filter(
        (software) => software.category === formData.softwareCategory
      );
      setAvailableSoftware(categorySoftware);

      // If asset is selected, also filter by installed software
      if (formData.assetId) {
        const assetSoftwareIds = mockAssetSoftware
          .filter((as) => as.assetId === formData.assetId)
          .map((as) => as.softwareId);

        const installedItems = categorySoftware.filter((software) =>
          assetSoftwareIds.includes(software.id)
        );
        setInstalledSoftware(installedItems);
      } else {
        setInstalledSoftware([]);
      }
    } else {
      setAvailableSoftware([]);
      setInstalledSoftware([]);
    }
  }, [formData.softwareCategory, formData.assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate software selection
    if (formData.isCustomSoftware && !formData.softwareName.trim()) {
      alert("Vui lòng nhập tên phần mềm.");
      return;
    }

    if (!formData.isCustomSoftware && !formData.softwareId) {
      alert("Vui lòng chọn phần mềm từ danh sách hoặc thêm phần mềm mới.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      assetId: "",
      roomId: "",
      errorTypeId: "",
      softwareCategory: "",
      softwareId: "",
      softwareName: "",
      isCustomSoftware: false,
      softwareVersion: "",
      description: "",
      mediaFiles: [],
    });
    setFilteredAssets([]);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien/theo-doi-tien-do");
  };

  // Handle cancel button
  const handleCancel = () => {
    router.push("/giang-vien");
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "" }));
    // Filter assets by selected room
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
  };

  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId }));
  };

  const handleSoftwareCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      softwareCategory: category,
      softwareId: "",
      softwareName: "",
      isCustomSoftware: false,
    }));
  };

  const handleSoftwareChange = (softwareId: string) => {
    const selectedSoftware = mockSoftware.find((s) => s.id === softwareId);
    if (selectedSoftware) {
      setFormData((prev) => ({
        ...prev,
        softwareId,
        softwareName: selectedSoftware.name,
        isCustomSoftware: false,
      }));
    } else if (softwareId === "custom") {
      setFormData((prev) => ({
        ...prev,
        softwareId: "",
        softwareName: "",
        isCustomSoftware: true,
      }));
    }
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
                  <span>Báo lỗi phần mềm</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo lỗi phần mềm
            </h1>
            <p className="text-gray-600">
              Tạo báo cáo lỗi cho các sự cố phần mềm trên thiết bị
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Laptop className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Báo lỗi phần mềm
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Sử dụng form này để báo cáo các sự cố liên quan đến phần mềm, ứng
              dụng, hệ điều hành, driver, hoặc các vấn đề kết nối mạng.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Bước 1: Room Selection */}
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

            {/* Bước 2: Asset Selection */}
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
                {filteredAssets.map((asset) => {
                  const computer = mockComputers.find(
                    (comp) => comp.assetId === asset.id
                  );
                  const machineLabel = computer?.machineLabel || "N/A";
                  return (
                    <option key={asset.id} value={asset.id}>
                      Máy {machineLabel} - {asset.name} ({asset.assetCode})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Bước 3: Software Category */}
            <div className="sm:col-span-2">
              <label
                htmlFor="softwareCategory"
                className="block text-sm font-medium text-gray-700">
                Bước 3: Loại phần mềm <span className="text-red-500">*</span>
              </label>
              <select
                id="softwareCategory"
                required
                value={formData.softwareCategory}
                onChange={(e) => handleSoftwareCategoryChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Chọn loại phần mềm</option>
                {softwareCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Chọn loại phần mềm gặp sự cố để hệ thống có thể phân loại và xử
                lý phù hợp
              </p>
            </div>
          </div>

          {/* Bước 4: Software Selection */}
          <div>
            <label
              htmlFor="softwareSelection"
              className="block text-sm font-medium text-gray-700">
              Bước 4: Chọn phần mềm <span className="text-red-500">*</span>
            </label>
            {formData.softwareCategory ? (
              <div className="space-y-3">
                {/* Software dropdown */}
                <select
                  id="softwareSelection"
                  value={
                    formData.isCustomSoftware ? "custom" : formData.softwareId
                  }
                  onChange={(e) => handleSoftwareChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Chọn phần mềm</option>

                  {/* Show installed software first if asset is selected */}
                  {formData.assetId && installedSoftware.length > 0 && (
                    <optgroup label="Phần mềm đã cài đặt trên thiết bị">
                      {installedSoftware.map((software) => (
                        <option key={software.id} value={software.id}>
                          {software.name}{" "}
                          {software.version && `(${software.version})`}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Show all available software in category */}
                  {availableSoftware.length > 0 && (
                    <optgroup
                      label={
                        formData.assetId
                          ? "Phần mềm khác trong danh mục"
                          : "Phần mềm có sẵn"
                      }>
                      {availableSoftware
                        .filter(
                          (software) =>
                            !formData.assetId ||
                            !installedSoftware.some(
                              (installed) => installed.id === software.id
                            )
                        )
                        .map((software) => (
                          <option key={software.id} value={software.id}>
                            {software.name}{" "}
                            {software.version && `(${software.version})`}
                          </option>
                        ))}
                    </optgroup>
                  )}

                  <option value="custom">+ Thêm phần mềm khác...</option>
                </select>

                {/* Custom software name input */}
                {formData.isCustomSoftware && (
                  <div>
                    <input
                      type="text"
                      placeholder="Nhập tên phần mềm..."
                      value={formData.softwareName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          softwareName: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {/* Software version input */}
                <div>
                  <input
                    type="text"
                    placeholder="Phiên bản phần mềm (tùy chọn)"
                    value={formData.softwareVersion}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        softwareVersion: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">
                  Vui lòng chọn loại phần mềm trước để hiển thị danh sách phần
                  mềm có sẵn
                </p>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Chọn phần mềm từ danh sách hoặc thêm phần mềm mới nếu không tìm
              thấy
            </p>
          </div>

          {/* Bước 5: Error Type */}
          <div>
            <label
              htmlFor="errorTypeId"
              className="block text-sm font-medium text-gray-700">
              Bước 5: Loại lỗi phần mềm <span className="text-red-500">*</span>
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
              <option value="">Chọn loại lỗi phần mềm</option>
              {softwareErrorTypes.map((errorType) => (
                <option key={errorType.id} value={errorType.id}>
                  {errorType.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Chọn loại lỗi phù hợp nhất với tình trạng hiện tại
            </p>
          </div>

          {/* Bước 6: Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Bước 6: Mô tả chi tiết sự cố{" "}
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
              placeholder="Mô tả chi tiết:&#10;- Thao tác đang thực hiện khi gặp lỗi&#10;- Thông báo lỗi hiển thị (nếu có)&#10;- Tần suất xảy ra lỗi&#10;- Đã thử khắc phục như thế nào..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Thông tin chi tiết sẽ giúp kỹ thuật viên chẩn đoán và khắc phục
              nhanh chóng
            </p>
          </div>

          {/* Bước 7: Media Files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bước 7: Đính kèm ảnh chụp màn hình/video (tùy chọn)
            </label>
            <p className="mb-3 text-sm text-gray-500">
              Ảnh chụp màn hình lỗi, thông báo lỗi hoặc video minh họa sẽ giúp
              kỹ thuật viên hiểu rõ vấn đề
            </p>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Monitor className="w-8 h-8 mb-4 text-gray-500" />
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
                <p className="text-sm text-gray-600 mb-3">
                  Đã chọn {formData.mediaFiles.length} file
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.mediaFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const isVideo = file.type.startsWith("video/");
                    const fileUrl = URL.createObjectURL(file);

                    return (
                      <div
                        key={index}
                        className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        {/* Preview Content */}
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          {isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={fileUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onLoad={() => URL.revokeObjectURL(fileUrl)}
                            />
                          ) : isVideo ? (
                            <video
                              src={fileUrl}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                              onLoadedMetadata={() =>
                                URL.revokeObjectURL(fileUrl)
                              }>
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Monitor className="w-8 h-8 mb-2" />
                              <span className="text-xs text-center">
                                File không hỗ trợ preview
                              </span>
                            </div>
                          )}
                        </div>

                        {/* File Info & Remove Button */}
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
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
                              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Overlay for file type indicator */}
                        <div className="absolute top-2 left-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isImage
                                ? "bg-green-100 text-green-800"
                                : isVideo
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {isImage
                              ? "🖼️ Ảnh"
                              : isVideo
                              ? "🎥 Video"
                              : "📄 File"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
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
        onClose={handleSuccessModalClose}
        title="Báo cáo lỗi phần mềm đã được gửi thành công!"
        message="Cảm ơn bạn đã báo cáo lỗi phần mềm. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất. Bạn có thể theo dõi tiến độ xử lý trong phần 'Theo dõi tiến độ'."
      />
    </div>
  );
}
