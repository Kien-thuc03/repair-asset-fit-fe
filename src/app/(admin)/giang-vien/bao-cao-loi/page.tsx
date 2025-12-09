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
import { AssetStatus, getAssetStatusLabel } from "@/types/computer";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { getComputersByRoomId, ComputerResponseDto } from "@/lib/api/computers";
import { getComponentsByComputerId } from "@/lib/api/components";
import { getSoftwareByAssetId } from "@/lib/api/asset-software";
import { createRepair, CreateRepairRequest } from "@/lib/api/repairs";
import {
  getComputerRepairInfo,
  ComputerRepairInfoResponse,
} from "@/lib/api/computers";
import { useProfile } from "@/hooks";
import { RoomStatus } from "@/lib/api/rooms";
import {
  getHardwareErrorTypes,
  getErrorTypeByKey,
  canSelectComponents as canSelectComponentsByErrorType,
  ErrorType,
} from "@/lib/constants/errorTypes";
import QRScanner from "@/components/common/QRScanner";
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
import { FileText, AlertCircle } from "lucide-react";

const { TextArea } = Input;
const { Option } = Select;

// Interface cho form báo cáo lỗi giảng viên (mở rộng từ ReportFormType)
interface LecturerReportFormType extends ReportFormType {
  building: string;
  floor: string;
}

// Giới hạn độ dài mô tả
const MAX_DESCRIPTION_LENGTH = 1000;

