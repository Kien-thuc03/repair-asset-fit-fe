import { IUserWithRoles, UserStatus } from "@/types";
import { MoreVertical, Eye, Edit, Lock, Unlock, Trash2, Users, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Pagination } from "@/components/common";

type SortField = "fullName" | "username" | "email" | "unit" | "roles" | "status" | "createdAt";
type SortDirection = "asc" | "desc" | "none";

interface UserTableProps {
  users: IUserWithRoles[];
  loading?: boolean;
  onViewUser: (user: IUserWithRoles) => void;
  onEditUser: (user: IUserWithRoles) => void;
  onToggleStatus: (user: IUserWithRoles) => void;
  onDeleteUser: (user: IUserWithRoles) => void;
  // Pagination props
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Selection props
  selectedRowKeys?: string[];
  onRowSelect?: (selectedKeys: string[]) => void;
}

export default function UserTable({
  users,
  loading = false,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  selectedRowKeys = [],
  onRowSelect,
}: UserTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  // Hàm xử lý chọn hàng
  const handleRowSelect = (userId: string, selected: boolean) => {
    if (!onRowSelect) return;
    
    if (selected) {
      onRowSelect([...selectedRowKeys, userId]);
    } else {
      onRowSelect(selectedRowKeys.filter(key => key !== userId));
    }
  };

  // Hàm xử lý chọn tất cả
  const handleSelectAll = (selected: boolean) => {
    if (!onRowSelect) return;
    
    if (selected) {
      const currentPageKeys = users.map(user => user.id);
      const newSelected = [...selectedRowKeys];
      currentPageKeys.forEach(key => {
        if (!newSelected.includes(key)) {
          newSelected.push(key);
        }
      });
      onRowSelect(newSelected);
    } else {
      const currentPageKeys = users.map(user => user.id);
      onRowSelect(selectedRowKeys.filter(key => !currentPageKeys.includes(key)));
    }
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const handleAction = (action: () => void) => {
    action();
    setOpenDropdownId(null);
  };

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
        />
      </div>
    );
  };

  // Sắp xếp dữ liệu
  const sortedUsers = () => {
    if (!sortField || sortDirection === "none") return users;

    return [...users].sort((a, b) => {
      let aValue: string | Date | number = "";
      let bValue: string | Date | number = "";

      switch (sortField) {
        case "fullName":
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case "username":
          aValue = a.username;
          bValue = b.username;
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "unit":
          aValue = a.unit?.name || "";
          bValue = b.unit?.name || "";
          break;
        case "roles":
          aValue = a.roles.map(role => role.name).join(", ");
          bValue = b.roles.map(role => role.name).join(", ");
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  if (loading) {
    return (
      <div className="overflow-hidden shadow md:rounded-lg bg-white">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const displayUsers = sortedUsers();

  return (
    <div className="overflow-hidden shadow md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {onRowSelect && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={users.length > 0 && users.every(user => selectedRowKeys.includes(user.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Chọn tất cả"
                />
              </th>
            )}
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
              onClick={() => handleSort("fullName")}
            >
              <div className="flex items-center space-x-1">
                <span>Người dùng</span>
                {getSortIcon("fullName")}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
              onClick={() => handleSort("unit")}
            >
              <div className="flex items-center space-x-1">
                <span>Đơn vị</span>
                {getSortIcon("unit")}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
              onClick={() => handleSort("roles")}
            >
              <div className="flex items-center space-x-1">
                <span>Vai trò</span>
                {getSortIcon("roles")}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center space-x-1">
                <span>Trạng thái</span>
                {getSortIcon("status")}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center space-x-1">
                <span>Ngày tạo</span>
                {getSortIcon("createdAt")}
              </div>
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {onRowSelect && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedRowKeys.includes(user.id)}
                    onChange={(e) => handleRowSelect(user.id, e.target.checked)}
                    aria-label={`Chọn ${user.fullName}`}
                  />
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {user.unit?.name || "Chưa phân công"}
                </div>
                <div className="text-sm text-gray-500">
                  {user.phoneNumber || "Chưa có SĐT"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === UserStatus.ACTIVE
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status === UserStatus.ACTIVE ? "Hoạt động" : "Khóa"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </td>
              <td className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(user.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Tùy chọn"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openDropdownId === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleAction(() => onViewUser(user))}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </button>
                        
                        <button
                          onClick={() => handleAction(() => onEditUser(user))}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </button>

                        <button
                          onClick={() => handleAction(() => onToggleStatus(user))}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {user.status === UserStatus.ACTIVE ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Khóa tài khoản
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Mở khóa
                            </>
                          )}
                        </button>

                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => handleAction(() => onDeleteUser(user))}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa tài khoản
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {displayUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có người dùng nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Hãy thêm người dùng mới để bắt đầu quản lý.
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {onPageChange && onPageSizeChange && total > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />
      )}
    </div>
  );
}