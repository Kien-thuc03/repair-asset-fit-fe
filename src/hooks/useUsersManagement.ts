import { useState, useEffect, useCallback } from 'react';
import { 
  IUserWithRoles, 
  ICreateUserRequest, 
  IUpdateUserRequest, 
  UserStatus,
  PaginatedResponse 
} from '@/types';
import { 
  mockUsersManagement, 
  createUser, 
  updateUser, 
  toggleUserStatus, 
  deleteUser,
  searchUsers,
  getUsersStats,
  mockUnits,
  mockRoles
} from '@/lib/mockData/usersManagement';

export interface UseUsersManagementOptions {
  initialPage?: number;
  initialLimit?: number;
  unitId?: string;
  roleCode?: string;
}

export interface UsersFilters {
  search: string;
  unitId: string;
  roleCode: string;
  status: UserStatus | 'all';
}

export const useUsersManagement = (options: UseUsersManagementOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    unitId: initialUnitId = '',
    roleCode: initialRoleCode = ''
  } = options;

  // State
  const [users, setUsers] = useState<IUserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  
  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    unitId: initialUnitId,
    roleCode: initialRoleCode,
    status: 'all'
  });

  // Computed values
  const stats = getUsersStats();
  const units = mockUnits;
  const roles = mockRoles;

  /**
   * Lọc và phân trang users
   */
  const getFilteredUsers = useCallback((): PaginatedResponse<IUserWithRoles> => {
    let filteredUsers = [...mockUsersManagement];

    // Apply search filter
    if (filters.search) {
      filteredUsers = searchUsers(filters.search);
    }

    // Apply unit filter
    if (filters.unitId) {
      filteredUsers = filteredUsers.filter(user => user.unitId === filters.unitId);
    }

    // Apply role filter
    if (filters.roleCode) {
      filteredUsers = filteredUsers.filter(user => 
        user.roles.some(role => role.code === filters.roleCode)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    // Filter out deleted users
    filteredUsers = filteredUsers.filter(user => !user.deletedAt);

    // Pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages
    };
  }, [filters, page, limit]);

  /**
   * Tải danh sách users
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = getFilteredUsers();
      setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [getFilteredUsers]);

  /**
   * Tạo user mới
   */
  const handleCreateUser = async (userData: ICreateUserRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      createUser(userData);
      await fetchUsers();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật user
   */
  const handleUpdateUser = async (userId: string, updateData: IUpdateUserRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = updateUser(userId, updateData);
      if (!result) {
        throw new Error('Không tìm thấy người dùng');
      }
      
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Thay đổi trạng thái user (khóa/mở khóa)
   */
  const handleToggleUserStatus = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = toggleUserStatus(userId);
      if (!result) {
        throw new Error('Không tìm thấy người dùng');
      }
      
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thay đổi trạng thái user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa user
   */
  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = deleteUser(userId);
      if (!result) {
        throw new Error('Không tìm thấy người dùng');
      }
      
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật filters
   */
  const updateFilters = (newFilters: Partial<UsersFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  /**
   * Reset filters
   */
  const resetFilters = () => {
    setFilters({
      search: '',
      unitId: '',
      roleCode: '',
      status: 'all'
    });
    setPage(1);
  };

  /**
   * Thay đổi trang
   */
  const changePage = (newPage: number) => {
    const totalPages = Math.ceil(getFilteredUsers().total / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  /**
   * Thay đổi số items per page
   */
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page
  };

  // Effects
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const pagination = getFilteredUsers();

  return {
    // Data
    users,
    stats,
    units,
    roles,
    
    // State
    loading,
    error,
    filters,
    
    // Pagination
    page,
    limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    
    // Actions
    fetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    toggleUserStatus: handleToggleUserStatus,
    deleteUser: handleDeleteUser,
    
    // Filters & Pagination
    updateFilters,
    resetFilters,
    changePage,
    changeLimit,
    
    // Utils
    clearError: () => setError(null)
  };
};