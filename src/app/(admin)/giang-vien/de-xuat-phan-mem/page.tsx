"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  NewSoftwareProposalForm as ProposalFormType,
  SoftwareItemForm,
} from "@/types";
import { mockAssets, mockSimpleRooms, mockComputers } from "@/lib/mockData";
import { SuccessModal } from "@/components/modal";
import {
  QRScannerSection,
  ProposalHeader,
} from "@/components/lecturer/softwareProposal";
import { Breadcrumb } from "antd";

export default function DeXuatPhanMemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProposalFormType>({
    roomId: "",
    reason: "",
    softwareItems: [
      {
        softwareName: "",
        version: "",
        publisher: "",
        quantity: 1,
        licenseType: "",
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

    console.log("Software Proposal Data:", {
      roomId: formData.roomId,
      reason: formData.reason,
      softwareItems: formData.softwareItems,
      proposerId: "user-5", // This would come from auth context
      status: "CHỜ_DUYỆT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      roomId: "",
      reason: "",
      softwareItems: [
        {
          softwareName: "",
          version: "",
          publisher: "",
          quantity: 1,
          licenseType: "",
        },
      ],
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien");
  };

  const handleCancel = () => {
    router.push("/giang-vien");
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId }));
    // Lọc thiết bị theo phòng đã chọn (giữ để tương thích với QR scan)
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    console.log("Room assets:", roomAssets);
  };

  const handleReasonChange = (reason: string) => {
    setFormData((prev) => ({ ...prev, reason }));
  };

  const handleSoftwareItemChange = (
    index: number,
    field: keyof SoftwareItemForm,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      softwareItems: prev.softwareItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSoftwareItem = () => {
    setFormData((prev) => ({
      ...prev,
      softwareItems: [
        ...prev.softwareItems,
        {
          softwareName: "",
          version: "",
          publisher: "",
          quantity: 1,
          licenseType: "",
        },
      ],
    }));
  };

  const removeSoftwareItem = (index: number) => {
    if (formData.softwareItems.length > 1) {
      setFormData((prev) => ({
        ...prev,
        softwareItems: prev.softwareItems.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAssetChange = (assetId: string) => {
    // Giữ để tương thích với QR scan, nhưng không cần lưu assetId nữa
    console.log("Asset selected:", assetId);
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

        // Sau đó gọi handleAssetChange để set asset
        setTimeout(() => {
          handleAssetChange(asset.id);

          const computer = mockComputers.find(
            (comp) => comp.assetId === asset.id
          );
          const machineLabel = computer?.machineLabel || "N/A";

          alert(
            `Đã quét thành công!\nMáy số: ${machineLabel}\nTên máy: ${asset.name}\nPhòng: ${room.name}\n\nTiếp theo:\n- Bước 2: Nhập thông tin phần mềm\n- Bước 3: Lý do đề xuất và mục đích sử dụng`
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
                  <span>Đề xuất phần mềm</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <ProposalHeader />

      {/* QR Scanner Button for Mobile */}
      <QRScannerSection isMobile={isMobile} onQRScan={simulateQRScan} />

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin đề xuất</h3>

        {/* Room Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phòng máy <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.roomId}
            onChange={(e) => handleRoomChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option value="">Chọn phòng máy</option>
            {mockSimpleRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do đề xuất <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            placeholder="Mô tả lý do cần trang bị phần mềm cho phòng máy này..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {/* Software Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-700">
              Phần mềm đề xuất <span className="text-red-500">*</span>
            </h4>
            <button
              type="button"
              onClick={addSoftwareItem}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              + Thêm phần mềm
            </button>
          </div>

          {formData.softwareItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Phần mềm {index + 1}
                </span>
                {formData.softwareItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSoftwareItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm">
                    Xóa
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phần mềm *
                  </label>
                  <input
                    type="text"
                    value={item.softwareName}
                    onChange={(e) =>
                      handleSoftwareItemChange(
                        index,
                        "softwareName",
                        e.target.value
                      )
                    }
                    placeholder="VD: Adobe Photoshop"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phiên bản *
                  </label>
                  <input
                    type="text"
                    value={item.version}
                    onChange={(e) =>
                      handleSoftwareItemChange(index, "version", e.target.value)
                    }
                    placeholder="VD: 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà phát hành *
                  </label>
                  <input
                    type="text"
                    value={item.publisher}
                    onChange={(e) =>
                      handleSoftwareItemChange(
                        index,
                        "publisher",
                        e.target.value
                      )
                    }
                    placeholder="VD: Adobe Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng bản quyền *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleSoftwareItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giấy phép *
                  </label>
                  <select
                    value={item.licenseType}
                    onChange={(e) =>
                      handleSoftwareItemChange(
                        index,
                        "licenseType",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required>
                    <option value="">Chọn loại giấy phép</option>
                    <option value="Giấy phép giáo dục miễn phí">
                      Giấy phép giáo dục miễn phí
                    </option>
                    <option value="Giấy phép giáo dục theo năm">
                      Giấy phép giáo dục theo năm
                    </option>
                    <option value="Giấy phép thương mại">
                      Giấy phép thương mại
                    </option>
                    <option value="Giấy phép mã nguồn mở">
                      Giấy phép mã nguồn mở
                    </option>
                    <option value="Giấy phép dùng thử">
                      Giấy phép dùng thử
                    </option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Đang gửi..." : "Gửi đề xuất"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Đề xuất phần mềm đã được gửi thành công!"
        message={`Cảm ơn bạn đã gửi đề xuất trang bị ${
          formData.softwareItems.length
        } phần mềm cho phòng ${
          mockSimpleRooms.find((r) => r.id === formData.roomId)?.name ||
          formData.roomId
        }. Kỹ thuật viên sẽ xem xét và phản hồi trong thời gian sớm nhất. Bạn có thể theo dõi trạng thái đề xuất trong mục quản lý đề xuất.`}
      />
    </div>
  );
}
