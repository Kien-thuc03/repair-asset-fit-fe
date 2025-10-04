import { Search, Download, Filter } from "lucide-react";
import { Input, Button, Row, Col, Select } from "antd";

interface ProposalFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onExport: () => void;
}

export default function ProposalFilters({
  searchTerm,
  selectedStatus,
  selectedCount,
  onSearchChange,
  onStatusChange,
  onExport,
}: ProposalFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <Row gutter={16}>
        {/* Search - chiếm 2 cột */}
        <Col xs={24} sm={12} lg={12}>
          <Input
            placeholder="Nhập mã đề xuất, tiêu đề, người tạo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search className="text-gray-400" />}
            allowClear
            size="middle"
          />
        </Col>

        {/* Status Filter - chiếm 1 cột */}
        <Col xs={24} sm={6} lg={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={selectedStatus}
            onChange={onStatusChange}
            allowClear
            size="middle"
            className="w-full"
            suffixIcon={<Filter className="text-gray-400 w-4 h-4" />}
            options={[
              { value: "", label: "Tất cả trạng thái" },
              { value: "CHỜ_TỔ_TRƯỞNG_DUYỆT", label: "Chờ tổ trưởng duyệt" },
              { value: "ĐÃ_DUYỆT", label: "Đã duyệt" },
              { value: "ĐÃ_TỪ_CHỐI", label: "Đã từ chối" },
            ]}
          />
        </Col>

        {/* Export Button - chiếm 1 cột */}
        <Col xs={24} sm={6} lg={6}>
          <Button
            onClick={onExport}
            disabled={selectedCount === 0}
            icon={<Download className="w-3 h-3" />}
            size="middle"
            className="w-full"
            type={selectedCount > 0 ? "default" : "default"}>
            <span className="hidden lg:inline">Xuất Excel</span>
            <span className="lg:hidden">Excel</span>
            {selectedCount > 0 && (
              <span className="ml-1 text-xs">({selectedCount})</span>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
