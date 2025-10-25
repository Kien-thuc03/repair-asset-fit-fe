import React from "react";
import { Breadcrumb } from "antd";

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

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Phân công khu vực
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Quản lý và phân công khu vực cho kỹ thuật viên
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentHeader;
