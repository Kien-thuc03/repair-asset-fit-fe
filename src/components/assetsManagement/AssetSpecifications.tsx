"use client";
import { Cpu, HardDrive, Monitor, Info, MemoryStick, Box, Zap, Keyboard, Mouse, Wifi, CircuitBoard, Fan, Speaker, Camera } from "lucide-react";
import { Asset } from "@/types";

interface AssetSpecificationsProps {
  asset: Asset;
}

export default function AssetSpecifications({
  asset,
}: AssetSpecificationsProps) {
  // Lấy danh sách linh kiện từ API data (đã có trong asset.components)
  const installedComponents = asset.components || [];

  // Function to get appropriate icon for each component type
  const getComponentIcon = (componentType: string) => {
    switch (componentType) {
      case "CPU":
        return <Cpu className="w-4 h-4 text-blue-500" />;
      case "RAM":
        return <MemoryStick className="w-4 h-4 text-green-500" />;
      case "STORAGE":
        return <HardDrive className="w-4 h-4 text-orange-500" />;
      case "GPU":
        return <Box className="w-4 h-4 text-purple-500" />;
      case "MAINBOARD":
        return <CircuitBoard className="w-4 h-4 text-red-500" />;
      case "PSU":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "MONITOR":
        return <Monitor className="w-4 h-4 text-gray-500" />;
      case "KEYBOARD":
        return <Keyboard className="w-4 h-4 text-indigo-500" />;
      case "MOUSE":
        return <Mouse className="w-4 h-4 text-pink-500" />;
      case "NETWORK":
      case "NETWORK_CARD":
        return <Wifi className="w-4 h-4 text-cyan-500" />;
      case "COOLER":
        return <Fan className="w-4 h-4 text-teal-500" />;
      case "SPEAKER":
        return <Speaker className="w-4 h-4 text-amber-500" />;
      case "WEBCAM":
        return <Camera className="w-4 h-4 text-lime-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // Function to get Vietnamese name for component types
  const getComponentTypeName = (componentType: string): string => {
    const typeMap: { [key: string]: string } = {
      "CPU": "Bộ xử lý",
      "RAM": "Bộ nhớ",
      "STORAGE": "Ổ cứng",
      "GPU": "Card đồ họa",
      "MAINBOARD": "Bo mạch chủ",
      "PSU": "Nguồn",
      "MONITOR": "Màn hình",
      "KEYBOARD": "Bàn phím",
      "MOUSE": "Chuột",
      "NETWORK": "Card mạng",
      "NETWORK_CARD": "Card mạng",
      "COOLER": "Tản nhiệt",
      "SPEAKER": "Loa",
      "WEBCAM": "Webcam",
      "CASE": "Vỏ case",
      "OPTICAL_DRIVE": "Ổ đĩa quang",
      "UPS": "UPS",
      "SOUND_CARD": "Card âm thanh",
    };
    return typeMap[componentType] || "Khác";
  };

  return (
    <div className="lg:col-span">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <span>Linh kiện trong máy</span>
        <span className="text-sm text-gray-500 font-normal">
          ({installedComponents.length} linh kiện)
        </span>
      </h4>
      
      {installedComponents.length > 0 ? (
        <div className="space-y-3">
          {installedComponents.map((component) => (
            <div 
              key={component.id} 
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getComponentIcon(component.componentType)}
                    <h5 className="text-sm font-semibold text-gray-900">
                      {component.name}
                    </h5>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getComponentTypeName(component.componentType)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    {component.componentSpecs && (
                      <div className="flex items-center space-x-1">
                        <Info className="w-3 h-3" />
                        <span>Thông số:</span>
                        <span className="font-medium">{component.componentSpecs}</span>
                      </div>
                    )}
                    
                    {component.serialNumber && (
                      <div className="flex items-center space-x-1">
                        <Box className="w-3 h-3" />
                        <span>Serial:</span>
                        <span className="font-medium font-mono">{component.serialNumber}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Monitor className="w-3 h-3" />
                      <span>Trạng thái:</span>
                      <span className={`font-medium ${
                        component.status === 'INSTALLED' ? 'text-green-600' : 
                        component.status === 'FAULTY' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {component.status === 'INSTALLED' ? 'Đang hoạt động' : 
                         component.status === 'FAULTY' ? 'Hỏng' : 'Đã gỡ'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Info className="w-3 h-3" />
                      <span>Ngày lắp:</span>
                      <span className="font-medium">
                        {new Date(component.installedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {component.notes && (
                    <div className="mt-2 text-xs text-gray-500 italic">
                      Ghi chú: {component.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-1">Chưa có thông tin linh kiện</p>
          <p className="text-xs text-gray-400">
            Thiết bị này chưa được cập nhật thông tin linh kiện chi tiết
          </p>
        </div>
      )}
    </div>
  );
}