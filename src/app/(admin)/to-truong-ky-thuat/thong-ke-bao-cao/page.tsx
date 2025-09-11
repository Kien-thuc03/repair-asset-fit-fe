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
} from "recharts";
import {
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { DepartmentStats } from "@/types/stats";
import {
  statsData,
  monthlyData,
  errorTypeStatsData,
  weeklyTrendData,
  detailedTableData,
  activityTimelineData,
  detailedErrorStats,
  mockTechnicians,
} from "@/lib/mockData";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Interface cho dữ liệu lỗi chi tiết
interface DetailedErrorStat {
  key: string;
  errorType: string;
  count: number;
  percentage: number;
  avgRepairTime: string;
  difficulty: string;
  commonCauses: string[];
}

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

const StatsReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // State cho bảng thống kê lỗi riêng biệt
  const [errorSortField, setErrorSortField] = useState<string | null>(null);
  const [errorSortOrder, setErrorSortOrder] = useState<"asc" | "desc" | null>(
    null
  );

  // Hàm xử lý sắp xếp cho bảng chính
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Nếu đang sắp xếp cột này, chuyển đổi thứ tự: asc -> desc -> null -> asc
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder(null);
        setSortField(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      // Nếu sắp xếp cột khác, bắt đầu với asc
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Hàm xử lý sắp xếp cho bảng thống kê lỗi
  const handleErrorSort = (field: string) => {
    if (errorSortField === field) {
      // Nếu đang sắp xếp cột này, chuyển đổi thứ tự: asc -> desc -> null -> asc
      if (errorSortOrder === "asc") {
        setErrorSortOrder("desc");
      } else if (errorSortOrder === "desc") {
        setErrorSortOrder(null);
        setErrorSortField(null);
      } else {
        setErrorSortOrder("asc");
      }
    } else {
      // Nếu sắp xếp cột khác, bắt đầu với asc
      setErrorSortField(field);
      setErrorSortOrder("asc");
    }
  };

  // Hàm render title với icon sắp xếp cho bảng chính
  const renderSortTitle = (title: string, field: string) => (
    <div
      className="flex items-center justify-center cursor-pointer hover:text-blue-600 select-none"
      onClick={() => handleSort(field)}>
      <span>{title}</span>
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`w-3 h-3 ${
            sortField === field && sortOrder === "asc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 -mt-1 ${
            sortField === field && sortOrder === "desc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );

  // Hàm render title với icon sắp xếp cho bảng thống kê lỗi
  const renderErrorSortTitle = (title: string, field: string) => (
    <div
      className="flex items-center justify-center cursor-pointer hover:text-blue-600 select-none"
      onClick={() => handleErrorSort(field)}>
      <span>{title}</span>
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`w-3 h-3 ${
            errorSortField === field && errorSortOrder === "asc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 -mt-1 ${
            errorSortField === field && errorSortOrder === "desc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );

  // Định nghĩa columns với custom sorting
  const columns = [
    {
      title: renderSortTitle("Tầng", "department"),
      dataIndex: "department",
      key: "department",
      width: 80,
    },
    {
      title: renderSortTitle("Báo cáo", "totalReports"),
      dataIndex: "totalReports",
      key: "totalReports",
      align: "center" as const,
      width: 70,
    },
    {
      title: renderSortTitle("Hoàn thành", "completed"),
      dataIndex: "completed",
      key: "completed",
      align: "center" as const,
      width: 80,
    },
    {
      title: renderSortTitle("Đang xử lý", "pending"),
      dataIndex: "pending",
      key: "pending",
      align: "center" as const,
      width: 80,
    },
    {
      title: renderSortTitle("TB (ngày)", "avgTime"),
      dataIndex: "avgTime",
      key: "avgTime",
      align: "center" as const,
      width: 80,
    },
    {
      title: renderSortTitle("Hiệu suất", "efficiency"),
      dataIndex: "efficiency",
      key: "efficiency",
      align: "center" as const,
      width: 90,
      render: (value: number) => {
        // Xác định màu dựa trên hiệu suất
        let progressColor = "#1890ff";
        let textColor = "text-blue-600";

        if (value >= 97) {
          progressColor = "#722ed1"; // Tím - Xuất sắc
          textColor = "text-purple-600";
        } else if (value >= 95) {
          progressColor = "#52c41a"; // Xanh lá - Tốt
          textColor = "text-green-600";
        } else if (value >= 90) {
          progressColor = "#fa8c16"; // Cam - Khá
          textColor = "text-orange-600";
        } else {
          progressColor = "#ff4d4f"; // Đỏ - Trung bình
          textColor = "text-red-600";
        }

        return (
          <div>
            <Progress
              percent={value}
              size="small"
              strokeColor={progressColor}
              showInfo={false}
            />
            <span className={`text-xs ${textColor}`}>{value.toFixed(1)}%</span>
          </div>
        );
      },
    },
    {
      title: renderSortTitle("Đánh giá", "status"),
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 80,
      render: (status: string, record: DepartmentStats) => {
        // Sử dụng cùng logic màu với cột hiệu suất
        let color = "default";

        if (record.efficiency >= 97) {
          color = "purple"; // Tím - Xuất sắc
        } else if (record.efficiency >= 95) {
          color = "green"; // Xanh lá - Tốt
        } else if (record.efficiency >= 90) {
          color = "orange"; // Cam - Khá
        } else {
          color = "red"; // Đỏ - Trung bình
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // Hàm sắp xếp dữ liệu cho bảng chính
  const getSortedData = (data: DepartmentStats[]) => {
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortField as keyof DepartmentStats];
      const bVal = b[sortField as keyof DepartmentStats];

      // Xử lý trường hợp số
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Xử lý trường hợp chuỗi
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  };

  // Hàm sắp xếp dữ liệu cho bảng thống kê lỗi
  const getSortedErrorData = (data: DetailedErrorStat[]) => {
    if (!errorSortField || !errorSortOrder) return data;

    return [...data].sort((a, b) => {
      const aVal = a[errorSortField as keyof DetailedErrorStat];
      const bVal = b[errorSortField as keyof DetailedErrorStat];

      // Xử lý trường hợp số
      if (typeof aVal === "number" && typeof bVal === "number") {
        return errorSortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Xử lý trường hợp chuỗi
      if (typeof aVal === "string" && typeof bVal === "string") {
        return errorSortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  };

  // Tính toán thống kê kỹ thuật viên từ dữ liệu thực
  const getTechnicianStats = () => {
    return mockTechnicians.map((tech) => {
      // Tính toán số liệu giả lập từ thông tin kỹ thuật viên
      const completed = Math.floor(Math.random() * 50) + 10;
      const pending = Math.floor(Math.random() * 10) + 1;
      const avgTime = Math.floor(Math.random() * 5) + 2;
      const efficiency = Math.floor(Math.random() * 20) + 80;

      return {
        id: tech.id,
        name: tech.name,
        completed,
        pending,
        avgTime,
        efficiency,
        status: tech.status,
        currentTask: tech.currentTask,
        assignedAreas: tech.assignedAreas.length,
      };
    });
  };

  // Tính toán thống kê linh kiện máy tính
  const getComputerComponentStats = () => {
    const components = [
      { category: "CPU", total: 120, faulty: 5, percentage: 4.2 },
      { category: "RAM", total: 240, faulty: 12, percentage: 5.0 },
      { category: "Ổ cứng", total: 180, faulty: 18, percentage: 10.0 },
      { category: "Mainboard", total: 120, faulty: 8, percentage: 6.7 },
      { category: "Nguồn", total: 130, faulty: 15, percentage: 11.5 },
      { category: "VGA", total: 80, faulty: 3, percentage: 3.8 },
      { category: "Màn hình", total: 150, faulty: 9, percentage: 6.0 },
      { category: "Bàn phím", total: 200, faulty: 25, percentage: 12.5 },
      { category: "Chuột", total: 220, faulty: 30, percentage: 13.6 },
    ];

    return components;
  };

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

  // Định nghĩa tabs items theo cú pháp mới của Ant Design
  const tabItems = [
    {
      key: "overview",
      label: "Tổng quan",
      children: (
        <div>
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
              <Card title="Chi tiết theo tầng - Tòa H">
                <Table
                  columns={columns}
                  dataSource={getSortedData(detailedTableData)}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Hoạt động gần đây - Khoa CNTT">
                <Timeline
                  items={activityTimelineData.map((activity, index) => ({
                    key: index,
                    color: activity.color,
                    children: (
                      <div>
                        <p className="text-sm">
                          {activity.time} - {activity.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {activity.timeAgo}
                        </p>
                      </div>
                    ),
                  }))}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "trends",
      label: "Xu hướng",
      children: (
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
      ),
    },
    {
      key: "performance",
      label: "Hiệu suất",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Hiệu suất theo tầng - Tòa H">
                {detailedTableData.map((dept, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <Text>{dept.department}</Text>
                      <Text strong>{dept.efficiency.toFixed(1)}%</Text>
                    </div>
                    <Progress
                      percent={dept.efficiency}
                      status={
                        dept.efficiency >= 95
                          ? "success"
                          : dept.efficiency >= 90
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
                <div className="space-y-4">
                  {getTechnicianStats().map((tech, index) => {
                    const statusColor =
                      tech.status === "active"
                        ? "green"
                        : tech.status === "busy"
                        ? "orange"
                        : tech.status === "offline"
                        ? "red"
                        : "default";

                    return (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Text strong>{tech.name}</Text>
                            <Tag color={statusColor}>
                              {tech.status === "active"
                                ? "Hoạt động"
                                : tech.status === "busy"
                                ? "Bận"
                                : tech.status === "offline"
                                ? "Nghỉ"
                                : tech.status}
                            </Tag>
                          </div>
                          <Tag color="blue">{tech.efficiency.toFixed(1)}%</Tag>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                          <div>Hoàn thành: {tech.completed}</div>
                          <div>Đang xử lý: {tech.pending}</div>
                          <div>TB: {tech.avgTime} ngày</div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div>Phụ trách: {tech.assignedAreas} khu vực</div>
                          {tech.currentTask && (
                            <div>Nhiệm vụ hiện tại: {tech.currentTask}</div>
                          )}
                        </div>
                        <Progress
                          percent={tech.efficiency}
                          size="small"
                          status={
                            tech.efficiency >= 95
                              ? "success"
                              : tech.efficiency >= 90
                              ? "normal"
                              : "exception"
                          }
                          showInfo={false}
                          className="mt-2"
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24}>
              <Card title="Thống kê linh kiện máy tính - Khoa CNTT">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {getComputerComponentStats().map((component, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        {component.category}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 my-2">
                        {component.total}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Lỗi:{" "}
                        <span className="font-semibold text-red-600">
                          {component.faulty}
                        </span>{" "}
                        ({component.percentage}%)
                      </div>
                      <div className="text-sm text-green-600 mb-3">
                        Hoạt động tốt: {component.total - component.faulty}
                      </div>
                      <Progress
                        percent={100 - component.percentage}
                        size="small"
                        status={
                          component.percentage <= 5
                            ? "success"
                            : component.percentage <= 10
                            ? "normal"
                            : "exception"
                        }
                        showInfo={false}
                        strokeColor={
                          component.percentage <= 5
                            ? "#52c41a"
                            : component.percentage <= 10
                            ? "#faad14"
                            : "#ff4d4f"
                        }
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Tỷ lệ hoạt động tốt:{" "}
                        {(100 - component.percentage).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "error-types",
      label: "Thống kê loại lỗi",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Phân bố loại lỗi - Khoa CNTT">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={errorTypeStatsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value">
                      {errorTypeStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} trường hợp`, "Số lượng"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Top 5 loại lỗi thường gặp">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={errorTypeStatsData.slice(0, 5)}
                    layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip
                      formatter={(value) => [`${value} trường hợp`, "Số lượng"]}
                    />
                    <Bar dataKey="value" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24}>
              <Card title="Chi tiết thống kê theo loại lỗi">
                <Table
                  columns={[
                    {
                      title: renderErrorSortTitle("Mã lỗi", "key"),
                      dataIndex: "key",
                      key: "key",
                      render: (text: string) => (
                        <Tag color="purple">{text}</Tag>
                      ),
                    },
                    {
                      title: renderErrorSortTitle("Loại lỗi", "errorType"),
                      dataIndex: "errorType",
                      key: "errorType",
                      width: 200,
                    },
                    {
                      title: renderErrorSortTitle("Số lượng", "count"),
                      dataIndex: "count",
                      key: "count",
                      render: (count: number) => <Text strong>{count}</Text>,
                    },
                    {
                      title: renderErrorSortTitle("Tỷ lệ", "percentage"),
                      dataIndex: "percentage",
                      key: "percentage",
                      render: (percentage: number) => (
                        <div>
                          <Progress percent={percentage} size="small" />
                          <span style={{ marginLeft: 8 }}>{percentage}%</span>
                        </div>
                      ),
                    },
                    {
                      title: renderErrorSortTitle(
                        "Thời gian sửa TB",
                        "avgRepairTime"
                      ),
                      dataIndex: "avgRepairTime",
                      key: "avgRepairTime",
                    },
                    {
                      title: renderErrorSortTitle("Độ khó", "difficulty"),
                      dataIndex: "difficulty",
                      key: "difficulty",
                      render: (difficulty: string) => {
                        const difficultyColors = {
                          "Rất dễ": "green",
                          Dễ: "lime",
                          "Trung bình": "orange",
                          Khó: "red",
                          "Rất khó": "magenta",
                          Khác: "default",
                        };
                        return (
                          <Tag
                            color={
                              difficultyColors[
                                difficulty as keyof typeof difficultyColors
                              ]
                            }>
                            {difficulty}
                          </Tag>
                        );
                      },
                    },
                    {
                      title: "Nguyên nhân chính",
                      dataIndex: "commonCauses",
                      key: "commonCauses",
                      render: (causes: string[]) => (
                        <div>
                          {causes.slice(0, 2).map((cause, index) => (
                            <Tag key={index}>{cause}</Tag>
                          ))}
                          {causes.length > 2 && <span>...</span>}
                        </div>
                      ),
                    },
                  ]}
                  dataSource={getSortedErrorData(detailedErrorStats)}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} loại lỗi`,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "detailed",
      label: "Báo cáo chi tiết",
      children: (
        <Card>
          <Table
            columns={columns}
            dataSource={getSortedData(detailedTableData)}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            }}
            size="small"
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2">
          Thống kê báo cáo - Khoa CNTT
        </Title>
        <Text type="secondary">
          Thống kê các báo lỗi thiết bị trong các tầng tòa H - Khoa Công nghệ
          Thông tin
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
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  );
};

export default StatsReportsPage;
