"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ReportForm as ReportFormType,
  SimpleAsset as Asset,
  Component,
} from "@/types";
import {
  errorTypes,
  mockAssets,
  mockSimpleRooms,
  mockComponents,
  mockComputers,
} from "@/lib/mockData";
import SuccessModal from "@/components/modal/SuccessModal";
import {
  QRScannerSection,
  ReportHeader,
  EditModeNotice,
  ReportForm,
} from "@/components/report";
import { Breadcrumb } from "antd";

export default function BaoCaoLoiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("edit") === "true";

  const [formData, setFormData] = useState<ReportFormType>({
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
  const [editRequestId, setEditRequestId] = useState<string>("");
  const [showComponentSelection, setShowComponentSelection] = useState(false);

  // Debug filteredComponents changes
  useEffect(() => {
    console.log("filteredComponents updated:", filteredComponents);
  }, [filteredComponents]);

  // Load edit data from localStorage
  useEffect(() => {
    if (isEditMode) {
      const editDataStr = localStorage.getItem("editRequestData");
      if (editDataStr) {
        try {
          const editData = JSON.parse(editDataStr);

          // Check if data is fresh (within last hour)
          const isDataFresh =
            editData.timestamp && Date.now() - editData.timestamp < 3600000;

          if (isDataFresh) {
            // Save the request ID for navigation after submit/cancel
            setEditRequestId(editData.requestId || "");

            // Now we can use direct IDs since mockRepairRequests uses correct IDs
            if (editData.roomId) {
              handleRoomChange(editData.roomId);

              // Set asset after room is set (with small delay to ensure assets are filtered)
              setTimeout(() => {
                if (editData.assetId) {
                  handleAssetChange(editData.assetId);

                  // Set components after asset is set
                  setTimeout(() => {
                    if (editData.componentId && editData.componentName) {
                      setShowComponentSelection(true);
                      setSelectedComponentIds([editData.componentId]);
                    }

                    // Set other form data including componentId
                    setFormData((prev) => ({
                      ...prev,
                      componentId: editData.componentId || "",
                      errorTypeId: editData.errorTypeId || "",
                      description: editData.description || "",
                    }));
                  }, 100);
                }
              }, 100);
            }

            // Clear edit data after loading
            localStorage.removeItem("editRequestData");
          } else {
            // Data is stale, remove it
            localStorage.removeItem("editRequestData");
          }
        } catch (error) {
          console.error("Error loading edit data:", error);
          localStorage.removeItem("editRequestData");
        }
      }
    }
  }, [isEditMode]);

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
    setShowComponentSelection(false);
    setFilteredAssets([]);
    setFilteredComponents([]);
  };

  // Handle success modal close - navigate back to detail page
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (isEditMode && editRequestId) {
      router.push(`/giang-vien/theo-doi-tien-do/chi-tiet/${editRequestId}`);
    } else {
      router.push("/giang-vien/theo-doi-tien-do");
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    if (isEditMode && editRequestId) {
      router.push(`/giang-vien/theo-doi-tien-do/chi-tiet/${editRequestId}`);
    } else {
      router.push("/giang-vien");
    }
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    setShowComponentSelection(false);
    // Lọc thiết bị theo phòng đã chọn
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
    setFilteredComponents([]);
  };

  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId, componentId: "" }));
    setSelectedComponentIds([]);
    setShowComponentSelection(false);
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
          const computer = mockComputers.find(
            (comp) => comp.assetId === asset.id
          );
          const machineLabel = computer?.machineLabel || "N/A";
          console.log("Filtered components after QR scan:", components);

          alert(
            `Đã quét thành công!\nMáy số: ${machineLabel}\nTên máy: ${asset.name}\nPhòng: ${room.name}\nSố linh kiện: ${components.length}\n\nTiếp theo:\n- Bước 3: Chọn loại lỗi\n- Bước 4: Mô tả chi tiết (tùy chọn)\n- Bước 5: Chọn linh kiện cụ thể (nếu cần)\n- Bước 6: Đính kèm hình ảnh (tùy chọn)`
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
            ...(isEditMode && editRequestId
              ? [
                  {
                    href: "/giang-vien/theo-doi-tien-do",
                    title: (
                      <div className="flex items-center">
                        <span>Theo dõi tiến độ</span>
                      </div>
                    ),
                  },
                  {
                    href: `/giang-vien/theo-doi-tien-do/chi-tiet/${editRequestId}`,
                    title: (
                      <div className="flex items-center">
                        <span>Chi tiết yêu cầu</span>
                      </div>
                    ),
                  },
                ]
              : []),
            {
              title: (
                <div className="flex items-center">
                  <span>
                    {isEditMode ? "Chỉnh sửa báo cáo lỗi" : "Báo cáo lỗi"}
                  </span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <ReportHeader isEditMode={isEditMode} />

      {/* Edit Mode Notice */}
      <EditModeNotice isEditMode={isEditMode} />

      {/* QR Scanner Button for Mobile */}
      <QRScannerSection isMobile={isMobile} onQRScan={simulateQRScan} />

      {/* Form */}
      <ReportForm
        formData={formData}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
        filteredAssets={filteredAssets}
        filteredComponents={filteredComponents}
        selectedComponentIds={selectedComponentIds}
        showComponentSelection={showComponentSelection}
        rooms={mockSimpleRooms}
        errorTypes={errorTypes}
        computers={mockComputers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onRoomChange={handleRoomChange}
        onAssetChange={handleAssetChange}
        onErrorTypeChange={(errorTypeId) =>
          setFormData((prev) => ({ ...prev, errorTypeId }))
        }
        onDescriptionChange={(description) =>
          setFormData((prev) => ({ ...prev, description }))
        }
        onComponentChange={(componentId) =>
          setFormData((prev) => ({ ...prev, componentId }))
        }
        onMediaChange={handleMediaChange}
        onRemoveFile={(index) =>
          setFormData((prev) => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
          }))
        }
        setShowComponentSelection={setShowComponentSelection}
        setSelectedComponentIds={setSelectedComponentIds}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={
          isEditMode
            ? "Báo cáo lỗi đã được cập nhật thành công!"
            : "Báo cáo lỗi đã được gửi thành công!"
        }
        message={
          isEditMode
            ? "Thông tin báo cáo lỗi đã được cập nhật. Chúng tôi sẽ xem xét lại và xử lý theo thông tin mới. Bạn có thể theo dõi tiến độ xử lý trong phần 'Theo dõi tiến độ'."
            : "Cảm ơn bạn đã báo cáo lỗi. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất. Bạn có thể theo dõi tiến độ xử lý trong phần 'Theo dõi tiến độ'."
        }
      />
    </div>
  );
}
