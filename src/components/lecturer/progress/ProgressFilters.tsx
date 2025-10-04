"use client";

import { Search, Download } from "lucide-react";
import { Input, Select, DatePicker, Button } from "antd";
import { RepairStatus } from "@/types";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProgressFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  selectedCount: number;
  onSearchChange: (term: string) => void;
  onStatusChange: (status: string) => void;
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  onExport: () => void;
}

export default function ProgressFilters({
  searchTerm,
  statusFilter,
  dateRange,
  selectedCount,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onExport,
}: ProgressFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search - chiếm 2 cột */}
        <Input
          className="col-span-1 md:col-span-2"
          placeholder="Tìm kiếm theo mã, tên tài sản, số phòng..."
          prefix={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          size="middle"
        />

        {/* Status Filter */}
        <Select
          placeholder="Chọn trạng thái"
          value={statusFilter}
          onChange={onStatusChange}
          allowClear
          size="middle">
          <Option value="all">Tất cả trạng thái</Option>
          <Option value={RepairStatus.CHỜ_TIẾP_NHẬN}>Chờ tiếp nhận</Option>
          <Option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>Đã tiếp nhận</Option>
          <Option value={RepairStatus.ĐANG_XỬ_LÝ}>Đang xử lý</Option>
          <Option value={RepairStatus.CHỜ_THAY_THẾ}>Chờ thay thế</Option>
          <Option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>Đã hoàn thành</Option>
          <Option value={RepairStatus.ĐÃ_HỦY}>Đã hủy</Option>
        </Select>

        {/* Date Range Filter */}
        <RangePicker
          placeholder={["Từ ngày", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={onDateRangeChange}
          size="middle"
        />

        {/* Export Button */}
        <Button
          type="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={onExport}
          disabled={selectedCount === 0}
          size="middle">
          Xuất Excel ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
