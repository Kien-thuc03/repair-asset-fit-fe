"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ReportForm as ReportFormType,
  SimpleAsset as Asset,
  Component,
  Software,
} from "@/types";
import { Room } from "@/types/unit";
import {
  mockErrorTypes,
  mockAssets,
  mockRooms,
  mockComponents,
  mockComputers,
  getSoftwareByAssetId,
} from "@/lib/mockData";
import {
  Breadcrumb,
  Card,
  Form,
  Button,
  Input,
  Select,
  Steps,
  Radio,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  CameraOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  WarningOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Interface cho form báo cáo lỗi giảng viên (mở rộng từ ReportFormType)
interface LecturerReportFormType extends ReportFormType {
  building: string;
  floor: string;
}

export default function BaoCaoLoiPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LecturerReportFormType>({
    building: "",
    floor: "",
    assetId: "",
    componentId: "",
    roomId: "",
    errorTypeId: "",
    description: "",
    mediaFiles: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filteredSoftware, setFilteredSoftware] = useState<Software[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    []
  );
  const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<string[]>([]);
  const [showComponentSelection, setShowComponentSelection] = useState(false);
  const [showSoftwareSelection, setShowSoftwareSelection] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorCategory, setErrorCategory] = useState<
    "hardware" | "software" | ""
  >(""); // Phân loại lỗi phần cứng/phần mềm

  // Danh sách tòa nhà duy nhất từ mockRooms
  const buildings = [
    ...new Set(mockRooms.map((room) => room.building).filter(Boolean)),
  ];

  // Tính toán bước hiện tại dựa trên dữ liệu đã điền
  const getCurrentStep = (): number => {
    if (!formData.building || !formData.floor || !formData.roomId) {
      return 0; // Bước 1: Chọn vị trí
    }
    if (!formData.assetId) {
      return 1; // Bước 2: Chọn thiết bị
    }
    if (!errorCategory) {
      return 2; // Bước 3: Chọn loại lỗi (phần cứng/phần mềm)
    }
    if (errorCategory === "hardware" && !formData.errorTypeId) {
      return 2; // Bước 3: Vẫn cần chọn loại lỗi cụ thể cho phần cứng
    }
    // Bước 4 luôn available sau khi chọn loại lỗi (optional step)
    if (!formData.description) {
      return 3; // Bước 4: Mô tả chi tiết (bắt buộc)
    }
    return 4; // Bước 5: Hoàn thành (có thể đính kèm hình ảnh)
  };

  const currentStep = getCurrentStep();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle building change
  const handleBuildingChange = (building: string) => {
    setFormData((prev) => ({
      ...prev,
      building,
      floor: "",
      roomId: "",
      assetId: "",
      componentId: "",
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    // Filter floors by building
    const floorsInBuilding = [
      ...new Set(
        mockRooms
          .filter((room) => room.building === building && room.floor)
          .map((room) => room.floor!)
      ),
    ] as string[];
    setFilteredFloors(floorsInBuilding);
    setFilteredRooms([]);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle floor change
  const handleFloorChange = (floor: string) => {
    setFormData((prev) => ({
      ...prev,
      floor,
      roomId: "",
      assetId: "",
      componentId: "",
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    // Filter rooms by building and floor
    const roomsOnFloor = mockRooms.filter(
      (room) => room.building === formData.building && room.floor === floor
    );
    setFilteredRooms(roomsOnFloor);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle room change
  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    // Filter assets by room
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle asset change
  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId, componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    setFilteredComponents(
      mockComponents.filter((comp) => comp.computerAssetId === assetId)
    );
    setFilteredSoftware(getSoftwareByAssetId(assetId));
  };

  // Handle media upload
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  // Remove media file
  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      building: "",
      floor: "",
      assetId: "",
      componentId: "",
      roomId: "",
      errorTypeId: "",
      description: "",
      mediaFiles: [],
    });
    setErrorCategory("");
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);
    setFilteredFloors([]);
    setFilteredRooms([]);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/giang-vien");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: <span>Trang chủ</span>,
            },
            {
              title: <span>Báo cáo lỗi</span>,
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Báo cáo lỗi thiết bị
        </h1>
        <p className="text-gray-600">
          Báo cáo sự cố và lỗi thiết bị máy tính trong phòng học
        </p>
      </div>

      {/* Progress Tracker Card */}
      <Card title="Tiến độ hoàn thành" className="mb-4">
        <Steps
          current={currentStep}
          size="small"
          items={[
            {
              title: "Chọn vị trí",
              icon: <EnvironmentOutlined />,
              description: "Tòa nhà → Tầng → Phòng",
            },
            {
              title: "Chọn thiết bị",
              icon: <LaptopOutlined />,
              description: "Máy tính cần báo lỗi",
            },
            {
              title: "Loại lỗi",
              icon: <WarningOutlined />,
              description: "Chọn loại sự cố",
            },
            {
              title: "Mô tả chi tiết",
              icon: <EditOutlined />,
              description: "Thông tin chi tiết về lỗi",
            },
            {
              title: "Hoàn tất",
              icon: <CheckCircleOutlined />,
              description: "Đính kèm hình ảnh & gửi",
            },
          ]}
        />
      </Card>

      {/* QR Scanner for Mobile */}
      {isMobile && (
        <Card>
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              icon={<ScanOutlined />}
              className="mb-2">
              Quét mã QR thiết bị
            </Button>
            <p className="text-sm text-gray-500">
              Quét mã QR trên thiết bị để tự động điền thông tin
            </p>
          </div>
        </Card>
      )}

      {/* Summary Card - Hiển thị thông tin đã điền */}
      {(formData.building || formData.assetId || formData.errorTypeId) && (
        <Card title="Thông tin đã chọn" size="small" className="bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.building && (
              <div>
                <div className="text-sm text-gray-500">Vị trí</div>
                <div className="font-medium">
                  {formData.building} - {formData.floor} -{" "}
                  {filteredRooms.find((r) => r.id === formData.roomId)
                    ?.roomNumber || "N/A"}
                </div>
              </div>
            )}
            {formData.assetId && (
              <div>
                <div className="text-sm text-gray-500">Thiết bị</div>
                <div className="font-medium">
                  {(() => {
                    const asset = filteredAssets.find(
                      (a) => a.id === formData.assetId
                    );
                    const computer = mockComputers.find(
                      (c) => c.assetId === formData.assetId
                    );
                    return asset
                      ? `Máy ${computer?.machineLabel || "N/A"} - ${asset.name}`
                      : "N/A";
                  })()}
                </div>
              </div>
            )}
            {formData.errorTypeId && (
              <div>
                <div className="text-sm text-gray-500">Loại lỗi</div>
                <div className="font-medium">
                  {mockErrorTypes.find((et) => et.id === formData.errorTypeId)
                    ?.name || "N/A"}
                </div>
              </div>
            )}
            {formData.description && (
              <div>
                <div className="text-sm text-gray-500">Mô tả</div>
                <div
                  className="font-medium truncate"
                  title={formData.description}>
                  {formData.description.length > 30
                    ? `${formData.description.substring(0, 30)}...`
                    : formData.description}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Bước 1: Chọn vị trí */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 1: Chọn vị trí thiết bị
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Chọn tòa nhà" required>
                <Select
                  placeholder="Chọn tòa nhà"
                  value={formData.building}
                  onChange={handleBuildingChange}>
                  {buildings.map((building) => (
                    <Option key={building} value={building}>
                      {building}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn tầng" required>
                <Select
                  placeholder="Chọn tầng"
                  value={formData.floor}
                  onChange={handleFloorChange}
                  disabled={!formData.building}>
                  {filteredFloors.map((floor) => (
                    <Option key={floor} value={floor}>
                      {floor}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn phòng" required>
                <Select
                  placeholder="Chọn phòng"
                  value={formData.roomId}
                  onChange={handleRoomChange}
                  disabled={!formData.floor}>
                  {filteredRooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Bước 2: Chọn thiết bị */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 2: Chọn thiết bị
            </h3>
            <Form.Item label="Chọn thiết bị" required>
              <Select
                placeholder={
                  !formData.roomId
                    ? "Vui lòng chọn phòng trước"
                    : "Chọn thiết bị"
                }
                value={formData.assetId}
                onChange={handleAssetChange}
                disabled={!formData.roomId}>
                {filteredAssets.map((asset) => {
                  const computer = mockComputers.find(
                    (comp) => comp.assetId === asset.id
                  );
                  const machineLabel = computer?.machineLabel || "N/A";
                  return (
                    <Option key={asset.id} value={asset.id}>
                      Máy {machineLabel} - {asset.name} ({asset.assetCode})
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          {/* Bước 3: Chọn loại lỗi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 3: Chọn loại lỗi
            </h3>

            {/* Radio buttons cho phân loại lỗi */}
            <Form.Item label="Phân loại lỗi" required>
              <Radio.Group
                value={errorCategory}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setErrorCategory(newCategory);
                  // Reset errorTypeId khi thay đổi category
                  if (newCategory === "software") {
                    // Nếu chọn lỗi phần mềm, tự động set errorTypeId
                    const softwareErrorType = mockErrorTypes.find(
                      (type) => type.name === "Máy hư phần mềm"
                    );
                    if (softwareErrorType) {
                      setFormData((prev) => ({
                        ...prev,
                        errorTypeId: softwareErrorType.id,
                      }));
                    }
                  } else {
                    setFormData((prev) => ({ ...prev, errorTypeId: "" }));
                  }
                }}
                disabled={!formData.assetId}>
                <Radio value="hardware">Lỗi phần cứng</Radio>
                <Radio value="software">Lỗi phần mềm</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Danh sách loại lỗi cụ thể - chỉ hiện khi chọn lỗi phần cứng */}
            {errorCategory === "hardware" && (
              <Form.Item label="Loại lỗi cụ thể" required>
                <Select
                  placeholder="Chọn loại lỗi phần cứng"
                  value={formData.errorTypeId}
                  onChange={(errorTypeId) =>
                    setFormData((prev) => ({ ...prev, errorTypeId }))
                  }>
                  {mockErrorTypes
                    .filter((errorType) => errorType.name !== "Máy hư phần mềm")
                    .map((errorType) => (
                      <Option key={errorType.id} value={errorType.id}>
                        {errorType.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {/* Bước 4: Mô tả chi tiết */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 4: Mô tả chi tiết vấn đề
            </h3>
            <Form.Item label="Mô tả chi tiết lỗi" required>
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết hiện tượng lỗi, khi nào xảy ra, tần suất lỗi..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Item>
          </div>

          {/* Bước 5: Chọn linh kiện/phần mềm cụ thể */}
          <div
            className={`mb-6 ${
              !errorCategory ||
              (errorCategory === "hardware" && !formData.errorTypeId)
                ? "opacity-50"
                : ""
            }`}>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 5: Chọn{" "}
              {errorCategory === "software" ? "phần mềm" : "linh kiện"} bị lỗi
              (tùy chọn)
            </h3>

            {errorCategory === "software" ? (
              <div>
                <Button
                  type={showSoftwareSelection ? "primary" : "dashed"}
                  disabled={errorCategory !== "software"}
                  onClick={() =>
                    setShowSoftwareSelection(!showSoftwareSelection)
                  }
                  className="mb-4">
                  {showSoftwareSelection
                    ? "Ẩn danh sách phần mềm"
                    : "Chọn phần mềm cụ thể"}
                </Button>

                {showSoftwareSelection && (
                  <Form.Item label="Phần mềm bị lỗi">
                    <Select
                      mode="multiple"
                      placeholder="Chọn các phần mềm bị lỗi"
                      value={selectedSoftwareIds}
                      disabled={errorCategory !== "software"}
                      onChange={setSelectedSoftwareIds}>
                      {filteredSoftware.map((software) => (
                        <Option key={software.id} value={software.id}>
                          {software.name}{" "}
                          {software.version && `(${software.version})`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </div>
            ) : (
              <div>
                <Button
                  type={showComponentSelection ? "primary" : "dashed"}
                  disabled={
                    errorCategory !== "hardware" || !formData.errorTypeId
                  }
                  onClick={() =>
                    setShowComponentSelection(!showComponentSelection)
                  }
                  className="mb-4">
                  {showComponentSelection
                    ? "Ẩn danh sách linh kiện"
                    : "Chọn linh kiện cụ thể"}
                </Button>

                {showComponentSelection && (
                  <Form.Item label="Linh kiện bị lỗi">
                    <Select
                      mode="multiple"
                      placeholder="Chọn các linh kiện bị lỗi"
                      value={selectedComponentIds}
                      disabled={
                        errorCategory !== "hardware" || !formData.errorTypeId
                      }
                      onChange={setSelectedComponentIds}>
                      {filteredComponents.map((component) => (
                        <Option key={component.id} value={component.id}>
                          {component.name}{" "}
                          {component.componentSpecs &&
                            `- ${component.componentSpecs}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </div>
            )}
          </div>

          {/* Bước 6: Đính kèm hình ảnh */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 6: Đính kèm hình ảnh (tùy chọn)
            </h3>

            <Form.Item label="Hình ảnh minh họa">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaChange}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                  <CameraOutlined className="mr-2" />
                  Chọn hình ảnh
                </label>
                <span className="text-sm text-gray-500">
                  Có thể chọn nhiều hình ảnh
                </span>
              </div>

              {/* Display selected images */}
              {formData.mediaFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.mediaFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={150}
                        height={96}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Form.Item>
          </div>

          {/* Form Actions */}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button size="large" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isSubmitting}
              disabled={
                !formData.building ||
                !formData.roomId ||
                !formData.assetId ||
                !errorCategory ||
                (errorCategory === "hardware" && !formData.errorTypeId) ||
                !formData.description
              }>
              {isSubmitting ? "Đang xử lý..." : "Gửi báo cáo lỗi"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Success Modal */}
      <Modal
        title="Thành công!"
        open={showSuccessModal}
        onOk={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
        okText="Đồng ý"
        cancelText="Đóng"
        centered
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalClose}>
            Đồng ý
          </Button>,
        ]}>
        <div className="flex items-center space-x-3">
          <CheckCircleOutlined className="text-green-500 text-2xl" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Báo cáo lỗi đã được gửi thành công!
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Cảm ơn bạn đã báo cáo lỗi. Chúng tôi sẽ xem xét và xử lý trong
              thời gian sớm nhất. Bạn có thể theo dõi tiến độ xử lý trong phần
              &apos;Danh sách yêu cầu sửa chữa&apos;.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
