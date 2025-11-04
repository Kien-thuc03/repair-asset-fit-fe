import { useState, useEffect, useCallback } from "react";
import {
  getSoftwareProposals,
  getSoftwareProposalById,
  GetSoftwareProposalsQueryParams,
} from "@/lib/api/software-proposals";
import { SoftwareProposal } from "@/types/software";

/**
 * Custom hook để quản lý danh sách đề xuất phần mềm
 * @param initialParams Query parameters ban đầu
 * @returns Object chứa data, loading state, error, và các hàm quản lý
 */
export const useSoftwareProposals = (
  initialParams?: GetSoftwareProposalsQueryParams
) => {
  const [data, setData] = useState<SoftwareProposal[]>([]);
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
  const [params, setParams] = useState<
    GetSoftwareProposalsQueryParams | undefined
  >(initialParams);

  /**
   * Lấy danh sách đề xuất phần mềm
   */
  const fetchSoftwareProposals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSoftwareProposals(params);
      console.log("📊 Software Proposals API Response:", response);

      // Backend trả về flat structure: { data, total, page, limit, totalPages }
      // Data includes nested objects (proposer, approver, room, items)
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
          : "Có lỗi xảy ra khi lấy danh sách đề xuất phần mềm.";
      setError(errorMessage);
      console.error("Error fetching software proposals:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Cập nhật query parameters và tự động fetch lại
   */
  const updateParams = useCallback(
    (newParams: GetSoftwareProposalsQueryParams) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  /**
   * Refetch data với params hiện tại
   */
  const refetch = useCallback(() => {
    fetchSoftwareProposals();
  }, [fetchSoftwareProposals]);

  // Auto-fetch khi params thay đổi
  useEffect(() => {
    fetchSoftwareProposals();
  }, [fetchSoftwareProposals]);

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
 * Custom hook để quản lý chi tiết một đề xuất phần mềm
 * @param id ID của đề xuất phần mềm
 * @returns Object chứa data, loading state, error, và hàm refetch
 */
export const useSoftwareProposalDetail = (id: string) => {
  const [data, setData] = useState<SoftwareProposal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy chi tiết đề xuất phần mềm
   */
  const fetchSoftwareProposalDetail = useCallback(async () => {
    if (!id) {
      console.warn("⚠️ useSoftwareProposalDetail: No ID provided");
      return;
    }

    console.log("🔍 useSoftwareProposalDetail: Fetching detail for ID:", id);
    setLoading(true);
    setError(null);
    try {
      const response = await getSoftwareProposalById(id);
      console.log("✅ useSoftwareProposalDetail: Raw API Response:", response);

      // Backend returns nested objects (proposer, approver, room, items)
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy chi tiết đề xuất phần mềm.";
      setError(errorMessage);
      console.error(
        "❌ useSoftwareProposalDetail: Error fetching detail:",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Refetch chi tiết
   */
  const refetch = useCallback(() => {
    fetchSoftwareProposalDetail();
  }, [fetchSoftwareProposalDetail]);

  useEffect(() => {
    fetchSoftwareProposalDetail();
  }, [fetchSoftwareProposalDetail]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
