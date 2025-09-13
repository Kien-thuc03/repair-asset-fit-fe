"use client";

import React, { useState } from "react";
import { Card, Table, Button, Tag, Input, Modal, Form, InputNumber, message, Breadcrumb } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { 
  Home as HomeIcon, 
  Wrench as RepairIcon,
  FileText as ProposalIcon 
} from "lucide-react";
import { mockComponentsFromReportsWithStatus, type ComponentFromReport } from "@/lib/mockData";

interface ProposalFormData {
  title: string;
  description: string;
  selectedComponents: string[];
}

export default function CreateProposalPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xử lý": return "warning";
      case "Đang xử lý": return "processing";
      case "Hoàn thành": return "success";
      default: return "default";
    }
  };

  const columns: ColumnsType<ComponentFromReport> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên linh kiện',
      dataIndex: 'componentName',
      key: 'componentName',
      render: (text: string, record: ComponentFromReport) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.componentSpecs && (
            <div className="text-sm text-gray-500">{record.componentSpecs}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Tài sản',
      key: 'asset',
      render: (record: ComponentFromReport) => (
        <div>
          <div className="font-medium">{record.assetName}</div>
          <div className="text-sm text-gray-500">Mã: {record.assetCode}</div>
        </div>
      ),
    },
    {
      title: 'Vị trí',
      key: 'location',
      render: (record: ComponentFromReport) => (
        <div>
          <div className="font-medium">{record.buildingName} - {record.roomName}</div>
          {record.machineLabel && (
            <div className="text-xs text-gray-500">Máy {record.machineLabel}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 100,
      render: (quantity: number) => (
        <span className="font-medium text-blue-600">
          {quantity}
        </span>
      ),
    },
    {
      title: 'Lý do thay thế',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <div className="text-sm text-gray-700">
          {reason}
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
    getCheckboxProps: (record: ComponentFromReport) => ({
      disabled: record.status !== "Chờ xử lý",
    }),
  };

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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <HomeIcon className="w-4 h-4 mr-1 inline" />
          <span>Trang chủ</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <RepairIcon className="w-4 h-4 mr-1 inline" />
          <span>Quản lý thay thế linh kiện</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ProposalIcon className="w-4 h-4 mr-1 inline" />
          <span>Lập phiếu đề xuất</span>
        </Breadcrumb.Item>
      </Breadcrumb>

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

      {/* Selected Summary */}
      {selectedRowKeys.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-700 font-medium">
                Đã chọn {selectedRowKeys.length} linh kiện để tạo đề xuất thay thế
              </span>
            </div>
            <Button 
              type="link" 
              onClick={() => setSelectedRowKeys([])}
            >
              Bỏ chọn tất cả
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách linh kiện cần thay thế
            </h3>
            <p className="text-gray-600 text-sm">
              Các linh kiện từ báo cáo lỗi đang chờ xử lý
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={mockComponentsFromReportsWithStatus}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: mockComponentsFromReportsWithStatus.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} linh kiện`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

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