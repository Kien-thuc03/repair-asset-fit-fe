"use client";
import { Input, Select, Button, Card, Row, Col } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { getAssetStatusOptions } from "@/types/computer";

interface DeviceFiltersProps {
  searchTerm: string;
  statusFilter: string;
  buildingFilter: string;
  floorFilter: string;
  roomFilter?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onBuildingChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onRoomChange?: (value: string) => void;
  onClearAll: () => void;
  buildings: string[];
  floors: string[];
  rooms?: Array<{ id: string; name: string; roomCode: string; roomNumber: string }>;
}

export default function DeviceFilters({
  searchTerm,
  statusFilter,
  buildingFilter,
  floorFilter,
  roomFilter = "",
  onSearchChange,
  onStatusChange,
  onBuildingChange,
  onFloorChange,
  onRoomChange,
  onClearAll,
  buildings,
  floors,
  rooms = [],
}: DeviceFiltersProps) {
  // Get status options from enum
  const statusOptions = getAssetStatusOptions();

  // Count active filters (only count non-empty values)
  const activeFiltersCount = [
    searchTerm,
    statusFilter,
    buildingFilter,
    floorFilter,
    roomFilter,
  ].filter((val) => val && val.trim() !== "").length;

  return (
    <Card className="mb-4">
      <Row gutter={[16, 16]}>
        {/* Search */}
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm kiếm theo tên, mã, model, phòng..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </Col>

        {/* Status Filter */}
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Tất cả trạng thái"
            value={statusFilter || undefined}
            onChange={(value) => onStatusChange(value || "")}
            allowClear
            style={{ width: "100%" }}
            options={statusOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>

        {/* Building Filter */}
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Tất cả tòa nhà"
            value={buildingFilter || undefined}
            onChange={(value) => onBuildingChange(value || "")}
            allowClear
            style={{ width: "100%" }}
          >
            {buildings.map((building) => (
              <Select.Option key={building} value={building}>
                Tòa {building}
              </Select.Option>
            ))}
          </Select>
        </Col>

        {/* Floor Filter */}
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder={!buildingFilter ? "Chọn tòa trước" : "Tất cả tầng"}
            value={floorFilter || undefined}
            onChange={(value) => onFloorChange(value || "")}
            allowClear
            disabled={!buildingFilter}
            style={{ width: "100%" }}
            notFoundContent={
              !buildingFilter
                ? "Vui lòng chọn tòa nhà trước"
                : "Không có dữ liệu"
            }
          >
            {floors.map((floor) => (
              <Select.Option key={floor} value={floor}>
                Tầng {floor}
              </Select.Option>
            ))}
          </Select>
        </Col>

        {/* Room Filter */}
        {onRoomChange && (
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={!floorFilter ? "Chọn tầng trước" : "Tất cả phòng"}
              value={roomFilter || undefined}
              onChange={(value) => onRoomChange(value || "")}
              allowClear
              disabled={!floorFilter}
              style={{ width: "100%" }}
              notFoundContent={
                !floorFilter
                  ? "Vui lòng chọn tầng trước"
                  : "Không có dữ liệu"
              }
            >
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.name || room.roomCode}>
                  {room.name || room.roomCode || `Phòng ${room.roomNumber}`}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}

        {/* Clear All Button */}
        <Col xs={24} sm={12} md={1}>
          <Button
            type="default"
            onClick={onClearAll}
            disabled={activeFiltersCount === 0}
            icon={<SyncOutlined />}
            block
            title="Xóa tất cả bộ lọc"
          />
        </Col>
      </Row>
    </Card>
  );
}