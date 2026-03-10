import React, { useMemo } from "react";
import { Card, Row, Col, Statistic, Progress, Tag, Typography, Spin, Empty } from "antd";
import { FileText, Users, CheckCircle, AlertCircle } from "lucide-react";
import { RepairStatus } from "@/types";
import { useUnits } from "@/hooks/useUnits";
import { useRepairDashboardData } from "@/hooks/useRepairDashboardData";

const { Text, Title } = Typography;

/**
 * Component hiển thị thống kê theo đơn vị
 * Dựa trên database schema: units table và RepairRequests table
 */
export const UnitStatistics = () => {
  const { units, loading: unitsLoading, error: unitsError } = useUnits();
  const { allRepairs, loading: repairsLoading, error: repairsError } = useRepairDashboardData();

  const unitStats = useMemo(() => {
    return units
      .filter((unit) => !unit.status || unit.status === "ACTIVE")
      .map((unit) => {
        const unitRequests = allRepairs.filter(
          (request) =>
            request.unit === unit.name ||
            request.room?.unit?.name === unit.name
        );

        const totalRequests = unitRequests.length;
        const completedRequests = unitRequests.filter(
          (req) => req.status === RepairStatus.ĐÃ_HOÀN_THÀNH
        ).length;
        const pendingRequests = unitRequests.filter(
          (req) =>
            req.status === RepairStatus.ĐANG_XỬ_LÝ ||
            req.status === RepairStatus.CHỜ_TIẾP_NHẬN ||
            req.status === RepairStatus.ĐÃ_TIẾP_NHẬN
        ).length;
        const cancelledRequests = unitRequests.filter(
          (req) => req.status === RepairStatus.ĐÃ_HỦY
        ).length;

        const completionRate =
          totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;

        return {
          id: unit.id,
          name: unit.name,
          type: unit.type,
          totalRequests,
          completedRequests,
          pendingRequests,
          cancelledRequests,
          completionRate: Number(completionRate.toFixed(1)),
          representative: unit.representativeId,
        };
      })
      .sort((a, b) => b.totalRequests - a.totalRequests);
  }, [units, allRepairs]);

  // Tính tổng thống kê
  const totalStats = unitStats.reduce(
    (acc, unit) => ({
      totalRequests: acc.totalRequests + unit.totalRequests,
      completedRequests: acc.completedRequests + unit.completedRequests,
      pendingRequests: acc.pendingRequests + unit.pendingRequests,
      cancelledRequests: acc.cancelledRequests + unit.cancelledRequests,
    }),
    {
      totalRequests: 0,
      completedRequests: 0,
      pendingRequests: 0,
      cancelledRequests: 0,
    }
  );

  const overallCompletionRate =
    totalStats.totalRequests > 0
      ? (totalStats.completedRequests / totalStats.totalRequests) * 100
      : 0;

  if (unitsLoading || repairsLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Spin />
      </div>
    );
  }

  if (unitsError || repairsError) {
    return (
      <Card>
        <Empty description={unitsError || repairsError || "Không thể tải dữ liệu"} />
      </Card>
    );
  }

  return (
    <div>
      <Title level={4} className="mb-4">
        Thống kê theo đơn vị
      </Title>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng yêu cầu"
              value={totalStats.totalRequests}
              prefix={<FileText className="w-4 h-4" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={totalStats.completedRequests}
              prefix={<CheckCircle className="w-4 h-4" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={totalStats.pendingRequests}
              prefix={<AlertCircle className="w-4 h-4" />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={overallCompletionRate}
              suffix="%"
              prefix={<Users className="w-4 h-4" />}
              valueStyle={{
                color:
                  overallCompletionRate >= 90
                    ? "#52c41a"
                    : overallCompletionRate >= 70
                    ? "#fa8c16"
                    : "#ff4d4f",
              }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Chi tiết theo từng đơn vị */}
      <Row gutter={[16, 16]}>
        {unitStats.map((unit) => (
          <Col xs={24} lg={12} xl={8} key={unit.id}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <Text strong>{unit.name}</Text>
                  <Tag
                    color={
                      unit.type === "đơn_vị_sử_dụng"
                        ? "blue"
                        : unit.type === "phòng_quản_trị"
                        ? "green"
                        : "orange"
                    }>
                    {unit.type === "đơn_vị_sử_dụng"
                      ? "Đơn vị sử dụng"
                      : unit.type === "phòng_quản_trị"
                      ? "Phòng quản trị"
                      : "Phòng kế hoạch"}
                  </Tag>
                </div>
              }
              size="small">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Text type="secondary">Tổng yêu cầu:</Text>
                    <div className="text-lg font-semibold text-blue-600">
                      {unit.totalRequests}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Hoàn thành:</Text>
                    <div className="text-lg font-semibold text-green-600">
                      {unit.completedRequests}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Text type="secondary">Đang xử lý:</Text>
                    <div className="text-lg font-semibold text-orange-600">
                      {unit.pendingRequests}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Đã hủy:</Text>
                    <div className="text-lg font-semibold text-red-600">
                      {unit.cancelledRequests}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Text type="secondary">Tỷ lệ hoàn thành:</Text>
                    <Text strong>{unit.completionRate}%</Text>
                  </div>
                  <Progress
                    percent={unit.completionRate}
                    size="small"
                    status={
                      unit.completionRate >= 95
                        ? "success"
                        : unit.completionRate >= 85
                        ? "normal"
                        : "exception"
                    }
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
