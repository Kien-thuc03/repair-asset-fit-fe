import React from "react";
import { Search, Download } from "lucide-react";
import { Row, Col, Input, Select, Button } from "antd";

const { Option } = Select;

type TabType = "areas" | "technicians";

interface SearchFiltersProps {
  activeTab: TabType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  buildingFilter?: string;
  floorFilter?: string;
  onBuildingChange?: (value: string) => void;
  onFloorChange?: (value: string) => void;
  onExportExcel?: () => void;
  selectedItemsCount?: number;
  buildings?: string[];
  floors?: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeTab,
  searchTerm,
  onSearchChange,
  buildingFilter = "",
  floorFilter = "",
  onBuildingChange = () => {},
  onFloorChange = () => {},
  onExportExcel = () => {},
  selectedItemsCount = 0,
  buildings = [],
  floors = [],
}) => {
  // Hide filters completely for technicians tab
  if (activeTab === "technicians") {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <Row gutter={[16, 16]}>
        {/* Search Input - 1 cột */}
        <Col xs={24} sm={8}>
          <Input
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            placeholder="Tìm theo phòng, tòa nhà, tầng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            size="middle"
          />
        </Col>

        {/* Building Filter - 1 cột */}
        <Col xs={24} sm={5}>
          <Select
            placeholder="Chọn tòa"
            value={buildingFilter || undefined}
            onChange={onBuildingChange}
            allowClear
            size="middle"
            className="w-full">
            {buildings.map((building) => (
              <Option key={building} value={building}>
                {building}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Floor Filter - 1 cột */}
        <Col xs={24} sm={5}>
          <Select
            placeholder="Chọn tầng"
            value={floorFilter || undefined}
            onChange={onFloorChange}
            allowClear
            size="middle"
            className="w-full">
            {floors.map((floor) => (
              <Option key={floor} value={floor}>
                {floor}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Export Button - 1 cột */}
        <Col xs={24} sm={6}>
          <Button
            onClick={onExportExcel}
            icon={<Download className="w-3 h-3" />}
            size="middle"
            className="w-full"
            type="default">
            <span className="hidden lg:inline">Xuất Excel</span>
            <span className="lg:hidden">Excel</span>
            {selectedItemsCount > 0 && ` (${selectedItemsCount})`}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilters;
