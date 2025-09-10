"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Button,
  Table,
  Tag,
  Progress,
  Timeline,
  Space,
  Tabs,
  Typography,
  Dropdown,
} from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { DepartmentStats } from "@/types/stats";
import {
  statsData,
  monthlyData,
  errorTypeStatsData,
  weeklyTrendData,
  detailedTableData,
  activityTimelineData,
} from "@/lib/mockData";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Helper function để tạo icon
const getIcon = (iconType: string) => {
  const iconClass = "w-4 h-4";
  switch (iconType) {
    case "FileText":
      return <FileText className={iconClass} />;
    case "Clock":
      return <Clock className={iconClass} />;
    case "CheckCircle":
      return <CheckCircle className={iconClass} />;
    case "TrendingUp":
      return <TrendingUp className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

const columns = [
  {
    title: "Khoa/Phòng ban",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Tổng báo cáo",
    dataIndex: "totalReports",
    key: "totalReports",
    sorter: (a: DepartmentStats, b: DepartmentStats) =>
      a.totalReports - b.totalReports,
  },
  {
    title: "Hoàn thành",
    dataIndex: "completed",
    key: "completed",
    sorter: (a: DepartmentStats, b: DepartmentStats) =>
      a.completed - b.completed,
  },
  {
    title: "Đang xử lý",
    dataIndex: "pending",
    key: "pending",
    sorter: (a: DepartmentStats, b: DepartmentStats) => a.pending - b.pending,
  },
  {
    title: "Thời gian TB",
    dataIndex: "avgTime",
    key: "avgTime",
  },
  {
    title: "Hiệu suất (%)",
    dataIndex: "efficiency",
    key: "efficiency",
    sorter: (a: DepartmentStats, b: DepartmentStats) =>
      a.efficiency - b.efficiency,
    render: (value: number) => (
      <Progress
        percent={value}
        size="small"
        status={value >= 85 ? "success" : value >= 70 ? "normal" : "exception"}
        showInfo={false}
      />
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color={
          status === "Tốt"
            ? "green"
            : status === "Trung bình"
            ? "orange"
            : "red"
        }>
        {status}
      </Tag>
    ),
  },
];

const StatsReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  const handleExport = (type: string) => {
    console.log(`Xuất báo cáo ${type}`);
    // Logic xuất báo cáo
  };

  const exportMenuItems = [
    {
      key: "pdf",
      label: "Xuất PDF",
      onClick: () => handleExport("pdf"),
    },
    {
      key: "excel",
      label: "Xuất Excel",
      onClick: () => handleExport("excel"),
    },
    {
      key: "csv",
      label: "Xuất CSV",
      onClick: () => handleExport("csv"),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2">
          Thống kê báo cáo
        </Title>
        <Text type="secondary">
          Xem các loại thống kê khác nhau (thiết bị, tiến độ, loại lỗi) và xuất
          báo cáo tổng hợp
        </Text>
      </div>

      {/* Bộ lọc và điều khiển */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Text>Thời gian:</Text>
              <RangePicker placeholder={["Từ ngày", "Đến ngày"]} />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Text>Chu kỳ:</Text>
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                style={{ width: 120 }}>
                <Option value="week">Tuần</Option>
                <Option value="month">Tháng</Option>
                <Option value="quarter">Quý</Option>
                <Option value="year">Năm</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8} className="text-right">
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button type="primary" icon={<Download className="w-4 h-4" />}>
                Xuất báo cáo
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </Card>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={getIcon(stat.iconType)}
                suffix={stat.suffix}
                valueStyle={stat.valueStyle}
                precision={stat.precision}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabs với các loại thống kê khác nhau */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Tab tổng quan */}
        <TabPane tab="Tổng quan" key="overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Thống kê theo tháng" className="mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#52c41a" name="Hoàn thành" />
                    <Bar dataKey="pending" fill="#faad14" name="Đang xử lý" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Phân loại theo loại lỗi" className="mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={errorTypeStatsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {errorTypeStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Chi tiết theo khoa/phòng ban">
                <Table
                  columns={columns}
                  dataSource={detailedTableData}
                  pagination={false}
                  size="middle"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Timeline hoạt động">
                <Timeline>
                  {activityTimelineData.map((activity, index) => (
                    <Timeline.Item key={index} color={activity.color}>
                      <p>
                        {activity.time} - {activity.description}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {activity.timeAgo}
                      </p>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Tab xu hướng */}
        <TabPane tab="Xu hướng" key="trends">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="Xu hướng báo cáo và thời gian xử lý">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="reports"
                      fill="#1890ff"
                      name="Số báo cáo"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#ff7300"
                      strokeWidth={3}
                      name="Thời gian TB (ngày)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Tab hiệu suất */}
        <TabPane tab="Hiệu suất" key="performance">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Hiệu suất theo khoa">
                {detailedTableData.map((dept, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <Text>{dept.department}</Text>
                      <Text strong>{dept.efficiency}%</Text>
                    </div>
                    <Progress
                      percent={dept.efficiency}
                      status={
                        dept.efficiency >= 85
                          ? "success"
                          : dept.efficiency >= 70
                          ? "normal"
                          : "exception"
                      }
                      showInfo={false}
                    />
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Thống kê kỹ thuật viên">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#52c41a"
                      fill="#52c41a"
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      stroke="#faad14"
                      fill="#faad14"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Tab báo cáo chi tiết */}
        <TabPane tab="Báo cáo chi tiết" key="detailed">
          <Card>
            <Table
              columns={columns}
              dataSource={detailedTableData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} mục`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatsReportsPage;
