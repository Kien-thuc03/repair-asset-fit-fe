import { apiClient } from '../api';

// Enums
export enum UnitType {
  CAMPUS = 'CAMPUS',
  USER_DEPT = 'USER_DEPT',
  ADMIN_DEPT = 'ADMIN_DEPT',
}

export enum UnitStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Response DTOs
export interface UnitResponseDto {
  id: string;
  name: string;
  unitCode: number;
  phone?: string;
  email?: string;
  type: UnitType;
  representativeId?: string;
  parentUnitId?: string;
  status: UnitStatus;
  representative?: unknown; // User response DTO
  parentUnit?: UnitResponseDto; // Parent unit information
  childUnits?: UnitResponseDto[]; // Nested child units
  users?: unknown[]; // User response DTOs
  rooms?: unknown[]; // Room response DTOs
  createdAt: Date;
  updatedAt?: Date;
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
