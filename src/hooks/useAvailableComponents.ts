import { useState } from 'react';
import { 
  getAvailableComponents, 
  GetAvailableComponentsQueryParams,
  ComponentFromRepair 
} from '@/lib/api/replacement-proposals';

/**
 * Custom hook để lấy danh sách linh kiện khả dụng từ repair requests
 * Chỉ lấy các linh kiện từ các yêu cầu sửa chữa mà kỹ thuật viên hiện tại đảm nhận
 */
export const useAvailableComponents = () => {
  const [components, setComponents] = useState<ComponentFromRepair[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch danh sách linh kiện khả dụng
   */
  const fetchComponents = async (params?: GetAvailableComponentsQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAvailableComponents(params);
      
      setComponents(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách linh kiện';
      setError(message);
      console.error('❌ Fetch available components error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh danh sách
   */
  const refetch = (params?: GetAvailableComponentsQueryParams) => {
    return fetchComponents(params);
  };

  return {
    components,
    pagination,
    loading,
    error,
    fetchComponents,
    refetch,
  };
};
