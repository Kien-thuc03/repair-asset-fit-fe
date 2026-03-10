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
  onBuildingChange?: (value: string | undefined) => void;
  onFloorChange?: (value: string | undefined) => void;
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
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-4 sm:mb-6">
      <Row gutter={[16, 16]}>
        {/* Search Input */}
        <Col xs={24} sm={12} md={8} lg={8}>
          <Input
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            placeholder="Tìm theo phòng, tòa nhà, tầng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            size="middle"
          />
        </Col>

        {/* Building Filter */}
        <Col xs={12} sm={6} md={5} lg={5}>
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

        {/* Floor Filter */}
        <Col xs={12} sm={6} md={5} lg={5}>
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

        {/* Export Button */}
        <Col xs={24} sm={24} md={6} lg={6}>
          <Button
            onClick={onExportExcel}
            icon={<Download className="w-3 h-3" />}
            size="middle"
            className="w-full"
            type="primary"
            disabled={selectedItemsCount === 0}
            style={{
              backgroundColor: selectedItemsCount > 0 ? "#16a34a" : undefined,
              borderColor: selectedItemsCount > 0 ? "#16a34a" : undefined,
            }}>
            <span className="hidden sm:inline">
              Xuất Excel {selectedItemsCount > 0 && `(${selectedItemsCount})`}
            </span>
            <span className="sm:hidden">
              Xuất {selectedItemsCount > 0 && `(${selectedItemsCount})`}
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilters;
