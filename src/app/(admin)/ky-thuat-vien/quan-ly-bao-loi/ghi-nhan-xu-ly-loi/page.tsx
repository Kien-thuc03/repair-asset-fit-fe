"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Component,
  Software,
  RepairStatus,
  ErrorType,
  ComponentStatus,
  ComponentType,
} from "@/types";
import { AssetStatus } from "@/types/computer";
import { AlertCircle } from "lucide-react";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { getComputersByRoomId, ComputerResponseDto } from "@/lib/api/computers";
import { getComponentsByComputerId, getStockComponents, StockComponentDto, replaceComponent } from "@/lib/api/components";
import { getSoftwareByAssetId } from "@/lib/api/asset-software";
import { createAndProcessRepair, CreateAndProcessRepairRequest, getAssignedFloors, AssignedFloor } from "@/lib/api/repairs";
import { useProfile } from "@/hooks";
import {
  getHardwareErrorTypes,
  getErrorTypeByKey,
} from "@/lib/constants/errorTypes";

import { SuccessModal } from "@/components/modal";
import { TechnicianReportSteps } from "@/components/technician/TechnicianReportHelpers";
import { 
  Breadcrumb, 
  Card, 
  Form, 
  Button, 
  Input, 
  Select, 
  Radio, 
  Alert, 
  message 
} from "antd";
import { DeleteOutlined, CameraOutlined, ScanOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Interface cho form ghi nhận lỗi kỹ thuật viên
interface TechnicianReportFormType {
  building: string;
  floor: string;
  roomId: string;
  assetId: string; // This will store asset.id
  errorCategory: "hardware" | "software" | "";
  errorType: ErrorType | "";
  description: string;
  repairMethod: "" | "software_fixed" | "hardware_fixed" | "need_replacement";
  repairNotes: string;
  mediaFiles: File[];
}

export default function GhiNhanXuLyLoiPage() {
  const router = useRouter();
  const { userDetails } = useProfile();

  const [formData, setFormData] = useState<TechnicianReportFormType>({
    building: "",
    floor: "",
    assetId: "",
    roomId: "",
    errorType: "",
    errorCategory: "",
    description: "",
    repairMethod: "",
    repairNotes: "",
    mediaFiles: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComputerId, setSelectedComputerId] = useState<string>(""); // Store computer.id for loading components
  const [filteredRooms, setFilteredRooms] = useState<RoomResponseDto[]>([]);
  const [filteredComputers, setFilteredComputers] = useState<ComputerResponseDto[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filteredSoftware, setFilteredSoftware] = useState<Software[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // State cho linh kiện trong kho và mapping thay thế
  const [stockComponents, setStockComponents] = useState<StockComponentDto[]>([]);
  const [replacementMapping, setReplacementMapping] = useState<Record<string, string>>({}); // oldComponentId -> newComponentId
  const [availableReplacements, setAvailableReplacements] = useState<Record<string, StockComponentDto[]>>({}); // componentType -> StockComponentDto[]
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [assignedFloors, setAssignedFloors] = useState<AssignedFloor[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [loadingComputers, setLoadingComputers] = useState(false);
  const [assignedFloorsLoaded, setAssignedFloorsLoaded] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Extract unique buildings - CHỈ lấy từ assignedFloors sau khi đã load xong
  // Không sử dụng fallback từ rooms để tránh hiển thị tầng không được phân công
  const buildings = assignedFloorsLoaded
    ? Array.from(
        new Set(assignedFloors.map((floor) => floor.building).filter(Boolean))
      )
    : [];

  // Computed: Lấy floors được phân công cho building hiện tại
  // CHỈ lấy từ assignedFloors, không fallback về rooms
  const getAvailableFloorsForBuilding = (building: string): string[] => {
    if (!building || !assignedFloorsLoaded) return [];
    
    // Chỉ lấy floors được phân công cho building này
    return Array.from(
      new Set(
        assignedFloors
          .filter((floor) => floor.building === building)
          .map((floor) => floor.floor)
          .filter(Boolean)
      )
    );
  };

  // Computed: Floors có sẵn cho building hiện tại
  const availableFloors = getAvailableFloorsForBuilding(formData.building);

  // Fetch assigned floors and rooms for technician
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingBuildings(true);
      setAssignedFloorsLoaded(false);
      const promises: Promise<void>[] = [];

      // Fetch assigned floors if user is logged in - BẮT BUỘC phải load trước
      if (userDetails?.id) {
        promises.push(
          getAssignedFloors()
            .then((response) => {
              setAssignedFloors(response.assignedFloors || []);
              setAssignedFloorsLoaded(true); // Đánh dấu đã load xong
            })
            .catch((error) => {
              console.error("Error fetching assigned floors:", error);
              setAssignedFloors([]);
              setAssignedFloorsLoaded(true); // Vẫn đánh dấu đã load (dù có lỗi)
              message.error("Không thể tải danh sách tầng được phân công. Vui lòng thử lại.");
            })
        );
      } else {
        // Nếu không có user, vẫn đánh dấu đã load để không hiển thị fallback
        setAssignedFloorsLoaded(true);
      }

      // Fetch rooms (chỉ dùng để filter rooms sau khi chọn floor)
      promises.push(
        getRoomsApi()
          .then((roomsData) => {
            setRooms(roomsData);
          })
          .catch(() => {
            message.error("Không thể tải danh sách phòng. Vui lòng thử lại.");
          })
      );

      // Wait for all promises to complete
      await Promise.all(promises);
      setLoadingBuildings(false);
    };

    fetchInitialData();
  }, [userDetails?.id]);

  useEffect(() => {
    const urls = formData.mediaFiles.map((file) => URL.createObjectURL(file));
    setMediaPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.mediaFiles]);

  // Load stock components on mount
  useEffect(() => {
    const fetchStockComponents = async () => {
      try {
        const stock = await getStockComponents();
        setStockComponents(stock);
        
        // Group by componentType
        const grouped: Record<string, StockComponentDto[]> = {};
        stock.forEach(comp => {
          const type = comp.componentType;
          if (!grouped[type]) {
            grouped[type] = [];
          }
          grouped[type].push(comp);
        });
        setAvailableReplacements(grouped);
      } catch (error) {
        console.error("Error fetching stock components:", error);
        // Không hiển thị lỗi vì đây là tính năng bổ sung
      }
    };
    
    fetchStockComponents();
  }, []);

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
    setFormData(prev => ({ 
      ...prev, 
      building, 
      floor: "", 
      roomId: "", 
      assetId: "",
      errorCategory: "",
      errorType: "",
      repairMethod: "",
      repairNotes: ""
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setSelectedComputerId("");
    
    // Filter floors by building - chỉ lấy floors được phân công
    // Không cần setFilteredFloors nữa vì đã dùng availableFloors computed value
    setFilteredRooms([]);
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle floor change
  const handleFloorChange = (floor: string) => {
    setFormData(prev => ({ 
      ...prev, 
      floor, 
      roomId: "", 
      assetId: "",
      errorCategory: "",
      errorType: "",
      repairMethod: "",
      repairNotes: ""
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setSelectedComputerId("");
    
    // Filter rooms by building and floor - CHỈ lấy rooms ở tầng được phân công
    // Không sử dụng fallback để tránh hiển thị rooms không được phân công
    let roomsOnFloor: RoomResponseDto[] = [];
    
    if (!assignedFloorsLoaded) {
      // Chưa load xong, không hiển thị rooms
      roomsOnFloor = [];
    } else if (assignedFloors.length > 0) {
      // Kiểm tra floor có được phân công không
      const isFloorAssigned = assignedFloors.some(
        (assigned) => assigned.building === formData.building && assigned.floor === floor
      );
      
      if (isFloorAssigned) {
        roomsOnFloor = rooms.filter(
          (room) => room.building === formData.building && room.floor === floor
        );
      } else {
        // Nếu floor không được phân công, không hiển thị rooms
        roomsOnFloor = [];
        message.warning("Tầng này không thuộc phạm vi được phân công của bạn");
      }
    } else {
      // assignedFloorsLoaded = true nhưng assignedFloors.length = 0
      // Nghĩa là người dùng không được phân công tầng nào
      roomsOnFloor = [];
      message.warning("Bạn chưa được phân công tầng nào");
    }
    
    setFilteredRooms(roomsOnFloor);
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };


  // Handle room change
  const handleRoomChange = async (roomId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      roomId, 
      assetId: "",
      errorCategory: "",
      errorType: "",
      repairMethod: "",
      repairNotes: ""
    }));
    setSelectedComputerId("");
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);

    // Reset computers first
    setFilteredComputers([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);

    // Fetch computers for the selected room
    try {
      setLoadingComputers(true);
      const computers = await getComputersByRoomId(roomId);
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
      setLoadingComputers(false);
    }
  };

  // Handle asset change
  const handleAssetChange = async (computerId: string) => {
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);

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
    }));

    // Store computer.id for loading components
    setSelectedComputerId(computerId);

    // Fetch components for the selected computer using computer ID
    try {
      const components = await getComponentsByComputerId(computerId);
      if (Array.isArray(components)) {
        // Map ComponentResponseDto to Component interface
        const mappedComponents: Component[] = components.map((comp) => ({
          id: comp.id,
          computerAssetId: selectedComputer.id,
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
        createdAt: sw.installationDate,
      }));
      setFilteredSoftware(mappedSoftware);
    } catch {
      message.error("Không thể tải danh sách phần mềm");
      setFilteredSoftware([]);
    }
  };

  // Handle error category change
  const handleErrorCategoryChange = (category: "hardware" | "software") => {
    setFormData(prev => ({ 
      ...prev, 
      errorCategory: category, 
      errorType: category === "software" ? ErrorType.MAY_HU_PHAN_MEM : "",
      repairMethod: "",
      repairNotes: ""
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
  };

  // Handle QR scan (simulation)
  const simulateQRScan = async () => {
    // This would open camera in real app
    message.info("Chức năng quét QR đang được phát triển");
  };

  // Handle media upload
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  // Remove media file
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
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

    // Validate computerId is available for replacement
    if (!selectedComputerId && formData.repairMethod === 'need_replacement' && Object.keys(replacementMapping).length > 0) {
      message.error("Không thể xác định máy tính để thay thế linh kiện. Vui lòng thử lại.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Xử lý thay thế linh kiện nếu có chọn linh kiện thay thế từ kho
      let allReplacementsSuccessful = true;
      if (formData.repairMethod === 'need_replacement' && Object.keys(replacementMapping).length > 0 && selectedComputerId) {
        const replacementPromises = Object.entries(replacementMapping).map(async ([oldComponentId, newComponentId]) => {
          const oldComponent = filteredComponents.find(c => c.id === oldComponentId);
          const newComponent = stockComponents.find(c => c.id === newComponentId);
          
          if (!oldComponent || !newComponent) {
            throw new Error(`Không tìm thấy thông tin linh kiện để thay thế`);
          }

          try {
            await replaceComponent(selectedComputerId, {
              oldComponentId: oldComponentId,
              newItemName: newComponent.name,
              newItemSpecs: newComponent.componentSpecs || "",
              serialNumber: newComponent.serialNumber,
              notes: `Thay thế từ kho - ${formData.repairNotes || "Thay thế linh kiện bị lỗi"}`,
              newlyPurchasedComponentId: newComponentId,
            });
            return true;
          } catch (error) {
            console.error(`Lỗi thay thế linh kiện ${oldComponent.name}:`, error);
            message.error(`Không thể thay thế linh kiện ${oldComponent.name}. ${error instanceof Error ? error.message : "Vui lòng thử lại."}`);
            return false;
          }
        });

        const results = await Promise.all(replacementPromises);
        allReplacementsSuccessful = results.every(r => r === true);
      }

      // ⚠️ LOGIC: Determine finalStatus based on repairMethod
      // - ĐÃ_HOÀN_THÀNH: khi sửa xong (software_fixed hoặc hardware_fixed) HOẶC đã thay thế thành công
      // - CHỜ_THAY_THẾ: khi cần thay thế linh kiện (need_replacement) nhưng chưa thay thế hoặc thay thế thất bại
      let finalStatus: RepairStatus.ĐÃ_HOÀN_THÀNH | RepairStatus.CHỜ_THAY_THẾ | undefined;
      
      if (formData.repairMethod === 'software_fixed' || formData.repairMethod === 'hardware_fixed') {
        finalStatus = RepairStatus.ĐÃ_HOÀN_THÀNH;
      } else if (formData.repairMethod === 'need_replacement') {
        // Nếu đã thay thế thành công tất cả linh kiện, chuyển sang ĐÃ_HOÀN_THÀNH
        // Nếu không có chọn linh kiện thay thế hoặc thay thế thất bại, giữ CHỜ_THAY_THẾ
        if (Object.keys(replacementMapping).length > 0 && allReplacementsSuccessful) {
          finalStatus = RepairStatus.ĐÃ_HOÀN_THÀNH;
        } else {
          finalStatus = RepairStatus.CHỜ_THAY_THẾ;
        }
      }

      // Prepare request data
      const requestData: CreateAndProcessRepairRequest = {
        computerAssetId: formData.assetId,
        errorType: formData.errorCategory === 'software' 
          ? ErrorType.MAY_HU_PHAN_MEM 
          : (formData.errorType as ErrorType),
        description: formData.description,
        mediaFiles: formData.mediaFiles.length > 0 ? formData.mediaFiles : undefined,
        componentIds: formData.errorCategory === 'hardware' && selectedComponentIds.length > 0
          ? selectedComponentIds 
          : undefined,
        softwareIds: formData.errorCategory === 'software' && selectedSoftwareIds.length > 0 
          ? selectedSoftwareIds 
          : undefined,
        resolutionNotes: formData.repairNotes || undefined,
        finalStatus: finalStatus, // ĐÃ_HOÀN_THÀNH nếu đã sửa được hoặc đã thay thế thành công, CHỜ_THAY_THẾ nếu cần thay thế
      };

      // Call API to create and process repair request
      await createAndProcessRepair(requestData);

      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        building: "",
        floor: "",
        assetId: "",
        roomId: "",
        errorType: "",
        errorCategory: "",
        description: "",
        repairMethod: "",
        repairNotes: "",
        mediaFiles: [],
      });
      setSelectedComponentIds([]);
      setSelectedSoftwareIds([]);
      setSelectedComputerId("");
      setFilteredRooms([]);
      setFilteredComputers([]);
      setFilteredComponents([]);
      setFilteredSoftware([]);
    } catch (error) {
      setIsSubmitting(false);
      message.error(
        error instanceof Error
          ? error.message
          : "Ghi nhận và xử lý lỗi thất bại. Vui lòng thử lại."
      );
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/ky-thuat-vien");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/ky-thuat-vien");
  };

  // Filter error types based on category
  const getFilteredErrorTypes = () => {
    if (formData.errorCategory === "software") {
      return []; // Không cần chọn loại lỗi cho phần mềm (auto = MAY_HU_PHAN_MEM)
    }
    return getHardwareErrorTypes();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/ky-thuat-vien",
              title: <span>Trang chủ</span>,
            },
            {
              title: <span>Ghi nhận và xử lý lỗi</span>,
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
          Ghi nhận và xử lý lỗi thiết bị
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Ghi nhận lỗi thiết bị và thực hiện xử lý trực tiếp tại hiện trường
        </p>
      </div>

      {/* Progress Steps */}
      <TechnicianReportSteps currentStep={
        !formData.building || !formData.floor || !formData.roomId ? 0 :
        !formData.assetId ? 1 :
        !formData.errorCategory ? 2 :
        (formData.errorCategory === "hardware" && !formData.errorType) ? 2 :
        !formData.description ? 3 :
        !formData.repairMethod || !formData.repairNotes ? 4 : 5
      } />

      {/* QR Scanner for Mobile */}
      {isMobile && (
        <Card>
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              icon={<ScanOutlined />}
              onClick={simulateQRScan}
              className="mb-2"
            >
              Quét mã QR thiết bị
            </Button>
            <p className="text-sm text-gray-500">
              Quét mã QR trên thiết bị để tự động điền thông tin
            </p>
          </div>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Bước 1: Chọn vị trí */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 1: Chọn vị trí thiết bị
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <Form.Item label="Chọn tòa nhà" required>
                <Select
                  placeholder={
                    loadingBuildings 
                      ? "Đang tải danh sách tòa nhà..." 
                      : !assignedFloorsLoaded
                        ? "Đang tải..."
                        : buildings.length === 0
                          ? "Không có tòa nhà được phân công"
                          : "Chọn tòa nhà"
                  }
                  value={formData.building}
                  onChange={handleBuildingChange}
                  loading={loadingBuildings || !assignedFloorsLoaded}
                  disabled={loadingBuildings || !assignedFloorsLoaded}
                  notFoundContent={
                    loadingBuildings || !assignedFloorsLoaded
                      ? "Đang tải..." 
                      : buildings.length === 0
                        ? "Bạn chưa được phân công tòa nhà nào"
                        : "Không có dữ liệu"
                  }
                >
                  {buildings.map(building => (
                    <Option key={building} value={building}>
                      {building}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn tầng" required>
                <Select
                  placeholder={
                    !assignedFloorsLoaded
                      ? "Đang tải..."
                      : !formData.building 
                        ? "Vui lòng chọn tòa nhà trước" 
                        : availableFloors.length === 0 
                          ? "Không có tầng được phân công" 
                          : "Chọn tầng"
                  }
                  value={formData.floor}
                  onChange={handleFloorChange}
                  disabled={!assignedFloorsLoaded || !formData.building || availableFloors.length === 0}
                  loading={!assignedFloorsLoaded}
                  notFoundContent={
                    !assignedFloorsLoaded
                      ? "Đang tải..."
                      : availableFloors.length === 0 && formData.building
                        ? "Không có tầng được phân công cho tòa nhà này"
                        : "Không có dữ liệu"
                  }
                >
                  {availableFloors.map(floor => (
                    <Option key={floor} value={floor}>
                      {floor}
                    </Option>
                  ))}
                </Select>
                {assignedFloorsLoaded && formData.building && availableFloors.length === 0 && (
                  <div className="text-sm text-orange-600 mt-1">
                    ⚠️ Bạn không được phân công tầng nào cho tòa nhà này
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Chọn phòng" required>
                <Select
                  placeholder="Chọn phòng"
                  value={formData.roomId}
                  onChange={handleRoomChange}
                  disabled={!formData.floor}
                >
                  {filteredRooms.map(room => (
                    <Option key={room.id} value={room.id}>
                      {room.name || room.roomNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Bước 2: Chọn thiết bị */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 2: Chọn thiết bị
            </h3>
            <Form.Item label="Chọn thiết bị" required>
              <Select
                placeholder={
                  !formData.roomId 
                    ? "Vui lòng chọn phòng trước" 
                    : loadingComputers
                      ? "Đang tải danh sách thiết bị..."
                      : "Chọn thiết bị"
                }
                value={selectedComputerId}
                onChange={handleAssetChange}
                disabled={!formData.roomId || loadingComputers}
                loading={loadingComputers}
                notFoundContent={
                  loadingComputers 
                    ? "Đang tải..." 
                    : "Không có máy tính nào trong phòng này"
                }
              >
                {Array.isArray(filteredComputers) &&
                  filteredComputers.map((computer) => {
                    // Kiểm tra theo trạng thái tài sản: Asset status = DAMAGED (hư hỏng)
                    const isAssetDamaged = computer.asset?.status === AssetStatus.DAMAGED;
                    
                    return (
                      <Option 
                        key={computer.id} 
                        value={computer.id}
                        disabled={isAssetDamaged}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            Máy {computer.machineLabel} - {computer.asset?.name || "N/A"}
                          </span>
                          {isAssetDamaged && (
                            <span className="ml-2 text-red-600 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Đang bị lỗi
                            </span>
                          )}
                        </div>
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>

          {/* Bước 3: Phân loại lỗi */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 3: Phân loại và chọn loại lỗi
            </h3>
            <Form.Item label="Phân loại lỗi" required>
              <Radio.Group
                value={formData.errorCategory}
                onChange={(e) => handleErrorCategoryChange(e.target.value)}
                disabled={!formData.assetId}
              >
                <Radio value="software">Lỗi phần mềm</Radio>
                <Radio value="hardware">Lỗi phần cứng</Radio>
              </Radio.Group>
            </Form.Item>

            {formData.errorCategory === "hardware" && (
              <Form.Item label="Chọn loại lỗi cụ thể" required>
                <Select
                  placeholder="Chọn loại lỗi"
                  value={formData.errorType}
                  onChange={(errorType) => 
                    setFormData(prev => ({ ...prev, errorType }))
                  }
                  disabled={!formData.errorCategory}
                >
                  {getFilteredErrorTypes().map(errorType => (
                    <Option key={errorType.key} value={errorType.key}>
                      {errorType.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {/* Bước 4: Chọn linh kiện/phần mềm cụ thể */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 4: Chọn {formData.errorCategory === "hardware" ? "linh kiện" : "phần mềm"} bị lỗi
            </h3>
            
            {formData.errorCategory === "hardware" && (
              <Form.Item 
                label="Linh kiện cụ thể" 
                required
                help="Vui lòng chọn ít nhất 1 linh kiện bị lỗi"
              >
                <Select
                  mode="multiple"
                  placeholder={
                    !formData.assetId 
                      ? "Vui lòng chọn thiết bị trước" 
                      : filteredComponents.length === 0
                        ? "Không có linh kiện nào"
                        : "Chọn linh kiện bị lỗi"
                  }
                  value={selectedComponentIds}
                  onChange={setSelectedComponentIds}
                  disabled={!formData.assetId || filteredComponents.length === 0}
                  notFoundContent={
                    filteredComponents.length === 0 && formData.assetId
                      ? "Không có linh kiện nào trong thiết bị này"
                      : "Không có dữ liệu"
                  }
                >
                  {filteredComponents
                    .filter(component => component.status == ComponentStatus.INSTALLED)
                    .map(component => (
                      <Option key={component.id} value={component.id}>
                        {component.name} ({component.componentType})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}

            {formData.errorCategory === "software" && (
              <Form.Item label="Phần mềm cụ thể">
                <Select
                  mode="multiple"
                  placeholder="Chọn phần mềm bị lỗi"
                  value={selectedSoftwareIds}
                  onChange={setSelectedSoftwareIds}
                  disabled={filteredSoftware.length === 0}
                >
                  {filteredSoftware.map(software => (
                    <Option key={software.id} value={software.id}>
                      {software.name} {software.version && `(${software.version})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {/* Bước 5: Mô tả chi tiết */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 5: Mô tả chi tiết vấn đề
            </h3>
            <Form.Item label="Mô tả chi tiết lỗi" required>
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết hiện tượng lỗi, nguyên nhân có thể và các bước đã thực hiện..."
                value={formData.description}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
              />
            </Form.Item>
          </div>

          {/* Bước 6: Xử lý và kết quả */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 6: Xử lý và kết quả kiểm tra
            </h3>

            <Alert
              message={`Xử lý lỗi ${formData.errorCategory === 'hardware' ? 'phần cứng' : 'phần mềm'}`}
              description={
                formData.errorCategory === 'hardware' 
                  ? "Đối với lỗi phần cứng, bạn có thể sửa chữa tại chỗ hoặc yêu cầu thay thế linh kiện." 
                  : "Đối với lỗi phần mềm, thường có thể khắc phục bằng cách cài đặt lại, cập nhật driver hoặc xử lý virus."
              }
              type="info"
              showIcon
              className="mb-4"
            />
            
            <Form.Item 
              label="Kết quả kiểm tra thực tế" 
              required
            >
              <Radio.Group
                value={formData.repairMethod}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, repairMethod: e.target.value }));
                }}
                disabled={!formData.errorCategory}
              >
                <div className="space-y-3">
                  {formData.errorCategory === "software" && (
                    <Radio value="software_fixed" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
                        <div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
                      </div>
                    </Radio>
                  )}
                  
                  {formData.errorCategory === "hardware" && (
                    <>
                      <Radio value="hardware_fixed" className="flex items-start">
                        <div className="ml-2">
                          <div className="font-medium">Lỗi phần cứng - Đã sửa được</div>
                          <div className="text-sm text-gray-500">Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp xúc...</div>
                        </div>
                      </Radio>
                      <Radio value="need_replacement" className="flex items-start">
                        <div className="ml-2">
                          <div className="font-medium">Cần thay thế linh kiện</div>
                          <div className="text-sm text-gray-500">Linh kiện hỏng không thể sửa chữa, cần thay thế mới</div>
                        </div>
                      </Radio>
                    </>
                  )}
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Mô tả chi tiết quá trình xử lý" required>
              <TextArea
                rows={4}
                placeholder="Mô tả các bước đã thực hiện, nguyên nhân lỗi, cách khắc phục, kết quả sau xử lý..."
                value={formData.repairNotes}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, repairNotes: e.target.value }))
                }
                disabled={!formData.repairMethod}
              />
            </Form.Item>

            {/* Hiển thị phần chọn linh kiện thay thế nếu cần */}
            {formData.errorCategory === "hardware" && formData.repairMethod === 'need_replacement' && (
              <div className="mt-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
                <h4 className="text-md font-semibold text-orange-800 mb-3">Linh kiện cần thay thế</h4>
                {selectedComponentIds.length === 0 ? (
                  <Alert
                    message="⚠️ Bắt buộc: Chọn linh kiện cần thay thế"
                    description="Bạn đã chọn 'Cần thay thế linh kiện'. Vui lòng chọn linh kiện cụ thể ở bước 4."
                    type="error"
                    showIcon
                  />
                ) : (
                  <div className="space-y-4">
                    <Alert
                      message={`Đã chọn ${selectedComponentIds.length} linh kiện để thay thế`}
                      description="Bạn có thể chọn linh kiện thay thế từ kho ngay bây giờ (nếu có sẵn)"
                      type="info"
                      showIcon
                      className="mb-4"
                    />
                    
                    {/* Danh sách linh kiện cần thay thế và chọn linh kiện thay thế */}
                    {selectedComponentIds.map(oldComponentId => {
                      const oldComponent = filteredComponents.find(c => c.id === oldComponentId);
                      if (!oldComponent) return null;
                      
                      const availableStock = availableReplacements[oldComponent.componentType] || [];
                      const hasStock = availableStock.length > 0;
                      const selectedReplacementId = replacementMapping[oldComponentId];
                      
                      return (
                        <div key={oldComponentId} className="p-3 bg-white rounded border border-orange-300">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">{oldComponent.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({oldComponent.componentType})</span>
                            </div>
                            {hasStock && (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Có {availableStock.length} linh kiện trong kho
                              </span>
                            )}
                          </div>
                          
                          {hasStock ? (
                            <Form.Item
                              label="Chọn linh kiện thay thế từ kho"
                              className="mb-0"
                            >
                              <Select
                                placeholder="Chọn linh kiện thay thế (tùy chọn)"
                                value={selectedReplacementId}
                                onChange={(value) => {
                                  setReplacementMapping(prev => ({
                                    ...prev,
                                    [oldComponentId]: value
                                  }));
                                }}
                                allowClear
                                showSearch
                                filterOption={(input, option) => {
                                  const label = typeof option?.label === 'string' 
                                    ? option.label 
                                    : String(option?.children || '');
                                  return label.toLowerCase().includes(input.toLowerCase());
                                }}
                              >
                                {availableStock.map(stockComp => (
                                  <Option key={stockComp.id} value={stockComp.id}>
                                    {stockComp.name} {stockComp.componentSpecs && `- ${stockComp.componentSpecs}`}
                                    {stockComp.serialNumber && ` (SN: ${stockComp.serialNumber})`}
                                  </Option>
                                ))}
                              </Select>
                              <div className="text-xs text-gray-500 mt-1">
                                Nếu không chọn, linh kiện sẽ được đánh dấu cần thay thế và xử lý sau
                              </div>
                            </Form.Item>
                          ) : (
                            <div className="text-sm text-gray-600">
                              ⚠️ Không có linh kiện cùng loại trong kho. Linh kiện sẽ được đánh dấu cần thay thế.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Cảnh báo khi chưa chọn linh kiện cho lỗi phần cứng */}
            {formData.errorCategory === "hardware" && 
             formData.errorType && 
             selectedComponentIds.length === 0 && 
             formData.assetId && (
              <Alert
                message="⚠️ Chưa chọn linh kiện"
                description="Vui lòng chọn ít nhất 1 linh kiện bị lỗi ở bước 4."
                type="warning"
                showIcon
                className="mt-4"
              />
            )}

            {/* Thông báo trạng thái sẽ được cập nhật */}
            {formData.repairMethod && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>💡 Trạng thái sẽ được cập nhật:</strong>
                  <div className="mt-1">
                    {formData.repairMethod === 'software_fixed' || formData.repairMethod === 'hardware_fixed' ? (
                      <div>
                        <span className="text-green-600 font-medium">→ Đã hoàn thành</span>
                        <div className="text-xs text-gray-600 mt-1">
                          Lỗi {formData.errorCategory === 'software' ? 'phần mềm' : 'phần cứng'} đã được khắc phục hoàn toàn
                        </div>
                      </div>
                    ) : formData.repairMethod === 'need_replacement' ? (
                      <div>
                        <span className="text-orange-600 font-medium">→ Chờ thay thế</span>
                        <div className="text-xs text-gray-600 mt-1">
                          Linh kiện đã được chọn để thay thế
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bước 7: Đính kèm hình ảnh */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-900">
              Bước 7: Đính kèm hình ảnh (tùy chọn)
            </h3>
            <Form.Item label="Hình ảnh minh họa">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  aria-label="Chọn file hình ảnh hoặc video"
                />
                
                {isMobile && (
                  <Button
                    type="dashed"
                    icon={<CameraOutlined />}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.capture = 'environment';
                      input.onchange = () => {
                        if (input.files) {
                          const files = Array.from(input.files);
                          setFormData(prev => ({
                            ...prev,
                            mediaFiles: [...prev.mediaFiles, ...files],
                          }));
                        }
                      };
                      input.click();
                    }}
                    className="w-full"
                  >
                    Chụp ảnh bằng camera
                  </Button>
                )}

                {formData.mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.mediaFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={mediaPreviews[index]}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={96}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>
          </div>

          {/* Summary */}
          {formData.building && 
           formData.roomId && 
           formData.assetId && 
           formData.description && 
           formData.repairMethod &&
           formData.repairNotes && (
            <div className="mb-6">
              <Alert
                message="Xem lại thông tin trước khi ghi nhận"
                description={
                  <div className="mt-2">
                    <p><strong>Vị trí:</strong> {formData.building} - {formData.floor} - {
                      filteredRooms.find(r => r.id === formData.roomId)?.name || 
                      filteredRooms.find(r => r.id === formData.roomId)?.roomNumber
                    }</p>
                    <p><strong>Thiết bị:</strong> {
                      (() => {
                        const computer = filteredComputers.find(c => c.id === selectedComputerId);
                        return computer ? `Máy ${computer.machineLabel} - ${computer.asset?.name}` : "N/A";
                      })()
                    }</p>
                    <p><strong>Phân loại:</strong> {formData.errorCategory === 'hardware' ? 'Lỗi phần cứng' : 'Lỗi phần mềm'}</p>
                    {formData.errorCategory === "hardware" && formData.errorType && (
                      <p><strong>Loại lỗi:</strong> {getErrorTypeByKey(formData.errorType as ErrorType)?.name}</p>
                    )}
                    <p><strong>Kết quả xử lý:</strong> {
                      formData.repairMethod === 'software_fixed' ? 'Lỗi phần mềm - Đã sửa được' :
                      formData.repairMethod === 'hardware_fixed' ? 'Lỗi phần cứng - Đã sửa được' :
                      formData.repairMethod === 'need_replacement' ? 'Cần thay thế linh kiện' :
                      formData.repairMethod
                    }</p>
                  </div>
                }
                type="success"
                showIcon
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 sm:space-x-0">
            <Button onClick={handleCancel} className="w-full sm:w-auto">
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={
                !formData.building || 
                !formData.roomId || 
                !formData.assetId || 
                !formData.errorCategory ||
                (formData.errorCategory === "hardware" && !formData.errorType) ||
                !formData.description || 
                !formData.repairMethod ||
                !formData.repairNotes ||
                (formData.repairMethod === 'need_replacement' && selectedComponentIds.length === 0)
              }
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Đang ghi nhận..." : "Ghi nhận và xử lý"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Ghi nhận xử lý lỗi thành công!"
        message="Thông tin xử lý lỗi đã được ghi nhận vào hệ thống. Yêu cầu sẽ được cập nhật trạng thái tương ứng và thông báo đến người báo lỗi."
      />
    </div>
  );
}
