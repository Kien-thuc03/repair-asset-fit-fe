import { IUserWithRoles, UserStatus } from "@/types";
import { MoreVertical, Eye, Edit, Lock, Unlock, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface UserTableProps {
  users: IUserWithRoles[];
  onViewUser: (user: IUserWithRoles) => void;
  onEditUser: (user: IUserWithRoles) => void;
  onToggleStatus: (user: IUserWithRoles) => void;
  onDeleteUser: (user: IUserWithRoles) => void;
}

export default function UserTable({
  users,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
}: UserTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const handleAction = (action: () => void) => {
    action();
    setOpenDropdownId(null);
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đơn vị
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
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

      {users.length === 0 && (
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
    </div>
  );
}