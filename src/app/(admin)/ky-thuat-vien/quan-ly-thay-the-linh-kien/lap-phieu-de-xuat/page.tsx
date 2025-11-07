"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form, message, Breadcrumb, Select, Tag } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Search, ChevronUp, ChevronDown, Loader2, X } from "lucide-react";
import { Pagination } from "@/components/ui";
import { useAvailableComponents } from "@/hooks";
import { createReplacementProposal, ComponentFromRepair } from "@/lib/api/replacement-proposals";
import { ComponentType } from "@/types/repair";

type SortField = "componentName" | "assetName" | "location" | "quantity" | "reason" | "requestCode";
type SortDirection = "asc" | "desc" | "none";

export default function CreateProposalPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Filter states
  const [componentTypeFilter, setComponentTypeFilter] = useState<string[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<string>('');
  const [roomFilter, setRoomFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Sử dụng custom hook để fetch data
  const { components, pagination, loading, error, fetchComponents } = useAvailableComponents();

  // Fetch data khi component mount hoặc filters thay đổi
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchText || undefined,
      componentType: componentTypeFilter.length > 0 ? componentTypeFilter : undefined,
      building: buildingFilter || undefined,
      roomName: roomFilter || undefined,
      excludeInProposal: true,
      sortBy: (sortField === "location" ? "createdAt" : sortField || "createdAt") as "createdAt" | "componentName" | "assetName" | "requestCode",
      sortOrder: (sortDirection === "none" ? "DESC" : sortDirection.toUpperCase()) as "ASC" | "DESC",
    };
    
    fetchComponents(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchText, componentTypeFilter, buildingFilter, roomFilter, sortField, sortDirection]);

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
          className={`h-3 w-3 ${sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
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

      // Lấy thông tin các linh kiện được chọn
      const selectedComponents = components.filter(
        (component) => selectedRowKeys.includes(component.componentId)
      );

      // Tạo payload theo format API
      const proposalData = {
        title: values.title,
        description: values.description,
        items: selectedComponents.map((component) => ({
          oldComponentId: component.componentId,
          newItemName: component.componentName,
          newItemSpecs: component.componentSpecs || "",
          quantity: component.quantity,
          reason: component.reason,
        })),
      };

      console.log("📤 Creating proposal:", proposalData);
      
      // Gọi API tạo đề xuất
      const result = await createReplacementProposal(proposalData);
      
      console.log("✅ Proposal created:", result);
      message.success(`Tạo đề xuất thay thế thành công! Mã: ${result.proposalCode}`);
      
      // Reset và đóng modal
      setIsModalVisible(false);
      form.resetFields();
      setSelectedRowKeys([]);
      
      // Refresh danh sách
      fetchComponents({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        excludeInProposal: true,
      });
    } catch (err) {
      console.error("❌ Create proposal error:", err);
      message.error(err instanceof Error ? err.message : "Tạo đề xuất thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Hàm lấy danh sách component đã chọn
  const selectedComponents = components.filter(
    (component) => selectedRowKeys.includes(component.componentId)
  );

  // Đếm số lượng filters đang active
  const activeFiltersCount = [
    componentTypeFilter.length > 0,
    buildingFilter,
    roomFilter,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setComponentTypeFilter([]);
    setBuildingFilter('');
    setRoomFilter('');
    setSearchText('');
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
      setSelectedRowKeys(prev => [...prev, id]);
    } else {
      setSelectedRowKeys(prev => prev.filter(key => key !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const newKeys = components.map(row => row.componentId);
      setSelectedRowKeys(newKeys);
    } else {
      setSelectedRowKeys([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/ky-thuat-vien',
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
            href: '/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat',
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
          <h1 className="text-2xl font-bold text-gray-900">Lập phiếu đề xuất thay thế</h1>
          <p className="text-gray-600 mt-1">
            Chọn các linh kiện từ báo cáo lỗi để tạo đề xuất thay thế
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProposal}
          size="large"
          disabled={selectedRowKeys.length === 0}
        >
          Tạo đề xuất ({selectedRowKeys.length})
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Bộ lọc và tìm kiếm</h3>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button 
                size="small" 
                onClick={clearAllFilters}
                icon={<X className="w-3 h-3" />}
              >
                Xóa bộ lọc ({activeFiltersCount})
              </Button>
            )}
            <Button
              size="small"
              type={showFilters ? "primary" : "default"}
              onClick={() => setShowFilters(!showFilters)}
              icon={<FilterOutlined />}
            >
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            className='col-span-1 md:col-span-2'
            placeholder="Tìm kiếm theo tên linh kiện, tài sản, mã tài sản..."
            prefix={<Search className="w-4 h-4" />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Component Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại linh kiện
              </label>
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn loại linh kiện"
                value={componentTypeFilter}
                onChange={(value) => {
                  setComponentTypeFilter(value);
                  setCurrentPage(1);
                }}
                style={{ width: '100%' }}
                maxTagCount="responsive"
              >
                {Object.entries(ComponentType).map(([key, value]) => (
                  <Select.Option key={value} value={value}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Building Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tòa nhà
              </label>
              <Input
                placeholder="Nhập tên tòa nhà (VD: A, B, C...)"
                value={buildingFilter}
                onChange={(e) => {
                  setBuildingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                allowClear
              />
            </div>

            {/* Room Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng
              </label>
              <Input
                placeholder="Nhập tên phòng (VD: A01.03)"
                value={roomFilter}
                onChange={(e) => {
                  setRoomFilter(e.target.value);
                  setCurrentPage(1);
                }}
                allowClear
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 self-center">Đang lọc:</span>
            {componentTypeFilter.length > 0 && (
              <Tag 
                closable 
                onClose={() => {
                  setComponentTypeFilter([]);
                  setCurrentPage(1);
                }}
                color="blue"
              >
                Loại: {componentTypeFilter.join(', ')}
              </Tag>
            )}
            {buildingFilter && (
              <Tag 
                closable 
                onClose={() => {
                  setBuildingFilter('');
                  setCurrentPage(1);
                }}
                color="green"
              >
                Tòa: {buildingFilter}
              </Tag>
            )}
            {roomFilter && (
              <Tag 
                closable 
                onClose={() => {
                  setRoomFilter('');
                  setCurrentPage(1);
                }}
                color="orange"
              >
                Phòng: {roomFilter}
              </Tag>
            )}
          </div>
        )}
      </div>

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
              <Button onClick={() => fetchComponents({ page: 1, limit: pageSize })}>
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
                        checked={components.length > 0 && components.every(row => selectedRowKeys.includes(row.componentId))}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Chọn tất cả linh kiện"
                      />
                      <span>STT</span>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("requestCode")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Mã YCSC</span>
                      {getSortIcon("requestCode")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("componentName")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Tên linh kiện</span>
                      {getSortIcon("componentName")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("assetName")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Tài sản</span>
                      {getSortIcon("assetName")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Vị trí</span>
                      {getSortIcon("location")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Số lượng</span>
                      {getSortIcon("quantity")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort("reason")}
                  >
                    <div className="flex items-center uppercase space-x-1">
                      <span>Lý do thay thế</span>
                      {getSortIcon("reason")}
                    </div>
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
                          onChange={(e) => handleRowSelect(record.componentId, e.target.checked)}
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
                        <div className="font-medium">{record.componentName}</div>
                        {record.componentType && (
                          <Tag color="cyan" className="text-xs mt-1">
                            {record.componentType}
                          </Tag>
                        )}
                        {record.componentSpecs && (
                          <div className="text-sm text-gray-500 mt-1">{record.componentSpecs}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">{record.assetName}</div>
                        <div className="text-sm text-gray-500">Mã: {record.assetCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">{record.buildingName || 'N/A'}</div>
                        {record.roomName && (
                          <div className="text-xs text-gray-500">
                            {record.roomName}
                            {record.machineLabel && ` - Máy ${record.machineLabel}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="font-medium text-blue-600">
                        {record.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {record.reason}
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
        title="Tạo đề xuất thay thế"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={isSubmitting ? "Đang tạo..." : "Tạo đề xuất"}
        cancelText="Hủy"
        confirmLoading={isSubmitting}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: `Đề xuất thay thế ${selectedRowKeys.length} linh kiện`,
            description: "",
          }}
        >
          <Form.Item
            label="Tiêu đề đề xuất"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề đề xuất" />
          </Form.Item>

          <Form.Item
            label="Mô tả chi tiết"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về đề xuất thay thế"
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Linh kiện được chọn ({selectedRowKeys.length})
            </h4>
            <div className="space-y-2">
              {selectedComponents.map((component: ComponentFromRepair) => (
                <div key={component.componentId} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {component.componentName}
                      </span>
                      {component.componentSpecs && (
                        <div className="text-gray-500 text-xs">
                          {component.componentSpecs}
                        </div>
                      )}
                      <div className="text-gray-600 text-xs">
                        {component.assetName} ({component.assetCode})
                      </div>
                      <div className="text-gray-500 text-xs">
                        {component.buildingName} - {component.roomName}
                        {component.machineLabel && ` - Máy ${component.machineLabel}`}
                      </div>
                    </div>
                    <span className="text-blue-600 font-medium ml-2">
                      x{component.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}