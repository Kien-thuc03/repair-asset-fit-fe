'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { RoleInfo } from '@/types/repair'

export default function Home() {
  const { isAuthenticated, isLoading, isInitializing, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Chỉ thực hiện redirect khi đã khởi tạo xong và không đang loading
    if (!isInitializing && !isLoading) {
      if (isAuthenticated && user && user.activeRole) {
        // Redirect to role-specific dashboard
        const roleCode = user.activeRole.code || user.activeRole;
        const defaultRoute = RoleInfo[roleCode as keyof typeof RoleInfo]?.defaultRoute;
        
        if (defaultRoute) {
          router.push(defaultRoute);
        } else {
          console.warn('⚠️ No default route found for role:', roleCode);
          router.push('/login');
        }
      } else {
        console.log('🔒 User not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, isInitializing, user, router])

  // Hiển thị loading khi đang khởi tạo hoặc đang loading
  if (isInitializing || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return null
}
