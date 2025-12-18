"use client";

import { useRouter } from "next/navigation";
import {
  UserPlus,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Building,
  Download,
} from "lucide-react";
import {
  Breadcrumb,
  message,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Alert,
} from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { useRoles } from "@/hooks/useRoles";
import { useUnits } from "@/hooks/useUnits";
import { getUsers } from "@/lib/api/users";
import type { UnitResponseDto } from "@/lib/api/units";
import type { RoleResponseDto } from "@/lib/api/roles";
import { IUserWithRoles, UserStatus } from "@/types";
import { UserTable, UserConfirmModal } from "@/components/qtvKhoa";
import {
  ExportExcelSuccessModal,
  ExportExcelErrorModal,
} from "@/components/modal";
import { useState, useMemo, useEffect, useCallback } from "react";

export default function UsersManagementPage() {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: IUserWithRoles | null;
    action: "toggle-status" | "delete";
  }>({
    isOpen: false,
    user: null,
    action: "toggle-status",
  });

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

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
    const selectedCampus = campuses.find((c) => c.id === filters.campusId);

    // Trả về childUnits của campus đó
    return selectedCampus?.childUnits || [];
  }, [filters.campusId, campuses]);

  // State cho stats tổng thể (không phụ thuộc vào filter)
  const [allUsersStats, setAllUsersStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    byUnit: { unitName: string; count: number }[];
  }>({
    total: 0,
    active: 0,
    inactive: 0,
    byUnit: [],
  });

  // Fetch stats tổng thể (tất cả users, không filter)
  const fetchAllUsersStats = useCallback(async () => {
    try {
      // Backend giới hạn limit tối đa là 100, nên cần gọi nhiều lần nếu có nhiều users
      // Bước 1: Lấy tổng số users
      const firstResponse = await getUsers({
        page: 1,
        limit: 100, // Limit tối đa theo backend
      });

      const totalUsers = firstResponse.total;
      let allUsers = [...firstResponse.data];

      // Nếu có nhiều hơn 100 users, gọi thêm các trang tiếp theo
      if (totalUsers > 100) {
        const totalPages = Math.ceil(totalUsers / 100);
        const promises = [];

        // Gọi các trang từ 2 đến totalPages
        for (let page = 2; page <= totalPages; page++) {
          promises.push(
            getUsers({
              page,
              limit: 100,
            })
          );
        }

        // Chờ tất cả các request hoàn thành
        const responses = await Promise.all(promises);

        // Gộp tất cả users lại
        responses.forEach((response) => {
          allUsers = [...allUsers, ...response.data];
        });
      }

      // Tính toán stats
      const activeUsers = allUsers.filter(
        (u) => u.status === UserStatus.ACTIVE
      );
      const inactiveUsers = allUsers.filter(
        (u) => u.status === UserStatus.INACTIVE
      );

      // Group by unit
      const byUnit = allUsers.reduce((acc, user) => {
        const unitName = user.unit?.name || "Chưa phân công";
        const existing = acc.find((item) => item.unitName === unitName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ unitName, count: 1 });
        }
        return acc;
      }, [] as { unitName: string; count: number }[]);

      setAllUsersStats({
        total: totalUsers,
        active: activeUsers.length,
        inactive: inactiveUsers.length,
        byUnit,
      });
    } catch (err) {
      console.error("Error fetching all users stats:", err);
      // Không set state nếu có lỗi, để fallback về tính từ users hiện tại
    }
  }, []);

  // Fetch stats khi component mount
  useEffect(() => {
    fetchAllUsersStats();
  }, [fetchAllUsersStats]);

  // Tính toán stats - ưu tiên allUsersStats, fallback về users hiện tại
  const stats = useMemo(() => {
    // Nếu đã có allUsersStats với dữ liệu hợp lệ (total > 0 hoặc đã có active/inactive), sử dụng nó
    if (allUsersStats.total > 0) {
      return allUsersStats;
    }

    // Fallback: tính từ users hiện tại và total từ API
    // Đây là dữ liệu từ trang hiện tại, sẽ được thay thế khi allUsersStats fetch xong
    const activeUsers = users.filter((u) => u.status === UserStatus.ACTIVE);
    const inactiveUsers = users.filter((u) => u.status === UserStatus.INACTIVE);

    // Group by unit từ users hiện tại
    const byUnit = users.reduce((acc, user) => {
      const unitName = user.unit?.name || "Chưa phân công";
      const existing = acc.find((item) => item.unitName === unitName);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ unitName, count: 1 });
      }
      return acc;
    }, [] as { unitName: string; count: number }[]);

    return {
      total: total || 0,
      active: activeUsers.length,
      inactive: inactiveUsers.length,
      byUnit,
    };
  }, [allUsersStats, users, total]);

  // Navigation handlers
  const handleCreateUser = () => {
    router.push("/qtv-khoa/quan-ly-nguoi-dung/tao-moi");
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
      action: "toggle-status",
    });
  };

  const handleDeleteUser = (user: IUserWithRoles) => {
    setConfirmModal({
      isOpen: true,
      user,
      action: "delete",
    });
  };

  // Modal handlers
  const handleCloseModal = () => {
    setConfirmModal({
      isOpen: false,
      user: null,
      action: "toggle-status",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.user) return;

    try {
      if (confirmModal.action === "toggle-status") {
        const success = await toggleUserStatus(confirmModal.user.id);
        if (success) {
          const newStatus =
            confirmModal.user.status === UserStatus.ACTIVE
              ? UserStatus.INACTIVE
              : UserStatus.ACTIVE;
          message.success(
            `${
              newStatus === UserStatus.ACTIVE ? "Mở khóa" : "Khóa"
            } tài khoản thành công!`
          );
          // Refetch stats sau khi toggle status thành công
          setTimeout(() => {
            fetchAllUsersStats();
          }, 500);
        } else {
          message.error("Có lỗi xảy ra khi thay đổi trạng thái tài khoản");
        }
      } else if (confirmModal.action === "delete") {
        const success = await deleteUser(confirmModal.user.id, false); // Soft delete
        if (success) {
          message.success("Xóa tài khoản thành công!");
          // Refetch stats sau khi delete thành công
          setTimeout(() => {
            fetchAllUsersStats();
          }, 500);
        } else {
          message.error("Có lỗi xảy ra khi xóa tài khoản");
        }
      }

      // Close modal
      handleCloseModal();
    } catch (error) {
      console.error("Error performing action:", error);
      message.error("Có lỗi xảy ra khi thực hiện thao tác");
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = users.filter((user) =>
      selectedRowKeys.includes(user.id)
    );

    if (selectedData.length === 0) {
      setExportError("Vui lòng chọn ít nhất một người dùng để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách người dùng");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map((user, index) => ({
        STT: index + 1,
        "Họ và tên": user.fullName,
        "Tên đăng nhập": user.username,
        Email: user.email || "Chưa có",
        "Số điện thoại": user.phoneNumber || "Chưa có",
        "Đơn vị": user.unit?.name || "Chưa phân công",
        "Vai trò": user.roles.map((role) => role.name).join(", "),
        "Trạng thái":
          user.status === UserStatus.ACTIVE ? "Đang hoạt động" : "Bị khóa",
        "Ngày sinh": user.birthDate
          ? new Date(user.birthDate).toLocaleDateString("vi-VN")
          : "Chưa có",
        "Ngày tạo": user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
          : "Chưa cập nhật",
      }));

      const columnHeaders = [
        "STT",
        "Họ và tên",
        "Tên đăng nhập",
        "Email",
        "Số điện thoại",
        "Đơn vị",
        "Vai trò",
        "Trạng thái",
        "Ngày sinh",
        "Ngày tạo",
      ];

      // Tạo footer
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dateStr = `Ngày ${day} Tháng ${
        month < 10 ? "0" + month : month
      } Năm ${year}`;

      const footerRow: string[] = new Array(columnHeaders.length).fill("");
      footerRow[0] = "Người lập biểu";
      footerRow[Math.floor(columnHeaders.length / 4)] = "Thư ký";
      footerRow[Math.floor((columnHeaders.length * 2) / 4)] =
        "Trưởng nhóm kiểm kê";
      footerRow[columnHeaders.length - 1] = "Đại diện ĐV sử dụng";

      let currentRow = 1;

      // Hàng 1: TRƯỜNG ĐẠI HỌC...
      const row1 = worksheet.getRow(currentRow);
      const cell1 = row1.getCell(1);
      cell1.value = "TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH";
      cell1.font = { name: "Arial", size: 9 };
      cell1.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 2: Địa chỉ
      const row2 = worksheet.getRow(currentRow);
      const cell2 = row2.getCell(1);
      cell2.value =
        "Địa chỉ : 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP Hồ Chí Minh";
      cell2.font = { name: "Arial", size: 9 };
      cell2.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 3: Dòng trống
      currentRow++;

      // Hàng 4: Tiêu đề sheet - màu đỏ
      const row4 = worksheet.getRow(currentRow);
      const cell4 = row4.getCell(1);
      cell4.value = "DANH SÁCH NGƯỜI DÙNG";
      cell4.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FFFF0000" },
      };
      cell4.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 5: KHOA CÔNG NGHỆ THÔNG TIN
      const row5 = worksheet.getRow(currentRow);
      const cell5 = row5.getCell(1);
      cell5.value = "KHOA CÔNG NGHỆ THÔNG TIN";
      cell5.font = { name: "Arial", size: 9 };
      cell5.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 6: NĂM
      const row6 = worksheet.getRow(currentRow);
      const cell6 = row6.getCell(1);
      cell6.value = `NĂM ${new Date().getFullYear()}`;
      cell6.font = { name: "Arial", size: 9 };
      cell6.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 7: Dòng trống
      currentRow++;

      // Header của bảng - in hoa và màu vàng
      const headerRow = worksheet.getRow(currentRow);
      columnHeaders.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header.toUpperCase();
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };
      });
      currentRow++;

      // Data rows
      excelData.forEach((rowData) => {
        const row = worksheet.getRow(currentRow);

        columnHeaders.forEach((header, index) => {
          const cell = row.getCell(index + 1);
          cell.value = rowData[header as keyof typeof rowData] ?? "";
          cell.font = { name: "Arial", size: 9 };
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;
      });

      // Dòng trống
      currentRow++;

      // Hàng ngày tháng
      const dateRow = worksheet.getRow(currentRow);
      const dateCell = dateRow.getCell(columnHeaders.length);
      dateCell.value = dateStr;
      dateCell.font = { name: "Arial", size: 9 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;

      // Footer row
      const footerRowExcel = worksheet.getRow(currentRow);
      footerRow.forEach((value, index) => {
        const cell = footerRowExcel.getCell(index + 1);
        cell.value = value;
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Set column widths
      columnHeaders.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 20;
      });

      // Xuất file
      const fileName = `Danh_sach_nguoi_dung_${
        new Date().toISOString().split("T")[0]
      }_${selectedData.length}_ban_ghi.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      // Thông báo thành công với modal
      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
      setShowExportErrorModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/qtv-khoa",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý tài khoản người dùng trong khoa và phân quyền truy cập hệ
            thống.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            onClick={handleExportExcel}
            disabled={selectedRowKeys.length === 0}
            icon={<Download className="h-4 w-4" />}
            type="default">
            Xuất Excel ({selectedRowKeys.length})
          </Button>
          <Button
            onClick={handleCreateUser}
            type="primary"
            icon={<UserPlus className="h-4 w-4" />}>
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
                  {stats.byUnit
                    .filter((u) => {
                      const name = u.unitName.toLowerCase();
                      return (
                        name.includes("công nghệ thông tin") ||
                        name.includes("cntt")
                      );
                    })
                    .reduce((sum, u) => sum + u.count, 0)}
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
              style={{ width: "100%" }}
              value={filters.campusId || undefined}
              onChange={(value) => {
                // Reset unitId khi đổi campus
                updateFilters({ campusId: value || "", unitId: "" });
              }}
              allowClear
              loading={unitsLoading}
              notFoundContent={
                unitsLoading ? "Đang tải..." : "Không có dữ liệu"
              }>
              {campuses && campuses.length > 0
                ? campuses.map((campus: UnitResponseDto) => (
                    <Select.Option key={campus.id} value={campus.id}>
                      {campus.name}
                    </Select.Option>
                  ))
                : !unitsLoading && (
                    <Select.Option value="" disabled>
                      Không có cơ sở
                    </Select.Option>
                  )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder={
                !filters.campusId ? "Chọn cơ sở trước" : "Tất cả đơn vị"
              }
              style={{ width: "100%" }}
              value={filters.unitId || undefined}
              onChange={(value) => updateFilters({ unitId: value || "" })}
              allowClear
              disabled={!filters.campusId}
              loading={unitsLoading}
              notFoundContent={
                !filters.campusId
                  ? "Vui lòng chọn cơ sở trước"
                  : unitsLoading
                  ? "Đang tải..."
                  : "Không có dữ liệu"
              }>
              {filteredUnits && filteredUnits.length > 0
                ? filteredUnits.map((unit) => (
                    <Select.Option key={unit.id} value={unit.id}>
                      {unit.name}
                    </Select.Option>
                  ))
                : !unitsLoading &&
                  filters.campusId && (
                    <Select.Option value="" disabled>
                      Không có đơn vị
                    </Select.Option>
                  )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tất cả vai trò"
              style={{ width: "100%" }}
              value={filters.roleId || undefined}
              onChange={(value) => updateFilters({ roleId: value || "" })}
              allowClear
              loading={rolesLoading}
              notFoundContent={
                rolesLoading ? "Đang tải..." : "Không có dữ liệu"
              }>
              {roles && roles.length > 0
                ? roles.map((role: RoleResponseDto) => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))
                : !rolesLoading && (
                    <Select.Option value="" disabled>
                      Không có vai trò
                    </Select.Option>
                  )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tất cả trạng thái"
              style={{ width: "100%" }}
              value={filters.status === "all" ? undefined : filters.status}
              onChange={(value) => updateFilters({ status: value || "all" })}
              allowClear>
              <Select.Option value={UserStatus.ACTIVE}>
                Đang hoạt động
              </Select.Option>
              <Select.Option value={UserStatus.INACTIVE}>Bị khóa</Select.Option>
              <Select.Option value={UserStatus.LOCKED}>Đã khóa</Select.Option>
              <Select.Option value={UserStatus.DELETED}>Đã xóa</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={1}>
            <Button
              icon={<SyncOutlined />}
              title="Tải lại bộ lọc"
              onClick={resetFilters}
              type="default"
              style={{ width: "100%" }}></Button>
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

      {/* Export Modals */}
      <ExportExcelSuccessModal
        isOpen={showExportSuccessModal}
        onClose={() => setShowExportSuccessModal(false)}
        fileName={exportFileName}
        recordCount={exportCount}
      />

      <ExportExcelErrorModal
        isOpen={showExportErrorModal}
        onClose={() => setShowExportErrorModal(false)}
        errorMessage={exportError}
      />
    </div>
  );
}
