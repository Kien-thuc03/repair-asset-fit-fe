import { useState, useEffect, useCallback } from "react";
import {
  getReplacementProposals,
  getReplacementProposalById,
  createReplacementProposal,
  updateReplacementProposalStatus,
  getReplacementProposalsByProposer,
  ReplacementProposal,
  GetReplacementProposalsQueryParams,
  CreateReplacementProposalRequest,
  UpdateReplacementProposalStatusRequest,
  GetReplacementProposalsResponse,
} from "@/lib/api/replacement-proposals";

/**
 * Hook để lấy danh sách đề xuất thay thế
 */
export const useReplacementProposals = (
  params?: GetReplacementProposalsQueryParams
) => {
  const [data, setData] = useState<GetReplacementProposalsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stringify params để so sánh chính xác
  const paramsString = JSON.stringify(params);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReplacementProposals(params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error fetching replacement proposals:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]); // Use stringified params to avoid unnecessary re-renders

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    data,
    loading,
    error,
    refetch: fetchProposals,
  };
};

/**
 * Hook để lấy chi tiết một đề xuất
 */
export const useReplacementProposal = (id: string | null) => {
  const [data, setData] = useState<ReplacementProposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getReplacementProposalById(id);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error fetching replacement proposal:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    data,
    loading,
    error,
    refetch: fetchProposal,
  };
};

/**
 * Hook để tạo đề xuất thay thế mới
 */
export const useCreateReplacementProposal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProposal = async (data: CreateReplacementProposalRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createReplacementProposal(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      setError(errorMessage);
      console.error("Error creating replacement proposal:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProposal,
    loading,
    error,
  };
};

/**
 * Hook để cập nhật trạng thái đề xuất
 */
export const useUpdateReplacementProposalStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    id: string,
    data: UpdateReplacementProposalStatusRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateReplacementProposalStatus(id, data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      setError(errorMessage);
      console.error("Error updating replacement proposal status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    loading,
    error,
  };
};

/**
 * Hook để lấy danh sách đề xuất theo người đề xuất
 */
export const useReplacementProposalsByProposer = (
  proposerId: string | null
) => {
  const [data, setData] = useState<ReplacementProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    if (!proposerId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getReplacementProposalsByProposer(proposerId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error fetching replacement proposals by proposer:", err);
    } finally {
      setLoading(false);
    }
  }, [proposerId]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    data,
    loading,
    error,
    refetch: fetchProposals,
  };
};
