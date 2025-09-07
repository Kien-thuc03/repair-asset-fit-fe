"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Camera, Send, QrCode } from "lucide-react";
import { ReportForm, SimpleAsset as Asset, Component } from "@/types";

const errorTypes = [
  { id: "ET001", name: "Không khởi động được" },
  { id: "ET002", name: "Màn hình không hiển thị" },
  { id: "ET003", name: "Lỗi phần mềm" },
  { id: "ET004", name: "Mất âm thanh" },
  { id: "ET005", name: "Chạy chậm" },
  { id: "ET006", name: "Lỗi bàn phím/chuột" },
  { id: "ET007", name: "Lỗi kết nối mạng" },
  { id: "ET008", name: "Khác" },
];

const mockAssets: Asset[] = [
  // Phòng A101
  {
    id: "ASSET001",
    name: "PC Dell OptiPlex 3080 - Máy 01",
    assetCode: "PC-A101-01",
    roomId: "ROOM001",
  },
  {
    id: "ASSET002",
    name: "PC Dell OptiPlex 3080 - Máy 02",
    assetCode: "PC-A101-02",
    roomId: "ROOM001",
  },
  {
    id: "ASSET003",
    name: "PC HP ProDesk 400 - Máy 03",
    assetCode: "PC-A101-03",
    roomId: "ROOM001",
  },
  // Phòng A102
  {
    id: "ASSET004",
    name: "PC Lenovo ThinkCentre - Máy 01",
    assetCode: "PC-A102-01",
    roomId: "ROOM002",
  },
  {
    id: "ASSET005",
    name: "PC Dell Inspiron - Máy 02",
    assetCode: "PC-A102-02",
    roomId: "ROOM002",
  },
  {
    id: "ASSET006",
    name: "PC HP Pavilion - Máy 03",
    assetCode: "PC-A102-03",
    roomId: "ROOM002",
  },
  // Phòng A103
  {
    id: "ASSET007",
    name: "PC ASUS VivoBook - Máy 01",
    assetCode: "PC-A103-01",
    roomId: "ROOM003",
  },
  {
    id: "ASSET008",
    name: "PC Acer Aspire - Máy 02",
    assetCode: "PC-A103-02",
    roomId: "ROOM003",
  },
  // Phòng B201
  {
    id: "ASSET009",
    name: "PC Dell Vostro - Máy 01",
    assetCode: "PC-B201-01",
    roomId: "ROOM004",
  },
  {
    id: "ASSET010",
    name: "PC HP EliteDesk - Máy 02",
    assetCode: "PC-B201-02",
    roomId: "ROOM004",
  },
  // Phòng B202
  {
    id: "ASSET011",
    name: "PC Lenovo IdeaCentre - Máy 01",
    assetCode: "PC-B202-01",
    roomId: "ROOM005",
  },
  {
    id: "ASSET012",
    name: "PC MSI Modern - Máy 02",
    assetCode: "PC-B202-02",
    roomId: "ROOM005",
  },
];

const mockRooms = [
  { id: "ROOM001", name: "Phòng máy tính A101" },
  { id: "ROOM002", name: "Phòng máy tính A102" },
  { id: "ROOM003", name: "Phòng máy tính A103" },
  { id: "ROOM004", name: "Phòng máy tính B201" },
  { id: "ROOM005", name: "Phòng máy tính B202" },
];

