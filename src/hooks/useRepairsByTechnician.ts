import { useState, useEffect, useCallback } from 'react';
import { getRepairsByTechnician } from '@/lib/api/repairs';
import { mapApiResponsesToRepairRequests } from '@/lib/utils/repairMapper';
import { RepairRequest } from '@/types/repair';

/**
 * Custom hook để lấy danh sách yêu cầu sửa chữa theo kỹ thuật viên
 * @param technicianId ID của kỹ thuật viên
 * @returns Object chứa repairs, loading, error, và refetch function
 */
export const useRepairsByTechnician = (technicianId?: string) => {
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairs = useCallback(async (id?: string) => {
    if (!id && !technicianId) {
      setError('Không có ID kỹ thuật viên');
      return;
    }

    const targetId = id || technicianId;
    if (!targetId) return;

    try {
      setLoading(true);
      setError(null);
      const apiData = await getRepairsByTechnician(targetId);
      
      // Map API response sang format của frontend
      const mappedData = mapApiResponsesToRepairRequests(apiData);
      setRepairs(mappedData);
      
      console.log('✅ Fetched and mapped repairs:', mappedData.length, 'items');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tải danh sách yêu cầu sửa chữa';
      setError(message);
      console.error('❌ Error fetching repairs by technician:', err);
    } finally {
      setLoading(false);
    }
  }, [technicianId]);

  useEffect(() => {
    if (technicianId) {
      fetchRepairs(technicianId);
    }
  }, [technicianId, fetchRepairs]);

  return {
    repairs,
    loading,
    error,
    refetch: fetchRepairs,
  };
};
