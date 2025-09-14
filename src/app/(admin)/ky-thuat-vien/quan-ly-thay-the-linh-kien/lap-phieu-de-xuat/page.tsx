"use client";

import React, { useState, useMemo } from "react";
import { Button, Input, Modal, Form, message, Breadcrumb, Select, DatePicker, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Pagination } from "@/components/ui";
import { mockComponentsFromReportsWithStatus, type ComponentFromReport } from "@/lib/mockData";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProposalFormData {
  title: string;
  description: string;
  selectedComponents: string[];
}

type SortField = "componentName" | "assetName" | "location" | "quantity" | "reason";
type SortDirection = "asc" | "desc" | "none";

export default function CreateProposalPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [form] = Form.useForm();

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

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    // Reset về trang 1 khi filter thay đổi  
    setCurrentPage(1);

    // Lọc dữ liệu
    const filtered = mockComponentsFromReportsWithStatus.filter((item: ComponentFromReport) => {
      const matchesSearch = searchText ? 
        [item.componentName, item.assetName, item.assetCode, item.buildingName, item.roomName, item.reason]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(searchText.toLowerCase()) : true;

      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });

    // Sắp xếp dữ liệu
    if (!sortField || sortDirection === "none") return filtered;

    return [...filtered].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "componentName":
          aValue = a.componentName.toLowerCase();
          bValue = b.componentName.toLowerCase();
          break;
        case "assetName":
          aValue = a.assetName.toLowerCase();
          bValue = b.assetName.toLowerCase();
          break;
        case "location":
          aValue = `${a.buildingName} ${a.roomName}`.toLowerCase();
          bValue = `${b.buildingName} ${b.roomName}`.toLowerCase();
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "reason":
          aValue = a.reason.toLowerCase();
          bValue = b.reason.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchText, statusFilter, sortField, sortDirection]);

  // Dữ liệu phân trang
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const handleCreateProposal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một linh kiện để tạo đề xuất");
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedComponents = mockComponentsFromReportsWithStatus.filter(
        (component: ComponentFromReport) => selectedRowKeys.includes(component.id)
      );

      const proposalData: ProposalFormData = {
        ...values,
        selectedComponents: selectedRowKeys,
      };

      console.log("Đề xuất thay thế:", proposalData);
      console.log("Các linh kiện được chọn:", selectedComponents);
      message.success("Tạo đề xuất thay thế thành công!");
      
      setIsModalVisible(false);
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const selectedComponents = mockComponentsFromReportsWithStatus.filter(
    (component: ComponentFromReport) => selectedRowKeys.includes(component.id)
  );

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
      const selectableRows = paginatedData.filter(row => row.status === "Chờ xử lý");
      const newKeys = selectableRows.map(row => row.id);
      setSelectedRowKeys(prev => [...prev, ...newKeys]);
    } else {
      const currentPageKeys = paginatedData.map(row => row.id);
      setSelectedRowKeys(prev => prev.filter(key => !currentPageKeys.includes(key)));
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            className='col-span-1 md:col-span-2'
            placeholder="Tìm kiếm theo tên linh kiện, tài sản, vị trí..."
            prefix={<Search className="w-4 h-4" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={paginatedData.filter(row => row.status === "Chờ xử lý").length > 0 && 
                             paginatedData.filter(row => row.status === "Chờ xử lý").every(row => selectedRowKeys.includes(row.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Chọn tất cả linh kiện"
                  />
                  <span>STT</span>
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
            {paginatedData.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRowKeys.includes(record.id)}
                      onChange={(e) => handleRowSelect(record.id, e.target.checked)}
                      disabled={record.status !== "Chờ xử lý"}
                      aria-label={`Chọn linh kiện ${record.componentName}`}
                    />
                    <span>{(currentPage - 1) * pageSize + index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>
                    <div className="font-medium">{record.componentName}</div>
                    {record.componentSpecs && (
                      <div className="text-sm text-gray-500">{record.componentSpecs}</div>
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
                    <div className="font-medium">{record.buildingName}</div>
                    {record.machineLabel && (
                      <div className="text-xs text-gray-500">{record.roomName} - Máy {record.machineLabel}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className="font-medium text-blue-600">
                    {record.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="text-sm text-gray-700">
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
          total={filteredAndSortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />
      </div>

      {/* Create Proposal Modal */}
      <Modal
        title="Tạo đề xuất thay thế"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="Tạo đề xuất"
        cancelText="Hủy"
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
              {selectedComponents.map((component: ComponentFromReport) => (
                <div key={component.id} className="text-sm">
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