"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SimpleAsset as Asset } from "@/types";
import { mockAssets, mockSoftware, mockAssetSoftware } from "@/lib/mockData";
import { SuccessModal } from "@/components/modal";
import { Breadcrumb } from "antd";
import {
  SoftwareHeader,
  SoftwareInfoBanner,
  SoftwareForm,
} from "@/components/software";

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
      <SoftwareHeader />

      {/* Info Banner */}
      <SoftwareInfoBanner />

      {/* Form */}
      <SoftwareForm
        formData={formData}
        setFormData={setFormData}
        filteredAssets={filteredAssets}
        availableSoftware={availableSoftware}
        installedSoftware={installedSoftware}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onRoomChange={handleRoomChange}
        onAssetChange={handleAssetChange}
        onSoftwareCategoryChange={handleSoftwareCategoryChange}
        onSoftwareChange={handleSoftwareChange}
        onMediaChange={handleMediaChange}
      />

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
