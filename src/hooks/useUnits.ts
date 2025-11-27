import { useState, useEffect, useCallback } from 'react';
import { getUnitsApi, getUnitByIdApi, UnitResponseDto, UnitType } from '@/lib/api/units';

/**
 * Interface cho unit với display name đã xử lý
 */
export interface UnitWithDisplayName extends UnitResponseDto {
  displayName: string; // Tên hiển thị có thêm prefix cơ sở nếu trùng tên
}

/**
 * Custom hook để fetch danh sách units và campuses
 * - campuses: Danh sách tất cả các cơ sở (CAMPUS)
 * - units: Danh sách tất cả đơn vị (FACULTY và DEPARTMENT) với display name
 * @returns {object} - { units, campuses, loading, error, refetch }
 */
export const useUnits = () => {
  const [units, setUnits] = useState<UnitWithDisplayName[]>([]);
  const [campuses, setCampuses] = useState<UnitResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy tất cả units
      const allUnits = await getUnitsApi();
      console.log('All units from API:', allUnits);
      
      // Lọc campuses (các cơ sở)
      const campusList = allUnits.filter(unit => unit.type === UnitType.CAMPUS);
      console.log('Campuses:', campusList);
      setCampuses(campusList);
      
      // Lấy tất cả childUnits từ các campus
      const allChildUnits: UnitResponseDto[] = [];
      
      campusList.forEach(campus => {
        if (campus.childUnits && Array.isArray(campus.childUnits)) {
          allChildUnits.push(...campus.childUnits);
        }
      });
      
      console.log('All child units from campuses:', allChildUnits);

      // Đếm số lần xuất hiện của mỗi tên để phát hiện trùng
      const nameCount = new Map<string, number>();
      allChildUnits.forEach(unit => {
        const count = nameCount.get(unit.name) || 0;
        nameCount.set(unit.name, count + 1);
      });

      // Tạo display name cho mỗi unit
      const unitsWithDisplayName: UnitWithDisplayName[] = allChildUnits.map(unit => {
        let displayName = unit.name;

        // Nếu tên bị trùng, tìm campus cha để lấy acronym
        if ((nameCount.get(unit.name) || 0) > 1) {
          // Tìm campus cha của unit này
          const parentCampus = campusList.find(campus => 
            campus.childUnits?.some(child => child.id === unit.id)
          );

          if (parentCampus) {
            
            displayName = `${unit.name}`;
          }
        }

        return {
          ...unit,
          displayName,
        };
      });

      // Sắp xếp theo displayName
      unitsWithDisplayName.sort((a, b) => 
        a.displayName.localeCompare(b.displayName, 'vi')
      );

      console.log('Final units with display name:', unitsWithDisplayName);
      setUnits(unitsWithDisplayName);
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
    campuses,
    loading,
    error,
    refetch: fetchUnits,
    getUnitById: useCallback(async (id: string) => {
      try {
        return await getUnitByIdApi(id);
      } catch (err) {
        console.error('Error fetching unit by ID:', err);
        throw err;
      }
    }, []),
  };
};
