import { Search, Download } from "lucide-react";
import { Row, Col, Input, Button } from "antd";

interface InspectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onExportExcel: () => void;
}

export default function InspectionFilters({
  searchTerm,
  onSearchChange,
  selectedCount,
  onExportExcel,
}: InspectionFiltersProps) {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-4 sm:mb-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={18} lg={18}>
          <Input
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            placeholder="Số biên bản, tờ trình,..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
            size="middle"
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={6}>
          <Button
            type="primary"
            icon={<Download className="h-4 w-4" />}
            onClick={onExportExcel}
            disabled={selectedCount === 0}
            size="middle"
            className={`w-full ${
              selectedCount > 0
                ? "bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                : ""
            }`}
            style={{
              backgroundColor: selectedCount > 0 ? "#16a34a" : undefined,
              borderColor: selectedCount > 0 ? "#16a34a" : undefined,
            }}>
            <span className="hidden sm:inline">
              Xuất Excel {selectedCount > 0 && `(${selectedCount})`}
            </span>
            <span className="sm:hidden">
              Xuất {selectedCount > 0 && `(${selectedCount})`}
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  );
}
