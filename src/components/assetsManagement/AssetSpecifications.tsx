"use client";
import { Cpu, HardDrive, Monitor, Info } from "lucide-react";
import { Asset } from "@/types";

interface TechnicianDeviceSpecificationsProps {
  asset: Asset;
}

export default function TechnicianDeviceSpecifications({
  asset,
}: TechnicianDeviceSpecificationsProps) {
  // Parse specifications from model/description
  const parseSpecs = (model: string) => {
    const specs: { [key: string]: string } = {};
    
    // Common patterns for computer specs
    if (model.includes("Intel") || model.includes("AMD")) {
      const cpuMatch = model.match(/(Intel Core [^,]+|AMD [^,]+)/);
      if (cpuMatch) specs["CPU"] = cpuMatch[0];
    }
    
    const ramMatch = model.match(/(\d+GB RAM)/);
    if (ramMatch) specs["RAM"] = ramMatch[0];
    
    const storageMatch = model.match(/(\d+GB|\d+TB) (SSD|HDD)/);
    if (storageMatch) specs["Ổ cứng"] = storageMatch[0];
    
    const osMatch = model.match(/(Windows \d+[^,]*)/);
    if (osMatch) specs["Hệ điều hành"] = osMatch[0];
    
    // For printers
    if (model.includes("Laser") || model.includes("Inkjet")) {
      specs["Loại máy in"] = model.includes("Laser") ? "Laser" : "Inkjet";
    }
    
    if (model.includes("A4") || model.includes("A3")) {
      specs["Khổ giấy"] = model.includes("A3") ? "A3" : "A4";
    }
    
    const speedMatch = model.match(/(\d+) trang\/phút/);
    if (speedMatch) specs["Tốc độ in"] = speedMatch[0];
    
    return specs;
  };

  const specifications = parseSpecs(asset.model);
  const hasSpecs = Object.keys(specifications).length > 0;

  return (
    <div className="lg:col-span-2">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <span>Linh kiện trong máy</span>
      </h4>
      
      {hasSpecs ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => {
              const getIcon = (key: string) => {
                if (key === "CPU") return <Cpu className="w-4 h-4 text-blue-500" />;
                if (key === "RAM") return <Monitor className="w-4 h-4 text-green-500" />;
                if (key === "Ổ cứng") return <HardDrive className="w-4 h-4 text-orange-500" />;
                return <Info className="w-4 h-4 text-gray-500" />;
              };
              
              return (
                <div key={key} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center space-x-2">
                    {getIcon(key)}
                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                  </div>
                  <span className="text-sm text-gray-900 font-medium max-w-32 text-right" title={value}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Thông số kỹ thuật chi tiết</p>
            <p className="text-xs mt-1">{asset.model}</p>
          </div>
        </div>
      )}
    </div>
  );
}