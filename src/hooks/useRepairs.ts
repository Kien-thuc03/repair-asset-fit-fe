import { useState, useEffect, useCallback } from "react";
import {
  getRepairs,
  getRepairById,
  getRepairsByReporter,
  acceptRepair,
  updateRepairStatus,
  GetRepairsQueryParams,
} from "@/lib/api/repairs";
import { RepairRequest, RepairRequestWithDetails, RepairStatus } from "@/types/repair";

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
      
      return response as RepairRequestWithDetails;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy chi tiết yêu cầu sửa chữa.";
      setError(errorMessage);
      console.error("❌ useRepairDetail: Error fetching repair detail:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Refetch chi tiết
   */
  const refetch = useCallback(() => {
    return fetchRepairDetail();
  }, [fetchRepairDetail]);

  useEffect(() => {
    fetchRepairDetail();
  }, [fetchRepairDetail]);

  return {
    data,
    loading,
    error,
    refetch,
    setData, // Expose setData để component có thể update local state
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

/**
 * Custom hook để xử lý các actions cho yêu cầu sửa chữa
 * @param repairId ID của yêu cầu sửa chữa
 * @returns Object chứa các hàm actions và loading states
 */
export const useRepairActions = (repairId: string) => {
  const [accepting, setAccepting] = useState(false);
  const [updating, setUpdating] = useState(false);

  /**
   * Tiếp nhận yêu cầu sửa chữa
   */
  const accept = useCallback(async () => {
    setAccepting(true);
    try {
      const result = await acceptRepair(repairId);
      return result;
    } catch (err) {
      console.error("Error accepting repair:", err);
      throw err;
    } finally {
      setAccepting(false);
    }
  }, [repairId]);

  /**
   * Cập nhật trạng thái yêu cầu sửa chữa
   */
  const updateStatus = useCallback(
    async (status: RepairStatus, resolutionNotes?: string, componentIds?: string[]) => {
      setUpdating(true);
      try {
        const result = await updateRepairStatus(repairId, status, resolutionNotes, componentIds);
        return result;
      } catch (err) {
        console.error("Error updating repair status:", err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [repairId]
  );

  return {
    accept,
    updateStatus,
    accepting,
    updating,
    isLoading: accepting || updating,
  };
};

/**
 * Custom hook tổng hợp cho trang chi tiết yêu cầu sửa chữa
 * Kết hợp fetch detail và auto-accept
 * @param id ID của yêu cầu sửa chữa
 * @param autoAccept Tự động tiếp nhận nếu là CHỜ_TIẾP_NHẬN
 * @returns Object chứa data, actions, và states
 */
export const useRepairDetailPage = (id: string, autoAccept = true) => {
  const {
    data,
    loading: fetchLoading,
    error,
    refetch,
    setData,
  } = useRepairDetail(id);
  const { accept, updateStatus, accepting, updating } = useRepairActions(id);
  const [autoAccepting, setAutoAccepting] = useState(false);

  /**
   * Auto-accept khi vào trang nếu status là CHỜ_TIẾP_NHẬN
   */
  useEffect(() => {
    const handleAutoAccept = async () => {
      if (!data || !autoAccept || data.status !== RepairStatus.CHỜ_TIẾP_NHẬN) {
        return;
      }

      try {
        setAutoAccepting(true);
        const acceptedData = await accept();
        setData(acceptedData);
      } catch (err) {
        console.error("Auto accept error:", err);
        // Không throw error, giữ nguyên data gốc
      } finally {
        setAutoAccepting(false);
      }
    };

    handleAutoAccept();
  }, [data, autoAccept, accept, setData]);

  /**
   * Wrapper cho updateStatus để tự động update local state
   */
  const handleUpdateStatus = useCallback(
    async (status: RepairStatus, resolutionNotes?: string, componentIds?: string[]) => {
      try {
        const updatedData = await updateStatus(status, resolutionNotes, componentIds);
        setData(updatedData);
        return updatedData;
      } catch (err) {
        throw err;
      }
    },
    [updateStatus, setData]
  );

  return {
    data,
    loading: fetchLoading || autoAccepting,
    error,
    refetch,
    updateStatus: handleUpdateStatus,
    accepting,
    updating,
    isUpdating: accepting || updating || autoAccepting,
  };
};