export default function BaoCaoLoiPage() {
  const router = useRouter();
  const { userDetails } = useProfile();

  const [formData, setFormData] = useState<LecturerReportFormType>({
    building: "",
    floor: "",
    assetId: "",
    componentId: "",
    roomId: "",
    errorType: "" as ErrorType, // ✅ Use errorType instead of errorTypeId
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDamagedModal, setShowDamagedModal] = useState(false);
  const [damagedMessage, setDamagedMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCategory, setErrorCategory] = useState<
    "hardware" | "software" | ""
  >(""); // Phân loại lỗi phần cứng/phần mềm
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoadingQRData, setIsLoadingQRData] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingComputers, setIsLoadingComputers] = useState(false);

  // Helper: get readable room label by id
  const getRoomLabel = (roomId?: string) => {
    if (!roomId) return "N/A";
    const room =
      filteredRooms.find((r) => r.id === roomId) ||
      rooms.find((r) => r.id === roomId);
    return room?.roomCode || room?.roomNumber || room?.name || roomId;
  };

  // Kiểm tra xem loại lỗi hiện tại có cho phép chọn linh kiện không
  const canSelectComponents =
    errorCategory === "hardware" &&
    formData.errorType &&
    canSelectComponentsByErrorType(formData.errorType as ErrorType);

  // Extract unique buildings from rooms
  const buildings = Array.from(
    new Set(rooms.map((room) => room.building).filter(Boolean))
  );

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const roomsData = await getRoomsApi();
        setRooms(roomsData);
      } catch {
        message.error("Không thể tải danh sách phòng. Vui lòng thử lại.");
      } finally {
        setIsLoadingRooms(false);
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
    if (errorCategory === "hardware" && !formData.errorType) {
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
    const floorsInBuilding = Array.from(
      new Set(
        rooms
          .filter((room) => room.building === building)
          .map((room) => room.floor)
          .filter(Boolean)
      )
    );
    setFilteredFloors(floorsInBuilding);
    setFilteredRooms([]);
    setFilteredComputers([]);
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
    const roomsOnFloor = rooms.filter(
      (room) => room.building === formData.building && room.floor === floor
    );

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
      setIsLoadingComputers(true);
      const computers = await getComputersByRoomId(roomId);
      // Ensure it's an array
      if (Array.isArray(computers)) {
        setFilteredComputers(computers);
      } else {
        setFilteredComputers([]);
        message.error("Dữ liệu máy tính không đúng định dạng");
      }
    } catch {
      message.error("Không thể tải danh sách máy tính");
      setFilteredComputers([]);
    } finally {
      setIsLoadingComputers(false);
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
      message.error("Không tìm thấy máy tính được chọn");
      return;
    }

    // Check if computer has asset
    if (!selectedComputer.asset?.id) {
      message.error("Máy tính này chưa được gán tài sản");
      return;
    }

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
      const components = await getComponentsByComputerId(computerId);
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
        setFilteredComponents([]);
        message.error("Dữ liệu linh kiện không đúng định dạng");
      }
    } catch {
      message.error("Không thể tải danh sách linh kiện");
      setFilteredComponents([]);
    }

    // Fetch software using asset ID
    try {
      const softwareList = await getSoftwareByAssetId(
        selectedComputer.asset.id
      );

      // Map SoftwareDto to Software interface
      const mappedSoftware: Software[] = softwareList.map((sw) => ({
        id: sw.softwareId,
        name: sw.name,
        version: sw.version,
        publisher: sw.publisher,
        createdAt: sw.installationDate, // Use installationDate as createdAt
      }));
      setFilteredSoftware(mappedSoftware);
    } catch {
      message.error("Không thể tải danh sách phần mềm");
      setFilteredSoftware([]);
    }
  };

  // Handle media upload
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const validFiles: File[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        message.error(`File "${file.name}" quá lớn, vui lòng chọn file < 10MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...validFiles],
      }));
    }

    // Reset input để có thể chọn lại cùng file nếu cần
    e.target.value = "";
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

    // Validate description length
    if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      message.error("Mô tả quá dài!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare request data
      const requestData: CreateRepairRequest = {
        computerAssetId: formData.assetId, // This is now asset.id
        errorType: formData.errorType as ErrorType, // Direct enum value
        description: formData.description,
        mediaFiles:
          formData.mediaFiles.length > 0 ? formData.mediaFiles : undefined, // ✅ Use mediaFiles instead of mediaUrls
        componentIds:
          selectedComponentIds.length > 0 ? selectedComponentIds : undefined,
        softwareIds:
          selectedSoftwareIds.length > 0 ? selectedSoftwareIds : undefined,
      };

      // Call API to create repair request
      await createRepair(requestData);

      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        building: "",
        floor: "",
        assetId: "",
        componentId: "",
        roomId: "",
        errorType: "" as ErrorType, // ✅ Use errorType
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
      setIsSubmitting(false);

      // Extract error message and status code
      let extractedMessage = "Tạo yêu cầu sửa chữa thất bại. Vui lòng thử lại.";
      let errorStatus: number | undefined;

      if (error instanceof Error) {
        extractedMessage = error.message;
        // Check if error has statusCode property (from our custom error)
        const errorWithStatus = error as Error & { statusCode?: number };
        if (errorWithStatus.statusCode !== undefined) {
          errorStatus = errorWithStatus.statusCode;
        }
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string | string[];
            };
            status?: number;
          };
        };
        errorStatus = axiosError.response?.status;
        if (axiosError.response?.data?.message) {
          const backendMessage = axiosError.response.data.message;
          extractedMessage = Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage;
        }
      }

      // Check if error is 409 Conflict (máy đã có yêu cầu chưa xử lý)
      if (
        errorStatus === 409 ||
        extractedMessage.includes("đang có yêu cầu sửa chữa chưa hoàn thành")
      ) {
        // Show error modal for 409 Conflict
        setErrorMessage(extractedMessage);
        setShowErrorModal(true);
        // Don't log 409 errors as errors since they're handled by UI modal
        console.info("ℹ️ Conflict (409) handled by modal:", extractedMessage);
      } else {
        // Show regular error message for other errors
        message.error(extractedMessage, 5);
        // Log other errors for debugging
        console.error("Create repair request error:", error);
      }
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/giang-vien/danh-sach-yeu-cau-sua-chua");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/giang-vien/danh-sach-yeu-cau-sua-chua");
  };

  // Handle QR scan success
  const handleQRScanSuccess = async (decodedText: string) => {
    try {
      setIsLoadingQRData(true);

      // Parse QR code data
      let qrData: { type: string; computerId: string; timestamp?: string };
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        message.error("Mã QR không hợp lệ. Vui lòng quét lại.");
        setIsLoadingQRData(false);
        return;
      }

      // Validate QR data
      if (qrData.type !== "REPAIR_REQUEST" || !qrData.computerId) {
        message.error(
          "Mã QR không phải là mã QR của thiết bị. Vui lòng quét đúng mã QR."
        );
        setIsLoadingQRData(false);
        return;
      }

      // Fetch computer repair info from API
      const repairInfo: ComputerRepairInfoResponse =
        await getComputerRepairInfo(qrData.computerId);

      if (!repairInfo.success) {
        message.error(repairInfo.message || "Không thể lấy thông tin thiết bị");
        setIsLoadingQRData(false);
        return;
      }

      const { data } = repairInfo;

      // Check if computer has active repair
      if (data.hasActiveRepair) {
        message.warning(
          `Máy này đang có yêu cầu sửa chữa chưa hoàn thành (${data.activeRepairInfo?.requestCode}). Vui lòng chọn máy khác.`
        );
        setIsLoadingQRData(false);
        return;
      }

      // Nếu tài sản đang ở trạng thái hư hỏng, thông báo và dừng
      if (data.asset.status === AssetStatus.DAMAGED) {
        setDamagedMessage(
          `Thiết bị ${data.asset.name} (${data.asset.ktCode}) đang được đánh dấu hư hỏng. Vui lòng chọn máy khác hoặc kiểm tra yêu cầu sửa chữa hiện có.`
        );
        setShowDamagedModal(true);
        setIsLoadingQRData(false);
        return;
      }

      // Auto-fill form with QR data
      setFormData((prev) => ({
        ...prev,
        building: data.room.building,
        floor: data.room.floor,
        roomId: data.room.id,
        assetId: data.asset.id, // This is computerAssetId for repair request
      }));

      // Update filtered data
      // 1. Set floors for the building
      const floorsInBuilding = Array.from(
        new Set(
          rooms
            .filter((room) => room.building === data.room.building)
            .map((room) => room.floor)
            .filter(Boolean)
        )
      );
      setFilteredFloors(floorsInBuilding);

      // 2. Set rooms for the floor
      const roomsOnFloor = rooms.filter(
        (room) =>
          room.building === data.room.building && room.floor === data.room.floor
      );
      if (roomsOnFloor.length > 0) {
        setFilteredRooms(roomsOnFloor);
      } else {
        // Fallback: ensure the scanned room is available for display
        const mappedRoom: RoomResponseDto = {
          id: data.room.id,
          building: data.room.building,
          roomCode:
            data.room.roomCode || data.room.roomNumber || data.room.name || "",
          floor: data.room.floor,
          roomNumber: data.room.roomNumber || "",
          status: RoomStatus.ACTIVE,
          name:
            data.room.name ||
            data.room.roomCode ||
            data.room.roomNumber ||
            "Phòng",
          createdAt: new Date().toISOString(),
        };
        setFilteredRooms([mappedRoom]);
      }

      // 3. Set computers for the room
      try {
        const computers = await getComputersByRoomId(data.room.id);
        setFilteredComputers(Array.isArray(computers) ? computers : []);

        // After computers are loaded, ensure selectedComputerId is set correctly
        // This will make the dropdown show the selected computer
        setSelectedComputerId(data.computer.id);
      } catch {
        setFilteredComputers([]);
      }

      // 4. Set components
      const mappedComponents: Component[] = data.availableComponents.map(
        (comp) => ({
          id: comp.id,
          computerAssetId: data.computer.id,
          componentType: comp.componentType as unknown as ComponentType,
          name: comp.name,
          componentSpecs: comp.componentSpecs,
          serialNumber: comp.serialNumber,
          status: "INSTALLED" as ComponentStatus, // Available components are installed
          installedAt: new Date().toISOString(),
          removedAt: undefined,
          notes: undefined,
        })
      );
      setFilteredComponents(mappedComponents);

      // 5. Set software
      const mappedSoftware: Software[] = data.installedSoftware.map((sw) => ({
        id: sw.id,
        name: sw.name,
        version: sw.version || "",
        publisher: sw.publisher || "",
        createdAt: sw.installationDate || new Date().toISOString(),
      }));
      setFilteredSoftware(mappedSoftware);

      setIsLoadingQRData(false);
      message.success(
        `Đã tự động điền thông tin từ mã QR: ${data.asset.name} (${data.asset.ktCode})`
      );
    } catch (error) {
      console.error("QR scan error:", error);
      message.error("Không thể tải thông tin từ mã QR. Vui lòng thử lại.");
      setIsLoadingQRData(false);
    }
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
              title: <span>Báo hỏng thiết bị</span>,
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mt-2">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo hỏng thiết bị
            </h1>
            <p className="text-gray-600">
              Báo cáo sự cố và lỗi thiết bị máy tính trong phòng học
            </p>
          </div>
        </div>
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
              style={{ height: "48px", fontSize: "16px" }}
              onClick={() => setShowQRScanner(true)}
              loading={isLoadingQRData}>
              {isLoadingQRData
                ? "Đang tải thông tin..."
                : "Quét mã QR thiết bị"}
            </Button>
            <p className="text-sm text-gray-600">
              Quét mã QR trên thiết bị để tự động điền thông tin
            </p>
          </div>
        </Card>
      )}

      {/* Summary Card - Hiển thị thông tin đã chọn */}
      {(formData.building || formData.assetId || formData.errorType) && (
        <Card title="Thông tin đã chọn" size="small" className="bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.building && (
              <div>
                <div className="text-sm text-gray-500">Vị trí</div>
                <div className="font-medium">
                  {formData.building} - {formData.floor} -{" "}
                  {getRoomLabel(formData.roomId)}
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
            {formData.errorType && (
              <div>
                <div className="text-sm text-gray-500">Loại lỗi</div>
                <div className="font-medium">
                  {getErrorTypeByKey(formData.errorType as ErrorType)?.name ||
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
                  placeholder={
                    isLoadingRooms
                      ? "Đang tải danh sách tòa nhà..."
                      : buildings.length === 0
                      ? "Không có dữ liệu tòa nhà"
                      : "Chọn tòa nhà"
                  }
                  value={formData.building}
                  onChange={handleBuildingChange}
                  loading={isLoadingRooms}
                  disabled={isLoadingRooms}
                  notFoundContent={
                    isLoadingRooms ? "Đang tải..." : "Không có dữ liệu"
                  }>
                  {buildings.map((building) => (
                    <Option key={building} value={building}>
                      {building}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn tầng" required>
                <Select
                  placeholder={
                    isLoadingRooms
                      ? "Đang tải..."
                      : !formData.building
                      ? "Vui lòng chọn tòa nhà trước"
                      : filteredFloors.length === 0
                      ? "Không có dữ liệu tầng"
                      : "Chọn tầng"
                  }
                  value={formData.floor}
                  onChange={handleFloorChange}
                  disabled={isLoadingRooms || !formData.building}
                  loading={isLoadingRooms}
                  notFoundContent={
                    isLoadingRooms ? "Đang tải..." : "Không có dữ liệu"
                  }>
                  {filteredFloors.map((floor) => (
                    <Option key={floor} value={floor}>
                      {floor}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn phòng" required>
                <Select
                  placeholder={
                    isLoadingRooms
                      ? "Đang tải..."
                      : !formData.floor
                      ? "Vui lòng chọn tầng trước"
                      : filteredRooms.length === 0
                      ? "Không có phòng nào"
                      : "Chọn phòng"
                  }
                  value={formData.roomId}
                  onChange={handleRoomChange}
                  disabled={isLoadingRooms || !formData.floor}
                  loading={isLoadingRooms}
                  notFoundContent={
                    isLoadingRooms ? "Đang tải..." : "Không có dữ liệu"
                  }>
                  {filteredRooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.roomCode || room.roomNumber || room.name}
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
                      : isLoadingComputers
                      ? "Đang tải danh sách thiết bị..."
                      : "Chọn thiết bị"
                }
                value={selectedComputerId}
                onChange={handleAssetChange}
                  disabled={!formData.roomId || isLoadingComputers}
                  loading={isLoadingComputers}
                  notFoundContent={
                    isLoadingComputers
                      ? "Đang tải..."
                      : "Không có máy tính nào trong phòng này"
                  }>
                {Array.isArray(filteredComputers) &&
                  filteredComputers.map((computer) => (
                    <Option
                      key={computer.id}
                      value={computer.id}
                      disabled={computer.asset?.status === AssetStatus.DAMAGED}>
                      <div className="flex items-center justify-between">
                        <span>
                          Máy {computer.machineLabel} -{" "}
                          {computer.asset?.name || "N/A"}
                        </span>
                        {computer.asset?.status === AssetStatus.DAMAGED && (
                          <span className="ml-2 text-red-600 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Đang bị lỗi
                          </span>
                        )}
                      </div>
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
                  // Reset errorType khi thay đổi category
                  if (newCategory === "software") {
                    // Nếu chọn lỗi phần mềm, tự động set errorType
                    setFormData((prev) => ({
                      ...prev,
                      errorType: ErrorType.MAY_HU_PHAN_MEM,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      errorType: "" as ErrorType,
                    }));
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
                  value={formData.errorType}
                  onChange={(errorType) => {
                    setFormData((prev) => ({ ...prev, errorType }));

                    // Nếu chuyển sang loại lỗi không cho phép chọn linh kiện, reset selection
                    if (
                      !canSelectComponentsByErrorType(errorType as ErrorType)
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
                maxLength={MAX_DESCRIPTION_LENGTH}
                showCount
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
          {/* <div
            className={`mb-6 ${
              !errorCategory ||
              (errorCategory === "hardware" && !formData.errorType)
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
                  formData.errorType && (
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
          </div> */}

          {/* Bước 5: Đính kèm hình ảnh */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-900">
              Bước 5: Đính kèm hình ảnh (tùy chọn)
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
                (errorCategory === "hardware" && !formData.errorType) ||
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

      {/* Error Modal for 409 Conflict */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <WarningOutlined className="text-orange-500 text-xl" />
            <span>Không thể tạo yêu cầu sửa chữa</span>
          </div>
        }
        open={showErrorModal}
        onOk={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
        okText="Đã hiểu"
        cancelText="Đóng"
        centered
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setShowErrorModal(false)}>
            Đã hiểu
          </Button>,
        ]}>
        <div className="py-4">
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium mb-2">
              ⚠️ Lưu ý quan trọng
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Gợi ý:</strong> Vui lòng chọn máy tính khác hoặc đợi yêu
              cầu hiện tại được xử lý xong trước khi tạo yêu cầu mới cho máy
              này.
            </p>
          </div>
        </div>
      </Modal>

      {/* Damaged asset modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <WarningOutlined className="text-red-500 text-xl" />
            <span>Thiết bị đang hư hỏng</span>
          </div>
        }
        open={showDamagedModal}
        onOk={() => setShowDamagedModal(false)}
        onCancel={() => setShowDamagedModal(false)}
        okText="Đã hiểu"
        cancelText="Đóng"
        centered
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setShowDamagedModal(false)}>
            Đã hiểu
          </Button>,
        ]}>
        <div className="py-4">
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{damagedMessage}</p>
          </div>
          <p className="text-xs text-gray-600">
            Vui lòng chọn máy khác hoặc kiểm tra các yêu cầu sửa chữa hiện tại
            cho thiết bị này.
          </p>
        </div>
      </Modal>

      {/* QR Scanner Modal */}
      <QRScanner
        open={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
}
