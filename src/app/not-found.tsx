'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Số 404 với hiệu ứng */}
        <div className="relative">
          <div className="text-9xl md:text-[12rem] font-bold opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-bold">Không tìm thấy trang</h1>
          </div>
        </div>
        
        {/* Minh họa */}
        <div className="py-8">
          <div className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Thông báo lỗi */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-blue-100">
            Chúng tôi không tìm thấy trang bạn đang tìm kiếm hoặc trang bạn tìm kiếm không tồn tại.
          </p>
          <p className="text-blue-300">
            Xin hãy kiểm tra lại URL.
          </p>
        </div>
        
        {/* Các nút hành động */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Home size={18} />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
      
      {/* Đồ họa nền */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-700"
              style={{
                width: `${Math.random() * 10 + 5}rem`,
                height: `${Math.random() * 10 + 5}rem`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                transform: `scale(${Math.random() * 0.8 + 0.2})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
