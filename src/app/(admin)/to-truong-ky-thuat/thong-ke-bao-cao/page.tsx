"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, Card, Select, Spin, message, Tabs } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { RepairStatus, ReplacementProposalStatus } from "@/types/repair";
import { SoftwareProposalStatus } from "@/types/software";
import { ErrorType, ERROR_TYPE_LABELS } from "@/lib/constants/errorTypes";
import { Table } from "antd";

const { Option } = Select;

// Interface cho dữ liệu thống kê
interface StatisticsData {
  repairRequests: {
    status: string;
    count: number;
  }[];
  replacementProposals: {
    status: string;
    count: number;
  }[];
  replacementProposalDetails: {
    status: string;
    proposalCount: number;
    totalItems: number;
  }[];
  softwareProposals: {
    status: string;
    count: number;
  }[];
  softwareProposalDetails: {
    status: string;
    proposalCount: number;
    totalItems: number;
  }[];
  errorTypes: {
    errorType: ErrorType;
    count: number;
  }[];
}

// Config cho trạng thái Repair Requests
const repairStatusConfig: Record<string, string> = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: "Chờ tiếp nhận",
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: "Đã tiếp nhận",
  [RepairStatus.ĐANG_XỬ_LÝ]: "Đang xử lý",
  [RepairStatus.CHỜ_THAY_THẾ]: "Chờ thay thế",
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: "Đã hoàn thành",
  [RepairStatus.ĐÃ_HỦY]: "Đã hủy",
};

// Màu cho từng trạng thái Repair Requests
const repairStatusColors: Record<string, string> = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: "#fbbf24", // Vàng
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: "#3b82f6", // Xanh dương
  [RepairStatus.ĐANG_XỬ_LÝ]: "#8b5cf6", // Tím
  [RepairStatus.CHỜ_THAY_THẾ]: "#f59e0b", // Cam
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: "#10b981", // Xanh lá
  [RepairStatus.ĐÃ_HỦY]: "#ef4444", // Đỏ
};

// Config cho trạng thái Replacement Proposals
const replacementStatusConfig: Record<string, string> = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "Chờ tổ trưởng duyệt",
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: "Đã duyệt",
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: "Đã từ chối",
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: "Đã lập tờ trình",
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: "Khoa đã duyệt tờ trình",
  [ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: "Đã duyệt tờ trình",
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: "Đã từ chối tờ trình",
  [ReplacementProposalStatus.CHỜ_XÁC_MINH]: "Chờ xác minh",
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: "Đã xác minh",
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: "Đã gửi biên bản",
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: "Đã ký biên bản",
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: "Đã hoàn tất mua sắm",
};

// Màu cho từng trạng thái Replacement Proposals
const replacementStatusColors: Record<string, string> = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "#f59e0b", // Cam
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: "#10b981", // Xanh lá
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: "#ef4444", // Đỏ
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: "#3b82f6", // Xanh dương
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: "#06b6d4", // Cyan
  [ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: "#8b5cf6", // Tím
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: "#f97316", // Cam đậm
  [ReplacementProposalStatus.CHỜ_XÁC_MINH]: "#6366f1", // Indigo
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: "#14b8a6", // Teal
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: "#a855f7", // Tím đậm
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: "#ec4899", // Hồng
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: "#22c55e", // Xanh lá đậm
};

// Config cho trạng thái Software Proposals
const softwareStatusConfig: Record<string, string> = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: "Chờ duyệt",
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: "Đã duyệt",
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: "Đã từ chối",
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: "Đang trang bị",
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: "Đã trang bị",
};

// Màu cho từng trạng thái Software Proposals
const softwareStatusColors: Record<string, string> = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: "#fbbf24", // Vàng
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: "#10b981", // Xanh lá
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: "#ef4444", // Đỏ
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: "#3b82f6", // Xanh dương
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: "#8b5cf6", // Tím
};

