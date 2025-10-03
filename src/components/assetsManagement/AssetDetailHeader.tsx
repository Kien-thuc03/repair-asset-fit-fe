"use client";
import { Monitor, Wrench } from "lucide-react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { Asset } from "@/types";
import { assetStatusConfig } from "@/lib/mockData";

interface TechnicianDeviceDetailHeaderProps {
  asset: Asset;
  warrantyStatus: {
    label: string;
    color: string;
  };
  onGoBack?: () => void; // Make optional since we're not using it in this version
}

export default function TechnicianDeviceDetailHeader({
  asset,
  warrantyStatus,
}: TechnicianDeviceDetailHeaderProps) {
  const pathname = usePathname();

  // Extract role from pathname to create dynamic links
  const getRoleFromPath = () => {
    if (pathname.includes("/ky-thuat-vien/")) return "/ky-thuat-vien";
    if (pathname.includes("/to-truong-ky-thuat/")) return "/to-truong-ky-thuat";
    return "/ky-thuat-vien"; // default fallback
  };

  const rolePath = getRoleFromPath();
  const getStatusConfig = (status: string) => {
    const config = assetStatusConfig[status as keyof typeof assetStatusConfig];
    if (!config) {
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    }

    const colorMap: { [key: string]: string } = {
      green: "bg-green-100 text-green-800 border-green-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      black: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return {
      label: config.label,
      color:
        colorMap[config.color] || "bg-gray-100 text-gray-800 border-gray-200",
    };
  };

  const statusConfig = getStatusConfig(asset.status);

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: rolePath,
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: `${rolePath}/quan-ly-thiet-bi`,
            title: (
              <div className="flex items-center">
                <span>Quản lý thiết bị</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết • {asset.name}</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className=" rounded-lg p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Monitor className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {asset.name}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base flex items-center">
                  <Wrench className="w-4 h-4 mr-1" />
                  {asset.assetCode} • {asset.category}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            {/* Status badge */}
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
            {/* Warranty status */}
            <div
              className={`text-sm font-medium ${warrantyStatus.color} flex items-center`}>
              Bảo hành: {warrantyStatus.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
