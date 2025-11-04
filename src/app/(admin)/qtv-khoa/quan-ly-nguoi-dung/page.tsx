'use client';

import { useRouter } from 'next/navigation';
import { UserPlus, Users as UsersIcon, UserCheck, UserX, Building, Download } from 'lucide-react';
import { Breadcrumb, message, Input, Select, Button, Card, Row, Col, Alert } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useUsersManagement } from '@/hooks/useUsersManagement';
import { useRoles } from '@/hooks/useRoles';
import { useUnits } from '@/hooks/useUnits';
import type { UnitResponseDto } from '@/lib/api/units';
import type { RoleResponseDto } from '@/lib/api/roles';
import { IUserWithRoles, UserStatus } from '@/types';
import { UserTable, UserConfirmModal } from '@/components/qtvKhoa';
import { useState, useMemo } from 'react';

export default function UsersManagementPage() {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: IUserWithRoles | null;
    action: 'toggle-status' | 'delete';
  }>({
    isOpen: false,
    user: null,
    action: 'toggle-status',
  });
  
  // Hooks
  const {
    users,
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
    clearError,
    toggleUserStatus,
    deleteUser,
  } = useUsersManagement();

  // Fetch roles and units (including campuses) for filters
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const { campuses, loading: unitsLoading, error: unitsError } = useUnits();

  // Lọc units dựa trên campus đã chọn
  const filteredUnits = useMemo(() => {
    if (!filters.campusId) {
      return []; // Không có campus nào được chọn, trả về mảng rỗng
    }

    // Tìm campus được chọn
    const selectedCampus = campuses.find(c => c.id === filters.campusId);
    
    // Trả về childUnits của campus đó
    return selectedCampus?.childUnits || [];
  }, [filters.campusId, campuses]);

  // Tính toán stats từ danh sách users
  const stats = useMemo(() => {
    const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);
    const inactiveUsers = users.filter(u => u.status === UserStatus.INACTIVE);
    
    // Group by unit
    const byUnit = users.reduce((acc, user) => {
      const unitName = user.unit?.name || 'Chưa phân công';
      const existing = acc.find(item => item.unitName === unitName);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ unitName, count: 1 });
      }
      return acc;
    }, [] as { unitName: string; count: number }[]);

    return {
      total: total,
      active: activeUsers.length,
      inactive: inactiveUsers.length,
      byUnit,
    };
  }, [users, total]);

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
    setConfirmModal({
      isOpen: true,
      user,
      action: 'toggle-status',
    });
  };

  const handleDeleteUser = (user: IUserWithRoles) => {
    setConfirmModal({
      isOpen: true,
      user,
      action: 'delete',
    });
  };

  // Modal handlers
  const handleCloseModal = () => {
    setConfirmModal({
      isOpen: false,
      user: null,
      action: 'toggle-status',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.user) return;

    try {
      if (confirmModal.action === 'toggle-status') {
        const success = await toggleUserStatus(confirmModal.user.id);
        if (success) {
          const newStatus = confirmModal.user.status === UserStatus.ACTIVE 
            ? UserStatus.INACTIVE 
            : UserStatus.ACTIVE;
          message.success(
            `${newStatus === UserStatus.ACTIVE ? 'Mở khóa' : 'Khóa'} tài khoản thành công!`
          );
        } else {
          message.error('Có lỗi xảy ra khi thay đổi trạng thái tài khoản');
        }
      } else if (confirmModal.action === 'delete') {
        const success = await deleteUser(confirmModal.user.id, false); // Soft delete
        if (success) {
          message.success('Xóa tài khoản thành công!');
        } else {
          message.error('Có lỗi xảy ra khi xóa tài khoản');
        }
      }
      
      // Close modal
      handleCloseModal();
      
    } catch (error) {
      console.error('Error performing action:', error);
      message.error('Có lỗi xảy ra khi thực hiện thao tác');
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = users.filter(user => selectedRowKeys.includes(user.id));
    
    if (selectedData.length === 0) {
      message.warning('Vui lòng chọn ít nhất một người dùng để xuất Excel');
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import('xlsx');
      
      // Tạo dữ liệu Excel
      const excelData = selectedData.map((user, index) => ({
        'STT': index + 1,
        'Họ và tên': user.fullName,
        'Tên đăng nhập': user.username,
        'Email': user.email || 'Chưa có',
        'Số điện thoại': user.phoneNumber || 'Chưa có',
        'Đơn vị': user.unit?.name || 'Chưa phân công',
        'Vai trò': user.roles.map(role => role.name).join(', '),
        'Trạng thái': user.status === UserStatus.ACTIVE ? 'Đang hoạt động' : 'Bị khóa',
        'Ngày sinh': user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'Chưa có',
        'Ngày tạo': user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách người dùng');

      // Xuất file
      const fileName = `danh-sach-nguoi-dung-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      message.success(`Đã xuất ${selectedData.length} người dùng ra file ${fileName}`);
      
      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      message.error('Có lỗi xảy ra khi xuất file Excel');
    }
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
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            onClick={handleExportExcel}
            disabled={selectedRowKeys.length === 0}
            icon={<Download className="h-4 w-4" />}
            type="default"
          >
            Xuất Excel ({selectedRowKeys.length})
          </Button>
          <Button
            onClick={handleCreateUser}
            type="primary"
            icon={<UserPlus className="h-4 w-4" />}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Tổng số người dùng
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {stats.total}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Đang hoạt động
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {stats.active}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Bị khóa
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {stats.inactive}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Khoa CNTT
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {stats.byUnit.find(u => u.unitName.includes('Công nghệ Thông tin'))?.count || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={5}>
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Tất cả cơ sở"
              style={{ width: '100%' }}
              value={filters.campusId || undefined}
              onChange={(value) => {
                // Reset unitId khi đổi campus
                updateFilters({ campusId: value || '', unitId: '' });
              }}
              allowClear
              loading={unitsLoading}
              notFoundContent={unitsLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            >
              {campuses && campuses.length > 0 ? (
                campuses.map((campus: UnitResponseDto) => (
                  <Select.Option key={campus.id} value={campus.id}>
                    {campus.name}
                  </Select.Option>
                ))
              ) : (
                !unitsLoading && <Select.Option value="" disabled>Không có cơ sở</Select.Option>
              )}
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder={!filters.campusId ? "Chọn cơ sở trước" : "Tất cả đơn vị"}
              style={{ width: '100%' }}
              value={filters.unitId || undefined}
              onChange={(value) => updateFilters({ unitId: value || '' })}
              allowClear
              disabled={!filters.campusId}
              loading={unitsLoading}
              notFoundContent={
                !filters.campusId 
                  ? 'Vui lòng chọn cơ sở trước'
                  : unitsLoading 
                    ? 'Đang tải...' 
                    : 'Không có dữ liệu'
              }
            >
              {filteredUnits && filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <Select.Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Option>
                ))
              ) : (
                !unitsLoading && filters.campusId && <Select.Option value="" disabled>Không có đơn vị</Select.Option>
              )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tất cả vai trò"
              style={{ width: '100%' }}
              value={filters.roleId || undefined}
              onChange={(value) => updateFilters({ roleId: value || '' })}
              allowClear
              loading={rolesLoading}
              notFoundContent={rolesLoading ? 'Đang tải...' : 'Không có dữ liệu'}
            >
              {roles && roles.length > 0 ? (
                roles.map((role: RoleResponseDto) => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name}
                  </Select.Option>
                ))
              ) : (
                !rolesLoading && <Select.Option value="" disabled>Không có vai trò</Select.Option>
              )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tất cả trạng thái"
              style={{ width: '100%' }}
              value={filters.status === 'all' ? undefined : filters.status}
              onChange={(value) => updateFilters({ status: value || 'all' })}
              allowClear
            >
              <Select.Option value={UserStatus.ACTIVE}>Đang hoạt động</Select.Option>
              <Select.Option value={UserStatus.INACTIVE}>Bị khóa</Select.Option>
              <Select.Option value={UserStatus.LOCKED}>Đã khóa</Select.Option>
              <Select.Option value={UserStatus.DELETED}>Đã xóa</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={1}>
            <Button
              icon={<SyncOutlined />}
              title='Tải lại bộ lọc'
              onClick={resetFilters}
              type="default"
              style={{ width: '100%' }}
            >
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert
          message="Có lỗi xảy ra"
          description={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
        />
      )}
      
      {/* Roles Error */}
      {rolesError && (
        <Alert
          message="Lỗi tải danh sách vai trò"
          description={rolesError}
          type="warning"
          showIcon
          closable
        />
      )}
      
      {/* Units Error */}
      {unitsError && (
        <Alert
          message="Lỗi tải danh sách đơn vị"
          description={unitsError}
          type="warning"
          showIcon
          closable
        />
      )}

      {/* Users Table */}
      <Card>
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
          selectedRowKeys={selectedRowKeys}
          onRowSelect={setSelectedRowKeys}
        />
      </Card>

      {/* Confirm Modal */}
      {confirmModal.user && (
        <UserConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAction}
          user={confirmModal.user}
          action={confirmModal.action}
        />
      )}

    </div>
  );
}