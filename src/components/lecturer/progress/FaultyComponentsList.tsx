"use client";

import { Table, Card, Tag, Typography, Empty } from 'antd';
import { ToolOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { RepairRequestComponent } from '@/types';
import { getComponentsByRepairRequestId, mockComponents } from '@/lib/mockData';

const { Title, Text } = Typography;

interface FaultyComponentsListProps {
  repairRequestId: string;
}

interface ComponentWithDetails extends RepairRequestComponent {
  componentName: string;
  componentType: string;
  componentSpecs?: string;
  serialNumber?: string;
}

export default function FaultyComponentsList({ repairRequestId }: FaultyComponentsListProps) {
  // Lấy danh sách linh kiện bị lỗi từ repair request
  const repairRequestComponents = getComponentsByRepairRequestId(repairRequestId);
  
  // Kết hợp với thông tin chi tiết của component
  const componentsWithDetails: ComponentWithDetails[] = repairRequestComponents.map(item => {
    const componentDetail = mockComponents.find(comp => comp.id === item.componentId);
    
    return {
      ...item,
      componentName: componentDetail?.name || 'Không xác định',
      componentType: componentDetail?.componentType || 'Không xác định', 
      componentSpecs: componentDetail?.componentSpecs,
      serialNumber: componentDetail?.serialNumber
    };
  });

  // Cấu hình columns cho table
  const columns: ColumnsType<ComponentWithDetails> = [
    {
      title: (
        <div className="flex items-center">
          <ToolOutlined className="mr-2" />
          Tên linh kiện
        </div>
      ),
      dataIndex: 'componentName',
      key: 'componentName',
      width: '25%',
      render: (name: string, record: ComponentWithDetails) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          {record.componentSpecs && (
            <div className="text-sm text-gray-500 mt-1">{record.componentSpecs}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Loại linh kiện',
      dataIndex: 'componentType',
      key: 'componentType',
      width: '20%',
      render: (type: string) => (
        <Tag color="blue" className="font-medium">
          {type}
        </Tag>
      ),
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber', 
      key: 'serialNumber',
      width: '20%',
      render: (serial: string) => (
        <Text code className="text-xs">
          {serial || 'N/A'}
        </Text>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <FileTextOutlined className="mr-2" />
          Mô tả lỗi
        </div>
      ),
      dataIndex: 'note',
      key: 'note', 
      width: '35%',
      render: (note: string) => (
        <div className="text-sm text-gray-700">
          {note || 'Không có mô tả'}
        </div>
      ),
    },
  ];

  if (componentsWithDetails.length === 0) {
    return (
      <Card className="mt-6">
        <Title level={4} className="text-gray-800 mb-4">
          <ToolOutlined className="mr-2 text-blue-600" />
          Linh kiện bị lỗi
        </Title>
        <Empty 
          description="Không có linh kiện cụ thể nào được báo lỗi"
          className="py-8"
        />
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <Title level={4} className="text-gray-800 mb-4">
        <ToolOutlined className="mr-2 text-blue-600" />
        Linh kiện bị lỗi ({componentsWithDetails.length})
      </Title>
      
      <Table
        columns={columns}
        dataSource={componentsWithDetails}
        rowKey="componentId"
        pagination={false}
        size="middle"
        className="border border-gray-200 rounded-lg"
        rowClassName="hover:bg-gray-50"
        locale={{
          emptyText: (
            <Empty 
              description="Không có linh kiện nào được báo lỗi"
              className="py-8"
            />
          )
        }}
      />
      
      <div className="mt-3 text-xs text-gray-500">
        💡 <strong>Lưu ý:</strong> Danh sách này chỉ hiển thị các linh kiện cụ thể được báo lỗi. 
        Kỹ thuật viên có thể cập nhật thêm linh kiện khác trong quá trình kiểm tra.
      </div>
    </Card>
  );
}