import { useState, useEffect, useCallback } from 'react';
import { getUnitsApi, UnitResponseDto } from '@/lib/api/units';

/**
 * Custom hook để fetch danh sách units
 * @returns {object} - { units, loading, error, refetch }
 */
export const useUnits = () => {
  const [units, setUnits] = useState<UnitResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnitsApi();
      setUnits(data);
    } catch (err : unknown) {
      const errorMessage = (err instanceof Error) ? err.message : 'Không thể tải danh sách đơn vị';
      setError(errorMessage);
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return {
    units,
    loading,
    error,
    refetch: fetchUnits,
  };
};
