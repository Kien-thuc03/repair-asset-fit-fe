import { apiClient } from '../api';

// Response DTOs
export interface RolePermissionDto {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface RoleResponseDto {
  id: string;
  name: string;
  code: string;
  permissions: RolePermissionDto[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all roles
 * @returns Promise<RoleResponseDto[]>
 */
export const getRolesApi = async (): Promise<RoleResponseDto[]> => {
  return await apiClient.get<RoleResponseDto[]>('api/v1/roles');
};

/**
 * Get role by ID
 * @param id - Role UUID
 * @returns Promise<RoleResponseDto>
 */
export const getRoleByIdApi = async (id: string): Promise<RoleResponseDto> => {
  return await apiClient.get<RoleResponseDto>(`/api/v1/roles/${id}`);
};
