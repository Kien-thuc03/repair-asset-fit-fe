"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ReportForm as ReportFormType,
  Component,
  Software,
  ComponentStatus,
  ComponentType,
} from "@/types";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { getComputersByRoomId, ComputerResponseDto } from "@/lib/api/computers";
import { getComponentsByComputerId } from "@/lib/api/components";
import { getSoftwareByAssetId } from "@/lib/api/asset-software";
import { createRepair, CreateRepairRequest } from "@/lib/api/repairs";
import { useProfile } from "@/hooks";
import {
  getHardwareErrorTypes,
  getErrorTypeByKey,
  canSelectComponents as canSelectComponentsByErrorType,
  ErrorType,
} from "@/lib/constants/errorTypes";
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
  message,
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
  const { userDetails } = useProfile();

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
  const [selectedComputerId, setSelectedComputerId] = useState<string>(""); // Store computer.id for loading components
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponseDto[]>([]);
  const [filteredComputers, setFilteredComputers] = useState<
    ComputerResponseDto[]
  >([]);
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
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);

  // Kiểm tra xem loại lỗi hiện tại có cho phép chọn linh kiện không
  const canSelectComponents =
    errorCategory === "hardware" &&
    formData.errorTypeId &&
    canSelectComponentsByErrorType(formData.errorTypeId as ErrorType);

  // Extract unique buildings from rooms
  const buildings = Array.from(
    new Set(rooms.map((room) => room.building).filter(Boolean))
  );

  // Debug: Log buildings whenever rooms change
  useEffect(() => {
    console.log("🏢 Buildings computed:", buildings);
    console.log("📍 Total rooms available:", rooms.length);
  }, [rooms, buildings]);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("🔍 Starting to fetch rooms...");
        const roomsData = await getRoomsApi();
        console.log("✅ Rooms fetched successfully:", roomsData);
        console.log("📊 Total rooms:", roomsData.length);
        setRooms(roomsData);

        // Log unique buildings and floors
        const uniqueBuildings = Array.from(
          new Set(roomsData.map((room) => room.building).filter(Boolean))
        );
        console.log("🏢 Unique buildings:", uniqueBuildings);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        message.error("Không thể tải danh sách phòng. Vui lòng thử lại.");
      }
    };
    fetchRooms();
  }, []);

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
    console.log("🏢 Building selected:", building);
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
    const floorsInBuilding = Array.from(
      new Set(
        rooms
          .filter((room) => room.building === building)
          .map((room) => room.floor)
          .filter(Boolean)
      )
    );
    console.log("🏢 Floors in building:", floorsInBuilding);
    setFilteredFloors(floorsInBuilding);
    setFilteredRooms([]);
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle floor change
  const handleFloorChange = (floor: string) => {
    console.log("🏢 Floor selected:", floor);
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
    const roomsOnFloor = rooms.filter(
      (room) => room.building === formData.building && room.floor === floor
    );
    console.log("🏢 Rooms on floor:", roomsOnFloor);
    setFilteredRooms(roomsOnFloor);
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle room change
  const handleRoomChange = async (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "", componentId: "" }));
    setSelectedComputerId("");
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    // Reset computers first
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);

    // Fetch computers for the selected room
    try {
      console.log("🔍 Fetching computers for room:", roomId);
      const computers = await getComputersByRoomId(roomId);
      console.log("✅ Computers fetched:", computers);

      // Ensure it's an array
      if (Array.isArray(computers)) {
        setFilteredComputers(computers);
      } else {
        console.error("❌ Response is not an array:", computers);
        setFilteredComputers([]);
        message.error("Dữ liệu máy tính không đúng định dạng");
      }
    } catch (error) {
      console.error("❌ Error fetching computers:", error);
      message.error("Không thể tải danh sách máy tính");
      setFilteredComputers([]);
    }
  };

  // Handle asset change
  const handleAssetChange = async (computerId: string) => {
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setShowComponentSelection(false);
    setShowSoftwareSelection(false);

    // Reset components and software first
    setFilteredComponents([]);
    setFilteredSoftware([]);

    // Find the selected computer to get its details
    const selectedComputer = filteredComputers.find(
      (comp) => comp.id === computerId
    );

    if (!selectedComputer) {
      console.error("❌ Selected computer not found", {
        computerId,
        availableComputers: filteredComputers.map((c) => ({
          id: c.id,
          machineLabel: c.machineLabel,
        })),
      });
      message.error("Không tìm thấy máy tính được chọn");
      return;
    }

    // Check if computer has asset
    if (!selectedComputer.asset?.id) {
      console.error("❌ Computer has no asset", selectedComputer);
      message.error("Máy tính này chưa được gán tài sản");
      return;
    }

    console.log("✅ Selected computer:", selectedComputer);
    console.log("📍 Asset ID:", selectedComputer.asset.id);

    // Store asset.id instead of computer.id
    setFormData((prev) => ({
      ...prev,
      assetId: selectedComputer.asset!.id, // Use asset.id for backend
      componentId: "",
    }));

    // Store computer.id for loading components
    setSelectedComputerId(computerId);

    // Fetch components for the selected computer using computer ID
    try {
      console.log("🔍 Fetching components for computer:", computerId);
      const components = await getComponentsByComputerId(computerId);
      console.log("✅ Components fetched:", components);

      // Ensure it's an array
      if (Array.isArray(components)) {
        // Map ComponentResponseDto to Component interface
        const mappedComponents: Component[] = components.map((comp) => ({
          id: comp.id,
          computerAssetId: selectedComputer.id, // Use computer ID
          componentType: comp.componentType as unknown as ComponentType,
          name: comp.name,
          componentSpecs: comp.componentSpecs,
          serialNumber: comp.serialNumber,
          status: comp.status as unknown as ComponentStatus,
          installedAt: comp.installedAt,
          removedAt: comp.removedAt,
          notes: comp.notes,
        }));
        setFilteredComponents(mappedComponents);
      } else {
        console.error("❌ Response is not an array:", components);
        setFilteredComponents([]);
        message.error("Dữ liệu linh kiện không đúng định dạng");
      }
    } catch (error) {
      console.error("❌ Error fetching components:", error);
      message.error("Không thể tải danh sách linh kiện");
      setFilteredComponents([]);
    }

    // Fetch software using asset ID
    try {
      console.log("🔍 Fetching software for asset:", selectedComputer.asset.id);
      const softwareList = await getSoftwareByAssetId(
        selectedComputer.asset.id
      );
      console.log("✅ Software fetched:", softwareList);

      // Map SoftwareDto to Software interface
      const mappedSoftware: Software[] = softwareList.map((sw) => ({
        id: sw.softwareId,
        name: sw.name,
        version: sw.version,
        publisher: sw.publisher,
        createdAt: sw.installationDate, // Use installationDate as createdAt
      }));
      setFilteredSoftware(mappedSoftware);
    } catch (error) {
      console.error("❌ Error fetching software:", error);
      message.error("Không thể tải danh sách phần mềm");
      setFilteredSoftware([]);
    }
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
    // Validate user is logged in
    if (!userDetails?.id) {
      message.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare request data
      const requestData: CreateRepairRequest = {
        computerAssetId: formData.assetId, // This is now asset.id
        errorType: formData.errorTypeId as ErrorType, // Direct enum value
        description: formData.description,
        mediaUrls: [], // TODO: Upload images first and get URLs
        componentIds:
          selectedComponentIds.length > 0 ? selectedComponentIds : undefined,
        softwareIds:
          selectedSoftwareIds.length > 0 ? selectedSoftwareIds : undefined,
      };

      console.log("📤 Submitting repair request:", requestData);

      // Call API to create repair request
      const result = await createRepair(requestData);

      console.log("✅ Repair request created:", result);

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
      setFilteredComputers([]);
      setFilteredComponents([]);
      setFilteredSoftware([]);
    } catch (error) {
      console.error("❌ Error creating repair request:", error);
      setIsSubmitting(false);
      message.error(
        error instanceof Error
          ? error.message
          : "Tạo yêu cầu sửa chữa thất bại. Vui lòng thử lại."
      );
    }
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
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
          Báo cáo lỗi thiết bị
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Báo cáo sự cố và lỗi thiết bị máy tính trong phòng học
        </p>
      </div>

      {/* Progress Tracker Card */}
      <Card title="Tiến độ hoàn thành" className="mb-4">
        <Steps
          current={currentStep}
          size="small"
          direction={isMobile ? "vertical" : "horizontal"}
          items={[
            {
              title: "Chọn vị trí",
              icon: <EnvironmentOutlined />,
              description: isMobile ? undefined : "Tòa nhà → Tầng → Phòng",
            },
            {
              title: "Chọn thiết bị",
              icon: <LaptopOutlined />,
              description: isMobile ? undefined : "Máy tính cần báo lỗi",
            },
            {
              title: "Loại lỗi",
              icon: <WarningOutlined />,
              description: isMobile ? undefined : "Chọn loại sự cố",
            },
            {
              title: "Mô tả chi tiết",
              icon: <EditOutlined />,
              description: isMobile ? undefined : "Thông tin chi tiết về lỗi",
            },
            {
              title: "Hoàn tất",
              icon: <CheckCircleOutlined />,
              description: isMobile ? undefined : "Đính kèm hình ảnh & gửi",
            },
          ]}
        />
      </Card>

      {/* QR Scanner for Mobile */}
      {isMobile && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center py-2">
            <Button
              type="primary"
              size="large"
              icon={<ScanOutlined />}
              className="mb-3 w-full sm:w-auto"
              style={{ height: "48px", fontSize: "16px" }}>
              Quét mã QR thiết bị
            </Button>
            <p className="text-sm text-gray-600">
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
                  {(() => {
                    const room = filteredRooms.find(
                      (r) => r.id === formData.roomId
                    );
                    return room
                      ? room.name || room.roomCode || room.roomNumber
                      : "N/A";
                  })()}
                </div>
              </div>
            )}
            {formData.assetId && (
              <div>
                <div className="text-sm text-gray-500">Thiết bị</div>
                <div className="font-medium">
                  {(() => {
                    if (!Array.isArray(filteredComputers)) return "N/A";
                    const computer = filteredComputers.find(
                      (c) => c.id === selectedComputerId
                    );
                    return computer
                      ? `Máy ${computer.machineLabel} - ${
                          computer.asset?.name || "N/A"
                        }`
                      : "N/A";
                  })()}
                </div>
              </div>
            )}
            {formData.errorTypeId && (
              <div>
                <div className="text-sm text-gray-500">Loại lỗi</div>
                <div className="font-medium">
                  {getErrorTypeByKey(formData.errorTypeId as ErrorType)?.name ||
                    "N/A"}
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
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
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
                      {room.name || room.roomNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Bước 2: Chọn thiết bị */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
              Bước 2: Chọn thiết bị
            </h3>
            <Form.Item label="Chọn thiết bị" required>
              <Select
                placeholder={
                  !formData.roomId
                    ? "Vui lòng chọn phòng trước"
                    : "Chọn thiết bị"
                }
                value={selectedComputerId}
                onChange={handleAssetChange}
                disabled={!formData.roomId}>
                {Array.isArray(filteredComputers) &&
                  filteredComputers.map((computer) => (
                    <Option key={computer.id} value={computer.id}>
                      Máy {computer.machineLabel}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          {/* Bước 3: Chọn loại lỗi */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
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
                    setFormData((prev) => ({
                      ...prev,
                      errorTypeId: ErrorType.MAY_HU_PHAN_MEM,
                    }));
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
                  onChange={(errorTypeId) => {
                    setFormData((prev) => ({ ...prev, errorTypeId }));

                    // Nếu chuyển sang loại lỗi không cho phép chọn linh kiện, reset selection
                    if (
                      !canSelectComponentsByErrorType(errorTypeId as ErrorType)
                    ) {
                      setSelectedComponentIds([]);
                      setShowComponentSelection(false);
                    }
                  }}>
                  {getHardwareErrorTypes().map((errorType) => (
                    <Option key={errorType.key} value={errorType.key}>
                      {errorType.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {/* Bước 4: Mô tả chi tiết */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
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
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
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
                {!canSelectComponents &&
                  errorCategory === "hardware" &&
                  formData.errorTypeId && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Chỉ có thể chọn linh kiện cụ thể
                        cho các loại lỗi: &quot;Máy không khởi động&quot;,
                        &quot;Máy không sử dụng được&quot;, hoặc &quot;Máy chạy
                        chậm&quot;.
                      </p>
                    </div>
                  )}

                <Button
                  type={showComponentSelection ? "primary" : "dashed"}
                  disabled={!canSelectComponents}
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
                      disabled={!canSelectComponents}
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
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
              Bước 6: Đính kèm hình ảnh (tùy chọn)
            </h3>

            <Form.Item label="Hình ảnh minh họa">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                  className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors w-full sm:w-auto">
                  <CameraOutlined className="mr-2" />
                  Chọn hình ảnh
                </label>
                <span className="text-sm text-gray-500 text-center sm:text-left">
                  Có thể chọn nhiều hình ảnh
                </span>
              </div>

              {/* Display selected images */}
              {formData.mediaFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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
                        className="absolute -top-2 -right-2 shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Form.Item>
          </div>

          {/* Form Actions */}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              size="large"
              onClick={handleCancel}
              className="w-full sm:w-auto">
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isSubmitting}
              className="w-full sm:w-auto"
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
