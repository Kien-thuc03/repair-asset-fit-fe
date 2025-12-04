'use client'

import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/image-1_Campus-IUH_bgLogin.png')]">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
           {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-white">
                Trang quản lý Sửa chữa tài sản - Khoa Công nghệ Thông tin
                </p>
                <p className="text-sm text-white">
                Trường Đại học Công nghiệp TP. Hồ Chí Minh
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