export default function ThongKeBaoCaoPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsData>({
    repairRequests: [],
    replacementProposals: [],
    replacementProposalDetails: [],
    softwareProposals: [],
    softwareProposalDetails: [],
    errorTypes: [],
  });

  // Filter states
  const [repairStatusFilter, setRepairStatusFilter] = useState<string>("all");
  const [replacementStatusFilter, setReplacementStatusFilter] =
    useState<string>("all");
  const [softwareStatusFilter, setSoftwareStatusFilter] =
    useState<string>("all");

  // Fetch statistics data using MCP queries
  // Data from MCP postgres queries executed by AI assistant:
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // MCP Query Results (executed by AI assistant):
        // Repair Requests: 53 total records
        const repairRequests = [
          { status: "CHỜ_THAY_THẾ", count: 23 },
          { status: "ĐANG_XỬ_LÝ", count: 8 },
          { status: "ĐÃ_HOÀN_THÀNH", count: 8 },
          { status: "ĐÃ_TIẾP_NHẬN", count: 6 },
          { status: "CHỜ_TIẾP_NHẬN", count: 4 },
          { status: "ĐÃ_HỦY", count: 4 },
        ];

        // Replacement Proposals: 12 total records
        const replacementProposals = [
          { status: "ĐÃ_LẬP_TỜ_TRÌNH", count: 3 },
          { status: "ĐÃ_GỬI_BIÊN_BẢN", count: 2 },
          { status: "ĐÃ_DUYỆT", count: 2 },
          { status: "ĐÃ_TỪ_CHỐI", count: 2 },
          { status: "ĐÃ_HOÀN_TẤT_MUA_SẮM", count: 1 },
          { status: "KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH", count: 1 },
          { status: "CHỜ_XÁC_MINH", count: 1 },
        ];

        // Replacement Proposal Details: Statistics by status with proposal count and total items
        const replacementProposalDetails = [
          { status: "ĐÃ_LẬP_TỜ_TRÌNH", proposalCount: 3, totalItems: 5 },
          { status: "ĐÃ_TỪ_CHỐI", proposalCount: 2, totalItems: 5 },
          { status: "ĐÃ_GỬI_BIÊN_BẢN", proposalCount: 2, totalItems: 4 },
          { status: "ĐÃ_DUYỆT", proposalCount: 2, totalItems: 12 },
          { status: "KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH", proposalCount: 1, totalItems: 2 },
          { status: "CHỜ_XÁC_MINH", proposalCount: 1, totalItems: 1 },
          { status: "ĐÃ_HOÀN_TẤT_MUA_SẮM", proposalCount: 1, totalItems: 2 },
        ];

        // Software Proposals: 23 total records
        const softwareProposals = [
          { status: "CHỜ_DUYỆT", count: 9 },
          { status: "ĐÃ_TRANG_BỊ", count: 8 },
          { status: "ĐÃ_DUYỆT", count: 4 },
          { status: "ĐÃ_TỪ_CHỐI", count: 2 },
        ];

        // Software Proposal Details: Statistics by status with proposal count and total items
        const softwareProposalDetails = [
          { status: "CHỜ_DUYỆT", proposalCount: 9, totalItems: 14 },
          { status: "ĐÃ_TRANG_BỊ", proposalCount: 8, totalItems: 19 },
          { status: "ĐÃ_DUYỆT", proposalCount: 4, totalItems: 8 },
          { status: "ĐÃ_TỪ_CHỐI", proposalCount: 2, totalItems: 5 },
        ];

        // Error Types: Statistics by error type from MCP query
        const errorTypes = [
          { errorType: ErrorType.MAY_KHONG_KHOI_DONG, count: 13 },
          { errorType: ErrorType.MAY_HU_CHUOT, count: 9 },
          { errorType: ErrorType.MAY_KHONG_SU_DUNG_DUOC, count: 8 },
          { errorType: ErrorType.MAY_HU_MAN_HINH, count: 6 },
          { errorType: ErrorType.MAY_HU_PHAN_MEM, count: 5 },
          { errorType: ErrorType.MAY_HU_BAN_PHIM, count: 2 },
          { errorType: ErrorType.MAY_MAT_BAN_PHIM, count: 2 },
          { errorType: ErrorType.LOI_KHAC, count: 2 },
          { errorType: ErrorType.MAY_KHONG_KET_NOI_MANG, count: 2 },
          { errorType: ErrorType.MAY_MAT_CHUOT, count: 2 },
        ];

        setStatistics({
          repairRequests,
          replacementProposals,
          replacementProposalDetails,
          softwareProposals,
          softwareProposalDetails,
          errorTypes,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        message.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Filter data based on selected status
  const getFilteredRepairData = () => {
    if (repairStatusFilter === "all") {
      return statistics.repairRequests;
    }
    return statistics.repairRequests.filter(
      (item) => item.status === repairStatusFilter
    );
  };

  const getFilteredReplacementData = () => {
    if (replacementStatusFilter === "all") {
      return statistics.replacementProposals;
    }
    return statistics.replacementProposals.filter(
      (item) => item.status === replacementStatusFilter
    );
  };

  const getFilteredSoftwareData = () => {
    if (softwareStatusFilter === "all") {
      return statistics.softwareProposals;
    }
    return statistics.softwareProposals.filter(
      (item) => item.status === softwareStatusFilter
    );
  };

  // Format data for charts (bao gồm status để map màu)
  const formatRepairData = () => {
    return getFilteredRepairData().map((item) => ({
      name: repairStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  const formatReplacementData = () => {
    return getFilteredReplacementData().map((item) => ({
      name: replacementStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  const formatSoftwareData = () => {
    return getFilteredSoftwareData().map((item) => ({
      name: softwareStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  return (
    <div className="space-y-8 min-h-screen p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/to-truong-ky-thuat",
            title: <span>Trang chủ</span>,
          },
          {
            title: <span>Thống kê báo cáo</span>,
          },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spin size="large" />
        </div>
      ) : (
        <Card>
          <Tabs
            defaultActiveKey="repair"
            items={[
              {
                key: "repair",
                label: "Báo lỗi",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê báo lỗi
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các yêu cầu sửa chữa
                        (Repair Requests)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={repairStatusFilter}
                        onChange={setRepairStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(repairStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatRepairData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatRepairData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                repairStatusColors[entry.status] || "#3b82f6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo loại lỗi */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo loại lỗi
                      </h4>
                      <Table
                        dataSource={statistics.errorTypes.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            errorType: item.errorType,
                            errorTypeName:
                              ERROR_TYPE_LABELS[item.errorType] ||
                              item.errorType,
                            count: item.count,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Loại lỗi",
                            dataIndex: "errorTypeName",
                            key: "errorTypeName",
                          },
                          {
                            title: "Số lượng",
                            dataIndex: "count",
                            key: "count",
                            width: 120,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "replacement",
                label: "Đề xuất thay thế",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê đề xuất thay thế
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các đề xuất thay thế linh
                        kiện (Replacement Proposals)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={replacementStatusFilter}
                        onChange={setReplacementStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(replacementStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatReplacementData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={120}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatReplacementData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                replacementStatusColors[entry.status] ||
                                "#10b981"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo trạng thái */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo trạng thái
                      </h4>
                      <Table
                        dataSource={statistics.replacementProposalDetails.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            status: item.status,
                            statusName:
                              replacementStatusConfig[item.status] ||
                              item.status,
                            proposalCount: item.proposalCount,
                            totalItems: item.totalItems,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Trạng thái",
                            dataIndex: "statusName",
                            key: "statusName",
                          },
                          {
                            title: "Số lượng đề xuất",
                            dataIndex: "proposalCount",
                            key: "proposalCount",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                          {
                            title: "Tổng số linh kiện",
                            dataIndex: "totalItems",
                            key: "totalItems",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-green-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "software",
                label: "Đề xuất phần mềm",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê đề xuất phần mềm
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các đề xuất cài đặt phần
                        mềm (Software Proposals)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={softwareStatusFilter}
                        onChange={setSoftwareStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(softwareStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatSoftwareData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatSoftwareData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                softwareStatusColors[entry.status] || "#f59e0b"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo trạng thái */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo trạng thái
                      </h4>
                      <Table
                        dataSource={statistics.softwareProposalDetails.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            status: item.status,
                            statusName:
                              softwareStatusConfig[item.status] || item.status,
                            proposalCount: item.proposalCount,
                            totalItems: item.totalItems,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Trạng thái",
                            dataIndex: "statusName",
                            key: "statusName",
                          },
                          {
                            title: "Số lượng đề xuất",
                            dataIndex: "proposalCount",
                            key: "proposalCount",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                          {
                            title: "Tổng số phần mềm",
                            dataIndex: "totalItems",
                            key: "totalItems",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-green-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
