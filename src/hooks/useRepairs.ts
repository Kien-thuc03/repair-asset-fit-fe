import { useState, useEffect, useCallback } from "react";
import {
  getRepairs,
  getRepairById,
  getRepairsByReporter,
  GetRepairsQueryParams,
} from "@/lib/api/repairs";
import { RepairRequest, RepairRequestWithDetails } from "@/types/repair";

/**
 * Custom hook để quản lý danh sách yêu cầu sửa chữa
 * @param initialParams Query parameters ban đầu
 * @returns Object chứa data, loading state, error, và các hàm CRUD
 */
export const useRepairs = (initialParams?: GetRepairsQueryParams) => {
  const [data, setData] = useState<RepairRequest[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetRepairsQueryParams | undefined>(
    initialParams
  );

  /**
   * Lấy danh sách yêu cầu sửa chữa
   */
  const fetchRepairs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRepairs(params);
      console.log("📊 API Response:", response);

      // API đã transform data rồi, không cần transform lại
      setData(response.data);
      setMeta({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy danh sách yêu cầu sửa chữa.";
      setError(errorMessage);
      console.error("Error fetching repairs:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Cập nhật query parameters và tự động fetch lại
   */
  const updateParams = useCallback((newParams: GetRepairsQueryParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  /**
   * Refetch data với params hiện tại
   */
  const refetch = useCallback(() => {
    fetchRepairs();
  }, [fetchRepairs]);

  // Auto-fetch khi params thay đổi
  useEffect(() => {
    fetchRepairs();
  }, [fetchRepairs]);

  return {
    data,
    meta,
    loading,
    error,
    params,
    updateParams,
    refetch,
  };
};

/**
 * Custom hook để quản lý chi tiết một yêu cầu sửa chữa
 * @param id ID của yêu cầu sửa chữa
 * @returns Object chứa data, loading state, error, và hàm refetch
 */
export const useRepairDetail = (id: string) => {
  const [data, setData] = useState<RepairRequestWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy chi tiết yêu cầu sửa chữa
   */
  const fetchRepairDetail = useCallback(async () => {
    if (!id) {
      console.warn("⚠️ useRepairDetail: No ID provided");
      return;
    }

    console.log("🔍 useRepairDetail: Fetching detail for ID:", id);
    setLoading(true);
    setError(null);
    try {
      const response = await getRepairById(id);
      console.log("✅ useRepairDetail: Raw API Response:", response);

      // API đã transform data rồi
      setData(response as RepairRequestWithDetails);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy chi tiết yêu cầu sửa chữa.";
      setError(errorMessage);
      console.error("❌ useRepairDetail: Error fetching repair detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Refetch chi tiết
   */
  const refetch = useCallback(() => {
    fetchRepairDetail();
  }, [fetchRepairDetail]);

  useEffect(() => {
    fetchRepairDetail();
  }, [fetchRepairDetail]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook để lấy danh sách yêu cầu sửa chữa theo người báo lỗi
 * @param reporterId ID của người báo lỗi
 * @returns Object chứa data, loading state, error, và hàm refetch
 */
export const useRepairsByReporter = (reporterId: string | undefined) => {
  const [data, setData] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy danh sách yêu cầu sửa chữa theo người báo lỗi
   */
  const fetchRepairsByReporter = useCallback(async () => {
    if (!reporterId) {
      console.warn("⚠️ useRepairsByReporter: No reporterId provided");
      setData([]);
      return;
    }

    console.log(
      "🔍 useRepairsByReporter: Fetching repairs for reporterId:",
      reporterId
    );
    setLoading(true);
    setError(null);
    try {
      const response = await getRepairsByReporter(reporterId);
      console.log("✅ useRepairsByReporter: Raw API Response:", response);

      // API đã transform data rồi
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy danh sách yêu cầu sửa chữa.";
      setError(errorMessage);
      console.error("❌ useRepairsByReporter: Error fetching repairs:", err);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [reporterId]);

  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    fetchRepairsByReporter();
  }, [fetchRepairsByReporter]);

  useEffect(() => {
    fetchRepairsByReporter();
  }, [fetchRepairsByReporter]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
