/**
 * Custom Hook: useComputers
 * Quản lý danh sách máy tính với filter và pagination
 */

import { useState, useCallback } from "react";
import { getComputers } from "@/lib/api/computers";
import type {
  Computer,
  GetComputersParams,
  ComputerPagination,
  ComputerSummary,
} from "@/types/computer";

interface UseComputersReturn {
  computers: Computer[];
  pagination: ComputerPagination | null;
  summary: ComputerSummary | null;
  loading: boolean;
  error: string | null;
  fetchComputers: (params?: GetComputersParams) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook để lấy danh sách máy tính từ API
 * 
 * @example
 * ```typescript
 * const { computers, loading, error, fetchComputers, pagination, summary } = useComputers();
 * 
 * useEffect(() => {
 *   fetchComputers({ page: 1, limit: 12 });
 * }, []);
 * 
 * // Filter
 * fetchComputers({ 
 *   search: "Dell", 
 *   status: ["IN_USE"],
 *   building: "H" 
 * });
 * ```
 */
export const useComputers = (): UseComputersReturn => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [pagination, setPagination] = useState<ComputerPagination | null>(null);
  const [summary, setSummary] = useState<ComputerSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<GetComputersParams | undefined>();

  /**
   * Fetch computers từ API
   */
  const fetchComputers = useCallback(async (params?: GetComputersParams) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(params);

      const response = await getComputers(params);

      if (response.success && response.data) {
        setComputers(response.data.computers);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
      } else {
        throw new Error(response.message || "Không thể lấy danh sách máy tính");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
      console.error("Error fetching computers:", err);
      
      // Set empty data on error
      setComputers([]);
      setPagination(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch with last params
   */
  const refetch = useCallback(async () => {
    await fetchComputers(lastParams);
  }, [fetchComputers, lastParams]);

  return {
    computers,
    pagination,
    summary,
    loading,
    error,
    fetchComputers,
    refetch,
  };
};

