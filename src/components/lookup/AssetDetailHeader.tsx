"use client";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "antd";
import { Asset } from "@/types";
import { assetStatusConfig, categoryIcons } from "@/lib/mockData";

interface AssetDetailHeaderProps {
  asset: Asset;
  warrantyStatus: {
    label: string;
    color: string;
  };
  onGoBack: () => void;
}

export default function AssetDetailHeader({
  asset,
  warrantyStatus,
  onGoBack,
}: AssetDetailHeaderProps) {
  const StatusIcon = assetStatusConfig[asset.status].icon;
  const CategoryIcon = categoryIcons[asset.category] || ArrowLeft;

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/giang-vien/tra-cuu-thiet-bi",
            title: (
              <div className="flex items-center">
                <span>Tra cứu thiết bị</span>
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
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={onGoBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CategoryIcon className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {asset.name}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {asset.assetCode} • {asset.category}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            {/* Status badge */}
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${
                assetStatusConfig[asset.status].color
              }`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {assetStatusConfig[asset.status].label}
            </div>
            {/* Warranty status */}
            <div className={`text-sm font-medium ${warrantyStatus.color}`}>
              Bảo hành: {warrantyStatus.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
