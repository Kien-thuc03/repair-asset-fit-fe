"use client";
import { ArrowLeft, XCircle } from "lucide-react";
import { Breadcrumb } from "antd";

interface AssetNotFoundProps {
  onGoBack: () => void;
}

export default function AssetNotFound({ onGoBack }: AssetNotFoundProps) {
  return (
    <div className="space-y-4">
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
                <span>Chi tiết</span>
              </div>
            ),
          },
        ]}
      />
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Không tìm thấy thiết bị
        </h1>
        <p className="mt-2 text-gray-600">
          Thiết bị với ID này không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={onGoBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
      </div>
    </div>
  );
}