const mockComponents: Component[] = [
  // ASSET001 - PC Dell OptiPlex 3080 - Máy 01
  {
    id: "COMP001",
    computerAssetId: "ASSET001",
    componentType: "CPU",
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP002",
    computerAssetId: "ASSET001",
    componentType: "RAM",
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz",
    serialNumber: "RAM001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP003",
    computerAssetId: "ASSET001",
    componentType: "STORAGE",
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2",
    serialNumber: "SSD001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP004",
    computerAssetId: "ASSET001",
    componentType: "MOTHERBOARD",
    name: "Dell OptiPlex 3080 Motherboard",
    componentSpecs: "Intel B460 chipset",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP005",
    computerAssetId: "ASSET001",
    componentType: "PSU",
    name: "Dell 200W PSU",
    componentSpecs: "200W 80+ Bronze",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP006",
    computerAssetId: "ASSET001",
    componentType: "MONITOR",
    name: "Dell P2214H",
    componentSpecs: "22 inch 1920x1080 LED",
    serialNumber: "MON001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP007",
    computerAssetId: "ASSET001",
    componentType: "KEYBOARD",
    name: "Dell KB216",
    componentSpecs: "USB Wired Keyboard",
    serialNumber: "KB001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP008",
    computerAssetId: "ASSET001",
    componentType: "MOUSE",
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse",
    serialNumber: "MS001",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP009",
    computerAssetId: "ASSET001",
    componentType: "CASE",
    name: "Dell OptiPlex 3080 Case",
    componentSpecs: "Mini Tower",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },

  // ASSET002 - PC Dell OptiPlex 3080 - Máy 02
  {
    id: "COMP011",
    computerAssetId: "ASSET002",
    componentType: "CPU",
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU002",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP012",
    computerAssetId: "ASSET002",
    componentType: "RAM",
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz",
    serialNumber: "RAM002",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP013",
    computerAssetId: "ASSET002",
    componentType: "STORAGE",
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2",
    serialNumber: "SSD002",
    status: "FAULTY",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP014",
    computerAssetId: "ASSET002",
    componentType: "MOTHERBOARD",
    name: "Dell OptiPlex 3080 Motherboard",
    componentSpecs: "Intel B460 chipset",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP015",
    computerAssetId: "ASSET002",
    componentType: "MONITOR",
    name: "Dell P2214H",
    componentSpecs: "22 inch 1920x1080 LED",
    serialNumber: "MON002",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP016",
    computerAssetId: "ASSET002",
    componentType: "KEYBOARD",
    name: "Dell KB216",
    componentSpecs: "USB Wired Keyboard",
    serialNumber: "KB002",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "COMP017",
    computerAssetId: "ASSET002",
    componentType: "MOUSE",
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse",
    serialNumber: "MS002",
    status: "INSTALLED",
    installedAt: "2023-01-15T00:00:00Z",
  },

  // ASSET003 - PC HP ProDesk 400 - Máy 03
  {
    id: "COMP021",
    computerAssetId: "ASSET003",
    componentType: "CPU",
    name: "Intel Core i3-12100",
    componentSpecs: "4 cores, 8 threads, 3.3GHz base, 4.3GHz boost",
    serialNumber: "CPU003",
    status: "INSTALLED",
    installedAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "COMP022",
    computerAssetId: "ASSET003",
    componentType: "RAM",
    name: "Crucial DDR4",
    componentSpecs: "8GB 2666MHz",
    serialNumber: "RAM003",
    status: "INSTALLED",
    installedAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "COMP023",
    computerAssetId: "ASSET003",
    componentType: "STORAGE",
    name: "WD Blue SSD",
    componentSpecs: "256GB SATA",
    serialNumber: "SSD003",
    status: "INSTALLED",
    installedAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "COMP024",
    computerAssetId: "ASSET003",
    componentType: "MONITOR",
    name: "HP P22v G4",
    componentSpecs: "21.5 inch 1920x1080 IPS",
    serialNumber: "MON003",
    status: "FAULTY",
    installedAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "COMP025",
    computerAssetId: "ASSET003",
    componentType: "KEYBOARD",
    name: "HP Standard Keyboard",
    componentSpecs: "USB Wired Keyboard",
    serialNumber: "KB003",
    status: "INSTALLED",
    installedAt: "2023-03-20T00:00:00Z",
  },
];

