'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { User, ArrowLeft, Send } from 'lucide-react'
import { forgotPassword } from '@/lib/api/auth'
import Image from 'next/image'
import Link from 'next/link'

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới')
    .required('Tên đăng nhập là bắt buộc'),
})

interface ForgotPasswordForm {
  username: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    try {
      await forgotPassword({ username: data.username })
      setEmailSent(true)
      toast.success('Email đặt lại mật khẩu đã được gửi!')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/40 backdrop-blur-sm rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <Image
            src={"/images/Logo_new.png"}
            alt="Logo IUH"
            width={250}
            height={109}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            QUÊN MẬT KHẨU
          </h1>
          <div className="w-16 h-0.5 bg-blue-500 mx-auto"></div>
        </div>

        {!emailSent ? (
          <>
            <p className="text-sm text-gray-600 text-center mb-6">
              Nhập tên đăng nhập của bạn để nhận liên kết đặt lại mật khẩu qua email
            </p>

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
                    placeholder="Nhập tên đăng nhập của bạn"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Liên kết đặt lại mật khẩu sẽ được gửi đến email đăng ký của tài khoản
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi email đặt lại mật khẩu
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Email đã được gửi!
            </h2>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email đăng ký của tài khoản{' '}
              <strong className="text-gray-900">{getValues('username')}</strong>
            </p>
            <p className="text-xs text-gray-500">
              Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) của bạn. Liên kết sẽ hết hạn sau 1 giờ.
            </p>
            <div className="pt-4 space-y-2">
              <button
                onClick={() => setEmailSent(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Gửi lại email
              </button>
              <div className="text-sm text-gray-500">hoặc</div>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

