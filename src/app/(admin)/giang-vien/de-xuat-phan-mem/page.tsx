"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SoftwareProposalForm as ProposalFormType,
  SimpleAsset as Asset,
} from "@/types";
import { mockAssets, mockSimpleRooms, mockComputers } from "@/lib/mockData";
import { SuccessModal } from "@/components/modal";
import {
  QRScannerSection,
  ProposalHeader,
  ProposalForm,
} from "@/components/softwareProposal";
import { Breadcrumb } from "antd";

export default function DeXuatPhanMemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProposalFormType>({
    assetId: "",
    roomId: "",
    softwareName: "",
    softwareVersion: "",
    publisher: "",
    description: "",
    justification: "",
    targetUsers: "",
    educationalPurpose: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
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

    console.log("Software Proposal Data:", formData);

    setIsSubmitting(false);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      assetId: "",
      roomId: "",
      softwareName: "",
      softwareVersion: "",
      publisher: "",
      description: "",
      justification: "",
      targetUsers: "",
      educationalPurpose: "",
    });
    setFilteredAssets([]);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien");
  };

  const handleCancel = () => {
    router.push("/giang-vien");
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "" }));
    // Lọc thiết bị theo phòng đã chọn
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
  };

  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId }));
  };

  const handleFormDataChange = (
    field: keyof ProposalFormType,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <ProposalForm
        formData={formData}
        isSubmitting={isSubmitting}
        isEditMode={false}
        filteredAssets={filteredAssets}
        rooms={mockSimpleRooms}
        computers={mockComputers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onRoomChange={handleRoomChange}
        onAssetChange={handleAssetChange}
        onFormDataChange={handleFormDataChange}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Đề xuất phần mềm đã được gửi thành công!"
        message="Cảm ơn bạn đã gửi đề xuất phần mềm. Kỹ thuật viên sẽ xem xét và phản hồi trong thời gian sớm nhất. Bạn có thể theo dõi trạng thái đề xuất trong mục quản lý đề xuất."
      />
    </div>
  );
}
