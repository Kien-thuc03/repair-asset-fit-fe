import { apiClient } from '../api';

// Enums
export enum UnitType {
  CAMPUS = 'CAMPUS',
  FACULTY = 'FACULTY',
  DEPARTMENT = 'DEPARTMENT',
  ROOM = 'ROOM',
}

// Response DTOs
export interface UnitResponseDto {
  id: string;
  name: string;
  code: string;
  type: UnitType;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  childUnits?: UnitResponseDto[]; // Nested child units
}

/**
 * Get all units
 * @returns Promise<UnitResponseDto[]>
 */
export const getUnitsApi = async (): Promise<UnitResponseDto[]> => {
  return await apiClient.get<UnitResponseDto[]>('/api/v1/units');
};

/**
 * Get unit by ID
 * @param id - Unit UUID
 * @returns Promise<UnitResponseDto>
 */
export const getUnitByIdApi = async (id: string): Promise<UnitResponseDto> => {
  return await apiClient.get<UnitResponseDto>(`/api/v1/units/${id}`);
};

/**
 * Get units by type
 * @param type - Unit type (CAMPUS, FACULTY, DEPARTMENT, ROOM)
 * @returns Promise<UnitResponseDto[]>
 */
export const getUnitsByTypeApi = async (type: UnitType): Promise<UnitResponseDto[]> => {
  return await apiClient.get<UnitResponseDto[]>(`/api/v1/units/type/${type}`);
};

/**
 * Get Đại học Công nghiệp Thành phố Hồ Chí Minh unit
 * @param parentId - Parent unit UUID
 * @returns Promise<UnitResponseDto[]>
 */
export const getChildUnitsApi = async (parentId: string): Promise<UnitResponseDto[]> => {
  return await apiClient.get<UnitResponseDto[]>(`/api/v1/units/${parentId}/children`);
};
