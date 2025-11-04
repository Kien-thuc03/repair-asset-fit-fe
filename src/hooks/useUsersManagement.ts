import { useState, useEffect, useCallback } from 'react';
import {
  IUserWithRoles,
  ICreateUserRequest,
  IUpdateUserRequest,
  UserStatus,
  GetUsersQueryParams,
} from '@/types/user';
import {
  getUsers,
  getUserById,
  createUser as createUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from '@/lib/api/users';

export interface UseUsersManagementOptions {
  initialPage?: number;
  initialLimit?: number;
  unitId?: string;
  roleId?: string;
  userId?: string; // For fetching single user detail
}

export interface UsersFilters {
  search: string;
  campusId: string;
  unitId: string;
  roleId: string;
  status: UserStatus | 'all';
}

export const useUsersManagement = (options: UseUsersManagementOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    unitId: initialUnitId = '',
    roleId: initialRoleId = '',
    userId,
  } = options;

  // State
  const [users, setUsers] = useState<IUserWithRoles[]>([]);
  const [currentUser, setCurrentUser] = useState<IUserWithRoles | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    campusId: '',
    unitId: initialUnitId,
    roleId: initialRoleId,
    status: 'all',
  });

  /**
   * Tải danh sách users từ API
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: GetUsersQueryParams = {
        page,
        limit,
        search: filters.search || undefined,
        campusId: filters.campusId || undefined,
        unitId: filters.unitId || undefined,
        roleId: filters.roleId || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      const response = await getUsers(params);
      setUsers(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  /**
   * Tải thông tin chi tiết 1 user từ API
   */
  const fetchUserDetail = useCallback(async (id: string) => {
    if (!id) {
      setCurrentUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await getUserById(id);
      setCurrentUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra khi tải thông tin người dùng';
      setError(errorMessage);
      console.error('Error fetching user detail:', err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo user mới
   */
  const handleCreateUser = async (
    userData: ICreateUserRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await createUserApi(userData);
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo user';
      setError(errorMessage);
      console.error('Error creating user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật user
   */
  const handleUpdateUser = async (
    userId: string,
    updateData: IUpdateUserRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await updateUserApi(userId, updateData);
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật user';
      setError(errorMessage);
      console.error('Error updating user:', err);
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
      // Tìm user hiện tại
      const currentUser = users.find((u) => u.id === userId);
      if (!currentUser) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Toggle status
      const newStatus: UserStatus =
        currentUser.status === UserStatus.ACTIVE
          ? UserStatus.INACTIVE
          : UserStatus.ACTIVE;

      await updateUserApi(userId, { status: newStatus });
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra khi thay đổi trạng thái user';
      setError(errorMessage);
      console.error('Error toggling user status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa user
   */
  const handleDeleteUser = async (
    userId: string,
    hardDelete = false
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteUserApi(userId, hardDelete);
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa user';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Import bulk users từ Excel
   */
  const handleBulkImport = async (
    usersData: ICreateUserRequest[]
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Create users one by one
      // TODO: Implement batch API endpoint for better performance
      for (const userData of usersData) {
        await createUserApi(userData);
      }

      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi import users';
      setError(errorMessage);
      console.error('Error importing users:', err);
      throw err; // Re-throw to handle in component
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
      campusId: '',
      unitId: '',
      roleId: '',
      status: 'all',
    });
    setPage(1);
  };

  /**
   * Thay đổi trang
   */
  const changePage = (newPage: number) => {
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
    if (userId) {
      // Nếu có userId, fetch user detail
      fetchUserDetail(userId);
    } else {
      // Nếu không có userId, fetch danh sách users
      fetchUsers();
    }
  }, [userId, fetchUsers, fetchUserDetail]);

  return {
    // Data
    users,
    currentUser, // Chi tiết người dùng hiện tại (khi có userId)

    // State
    loading,
    error,
    filters,

    // Pagination
    page,
    limit,
    total,
    totalPages,

    // Actions
    fetchUsers,
    fetchUserDetail, // Thêm function để fetch user detail
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    toggleUserStatus: handleToggleUserStatus,
    deleteUser: handleDeleteUser,
    bulkImport: handleBulkImport,

    // Filters & Pagination
    updateFilters,
    resetFilters,
    changePage,
    changeLimit,

    // Utils
    clearError: () => setError(null),
  };
};