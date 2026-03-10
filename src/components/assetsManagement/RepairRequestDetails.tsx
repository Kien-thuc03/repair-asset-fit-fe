import React, { useMemo } from "react";
import { Card, Table, Tag, Space, Typography, Row, Col, Statistic, Empty, Spin } from "antd";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { RepairStatus } from "@/types";
import type { ColumnsType } from "antd/es/table";
import { useRepairDashboardData } from "@/hooks/useRepairDashboardData";

const { Text, Title } = Typography;

interface RepairDetail {
  key: string;
  requestCode: string;
  assetName: string;
  errorType: string;
  reporterName: string;
  technicianName: string;
  roomName: string;
  status: RepairStatus;
  createdAt: string;
  completedAt?: string;
  resolutionTime?: number; // Thời gian xử lý (tính bằng giờ)
}

/**
 * Component hiển thị chi tiết về các yêu cầu sửa chữa
 * Dựa trên database schema: RepairRequests table
 */
export const RepairRequestDetails = () => {
  const { allRepairs, loading, error } = useRepairDashboardData();

  // Chuyển đổi dữ liệu repair requests thành format hiển thị
  const repairDetails: RepairDetail[] = useMemo(() => {
    return allRepairs.map((request) => {
      let resolutionTime: number | undefined;

      // Tính thời gian xử lý nếu đã hoàn thành
      if (request.completedAt && request.createdAt) {
        const created = new Date(request.createdAt);
        const completed = new Date(request.completedAt);
        resolutionTime = Math.round(
          (completed.getTime() - created.getTime()) / (1000 * 60 * 60)
        ); // Tính bằng giờ
      }

      return {
        key: request.id,
        requestCode: request.requestCode,
        assetName: request.assetName || "Không xác định",
        errorType: request.errorTypeName || "Không xác định",
        reporterName: request.reporterName || "Không xác định",
        technicianName: request.assignedTechnicianName || "Chưa phân công",
        roomName: `${request.roomName} - ${request.buildingName}`,
        status: request.status,
        createdAt: request.createdAt,
        completedAt: request.completedAt,
        resolutionTime,
      };
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Spin />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Empty description={error} />
      </Card>
    );
  }

  if (repairDetails.length === 0) {
    return (
      <Card>
        <Empty description="Chưa có yêu cầu sửa chữa" />
      </Card>
    );
  }

  // Tính thống kê
  const statistics = useMemo(() => {
    const completed = repairDetails.filter(
      (r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH
    );
    const pending = repairDetails.filter(
      (r) =>
        r.status === RepairStatus.ĐANG_XỬ_LÝ ||
        r.status === RepairStatus.CHỜ_TIẾP_NHẬN ||
        r.status === RepairStatus.ĐÃ_TIẾP_NHẬN
    );

    const avgResolutionTime =
      completed.length > 0
        ? completed.reduce((sum, r) => sum + (r.resolutionTime || 0), 0) /
          completed.length
        : 0;

    return {
      total: repairDetails.length,
      completed: completed.length,
      pending: pending.length,
      avgResolutionTime: Number(avgResolutionTime.toFixed(1)),
    };
  }, [repairDetails]);

  // Định nghĩa columns cho bảng
  const columns: ColumnsType<RepairDetail> = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestCode",
      key: "requestCode",
      width: 150,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Tài sản",
      dataIndex: "assetName",
      key: "assetName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Loại lỗi",
      dataIndex: "errorType",
      key: "errorType",
      width: 180,
      render: (text: string) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporterName",
      key: "reporterName",
      width: 150,
    },
    {
      title: "Kỹ thuật viên",
      dataIndex: "technicianName",
      key: "technicianName",
      width: 150,
      render: (text: string) =>
        text === "Chưa phân công" ? (
          <Text type="secondary">{text}</Text>
        ) : (
          <Text>{text}</Text>
        ),
    },
    {
      title: "Vị trí",
      dataIndex: "roomName",
      key: "roomName",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: RepairStatus) => {
        const statusConfig = {
          [RepairStatus.CHỜ_TIẾP_NHẬN]: {
            color: "default",
            text: "Chờ tiếp nhận",
          },
          [RepairStatus.ĐÃ_TIẾP_NHẬN]: { color: "blue", text: "Đã tiếp nhận" },
          [RepairStatus.ĐANG_XỬ_LÝ]: {
            color: "processing",
            text: "Đang xử lý",
          },
          [RepairStatus.CHỜ_THAY_THẾ]: {
            color: "warning",
            text: "Chờ thay thế",
          },
          [RepairStatus.ĐÃ_HOÀN_THÀNH]: {
            color: "success",
            text: "Đã hoàn thành",
          },
          [RepairStatus.ĐÃ_HỦY]: { color: "error", text: "Đã hủy" },
        };

        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thời gian xử lý",
      dataIndex: "resolutionTime",
      key: "resolutionTime",
      width: 120,
      render: (time: number | undefined, record: RepairDetail) => {
        if (
          record.status === RepairStatus.ĐÃ_HOÀN_THÀNH &&
          time !== undefined
        ) {
          const days = Math.floor(time / 24);
          const hours = time % 24;
          return (
            <Space direction="vertical" size={0}>
              <Text className="text-xs">
                {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
              </Text>
            </Space>
          );
        }
        return <Text type="secondary">-</Text>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <Text className="text-xs">
          {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} className="mb-4">
        Chi tiết yêu cầu sửa chữa
      </Title>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng yêu cầu"
              value={statistics.total}
              prefix={<CheckCircle className="w-4 h-4" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={statistics.completed}
              prefix={<CheckCircle className="w-4 h-4" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={statistics.pending}
              prefix={<AlertTriangle className="w-4 h-4" />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Thời gian TB"
              value={statistics.avgResolutionTime}
              suffix="giờ"
              prefix={<Clock className="w-4 h-4" />}
              valueStyle={{
                color:
                  statistics.avgResolutionTime <= 24
                    ? "#52c41a"
                    : statistics.avgResolutionTime <= 72
                    ? "#fa8c16"
                    : "#ff4d4f",
              }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết */}
      <Card>
        <Table
          columns={columns}
          dataSource={repairDetails}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};
