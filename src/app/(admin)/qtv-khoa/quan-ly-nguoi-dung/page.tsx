'use client';

import { useState } from 'react';
import { UserPlus, Search, Filter, Users as UsersIcon, UserCheck, UserX, Building } from 'lucide-react';
import { useUsersManagement } from '@/hooks/useUsersManagement';
import { IUserWithRoles, UserStatus, ICreateUserRequest, IUpdateUserRequest } from '@/types';
import { UserTable, UserFormModal, UserDetailModal, UserConfirmModal } from '@/components/qtvKhoa';
import { Pagination } from '@/components/common';

export default function UsersManagementPage() {
  // Hooks
  const {
    users,
    stats,
    units,
    roles,
    loading,
    error,
    filters,
    page,
    limit,
    total,
    totalPages,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    updateFilters,
    resetFilters,
    changePage,
    changeLimit,
    clearError
  } = useUsersManagement();

  // Modal states
  const [selectedUser, setSelectedUser] = useState<IUserWithRoles | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [confirmAction, setConfirmAction] = useState<'toggle-status' | 'delete'>('toggle-status');

  // Handlers
  const handleCreateUser = () => {
    setFormMode('create');
    setSelectedUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user: IUserWithRoles) => {
    setFormMode('edit');
    setSelectedUser(user);
    setShowFormModal(true);
  };

  const handleViewUser = (user: IUserWithRoles) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleToggleStatus = (user: IUserWithRoles) => {
    setSelectedUser(user);
    setConfirmAction('toggle-status');
    setShowConfirmModal(true);
  };

  const handleDeleteUser = (user: IUserWithRoles) => {
    setSelectedUser(user);
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const handleFormSubmit = async (userData: ICreateUserRequest | IUpdateUserRequest) => {
    let success = false;
    
    if (formMode === 'create') {
      success = await createUser(userData as ICreateUserRequest);
    } else if (selectedUser) {
      success = await updateUser(selectedUser.id, userData as IUpdateUserRequest);
    }

    if (success) {
      setShowFormModal(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    
    let success = false;
    
    if (confirmAction === 'toggle-status') {
      success = await toggleUserStatus(selectedUser.id);
    } else if (confirmAction === 'delete') {
      success = await deleteUser(selectedUser.id);
    }

    if (success) {
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tài khoản người dùng trong khoa và phân quyền truy cập hệ thống.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số người dùng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bị khóa
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.inactive}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Khoa CNTT
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.byUnit.find(u => u.unitName.includes('Công nghệ Thông tin'))?.count || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Unit Filter */}
            <div>
              <select
                value={filters.unitId}
                onChange={(e) => updateFilters({ unitId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Lọc theo đơn vị"
              >
                <option value="">Tất cả đơn vị</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filters.roleCode}
                onChange={(e) => updateFilters({ roleCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Lọc theo vai trò"
              >
                <option value="">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.code}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value as UserStatus | 'all' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Lọc theo trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value={UserStatus.ACTIVE}>Đang hoạt động</option>
                <option value={UserStatus.INACTIVE}>Bị khóa</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </button>

            <p className="text-sm text-gray-500">
              Hiển thị {users.length} / {total} người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Có lỗi xảy ra
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearError}
                  className="text-sm bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onToggleStatus={handleToggleStatus}
              onDeleteUser={handleDeleteUser}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t">
                <Pagination
                  currentPage={page}
                  pageSize={limit}
                  total={total}
                  onPageChange={changePage}
                  onPageSizeChange={changeLimit}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        mode={formMode}
      />

      {selectedUser && (
        <>
          <UserDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
          />

          <UserConfirmModal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmAction}
            user={selectedUser}
            action={confirmAction}
          />
        </>
      )}
    </div>
  );
}