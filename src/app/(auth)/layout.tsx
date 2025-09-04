import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/image-1_Campus-IUH_bgLogin.png')",
        }}
      >
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
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-xs font-medium text-blue-800 mb-1">Tài khoản demo:</h4>
                <div className="space-y-0.5 text-xs text-blue-700">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Kỹ thuật viên:</strong> tech / tech123</p>
                <p><strong>Người dùng:</strong> user / user123</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
