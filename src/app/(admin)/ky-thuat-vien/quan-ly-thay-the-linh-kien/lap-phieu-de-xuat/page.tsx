"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  message,
  Breadcrumb,
  Select,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { Pagination } from "@/components/ui";
import { useAvailableComponents } from "@/hooks";
import {
  createReplacementProposal,
  ComponentFromRepair,
} from "@/lib/api/replacement-proposals";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import { ComponentStatus, ComponentType } from "@/types";

type SortField =
  | "componentName"
  | "assetName"
  | "location"
  | "requestCode"
  | "componentStatus"
  | "repairStatus";
type SortDirection = "asc" | "desc" | "none";

export default function CreateProposalPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedComponentsData, setSelectedComponentsData] = useState<
    ComponentFromRepair[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Filter states
  const [componentTypeFilter, setComponentTypeFilter] = useState<string[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<string>("");
  const [floorFilter, setFloorFilter] = useState<string>("");
  const [roomFilter, setRoomFilter] = useState<string>("");

  // State for rooms data and cascade filtering
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponseDto[]>([]);

  // Sử dụng custom hook để fetch data
  const { components, pagination, loading, error, fetchComponents } =
    useAvailableComponents();

  // Extract unique buildings from rooms
  const buildings = Array.from(
    new Set(rooms.map((room) => room.building).filter(Boolean))
  );

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRoomsApi();
        setRooms(roomsData);
      } catch {
        message.error("Không thể tải danh sách phòng. Vui lòng thử lại.");
      }
    };
    fetchRooms();
  }, []);

  // Fetch data khi component mount hoặc filters thay đổi
  useEffect(() => {
    // Map sortField to backend field names
    const getSortByField = (
      field: SortField | ""
    ): "createdAt" | "componentName" | "assetName" | "requestCode" => {
      switch (field) {
        case "componentName":
          return "componentName";
        case "assetName":
          return "assetName";
        case "requestCode":
          return "requestCode";
        case "componentStatus":
        case "repairStatus":
        case "location":
        default:
          return "createdAt"; // Fallback to createdAt for unsupported fields
      }
    };

    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchText || undefined,
      componentType:
        componentTypeFilter.length > 0 ? componentTypeFilter : undefined,
      building: buildingFilter || undefined,
      floor: floorFilter || undefined,
      roomName: roomFilter || undefined,
      excludeInProposal: true,
      sortBy: getSortByField(sortField),
      sortOrder: (sortDirection === "none"
        ? "DESC"
        : sortDirection.toUpperCase()) as "ASC" | "DESC",
    };

    fetchComponents(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    pageSize,
    searchText,
    componentTypeFilter,
    buildingFilter,
    floorFilter,
    roomFilter,
    sortField,
    sortDirection,
  ]);

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset về trang đầu khi sort
  };

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  // Tạo đề xuất thay thế
  const handleCreateProposal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một linh kiện để tạo đề xuất");
      return;
    }
    setIsModalVisible(true);
  };

  // Submit form tạo đề xuất
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Sử dụng selectedComponentsData thay vì filter từ components hiện tại
      // Điều này đảm bảo lấy được tất cả items đã chọn từ mọi trang
      const selectedComponents = selectedComponentsData;

      // 🔥 MỚI: Thu thập repair request IDs từ các components được chọn
      const repairRequestIds = Array.from(
        new Set(
          selectedComponents
            .map((c) => c.repairRequestId)
            .filter((id): id is string => !!id)
        )
      );

      // Tạo payload theo format API
      // Lưu ý: newItemName và newItemSpecs để trống ở phía kỹ thuật viên
      // Phòng quản trị sẽ cập nhật thông tin này sau
      const proposalData = {
        title: values.title,
        description: values.description,
        items: selectedComponents.map((component) => ({
          oldComponentId: component.componentId,
          newItemName: "",
          newItemSpecs: "", // Để trống, phòng quản trị sẽ cập nhật sau
          quantity: component.quantity || 1, // Đảm bảo có quantity
          reason: component.reason || component.repairDescription || "", // Dùng reason hoặc repairDescription
        })),
        // 🔥 MỚI: Thêm repair request IDs (nếu có)
        ...(repairRequestIds.length > 0 && { repairRequestIds }),
      };

      console.log("📤 Sending proposal data:", proposalData);

      // Gọi API tạo đề xuất
      const result = await createReplacementProposal(proposalData);

      message.success({
        content: `Tạo đề xuất thay thế thành công! Mã: ${result.proposalCode}`,
        duration: 5,
      });

      // Reset và đóng modal
      setIsModalVisible(false);
      form.resetFields();
      setSelectedRowKeys([]);
      setSelectedComponentsData([]);

      // Refresh danh sách
      fetchComponents({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        excludeInProposal: true,
      });
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Tạo đề xuất thất bại"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Đếm số lượng filters đang active
  const activeFiltersCount = [
    componentTypeFilter.length > 0,
    buildingFilter,
    floorFilter,
    roomFilter,
    searchText,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setComponentTypeFilter([]);
    setBuildingFilter("");
    setFloorFilter("");
    setRoomFilter("");
    setSearchText("");
    setFilteredFloors([]);
    setFilteredRooms([]);
    setCurrentPage(1);
  };

  // Handle building change - cascade filter
  const handleBuildingChange = (building: string) => {
    setBuildingFilter(building);
    setFloorFilter("");
    setRoomFilter("");
    setCurrentPage(1);

    if (building) {
      // Filter floors by building
      const floorsInBuilding = Array.from(
        new Set(
          rooms
            .filter((room) => room.building === building)
            .map((room) => room.floor)
            .filter(Boolean)
        )
      );
      setFilteredFloors(floorsInBuilding);
    } else {
      setFilteredFloors([]);
    }
    setFilteredRooms([]);
  };

  // Handle floor change - cascade filter
  const handleFloorChange = (floor: string) => {
    setFloorFilter(floor);
    setRoomFilter("");
    setCurrentPage(1);

    if (floor && buildingFilter) {
      // Filter rooms by building and floor
      const roomsInFloor = rooms.filter(
        (room) => room.building === buildingFilter && room.floor === floor
      );
      setFilteredRooms(roomsInFloor);
    } else {
      setFilteredRooms([]);
    }
  };

  // Handle room change
  const handleRoomChange = (roomName: string) => {
    setRoomFilter(roomName);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRowSelect = (id: string, selected: boolean) => {
    if (selected) {
      // Chỉ thêm nếu chưa tồn tại
      setSelectedRowKeys((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });

      // Lưu trữ thông tin đầy đủ của component được chọn
      const component = components.find((c) => c.componentId === id);
      if (component) {
        setSelectedComponentsData((prev) => {
          // Kiểm tra xem đã tồn tại chưa
          if (prev.find((c) => c.componentId === id)) return prev;
          // Thêm quantity và reason mặc định
          return [
            ...prev,
            {
              ...component,
              quantity: 1, // Mặc định 1
              reason: component.repairDescription || "", // Dùng description từ repair request
            },
          ];
        });
      }
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
      setSelectedComponentsData((prev) =>
        prev.filter((c) => c.componentId !== id)
      );
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      // Merge với các items đã chọn từ trang trước, không thay thế
      const currentPageKeys = components.map((row) => row.componentId);
      setSelectedRowKeys((prev) => {
        const newKeys = [...prev];
        currentPageKeys.forEach((key) => {
          if (!newKeys.includes(key)) {
            newKeys.push(key);
          }
        });
        return newKeys;
      });

      // Lưu trữ thông tin đầy đủ của các components được chọn
      setSelectedComponentsData((prev) => {
        const newData = [...prev];
        components.forEach((component) => {
          if (!newData.find((c) => c.componentId === component.componentId)) {
            newData.push({
              ...component,
              quantity: 1, // Mặc định 1
              reason: component.repairDescription || "", // Dùng description từ repair request
            });
          }
        });
        return newData;
      });
    } else {
      // Chỉ bỏ chọn các items của trang hiện tại, giữ lại items từ trang khác
      const currentPageKeys = components.map((row) => row.componentId);
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !currentPageKeys.includes(key))
      );
      setSelectedComponentsData((prev) =>
        prev.filter((c) => !currentPageKeys.includes(c.componentId))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/ky-thuat-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Quản lý thay thế linh kiện</span>
              </div>
            ),
          },
          {
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat",
            title: (
              <div className="flex items-center">
                <span>Lập phiếu đề xuất</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lập phiếu đề xuất thay thế
          </h1>
          <p className="text-gray-600 mt-1">
            Chọn các linh kiện từ báo cáo lỗi để tạo đề xuất thay thế
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProposal}
          size="large"
          disabled={selectedRowKeys.length === 0}>
          Tạo đề xuất ({selectedRowKeys.length})
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo tên linh kiện, tài sản, mã tài sản..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Tất cả loại linh kiện"
              value={componentTypeFilter}
              onChange={(value) => {
                setComponentTypeFilter(value);
                setCurrentPage(1);
              }}
              style={{ width: "100%" }}
              maxTagCount="responsive">
              {Object.entries(ComponentType).map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tất cả tòa nhà"
              value={buildingFilter || undefined}
              onChange={handleBuildingChange}
              allowClear
              style={{ width: "100%" }}>
              {buildings.map((building) => (
                <Select.Option key={building} value={building}>
                  Tòa {building}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={!buildingFilter ? "Chọn tòa trước" : "Tất cả tầng"}
              value={floorFilter || undefined}
              onChange={handleFloorChange}
              allowClear
              disabled={!buildingFilter}
              style={{ width: "100%" }}
              notFoundContent={
                !buildingFilter
                  ? "Vui lòng chọn tòa nhà trước"
                  : "Không có dữ liệu"
              }>
              {filteredFloors.map((floor) => (
                <Select.Option key={floor} value={floor}>
                  Tầng {floor}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={!floorFilter ? "Chọn tầng trước" : "Tất cả phòng"}
              value={roomFilter || undefined}
              onChange={handleRoomChange}
              allowClear
              disabled={!floorFilter}
              style={{ width: "100%" }}
              notFoundContent={
                !floorFilter ? "Vui lòng chọn tầng trước" : "Không có dữ liệu"
              }>
              {filteredRooms.map((room) => (
                <Select.Option key={room.id} value={room.name || room.roomCode}>
                  {room.name || room.roomCode || `Phòng ${room.roomNumber}`}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={1}>
            <Button
              type="default"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              icon={<SyncOutlined />}
              block></Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">❌ {error}</p>
              <Button
                onClick={() => fetchComponents({ page: 1, limit: pageSize })}>
                Thử lại
              </Button>
            </div>
          </div>
        ) : components.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Không có linh kiện nào cần thay thế</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={
                          components.length > 0 &&
                          components.every((row) =>
                            selectedRowKeys.includes(row.componentId)
                          )
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Chọn tất cả linh kiện"
                      />
                      <span>STT</span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("requestCode")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Mã YCSC</span>
                      {getSortIcon("requestCode")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("componentName")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Tên linh kiện</span>
                      {getSortIcon("componentName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("assetName")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Tài sản</span>
                      {getSortIcon("assetName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("location")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Vị trí</span>
                      {getSortIcon("location")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("componentStatus")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Trạng thái LK</span>
                      {getSortIcon("componentStatus")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("repairStatus")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Trạng thái YCSC</span>
                      {getSortIcon("repairStatus")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả lỗi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {components.map((record, index) => (
                  <tr key={record.componentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRowKeys.includes(record.componentId)}
                          onChange={(e) =>
                            handleRowSelect(
                              record.componentId,
                              e.target.checked
                            )
                          }
                          aria-label={`Chọn linh kiện ${record.componentName}`}
                        />
                        <span>{(currentPage - 1) * pageSize + index + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="font-mono text-blue-600 font-medium">
                        {record.requestCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">
                          {record.componentName}
                        </div>
                        {record.componentType && (
                          <Tag color="cyan" className="text-xs mt-1">
                            {record.componentType}
                          </Tag>
                        )}
                        {record.componentSpecs && (
                          <div className="text-sm text-gray-500 mt-1">
                            {record.componentSpecs}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">{record.assetName}</div>
                        <div className="text-sm text-gray-500">
                          Mã: {record.ktCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">
                          {record.buildingName || "N/A"}
                        </div>
                        {record.roomName && (
                          <div className="text-xs text-gray-500">
                            {record.roomName}
                            {record.machineLabel &&
                              ` - Máy ${record.machineLabel}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {record.componentStatus && (
                        <Tag
                          color={
                            record.componentStatus === ComponentStatus.FAULTY
                              ? "red"
                              : record.componentStatus ===
                                ComponentStatus.PENDING_REPLACEMENT
                              ? "orange"
                              : "green"
                          }
                          className="text-xs">
                          {record.componentStatus === ComponentStatus.FAULTY
                            ? "Hỏng"
                            : record.componentStatus ===
                              ComponentStatus.PENDING_REPLACEMENT
                            ? "Chờ thay"
                            : record.componentStatus}
                        </Tag>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {record.repairStatus && (
                        <Tag
                          color={
                            record.repairStatus === "ĐANG_XỬ_LÝ"
                              ? "processing"
                              : record.repairStatus === "CHỜ_THAY_THẾ"
                              ? "warning"
                              : record.repairStatus === "ĐÃ_TIẾP_NHẬN"
                              ? "blue"
                              : "default"
                          }
                          className="text-xs">
                          {record.repairStatus}
                        </Tag>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div
                        className="text-sm text-gray-700 line-clamp-2"
                        title={record.repairDescription}>
                        {record.repairDescription || "N/A"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={pagination.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 50, 100]}
              showQuickJumper={true}
              showTotal={true}
            />
          </>
        )}
      </div>

      {/* Create Proposal Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Tạo đề xuất thay thế</span>
            <Tag color="blue">{selectedRowKeys.length} linh kiện</Tag>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={720}
        okText={isSubmitting ? "Đang tạo..." : "Tạo đề xuất"}
        cancelText="Hủy"
        confirmLoading={isSubmitting}
        maskClosable={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: `Đề xuất thay thế ${selectedRowKeys.length} linh kiện`,
            description: "",
          }}>
          <Form.Item
            label={<span className="font-medium">Tiêu đề đề xuất</span>}
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề!" },
              { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự" },
              { max: 200, message: "Tiêu đề không quá 200 ký tự" },
            ]}>
            <Input
              placeholder="Ví dụ: Đề xuất thay thế RAM và SSD cho phòng H.03"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium">Mô tả chi tiết</span>}
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { min: 20, message: "Mô tả phải có ít nhất 20 ký tự" },
            ]}>
            <Input.TextArea
              rows={4}
              placeholder="Mô tả lý do cần thay thế, tình trạng hiện tại, yêu cầu cụ thể..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          {/* Repair Requests Info */}
          {(() => {
            const repairRequestIds = Array.from(
              new Set(
                selectedComponentsData
                  .map((c) => c.repairRequestId)
                  .filter((id): id is string => !!id)
              )
            );
            const requestCodes = Array.from(
              new Set(
                selectedComponentsData
                  .map((c) => c.requestCode)
                  .filter((code) => !!code)
              )
            );

            if (repairRequestIds.length > 0) {
              return (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-0.5">🔗</div>
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 text-sm">
                        Liên kết với {repairRequestIds.length} yêu cầu sửa chữa
                      </div>
                      <div className="text-xs text-blue-700 mt-1 flex flex-wrap gap-1">
                        {requestCodes.map((code, idx) => (
                          <Tag key={idx} color="blue" className="text-xs m-0">
                            {code}
                          </Tag>
                        ))}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Đề xuất này sẽ được liên kết tự động với các yêu cầu sửa
                        chữa trên
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Components List */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 text-sm flex items-center justify-between">
                <span>Danh sách linh kiện được chọn</span>
                <Tag color="green">{selectedRowKeys.length} linh kiện</Tag>
              </h4>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-white">
              {selectedComponentsData.map(
                (component: ComponentFromRepair, index) => (
                  <div
                    key={component.componentId}
                    className="border-l-4 border-blue-400 bg-gray-50 p-3 rounded-r-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">
                            {component.componentName}
                          </span>
                          {component.componentType && (
                            <Tag color="cyan" className="text-xs m-0">
                              {component.componentType}
                            </Tag>
                          )}
                        </div>

                        {component.componentSpecs && (
                          <div className="text-xs text-gray-600 mt-1">
                            📋 {component.componentSpecs}
                          </div>
                        )}

                        <div className="text-xs text-gray-700 mt-1">
                          💻 {component.assetName}
                          <span className="text-gray-500 ml-1">
                            ({component.ktCode})
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 mt-1">
                          📍 {component.buildingName} - {component.roomName}
                          {component.machineLabel &&
                            ` - Máy ${component.machineLabel}`}
                        </div>

                        <div className="text-xs text-blue-600 mt-1 font-mono">
                          🔖 {component.requestCode}
                        </div>

                        {component.reason && (
                          <div className="text-xs text-gray-700 mt-2 bg-yellow-50 p-2 rounded">
                            <span className="font-medium">Lý do:</span>{" "}
                            {component.reason}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                          x{component.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Summary Info */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tổng số linh kiện:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {selectedRowKeys.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tổng số lượng:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {selectedComponentsData.reduce(
                    (sum, c) => sum + (c.quantity || 1),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
