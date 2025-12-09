import { useCallback, useEffect, useMemo, useState } from "react";
import { getRepairs, GetRepairsQueryParams } from "@/lib/api/repairs";
import { RepairRequest, RepairStatus } from "@/types";
import { getErrorTypeLabel } from "@/lib/constants/errorTypes";

type StatusCounts = {
  waiting: number;
  inProgress: number;
  waitingReplacement: number;
};

export type AssetFailureStat = {
  assetId: string;
  ktCode: string;
  assetName: string;
  totalIssues: number;
  completedIssues: number;
  successRate: number;
  lastIssueDate?: string;
  commonIssues: string[];
};

export type RepairHistoryStat = {
  total: number;
  completed: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
  avgProcessingTimeHours: number;
};

/**
 * Fetch all repair requests across pages for dashboard aggregations.
 * Falls back gracefully if pagination metadata is missing.
 */
const fetchAllRepairs = async (
  baseParams: Partial<GetRepairsQueryParams> = {}
): Promise<RepairRequest[]> => {
  const pageSize = 100;
  let page = 1;
  let results: RepairRequest[] = [];
  let totalPages = 1;

  do {
    const response = await getRepairs({
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "DESC",
      ...baseParams,
    });

    results = results.concat(response.data);
    totalPages = response.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return results;
};

export const useRepairDashboardData = () => {
  const [recentRequests, setRecentRequests] = useState<RepairRequest[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    waiting: 0,
    inProgress: 0,
    waitingReplacement: 0,
  });
  const [allRepairs, setAllRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [recentRes, waitingRes, inProgressRes, waitingReplacementRes, fullList] =
        await Promise.all([
          getRepairs({
            page: 1,
            limit: 4,
            sortBy: "createdAt",
            sortOrder: "DESC",
          }),
          getRepairs({
            page: 1,
            limit: 1,
            status: RepairStatus.CHỜ_TIẾP_NHẬN,
          }),
          getRepairs({
            page: 1,
            limit: 1,
            status: RepairStatus.ĐANG_XỬ_LÝ,
          }),
          getRepairs({
            page: 1,
            limit: 1,
            status: RepairStatus.CHỜ_THAY_THẾ,
          }),
          fetchAllRepairs(),
        ]);

      setRecentRequests(recentRes.data);
      setStatusCounts({
        waiting: waitingRes.total ?? waitingRes.data.length,
        inProgress: inProgressRes.total ?? inProgressRes.data.length,
        waitingReplacement: waitingReplacementRes.total ?? waitingReplacementRes.data.length,
      });
      setAllRepairs(fullList);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Không thể tải dữ liệu dashboard.";
      setError(msg);
      console.error("❌ useRepairDashboardData error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const assetStats: AssetFailureStat[] = useMemo(() => {
    if (!allRepairs.length) return [];

    const byAsset = allRepairs.reduce<Record<string, AssetFailureStat>>(
      (acc, repair) => {
        const assetId = repair.computerAssetId || repair.computerAsset?.id;
        if (!assetId) return acc;

        const key = assetId;
        if (!acc[key]) {
          acc[key] = {
            assetId: key,
            ktCode: repair.ktCode || repair.computerAsset?.ktCode || "N/A",
            assetName: repair.assetName || repair.computerAsset?.name || "Chưa xác định",
            totalIssues: 0,
            completedIssues: 0,
            successRate: 0,
            lastIssueDate: repair.createdAt,
            commonIssues: [],
          };
        }

        acc[key].totalIssues += 1;
        if (repair.status === RepairStatus.ĐÃ_HOÀN_THÀNH) {
          acc[key].completedIssues += 1;
        }
        // Track latest issue date
        if (
          repair.createdAt &&
          acc[key].lastIssueDate &&
          new Date(repair.createdAt) > new Date(acc[key].lastIssueDate)
        ) {
          acc[key].lastIssueDate = repair.createdAt;
        }

        const errorLabel = getErrorTypeLabel(repair.errorType);
        if (errorLabel) {
          acc[key].commonIssues.push(errorLabel);
        }

        return acc;
      },
      {}
    );

    return Object.values(byAsset)
      .map((stat) => {
        const successRate =
          stat.totalIssues > 0
            ? Math.round((stat.completedIssues / stat.totalIssues) * 100)
            : 0;

        // Pick top 3 most common issues
        const issueCounts = stat.commonIssues.reduce<Record<string, number>>(
          (counts, issue) => {
            counts[issue] = (counts[issue] || 0) + 1;
            return counts;
          },
          {}
        );
        const topIssues = Object.entries(issueCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);

        return {
          ...stat,
          successRate,
          commonIssues: topIssues,
        };
      })
      .sort((a, b) => b.totalIssues - a.totalIssues)
      .slice(0, 5);
  }, [allRepairs]);

  const repairHistoryStats: RepairHistoryStat = useMemo(() => {
    if (!allRepairs.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
        completionRate: 0,
        avgProcessingTimeHours: 0,
      };
    }

    const completed = allRepairs.filter(
      (r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH
    );
    const inProgress = allRepairs.filter(
      (r) =>
        r.status === RepairStatus.ĐANG_XỬ_LÝ ||
        r.status === RepairStatus.ĐÃ_TIẾP_NHẬN ||
        r.status === RepairStatus.CHỜ_TIẾP_NHẬN
    );
    const cancelled = allRepairs.filter((r) => r.status === RepairStatus.ĐÃ_HỦY);

    const completionRate =
      allRepairs.length > 0
        ? Math.round((completed.length / allRepairs.length) * 1000) / 10
        : 0;

    const durations: number[] = completed
      .map((r) => {
        if (!r.createdAt || !r.completedAt) return null;
        const start = new Date(r.createdAt).getTime();
        const end = new Date(r.completedAt).getTime();
        if (isNaN(start) || isNaN(end) || end <= start) return null;
        return (end - start) / (1000 * 60 * 60); // hours
      })
      .filter((v): v is number => v !== null);

    const avgProcessingTimeHours =
      durations.length > 0
        ? Math.round(
            (durations.reduce((sum, val) => sum + val, 0) / durations.length) * 10
          ) / 10
        : 0;

    return {
      total: allRepairs.length,
      completed: completed.length,
      inProgress: inProgress.length,
      cancelled: cancelled.length,
      completionRate,
      avgProcessingTimeHours,
    };
  }, [allRepairs]);

  return {
    recentRequests,
    statusCounts,
    assetStats,
    repairHistoryStats,
    loading,
    error,
    refetch: fetchDashboardData,
    allRepairs,
  };
};

