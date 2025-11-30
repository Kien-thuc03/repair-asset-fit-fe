import React from "react";
import { Breadcrumb } from "antd";
import { MapPin } from "lucide-react";

interface AssignmentHeaderProps {
  selectedItemsCount: number;
  totalItems: number;
  onExportExcel: () => void;
  activeTab?: "areas" | "technicians";
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  selectedItemsCount: _selectedItemsCount,
  totalItems: _totalItems,
  onExportExcel: _onExportExcel,
  activeTab: _activeTab = "areas",
}) => {
  return (
    <>
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Phân công khu vực</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header*/}

      <div className="bg-white shadow rounded-lg p-6 mt-2 mb-4">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Phân công khu vực
            </h1>
            <p className="text-gray-600">
              Quản lý và phân công khu vực cho kỹ thuật viên
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentHeader;
