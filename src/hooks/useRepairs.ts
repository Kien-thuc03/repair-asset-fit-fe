import { useState, useEffect, useCallback } from "react";
import {
  getRepairs,
  getRepairById,
  GetRepairsQueryParams,
} from "@/lib/api/repairs";
import { RepairRequest, RepairRequestWithDetails } from "@/types/repair";

/**
 * Transform backend response to include computed fields for backward compatibility
 */
const transformRepairRequest = (request: RepairRequest): RepairRequest => {
  return {
    ...request,
    // Computed fields from nested objects
    assetCode: request.computerAsset?.ktCode,
    assetName: request.computerAsset?.name,
    roomName: request.room?.name,
    buildingName: request.room?.building,
    reporterName: request.reporter?.fullName,
    assignedTechnicianName: request.assignedTechnician?.fullName,
    errorTypeName: request.errorType,
  };
};

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

      // Backend trả về flat structure: { data, total, page, limit, totalPages }
      // Transform data to include computed fields
      const transformedData = response.data.map(transformRepairRequest);

      setData(transformedData);
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
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getRepairById(id);
      setData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy chi tiết yêu cầu sửa chữa.";
      setError(errorMessage);
      console.error("Error fetching repair detail:", err);
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
