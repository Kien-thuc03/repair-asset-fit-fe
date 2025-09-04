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

  // Reset selected role when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(null)
    }
  }, [isOpen])

  if (!isOpen || !user || user.roles.length <= 1) return null

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      switchRole(selectedRole)
      onClose()
      
      // Navigate to default route for selected role
      const defaultRoute = RoleInfo[selectedRole].defaultRoute
      router.push(defaultRoute)
    }
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
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
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
  )
}
