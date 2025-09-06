'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole, RoleInfo } from '@/types/repair'
import { useAuth } from '@/contexts/AuthContext'
import { ShieldCheck, Users, Wrench, CheckCircle2 } from 'lucide-react'

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

const RoleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  [UserRole.GIANG_VIEN]: Users,
  [UserRole.KY_THUAT_VIEN]: Wrench, 
  [UserRole.TO_TRUONG_KY_THUAT]: ShieldCheck,
  [UserRole.PHONG_QUAN_TRI]: CheckCircle2,
  [UserRole.QTV_KHOA]: ShieldCheck,
}

export function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const { user, switchRole } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isAutoSelectEnabled, setIsAutoSelectEnabled] = useState(true)
  const [countdown, setCountdown] = useState(10)

  const handleContinue = () => {
    if (selectedRole) {
      switchRole(selectedRole)
      onClose()
      
      // Navigate to default route for selected role
      const defaultRoute = RoleInfo[selectedRole].defaultRoute
      router.push(defaultRoute)
    }
  }

  // Khởi tạo selectedRole với vai trò hiện tại hoặc vai trò đầu tiên trong danh sách
  useEffect(() => {
    if (isOpen && user && user.roles && user.roles.length > 0) {
      console.log("RoleModal - User roles:", user.roles);
      console.log("RoleModal - Active role:", user.activeRole);
      
      // Đặt vai trò đang hoạt động làm mặc định nếu có
      if (user.activeRole && user.roles.includes(user.activeRole)) {
        setSelectedRole(user.activeRole);
      } else {
        // Nếu không, đặt vai trò đầu tiên làm mặc định
        setSelectedRole(user.roles[0]);
      }
    }
  }, [isOpen, user]);
  
  // Thêm một timeout để tự động chọn vai trò sau 10 giây nếu người dùng không chọn
  useEffect(() => {
    if (isOpen && isAutoSelectEnabled && selectedRole) {
      // Reset đếm ngược
      setCountdown(10);
      
      // Cập nhật đếm ngược mỗi giây
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Tự động chọn vai trò sau 10 giây
      const timer = setTimeout(() => {
        if (selectedRole) {
          switchRole(selectedRole);
          const defaultRoute = RoleInfo[selectedRole].defaultRoute;
          router.push(defaultRoute);
          onClose();
        }
      }, 10000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isOpen, isAutoSelectEnabled, selectedRole, router, switchRole, onClose]);

  if (!isOpen || !user || !user.roles || user.roles.length <= 1) return null

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Chọn vai trò</h2>
            <p className="mt-2 text-sm text-gray-600">
              Bạn có nhiều vai trò trong hệ thống. Vui lòng chọn vai trò để tiếp tục.
            </p>
          </div>
          
          {/* Role List */}
          <div className="p-6">
            <div className="space-y-3">
              {user.roles.map((role) => {
                const RoleIcon = RoleIcons[role] || Users
                
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSelection(role)}
                    className={`flex items-center w-full p-4 rounded-lg border ${
                      selectedRole === role
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedRole === role ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-medium text-gray-900">{RoleInfo[role].name}</h3>
                      <p className="text-sm text-gray-500">{RoleInfo[role].description}</p>
                    </div>
                    {selectedRole === role && (
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <input
                  id="auto-select"
                  type="checkbox"
                  checked={isAutoSelectEnabled}
                  onChange={(e) => setIsAutoSelectEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="auto-select" className="ml-2 text-sm text-gray-600">
                  Tự động chọn sau
                </label>
              </div>
              {isAutoSelectEnabled && (
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {countdown}s
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  selectedRole
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
