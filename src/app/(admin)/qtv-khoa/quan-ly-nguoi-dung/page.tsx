'use client';

import { useRouter } from 'next/navigation';
import { UserPlus, Search, Filter, Users as UsersIcon, UserCheck, UserX, Building } from 'lucide-react';
import { Breadcrumb } from 'antd';
import { useUsersManagement } from '@/hooks/useUsersManagement';
import { IUserWithRoles, UserStatus } from '@/types';
import { UserTable } from '@/components/qtvKhoa';

export default function UsersManagementPage() {
  const router = useRouter();
  
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
    updateFilters,
    resetFilters,
    changePage,
    changeLimit,
    clearError
  } = useUsersManagement();

  // Navigation handlers
  const handleCreateUser = () => {
    router.push('/qtv-khoa/quan-ly-nguoi-dung/tao-moi');
  };

  const handleEditUser = (user: IUserWithRoles) => {
    router.push(`/qtv-khoa/quan-ly-nguoi-dung/chinh-sua/${user.id}`);
  };

  const handleViewUser = (user: IUserWithRoles) => {
    router.push(`/qtv-khoa/quan-ly-nguoi-dung/chi-tiet/${user.id}`);
  };

  const handleToggleStatus = (user: IUserWithRoles) => {
    router.push(`/qtv-khoa/quan-ly-nguoi-dung/xac-nhan/${user.id}?action=toggle-status`);
  };

  const handleDeleteUser = (user: IUserWithRoles) => {
    router.push(`/qtv-khoa/quan-ly-nguoi-dung/xac-nhan/${user.id}?action=delete`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/qtv-khoa',
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Quản lý người dùng</span>
              </div>
            ),
          },
        ]}
      />

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

            {/* Reset Filters Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </button>
            </div>
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
        <UserTable
          users={users}
          loading={loading}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
          currentPage={page}
          pageSize={limit}
          total={total}
          onPageChange={changePage}
          onPageSizeChange={changeLimit}
        />
      </div>
    </div>
  );
}