'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, RoleInfo } from '@/types/repair'
import { ArrowLeftRight } from 'lucide-react'

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, switchRole } = useAuth()

  // Return null if user has only one role
  if (!user || user.roles.length <= 1) {
    return null
  }

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        title='Chuyển đổi vai trò'
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowLeftRight className="h-4 w-4 text-blue-600" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              Chọn vai trò
            </div>
            <div className="space-y-1">
              {user.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md ${
                    user.activeRole === role 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{RoleInfo[role]?.name || role}</div>
                    <div className="text-xs text-gray-500">{RoleInfo[role]?.description}</div>
                  </div>
                  {user.activeRole === role && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close the dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
