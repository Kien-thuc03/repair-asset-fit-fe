'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleSelectionModal } from '@/components/modal/RoleSelectionModal'
import Image from 'next/image'

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
})

interface LoginForm {
  username: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const router = useRouter()
  const { login, isLoading, user } = useAuth()
  
  // Check if user is logged in and has multiple roles
  useEffect(() => {
    if (user && user.roles && user.roles.length > 1) {
      setShowRoleModal(true)
    } else if (user && user.activeRole) {
      // If user has only one role or activeRole is set, redirect to their role-specific page
      const roleRoutes = {
        'QTV_KHOA': '/qtv-khoa',
        'PHONG_QUAN_TRI': '/phong-quan-tri', 
        'TO_TRUONG_KY_THUAT': '/to-truong-ky-thuat',
        'KY_THUAT_VIEN': '/ky-thuat-vien',
        'GIANG_VIEN': '/giang-vien'
      }
      const route = roleRoutes[user.activeRole as keyof typeof roleRoutes] || '/admin'
      router.push(route)
    }
  }, [user, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      // Sử dụng trực tiếp username không chuyển đổi thành email
      await login(data.username, data.password)
      toast.success('Đăng nhập thành công!')
      
      // Role selection will be handled by useEffect to avoid race conditions
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Tên đăng nhập hoặc mật khẩu không chính xác!')
    }
  }

  const handleCloseRoleModal = () => {
    setShowRoleModal(false)
    router.push('/admin')
  }
  
  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="text-center mb-6">
        <Image
          src={"/images/logo-light.webp"}
          alt="Logo IUH"
          width={250}
          height={109}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          ĐĂNG NHẬP HỆ THỐNG
        </h1>
        <div className="w-16 h-0.5 bg-blue-500 mx-auto"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('username')}
              type="text"
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mã số cá nhân"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-700 hover:text-blue-600">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang đăng nhập...
            </div>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
      
      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal}
        onClose={handleCloseRoleModal}
      />
    </div>
  )
}
