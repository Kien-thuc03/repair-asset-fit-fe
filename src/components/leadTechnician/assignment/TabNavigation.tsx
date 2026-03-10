import React from "react";
import { MapPin, User } from "lucide-react";

type TabType = "areas" | "technicians";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => onTabChange("areas")}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === "areas"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            <MapPin className="inline h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Phân công theo khu vực</span>
            <span className="sm:hidden">Khu vực</span>
          </button>
          <button
            onClick={() => onTabChange("technicians")}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === "technicians"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            <User className="inline h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Quản lý kỹ thuật viên</span>
            <span className="sm:hidden">Kỹ thuật viên</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
