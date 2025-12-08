import { useState, useMemo } from "react";
import { RepairStatus } from "@/types";
import { useRepairDashboardData } from "./useRepairDashboardData";

/**
 * Hook để quản lý và tính toán các thống kê cho trang báo cáo
 */
export const useStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { allRepairs, loading, error } = useRepairDashboardData();

  // Tính toán thống kê thực tế từ dữ liệu API
  const realTimeStats = useMemo(() => {
    const totalReports = allRepairs.length;
    const completedReports = allRepairs.filter(
      (req) => req.status === RepairStatus.ĐÃ_HOÀN_THÀNH
    ).length;
    const pendingReports = allRepairs.filter(
      (req) =>
        req.status === RepairStatus.ĐANG_XỬ_LÝ ||
        req.status === RepairStatus.CHỜ_TIẾP_NHẬN ||
        req.status === RepairStatus.ĐÃ_TIẾP_NHẬN
    ).length;
    const completionRate =
      totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

    return {
      totalReports,
      completedReports,
      pendingReports,
      completionRate: Number(completionRate.toFixed(1)),
    };
  }, []);

  // Cập nhật statsData với dữ liệu thực tế
  const updatedStatsData = useMemo(() => {
    return [
      {
        label: "Tổng yêu cầu",
        value: realTimeStats.totalReports,
        trend: "",
      },
      {
        label: "Đang xử lý",
        value: realTimeStats.pendingReports,
        trend: "",
      },
      {
        label: "Đã hoàn thành",
        value: realTimeStats.completedReports,
        trend: "",
      },
      {
        label: "Tỷ lệ hoàn thành",
        value: realTimeStats.completionRate,
        trend: "",
      },
    ];
  }, [realTimeStats]);

  // Tính toán thống kê theo loại lỗi từ dữ liệu thực
  const errorTypeStatsFromReal = useMemo(() => {
    const errorCounts: Record<string, number> = {};

    allRepairs.forEach((request) => {
      if (request.errorType && request.errorTypeName) {
        errorCounts[request.errorType] =
          (errorCounts[request.errorType] || 0) + 1;
      }
    });

    return Object.entries(errorCounts).map(([errorTypeId, count]) => {
      const request = allRepairs.find((req) => req.errorType === errorTypeId);
      return {
        name: request?.errorTypeName || "Lỗi không xác định",
        value: count,
        errorTypeId,
      };
    });
  }, [allRepairs]);

  // Thống kê theo kỹ thuật viên từ dữ liệu thực
  const technicianStatsFromReal = useMemo(() => {
    const technicianWork: Record<
      string,
      { completed: number; pending: number; name: string }
    > = {};

    allRepairs.forEach((request) => {
      if (request.assignedTechnicianId && request.assignedTechnicianName) {
        const techId = request.assignedTechnicianId;
        if (!technicianWork[techId]) {
          technicianWork[techId] = {
            completed: 0,
            pending: 0,
            name: request.assignedTechnicianName,
          };
        }

        if (request.status === RepairStatus.ĐÃ_HOÀN_THÀNH) {
          technicianWork[techId].completed++;
        } else if (
          request.status === RepairStatus.ĐANG_XỬ_LÝ ||
          request.status === RepairStatus.ĐÃ_TIẾP_NHẬN
        ) {
          technicianWork[techId].pending++;
        }
      }
    });

    return Object.entries(technicianWork).map(([id, stats]) => {
      const total = stats.completed + stats.pending;
      const efficiency = total > 0 ? (stats.completed / total) * 100 : 0;

      return {
        id,
        name: stats.name,
        completed: stats.completed,
        pending: stats.pending,
        efficiency: Number(efficiency.toFixed(1)),
        avgTime: 0,
      };
    });
  }, [allRepairs]);

  // Lọc dữ liệu theo khoảng thời gian
  const filterDataByPeriod = (
    data: Record<string, unknown>[],
    field: string = "createdAt"
  ) => {
    if (!dateRange) return data;

    const [start, end] = dateRange;
    return data.filter((item) => {
      const itemDate = new Date(item[field] as string);
      return itemDate >= new Date(start) && itemDate <= new Date(end);
    });
  };

  return {
    // State management
    selectedPeriod,
    setSelectedPeriod,
    dateRange,
    setDateRange,

    // Static data from mockData
    monthlyData,
    errorTypeStatsData,
    weeklyTrendData,
    detailedTableData,
    activityTimelineData,
    detailedErrorStats,
    technicianPerformanceData,
    equipmentStatsData,

    // Real-time calculated data
    realTimeStats,
    updatedStatsData,
    errorTypeStatsFromReal,
    technicianStatsFromReal,

    // Utility functions
    filterDataByPeriod,
    loading,
    error,
  };
};
