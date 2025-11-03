import { useState, useEffect, useCallback } from 'react';
import { getRolesApi, RoleResponseDto } from '@/lib/api/roles';

/**
 * Custom hook để fetch danh sách roles
 * @returns {object} - { roles, loading, error, refetch }
 */
export const useRoles = () => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRolesApi();
      setRoles(data);
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error) ? err.message : 'Không thể tải danh sách vai trò';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
};
