import { useState, useEffect, useCallback } from 'react';
import { getChildUnitsApi, getUnitsApi, UnitResponseDto, UnitType } from '@/lib/api/units';

/**
 * Custom hook để fetch danh sách units con của Đại học Công nghiệp TP.HCM
 * Tự động tìm campus IUH và lấy tất cả units con (FACULTY và DEPARTMENT)
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
      // Bước 1: Lấy tất cả units để tìm campus IUH
      const allUnits = await getUnitsApi();
      
      // Bước 2: Tìm campus "Đại học Công nghiệp Thành phố Hồ Chí Minh"
      const iuhCampus = allUnits.find(
        unit => 
          unit.type === UnitType.CAMPUS && 
          (unit.name.includes('Đại học Công nghiệp') || 
           unit.code === 'IUH' ||
           unit.name.includes('IUH'))
      );

      if (!iuhCampus) {
        // Nếu không tìm thấy campus, lọc các FACULTY và DEPARTMENT từ tất cả units
        const filteredUnits = allUnits.filter(
          unit => unit.type === UnitType.FACULTY || unit.type === UnitType.DEPARTMENT
        );
        setUnits(filteredUnits);
        return;
      }

      // Bước 3: Lấy tất cả units con của campus IUH
      const childUnits = await getChildUnitsApi(iuhCampus.id);
      
      // Lọc để chỉ lấy các units có type là FACULTY hoặc DEPARTMENT
      const filteredUnits = childUnits.filter(
        unit => unit.type === UnitType.FACULTY || unit.type === UnitType.DEPARTMENT
      );
      
      // Nếu không có units nào pass filter, thử lấy tất cả childUnits
      if (filteredUnits.length === 0) {
        setUnits(childUnits);
      } else {
        setUnits(filteredUnits);
      }
    } catch (err) {
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
