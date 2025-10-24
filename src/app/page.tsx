'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole, RoleInfo } from '@/types/repair'

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user && user.activeRole) {
        // Redirect to role-specific dashboard
        const defaultRoute = RoleInfo[user.activeRole.code as UserRole]?.defaultRoute
        if (defaultRoute) {
          router.push(defaultRoute)
        } else {
          // Fallback if no default route is found for the role
          console.warn('No default route found for role:', user.activeRole.code)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
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
