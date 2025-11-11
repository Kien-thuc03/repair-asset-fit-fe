"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  NewSoftwareProposalForm as ProposalFormType,
  SoftwareItemForm,
} from "@/types";
import { createSoftwareProposal } from "@/lib/api/software-proposals";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { ProposalHeader } from "@/components/lecturer/softwareProposal";
import { Breadcrumb, Select, Modal, Button, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function DeXuatPhanMemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProposalFormType>({
    roomId: "",
    reason: "",
    softwareItems: [
      {
        softwareName: "",
        version: "",
      },
    ],
  });

  // State cho việc chọn vị trí 3 bước
  const [locationData, setLocationData] = useState({
    building: "",
    floor: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [createdProposalCode, setCreatedProposalCode] = useState<string>("");

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRoomsApi();
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        message.error("Không thể tải danh sách phòng");
      }
    };
    fetchRooms();
  }, []);

  // Validation function to check if form is complete
  const isFormValid = () => {
    // Check if room is selected
    if (!formData.roomId) return false;

    // Check if reason is provided
    if (!formData.reason.trim()) return false;

    // Check if all software items are complete
    const hasValidSoftwareItems = formData.softwareItems.every(
      (item) => item.softwareName.trim() && item.version.trim()
    );

    return hasValidSoftwareItems;
  };

  // Extract unique buildings from rooms
  const buildings = Array.from(
    new Set(rooms.map((room) => room.building).filter(Boolean))
  );

  // Get floors based on selected building
  const filteredFloors = Array.from(
    new Set(
      rooms
        .filter((room) => room.building === locationData.building)
        .map((room) => room.floor)
        .filter(Boolean)
    )
  );

  // Get rooms based on selected building and floor
  const filteredRooms = rooms.filter(
    (room) =>
      room.building === locationData.building &&
      room.floor === locationData.floor
  );

  // Detect if user is on mobile device (removed - not needed without QR scanner)

  // Xử lý thay đổi tòa nhà
  const handleBuildingChange = (building: string) => {
    setLocationData({
      building,
      floor: "", // Reset floor khi thay đổi building
    });
    setFormData((prev) => ({
      ...prev,
      roomId: "", // Reset room khi thay đổi building
    }));
  };

  // Xử lý thay đổi tầng
  const handleFloorChange = (floor: string) => {
    setLocationData((prev) => ({
      ...prev,
      floor,
    }));
    setFormData((prev) => ({
      ...prev,
      roomId: "", // Reset room khi thay đổi floor
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.roomId) {
      Modal.warning({
        title: "Thông tin chưa đầy đủ",
        content: "Vui lòng chọn phòng máy.",
        centered: true,
        okText: "Đồng ý",
      });
      return;
    }

    if (!formData.reason.trim()) {
      Modal.warning({
        title: "Thông tin chưa đầy đủ",
        content: "Vui lòng nhập lý do đề xuất.",
        centered: true,
        okText: "Đồng ý",
      });
      return;
    }

    // Validate software items
    const invalidSoftwareItem = formData.softwareItems.find(
      (item) => !item.softwareName.trim() || !item.version.trim()
    );

    if (invalidSoftwareItem) {
      Modal.warning({
        title: "Thông tin phần mềm chưa đầy đủ",
        content:
          "Vui lòng điền đầy đủ thông tin cho tất cả phần mềm (tên phần mềm và phiên bản).",
        centered: true,
        okText: "Đồng ý",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call API to create software proposal
      const createdProposal = await createSoftwareProposal({
        roomId: formData.roomId,
        reason: formData.reason,
        items: formData.softwareItems,
      });

      console.log("✅ Software Proposal Created:", createdProposal);
      setCreatedProposalCode(createdProposal.proposalCode);
      message.success("Đề xuất phần mềm đã được gửi thành công!");
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        roomId: "",
        reason: "",
        softwareItems: [
          {
            softwareName: "",
            version: "",
          },
        ],
      });
      setLocationData({
        building: "",
        floor: "",
      });
    } catch (error) {
      console.error("❌ Create software proposal error:", error);
      Modal.error({
        title: "Lỗi gửi đề xuất",
        content:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi gửi đề xuất. Vui lòng thử lại.",
        centered: true,
        okText: "Đồng ý",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien/danh-sach-de-xuat-phan-mem");
  };

  const handleCancel = () => {
    router.push("/giang-vien");
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId }));
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin đề xuất</h3>

        {/* Location Selection - 3 steps */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Chọn vị trí <span className="text-red-500">*</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tòa nhà */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tòa nhà <span className="text-red-500">*</span>
              </label>
              <Select
                value={locationData.building}
                onChange={handleBuildingChange}
                placeholder="Chọn tòa nhà"
                className="w-full"
                size="large">
                {buildings.map((building) => (
                  <Option key={building} value={building}>
                    {building}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Tầng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tầng <span className="text-red-500">*</span>
              </label>
              <Select
                value={locationData.floor}
                onChange={handleFloorChange}
                placeholder="Chọn tầng"
                className="w-full"
                size="large"
                disabled={!locationData.building}>
                {filteredFloors.map((floor) => (
                  <Option key={floor} value={floor}>
                    {floor}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Phòng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phòng máy <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.roomId}
                onChange={(value) => handleRoomChange(value)}
                placeholder="Chọn phòng máy"
                className="w-full"
                size="large"
                disabled={!locationData.floor}>
                {filteredRooms.map((room) => (
                  <Option key={room.id} value={room.id}>
                    {room.roomNumber ||
                      `${room.building}.${room.floor}${room.roomNumber}`}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
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
            disabled={isSubmitting || !isFormValid()}
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              isSubmitting || !isFormValid()
                ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}>
            {isSubmitting ? "Đang gửi..." : "Gửi đề xuất"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onCancel={handleSuccessModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleSuccessModalClose}>
            Đóng
          </Button>,
        ]}
        centered>
        <div className="text-center py-4">
          <CheckCircleOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
          <h3 className="mt-4 text-lg font-semibold">
            Đề xuất phần mềm đã được gửi thành công!
          </h3>
          <p className="text-gray-600 mt-2">
            {`Cảm ơn bạn đã gửi đề xuất trang bị ${
              formData.softwareItems.length
            } phần mềm cho phòng ${
              rooms.find((r) => r.id === formData.roomId)?.roomCode ||
              formData.roomId
            }. Mã đề xuất: ${createdProposalCode}. Kỹ thuật viên sẽ xem xét và phản hồi trong thời gian sớm nhất. Bạn có thể theo dõi trạng thái đề xuất trong mục quản lý đề xuất.`}
          </p>
        </div>
      </Modal>
    </div>
  );
}
