'use client'

import { ReactNode } from 'react'

// Demo accounts component
function DemoAccountsInfo() {
  // Demo users for testing - should match AuthContext
  const demoUsers = [
    {
      name: "Quản trị viên Khoa",
      username: "qtv",
      password: "qtv123",
      role: "QTV_KHOA"
    },
    {
      name: "Nhân viên Phòng Quản trị",
      username: "quantri",
      password: "quantri123",
      role: "PHONG_QUAN_TRI"
    },
    {
      name: "Tổ trưởng Kỹ thuật",
      username: "totruong",
      password: "totruong123",
      role: "TO_TRUONG_KY_THUAT"
    },
    {
      name: "Kỹ thuật viên",
      username: "kythuat",
      password: "kythuat123",
      role: "KY_THUAT_VIEN"
    },
    {
      name: "Giảng viên",
      username: "giangvien",
      password: "giangvien123",
      role: "GIANG_VIEN"
    }
  ];

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <h4 className="text-xs font-medium text-blue-800 mb-2">Tài khoản demo:</h4>
      <div className="space-y-1 text-xs text-blue-700">
        {demoUsers.map((user, index) => (
          <p key={index}>
            <strong>{user.name}:</strong> {user.username} / {user.password}
          </p>
        ))}
      </div>
    </div>
  )
}

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

            {/* Demo accounts info */}
            <DemoAccountsInfo />
        </div>
      </div>
    </div>
  )
}
