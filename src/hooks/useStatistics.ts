import { useState, useMemo } from "react";
import {
  statsData,
  monthlyData,
  errorTypeStatsData,
  weeklyTrendData,
  detailedTableData,
  activityTimelineData,
  detailedErrorStats,
  technicianPerformanceData,
  equipmentStatsData,
} from "@/lib/mockData/statisticsData";
import { mockRepairRequests } from "@/lib/mockData/repairRequests";
import { RepairStatus } from "@/types";

/**
 * Hook để quản lý và tính toán các thống kê cho trang báo cáo
 * Kết hợp dữ liệu từ mockData với tính toán thực tế
 */
export const useStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Tính toán thống kê thực tế từ mockRepairRequests
  const realTimeStats = useMemo(() => {
    const totalReports = mockRepairRequests.length;
    const completedReports = mockRepairRequests.filter(
      (req) => req.status === RepairStatus.ĐÃ_HOÀN_THÀNH
    ).length;
    const pendingReports = mockRepairRequests.filter(
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
        ...statsData[0],
        value: realTimeStats.totalReports,
      },
      {
        ...statsData[1],
        value: realTimeStats.pendingReports,
      },
      {
        ...statsData[2],
        value: realTimeStats.completedReports,
      },
      {
        ...statsData[3],
        value: realTimeStats.completionRate,
      },
    ];
  }, [realTimeStats]);

  // Tính toán thống kê theo loại lỗi từ dữ liệu thực
  const errorTypeStatsFromReal = useMemo(() => {
    const errorCounts: Record<string, number> = {};

    mockRepairRequests.forEach((request) => {
      if (request.errorTypeId && request.errorTypeName) {
        errorCounts[request.errorTypeId] =
          (errorCounts[request.errorTypeId] || 0) + 1;
      }
    });

    return Object.entries(errorCounts).map(([errorTypeId, count]) => {
      const request = mockRepairRequests.find(
        (req) => req.errorTypeId === errorTypeId
      );
      const existingData = errorTypeStatsData.find(
        (data) => data.errorTypeId === errorTypeId
      );

      return {
        name: request?.errorTypeName || "Lỗi không xác định",
        value: count,
        color: existingData?.color || "#8c8c8c",
        errorTypeId,
      };
    });
  }, []);

  // Thống kê theo kỹ thuật viên từ dữ liệu thực
  const technicianStatsFromReal = useMemo(() => {
    const technicianWork: Record<
      string,
      { completed: number; pending: number; name: string }
    > = {};

    mockRepairRequests.forEach((request) => {
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
        avgTime: 1.5 + Math.random() * 2, // Giả lập thời gian trung bình
      };
    });
  }, []);

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
  };
};
