"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Breadcrumb, Card, Select, Button, message, Modal, Empty } from "antd";
import {
  QrcodeOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { getComputersByRoomId, ComputerResponseDto } from "@/lib/api/computers";
import { api } from "@/lib/api";

const { Option } = Select;

interface QRCodeData {
  computerId: string;
  computerLabel: string;
  assetName: string;
  ktCode: string;
  roomName: string;
  qrCodeImage: string;
}

export default function MaQRThietBiPage() {
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponseDto[]>([]);
  const [computers, setComputers] = useState<ComputerResponseDto[]>([]);

  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedComputerId, setSelectedComputerId] = useState<string>("");

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingComputers, setIsLoadingComputers] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const roomsData = await getRoomsApi();
        setRooms(roomsData);

        // Extract unique buildings
        const uniqueBuildings = Array.from(
          new Set(roomsData.map((room) => room.building).filter(Boolean))
        );
        setBuildings(uniqueBuildings);
      } catch (error) {
        message.error("Không thể tải danh sách phòng");
        console.error(error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle building change
  const handleBuildingChange = (building: string) => {
    setSelectedBuilding(building);
    setSelectedFloor("");
    setSelectedRoomId("");
    setSelectedComputerId("");
    setComputers([]);
    setQrCodeData(null);

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
  };

  // Handle floor change
  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedRoomId("");
    setSelectedComputerId("");
    setComputers([]);
    setQrCodeData(null);

    // Filter rooms by building and floor
    const roomsOnFloor = rooms.filter(
      (room) => room.building === selectedBuilding && room.floor === floor
    );
    setFilteredRooms(roomsOnFloor);
  };

  // Handle room change
  const handleRoomChange = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedComputerId("");
    setQrCodeData(null);

    setIsLoadingComputers(true);
    try {
      const computersData = await getComputersByRoomId(roomId);
      setComputers(Array.isArray(computersData) ? computersData : []);
    } catch (error) {
      message.error("Không thể tải danh sách máy tính");
      console.error(error);
      setComputers([]);
    } finally {
      setIsLoadingComputers(false);
    }
  };

  // Generate QR Code
  const handleGenerateQR = async () => {
    if (!selectedComputerId) {
      message.warning("Vui lòng chọn máy tính");
      return;
    }

    setIsGeneratingQR(true);
    try {
      // Get QR code from backend
      const response = await api.get<string>(
        `/computer/${selectedComputerId}/qr-code`
      );

      const qrCodeImage = response.data;

      // Find computer details
      const selectedComputer = computers.find(
        (c) => c.id === selectedComputerId
      );
      const selectedRoom = filteredRooms.find((r) => r.id === selectedRoomId);

      if (!selectedComputer) {
        message.error("Không tìm thấy thông tin máy tính");
        return;
      }

      setQrCodeData({
        computerId: selectedComputer.id,
        computerLabel: selectedComputer.machineLabel,
        assetName: selectedComputer.asset?.name || "N/A",
        ktCode: selectedComputer.asset?.ktCode || "N/A",
        roomName:
          selectedRoom?.name ||
          selectedRoom?.roomCode ||
          selectedRoom?.roomNumber ||
          "N/A",
        qrCodeImage: qrCodeImage,
      });

      setShowQRModal(true);
      message.success("Tạo mã QR thành công!");
    } catch (error) {
      message.error("Không thể tạo mã QR");
      console.error(error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // Download QR Code
  const handleDownloadQR = () => {
    if (!qrCodeData) return;

    const link = document.createElement("a");
    link.href = qrCodeData.qrCodeImage;
    link.download = `QR_May${qrCodeData.computerLabel}_${qrCodeData.ktCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Đã tải xuống mã QR");
  };

  // Print QR Code
  const handlePrintQR = () => {
    if (!qrCodeData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      message.error("Không thể mở cửa sổ in");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In mã QR - ${qrCodeData.computerLabel}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #333;
              padding: 30px;
              border-radius: 8px;
              max-width: 400px;
            }
            .qr-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #1890ff;
            }
            .qr-info {
              font-size: 14px;
              margin-bottom: 20px;
              color: #666;
            }
            .qr-image {
              margin: 20px 0;
            }
            .qr-footer {
              font-size: 12px;
              color: #999;
              margin-top: 20px;
            }
            @media print {
              body {
                background: white;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">MÃ QR THIẾT BỊ</div>
            <div class="qr-info">
              <p><strong>Máy số:</strong> ${qrCodeData.computerLabel}</p>
              <p><strong>Thiết bị:</strong> ${qrCodeData.assetName}</p>
              <p><strong>Mã KT:</strong> ${qrCodeData.ktCode}</p>
              <p><strong>Phòng:</strong> ${qrCodeData.roomName}</p>
            </div>
            <div class="qr-image">
              <img src="${qrCodeData.qrCodeImage}" alt="QR Code" style="width: 250px; height: 250px;" />
            </div>
            <div class="qr-footer">
              Quét mã QR để báo cáo lỗi thiết bị
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for image to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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
              title: <span>Mã QR thiết bị</span>,
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
          Tạo mã QR cho thiết bị
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Tạo mã QR để quét và báo lỗi nhanh chóng trên thiết bị di động
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <QrcodeOutlined className="text-blue-500 text-2xl mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Hướng dẫn sử dụng:
            </h3>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Chọn vị trí (Tòa nhà → Tầng → Phòng)</li>
              <li>Chọn máy tính cần tạo mã QR</li>
              <li>Nhấn nút &quot;Tạo mã QR&quot;</li>
              <li>In hoặc tải xuống mã QR</li>
              <li>Dán mã QR lên thiết bị tương ứng</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Selection Form */}
      <Card title="Chọn thiết bị" loading={isLoadingRooms}>
        <div className="space-y-4">
          {/* Building Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn tòa nhà <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn tòa nhà"
              value={selectedBuilding || undefined}
              onChange={handleBuildingChange}
              className="w-full"
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {buildings.map((building) => (
                <Option key={building} value={building}>
                  Tòa {building}
                </Option>
              ))}
            </Select>
          </div>

          {/* Floor Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn tầng <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn tầng"
              value={selectedFloor || undefined}
              onChange={handleFloorChange}
              className="w-full"
              size="large"
              disabled={!selectedBuilding}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {filteredFloors.map((floor) => (
                <Option key={floor} value={floor}>
                  Tầng {floor}
                </Option>
              ))}
            </Select>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn phòng <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn phòng"
              value={selectedRoomId || undefined}
              onChange={handleRoomChange}
              className="w-full"
              size="large"
              disabled={!selectedFloor}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {filteredRooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name || room.roomCode || room.roomNumber}
                </Option>
              ))}
            </Select>
          </div>

          {/* Computer Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn máy tính <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder={
                isLoadingComputers
                  ? "Đang tải danh sách máy..."
                  : "Chọn máy tính"
              }
              value={selectedComputerId || undefined}
              onChange={setSelectedComputerId}
              className="w-full"
              size="large"
              disabled={!selectedRoomId || isLoadingComputers}
              loading={isLoadingComputers}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {computers.map((computer) => (
                <Option key={computer.id} value={computer.id}>
                  Máy {computer.machineLabel} - {computer.asset?.name || "N/A"}
                </Option>
              ))}
            </Select>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              type="primary"
              size="large"
              icon={<QrcodeOutlined />}
              onClick={handleGenerateQR}
              loading={isGeneratingQR}
              disabled={!selectedComputerId}
              className="w-full">
              {isGeneratingQR ? "Đang tạo mã QR..." : "Tạo mã QR"}
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Code Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <QrcodeOutlined className="text-blue-500" />
            <span>Mã QR thiết bị</span>
          </div>
        }
        open={showQRModal}
        onCancel={() => setShowQRModal(false)}
        width={500}
        footer={[
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={handleDownloadQR}>
            Tải xuống
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrintQR}>
            In mã QR
          </Button>,
        ]}
        centered>
        {qrCodeData ? (
          <div className="text-center py-4">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Máy số:</strong> {qrCodeData.computerLabel}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Thiết bị:</strong> {qrCodeData.assetName}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Mã KT:</strong> {qrCodeData.ktCode}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phòng:</strong> {qrCodeData.roomName}
              </p>
            </div>

            <div className="flex justify-center">
              <Image
                src={qrCodeData.qrCodeImage}
                alt="QR Code"
                width={300}
                height={300}
                className="border-2 border-gray-300 rounded-lg p-2"
                unoptimized
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Hướng dẫn:</strong> In mã QR này và dán lên thiết bị.
                Người dùng có thể quét mã QR bằng điện thoại để báo lỗi nhanh
                chóng.
              </p>
            </div>
          </div>
        ) : (
          <Empty description="Không có dữ liệu" />
        )}
      </Modal>
    </div>
  );
}