export default function BaoCaoLoiPage() {
  const [formData, setFormData] = useState<ReportForm>({
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
  const [isMobile, setIsMobile] = useState(false);

  // Debug filteredComponents changes
  useEffect(() => {
    console.log("filteredComponents updated:", filteredComponents);
  }, [filteredComponents]);

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

    alert("Báo cáo đã được gửi thành công!");
    setIsSubmitting(false);

    // Reset form
    setFormData({
      assetId: "",
      componentId: "",
      roomId: "",
      errorTypeId: "",
      description: "",
      mediaFiles: [],
    });
    setFilteredAssets([]);
    setFilteredComponents([]);
  };

  const handleRoomChange = (roomId: string) => {
    setFormData((prev) => ({ ...prev, roomId, assetId: "", componentId: "" }));
    // Lọc thiết bị theo phòng đã chọn
    const roomAssets = mockAssets.filter((asset) => asset.roomId === roomId);
    setFilteredAssets(roomAssets);
    setFilteredComponents([]);
  };

  const handleAssetChange = (assetId: string) => {
    setFormData((prev) => ({ ...prev, assetId, componentId: "" }));
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
      const room = mockRooms.find((room) => room.id === asset.roomId);
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
          console.log("Filtered components after QR scan:", components);

          alert(
            `Đã quét thành công!\nMáy: ${asset.name}\nPhòng: ${room.name}\nSố linh kiện: ${components.length}`
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
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Báo cáo lỗi thiết bị
            </h1>
            <p className="text-gray-600">
              Tạo báo cáo lỗi cho thiết bị gặp sự cố
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Button for Mobile */}
      {isMobile && (
        <div className="bg-blue-50 shadow rounded-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-blue-600" />
              Quét mã QR thiết bị
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Quét mã QR trên thiết bị để tự động điền thông tin
            </p>
            <button
              type="button"
              onClick={simulateQRScan}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center">
              <Camera className="w-4 h-4 mr-2" />
              Mở máy ảnh quét QR
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Bước 1: Room Selection - Chọn phòng trước */}
            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700">
                Bước 1: Chọn phòng/khoa <span className="text-red-500">*</span>
              </label>
              <select
                id="roomId"
                required
                value={formData.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Chọn phòng</option>
                {mockRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bước 2: Asset Selection - Chọn thiết bị trong phòng */}
            <div>
              <label
                htmlFor="assetId"
                className="block text-sm font-medium text-gray-700">
                Bước 2: Chọn thiết bị <span className="text-red-500">*</span>
              </label>
              <select
                id="assetId"
                required
                value={formData.assetId}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!formData.roomId}>
                <option value="">
                  {!formData.roomId
                    ? "Vui lòng chọn phòng trước"
                    : "Chọn thiết bị"}
                </option>
                {filteredAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.assetCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Component Selection - Hiển thị tự động sau khi chọn máy */}
            <div className="sm:col-span-2">
              <label
                htmlFor="componentId"
                className="block text-sm font-medium text-gray-700">
                Linh kiện cụ thể gặp lỗi (tùy chọn)
              </label>
              {!formData.assetId ? (
                <p className="mt-1 text-sm text-gray-500 italic">
                  Vui lòng chọn thiết bị để xem danh sách linh kiện
                </p>
              ) : filteredComponents.length === 0 ? (
                <p className="mt-1 text-sm text-gray-500 italic">
                  Không có linh kiện nào được tìm thấy cho thiết bị này
                </p>
              ) : (
                <>
                  <select
                    id="componentId"
                    value={formData.componentId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        componentId: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="">
                      Chọn linh kiện cụ thể (nếu biết rõ)
                    </option>
                    {filteredComponents.map((component) => (
                      <option key={component.id} value={component.id}>
                        {component.componentType} - {component.name}
                        {component.componentSpecs &&
                          ` (${component.componentSpecs})`}
                        {component.status === "FAULTY" && " - ⚠️ Đã báo lỗi"}
                        {component.status === "MAINTENANCE" &&
                          " - 🔧 Đang bảo trì"}
                      </option>
                    ))}
                  </select>

                  {/* Hiển thị danh sách tất cả linh kiện trong máy để tham khảo */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Tất cả linh kiện trong máy này:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {filteredComponents.map((component) => (
                        <div
                          key={component.id}
                          className={`p-2 rounded ${
                            component.status === "FAULTY"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : component.status === "MAINTENANCE"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}>
                          <div className="font-medium truncate">
                            {component.componentType}
                          </div>
                          <div className="text-gray-600 truncate">
                            {component.name}
                          </div>
                          {component.componentSpecs && (
                            <div className="text-gray-500 truncate text-xs">
                              {component.componentSpecs}
                            </div>
                          )}
                          <div className="mt-1">
                            <span
                              className={`px-1 py-0.5 rounded text-xs ${
                                component.status === "INSTALLED"
                                  ? "bg-green-200"
                                  : component.status === "FAULTY"
                                  ? "bg-red-200"
                                  : component.status === "MAINTENANCE"
                                  ? "bg-yellow-200"
                                  : "bg-gray-200"
                              }`}>
                              {component.status === "INSTALLED"
                                ? "Hoạt động"
                                : component.status === "FAULTY"
                                ? "Có lỗi"
                                : component.status === "MAINTENANCE"
                                ? "Bảo trì"
                                : component.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bước 3: Description - Mô tả lỗi chi tiết */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Bước 3: Mô tả chi tiết tình trạng lỗi{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về tình trạng lỗi, triệu chứng, thời điểm xảy ra, các bước đã thực hiện..."
            />
          </div>

          {/* Media Files - Đính kèm hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đính kèm hình ảnh/video minh họa (tùy chọn)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click để upload</span> hoặc
                    kéo thả
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, MP4 (MAX. 10MB mỗi file)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
            </div>
            {formData.mediaFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Đã chọn {formData.mediaFiles.length} file
                </p>
                <div className="mt-2 space-y-1">
                  {formData.mediaFiles.map((file, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-500 flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            mediaFiles: prev.mediaFiles.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 ml-2">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bước 4: Error Type Selection - Chọn loại lỗi */}
          <div>
            <label
              htmlFor="errorTypeId"
              className="block text-sm font-medium text-gray-700">
              Bước 4: Chọn loại lỗi từ danh sách{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="errorTypeId"
              required
              value={formData.errorTypeId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  errorTypeId: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Chọn loại lỗi phổ biến</option>
              {errorTypes.map((errorType) => (
                <option key={errorType.id} value={errorType.id}>
                  {errorType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi báo cáo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
