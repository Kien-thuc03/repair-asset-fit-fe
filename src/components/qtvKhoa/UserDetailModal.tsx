import { IUserWithRoles } from "@/types";
import { Users, Shield, Calendar, Mail, Phone, Building } from "lucide-react";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUserWithRoles;
}

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h4>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{user.email || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="text-gray-900">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              {user.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày sinh</p>
                    <p className="text-gray-900">
                      {new Date(user.birthDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}

              {user.unit && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Đơn vị</p>
                    <p className="text-gray-900">{user.unit.name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Vai trò và quyền</h4>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Vai trò</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.roles.map(role => (
                      <span 
                        key={role.id}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {user.permissions && user.permissions.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Quyền hạn</p>
                    <div className="mt-1 space-y-1">
                      {user.permissions.map(permission => (
                        <div key={permission.id} className="text-sm text-gray-700">
                          • {permission.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin hoạt động</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Ngày tạo</p>
                <p className="text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
              {user.updatedAt && (
                <div>
                  <p className="text-gray-600">Cập nhật lần cuối</p>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}