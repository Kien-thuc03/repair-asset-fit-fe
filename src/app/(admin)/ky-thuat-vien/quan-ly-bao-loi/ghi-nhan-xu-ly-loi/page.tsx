"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ReportForm as ReportFormType,
  SimpleAsset as Asset,
  Component,
  Software,
  RepairStatus,
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
import { useRepairProcessing } from "@/hooks";
import { SuccessModal } from "@/components/modal";
import { TechnicianReportSteps } from "@/components/technician/TechnicianReportHelpers";
import { Breadcrumb, Card, Form, Button, Input, Select, Radio, Image, Alert } from "antd";
import { DeleteOutlined, CameraOutlined, ScanOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Interface cho form ghi nhận lỗi kỹ thuật viên
interface TechnicianReportFormType extends ReportFormType {
  building: string;
  floor: string;
  errorCategory: "hardware" | "software";
  repairMethod: string;
  repairNotes: string;
  status: RepairStatus;
}

export default function GhiNhanXuLyLoiPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<TechnicianReportFormType>({
    building: "",
    floor: "",
    assetId: "",
    componentId: "",
    roomId: "",
    errorTypeId: "",
    errorCategory: "software",
    description: "",
    repairMethod: "",
    repairNotes: "",
    mediaFiles: [],
    status: RepairStatus.ĐANG_XỬ_LÝ,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filteredSoftware, setFilteredSoftware] = useState<Software[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Danh sách tòa nhà duy nhất từ mockRooms
  const buildings = [...new Set(mockRooms.map(room => room.building))];



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
    setFormData(prev => ({ ...prev, building, floor: "", roomId: "", assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    
    // Filter floors by building
    const floorsInBuilding = [...new Set(mockRooms
      .filter(room => room.building === building && room.floor)
      .map(room => room.floor!))] as string[];
    setFilteredFloors(floorsInBuilding);
    setFilteredRooms([]);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle floor change
  const handleFloorChange = (floor: string) => {
    setFormData(prev => ({ ...prev, floor, roomId: "", assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    
    // Filter rooms by building and floor
    const roomsOnFloor = mockRooms.filter(room => 
      room.building === formData.building && room.floor === floor
    );
    setFilteredRooms(roomsOnFloor);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle room change
  const handleRoomChange = (roomId: string) => {
    setFormData(prev => ({ ...prev, roomId, assetId: "", componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    
    // Filter assets by room
    const roomAssets = mockAssets.filter(asset => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
    setFilteredComponents([]);
    setFilteredSoftware([]);
  };

  // Handle asset change
  const handleAssetChange = (assetId: string) => {
    setFormData(prev => ({ ...prev, assetId, componentId: "" }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    
    setFilteredComponents(
      mockComponents.filter(comp => comp.computerAssetId === assetId)
    );
    setFilteredSoftware(getSoftwareByAssetId(assetId));
  };

  // Handle error category change
  const handleErrorCategoryChange = (category: "hardware" | "software") => {
    setFormData(prev => ({ 
      ...prev, 
      errorCategory: category, 
      errorTypeId: "", 
      componentId: "",
      repairMethod: "", // Reset repairMethod khi thay đổi category
      repairNotes: "",  // Reset repairNotes
      status: RepairStatus.ĐANG_XỬ_LÝ // Reset status về mặc định
    }));
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
  };

  // Handle QR scan
  const simulateQRScan = () => {
    const randomAsset = mockAssets[Math.floor(Math.random() * mockAssets.length)];
    const room = mockRooms.find(room => room.id === randomAsset.roomId);
    
    if (room && room.building && room.floor) {
      // Auto-select building, floor, room, and asset
      handleBuildingChange(room.building);
      
      setTimeout(() => {
        handleFloorChange(room.floor!);
        
        setTimeout(() => {
          handleRoomChange(room.id);
          
          setTimeout(() => {
            handleAssetChange(randomAsset.id);
            
            const computer = mockComputers.find(comp => comp.assetId === randomAsset.id);
            const machineLabel = computer?.machineLabel || "N/A";
            
            alert(
              `Đã quét thành công thiết bị!\n` +
              `Mã QR: ${randomAsset.assetCode}\n` +
              `Tên thiết bị: ${randomAsset.name}\n` +
              `Máy số: ${machineLabel}\n` +
              `Tòa: ${room.building}\n` +
              `Tầng: ${room.floor}\n` +
              `Phòng: ${room.roomNumber}\n\n` +
              `Tiếp theo: Chọn loại lỗi và phương pháp xử lý`
            );
          }, 100);
        }, 100);
      }, 100);
    }
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

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
      errorCategory: "software",
      description: "",
      repairMethod: "",
      repairNotes: "",
      mediaFiles: [],
      status: RepairStatus.ĐANG_XỬ_LÝ,
    });
    setSelectedComponentIds([]);
    setSelectedSoftwareIds([]);
    setFilteredFloors([]);
    setFilteredRooms([]);
    setFilteredAssets([]);
    setFilteredComponents([]);
    setFilteredSoftware([]);
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
      return mockErrorTypes.filter(error => error.name.includes("phần mềm") || error.id === "ET002");
    }
    return mockErrorTypes.filter(error => !error.name.includes("phần mềm") && error.id !== "ET002");
  };

  return (
    <div className="space-y-6">
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
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Ghi nhận và xử lý lỗi thiết bị
        </h1>
        <p className="text-gray-600">
          Ghi nhận lỗi thiết bị và thực hiện xử lý trực tiếp tại hiện trường
        </p>
      </div>

      {/* Progress Steps */}
      <TechnicianReportSteps currentStep={
        !formData.building ? 0 :
        !formData.roomId ? 1 :
        !formData.assetId ? 2 :
        !formData.description ? 4 :
        !formData.repairMethod ? 5 :
        !formData.repairNotes ? 6 : 7
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 1: Chọn vị trí thiết bị
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Chọn tòa nhà" required>
                <Select
                  placeholder="Chọn tòa nhà"
                  value={formData.building}
                  onChange={handleBuildingChange}
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
                  placeholder="Chọn tầng"
                  value={formData.floor}
                  onChange={handleFloorChange}
                  disabled={!formData.building}
                >
                  {filteredFloors.map(floor => (
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
                  disabled={!formData.floor}
                >
                  {filteredRooms.map(room => (
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
                placeholder="Chọn thiết bị cần xử lý"
                value={formData.assetId}
                onChange={handleAssetChange}
                disabled={!formData.roomId}
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                }
              >
                {filteredAssets.map(asset => {
                  const computer = mockComputers.find(comp => comp.assetId === asset.id);
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

          {/* Bước 3: Phân loại lỗi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 3: Phân loại và chọn loại lỗi
            </h3>
            
            {formData.assetId && (
              <Alert
                message="Chọn phân loại lỗi"
                description="Lỗi phần cứng: linh kiện hỏng, kết nối vật lý. Lỗi phần mềm: ứng dụng, hệ điều hành, virus."
                type="info"
                showIcon
                className="mb-4"
              />
            )}
            
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
                  value={formData.errorTypeId}
                  onChange={(errorTypeId) => 
                    setFormData(prev => ({ ...prev, errorTypeId }))
                  }
                  disabled={!formData.errorCategory}
                >
                  {getFilteredErrorTypes().map(errorType => (
                    <Option key={errorType.id} value={errorType.id}>
                      {errorType.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>

          {/* Bước 4: Chọn linh kiện/phần mềm cụ thể */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              Bước 4: Chọn {formData.errorCategory === "hardware" ? "linh kiện" : "phần mềm"} bị lỗi (tùy chọn)
            </h3>
            
            {formData.errorCategory === "hardware" && (
              <Form.Item label="Linh kiện cụ thể">
                <Select
                  mode="multiple"
                  placeholder="Chọn linh kiện bị lỗi"
                  value={selectedComponentIds}
                  onChange={setSelectedComponentIds}
                  disabled={!formData.assetId || filteredComponents.length === 0}
                >
                  {filteredComponents.map(component => (
                    <Option key={component.id} value={component.id}>
                      {component.name} ({component.componentType})
                    </Option>
                  ))}
                </Select>
                {!formData.assetId && (
                  <div className="text-sm text-gray-500 mt-1">
                    Vui lòng chọn thiết bị trước để hiển thị danh sách linh kiện
                  </div>
                )}
              </Form.Item>
            )}

            {formData.errorCategory === "software" && (
              <Form.Item label="Phần mềm cụ thể">
                <Select
                  mode="multiple"
                  placeholder="Chọn phần mềm bị lỗi"
                  value={selectedSoftwareIds}
                  onChange={setSelectedSoftwareIds}
                  disabled={!formData.assetId || filteredSoftware.length === 0}
                >
                  {filteredSoftware.map(software => (
                    <Option key={software.id} value={software.id}>
                      {software.name} {software.version}
                    </Option>
                  ))}
                </Select>
                {!formData.assetId && (
                  <div className="text-sm text-gray-500 mt-1">
                    Vui lòng chọn thiết bị trước để hiển thị danh sách phần mềm
                  </div>
                )}
              </Form.Item>
            )}
          </div>

          {/* Bước 5: Mô tả chi tiết */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
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
                  const method = e.target.value;
                  setFormData(prev => ({ ...prev, repairMethod: method }));
                  
                  // Tự động cập nhật trạng thái dựa trên kết quả
                  if (method === 'software_fixed' || method === 'hardware_fixed') {
                    setFormData(prev => ({ ...prev, status: RepairStatus.ĐÃ_HOÀN_THÀNH }));
                  } else if (method === 'need_replacement') {
                    setFormData(prev => ({ ...prev, status: RepairStatus.CHỜ_THAY_THẾ }));
                  }
                }}
                disabled={!formData.errorCategory}
              >
                <div className="space-y-3">
                  {/* Hiển thị option phần mềm chỉ khi errorCategory là software */}
                  {formData.errorCategory === "software" && (
                    <Radio value="software_fixed" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
                        <div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
                      </div>
                    </Radio>
                  )}
                  
                  {/* Hiển thị options phần cứng chỉ khi errorCategory là hardware */}
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
            {formData.errorCategory === "hardware" && formData.repairMethod === 'need_replacement' && formData.assetId && (
              <div className="mt-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
                <h4 className="text-md font-semibold text-orange-800 mb-3">Linh kiện cần thay thế</h4>
                <div className="space-y-3">
                  {selectedComponentIds.length === 0 ? (
                    <Alert
                      message="⚠️ Bắt buộc: Chọn linh kiện cần thay thế"
                      description="Bạn đã chọn 'Cần thay thế linh kiện'. Vui lòng quay lại bước 4 để chọn linh kiện cụ thể, hoặc chọn từ danh sách dưới đây. Không thể hoàn thành yêu cầu nếu chưa chọn linh kiện."
                      type="error"
                      showIcon
                    />
                  ) : (
                    <Alert
                      message={`Đã chọn ${selectedComponentIds.length} linh kiện để thay thế`}
                      description={
                        <div className="mt-2">
                          <div className="text-sm">Linh kiện được chọn:</div>
                          <ul className="mt-1 list-disc list-inside text-sm">
                            {selectedComponentIds.map(id => {
                              const component = filteredComponents.find(c => c.id === id);
                              return component ? (
                                <li key={id}>{component.name} ({component.componentType})</li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      }
                      type="info"
                      showIcon
                    />
                  )}
                  
                  <Form.Item label="Bổ sung linh kiện khác (nếu cần)">
                    <Select
                      mode="multiple"
                      placeholder="Chọn thêm linh kiện cần thay thế"
                      value={selectedComponentIds}
                      onChange={setSelectedComponentIds}
                      disabled={filteredComponents.length === 0}
                    >
                      {filteredComponents.map(component => (
                        <Option key={component.id} value={component.id}>
                          {component.name} ({component.componentType})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}

            {/* Thông báo trạng thái sẽ được cập nhật */}
            {formData.repairMethod && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>💡 Trạng thái sẽ được cập nhật:</strong>
                  <div className="mt-1">
                    {formData.repairMethod === 'software_fixed' ? (
                      <div>
                        <span className="text-green-600 font-medium">→ Đã hoàn thành</span>
                        <div className="text-xs text-gray-600 mt-1">Lỗi phần mềm đã được khắc phục hoàn toàn</div>
                      </div>
                    ) : formData.repairMethod === 'hardware_fixed' ? (
                      <div>
                        <span className="text-green-600 font-medium">→ Đã hoàn thành</span>
                        <div className="text-xs text-gray-600 mt-1">Lỗi phần cứng đã được sửa chữa thành công</div>
                      </div>
                    ) : formData.repairMethod === 'need_replacement' ? (
                      <div>
                        <span className="text-orange-600 font-medium">→ Chờ thay thế linh kiện</span>
                        <div className="text-xs text-gray-600 mt-1">Yêu cầu sẽ chuyển sang quy trình thay thế linh kiện</div>
                      </div>
                    ) : (
                      <span className="text-blue-900 font-medium">→ Đang xử lý</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>



          {/* Bước 7: Đính kèm hình ảnh */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
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
                      // In real app, this would open camera
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
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
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
           formData.repairNotes &&
           (formData.errorCategory !== "hardware" || formData.errorTypeId) && (
            <div className="mb-6">
              <Alert
                message="Xem lại thông tin trước khi ghi nhận"
                description={
                  <div className="mt-2">
                    <p><strong>Vị trí:</strong> {formData.building} - {formData.floor} - {filteredRooms.find(r => r.id === formData.roomId)?.roomNumber}</p>
                    <p><strong>Thiết bị:</strong> {filteredAssets.find(a => a.id === formData.assetId)?.name}</p>
                    <p><strong>Phân loại:</strong> {formData.errorCategory === 'hardware' ? 'Lỗi phần cứng' : 'Lỗi phần mềm'}</p>
                    {formData.errorCategory === "hardware" && formData.errorTypeId && (
                      <p><strong>Loại lỗi:</strong> {mockErrorTypes.find(e => e.id === formData.errorTypeId)?.name}</p>
                    )}
                    <p><strong>Kết quả xử lý:</strong> {
                      formData.repairMethod === 'software_fixed' ? 'Lỗi phần mềm - Đã sửa được' :
                      formData.repairMethod === 'hardware_fixed' ? 'Lỗi phần cứng - Đã sửa được' :
                      formData.repairMethod === 'need_replacement' ? 'Cần thay thế linh kiện' :
                      formData.repairMethod
                    }</p>
                    <p><strong>Trạng thái:</strong> {formData.status}</p>
                  </div>
                }
                type="success"
                showIcon
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button onClick={handleCancel}>
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
                !formData.description || 
                !formData.repairMethod ||
                !formData.repairNotes ||
                (formData.errorCategory === "hardware" && !formData.errorTypeId) ||
                (formData.repairMethod === 'need_replacement' && selectedComponentIds.length === 0)
              }
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
