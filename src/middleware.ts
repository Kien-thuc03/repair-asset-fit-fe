/**
 * Middleware để handle authentication và routing cho hệ thống sửa chữa tài sản
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Định nghĩa các vai trò trong hệ thống
enum UserRole {
  GIANG_VIEN = 'GIANG_VIEN',                    // Giảng viên
  KY_THUAT_VIEN = 'KY_THUAT_VIEN',             // Kỹ thuật viên
  TO_TRUONG_KY_THUAT = 'TO_TRUONG_KY_THUAT',   // Tổ trưởng Kỹ thuật
  PHONG_QUAN_TRI = 'PHONG_QUAN_TRI',           // Nhân viên Phòng Quản trị
  QTV_KHOA = 'QTV_KHOA'                        // Quản trị viên Khoa
}

// Định nghĩa các route được bảo vệ theo vai trò
const roleBasedRoutes = {
  // Routes dành cho Giảng viên
  [UserRole.GIANG_VIEN]: [
    '/giang-vien',
    '/giang-vien/bao-cao-loi',
    '/giang-vien/theo-doi-tien-do',
    '/giang-vien/tra-cuu-thiet-bi',
    '/giang-vien/thong-tin-ca-nhan'
  ],
  
  // Routes dành cho Kỹ thuật viên
  [UserRole.KY_THUAT_VIEN]: [
    '/ky-thuat-vien',
    '/ky-thuat-vien/xu-ly-loi',
    '/ky-thuat-vien/de-xuat-thay-the',
    '/ky-thuat-vien/quan-ly-tai-san',
    '/ky-thuat-vien/thong-ke-ca-nhan'
  ],
  
  // Routes dành cho Tổ trưởng Kỹ thuật  
  [UserRole.TO_TRUONG_KY_THUAT]: [
    '/to-truong-ky-thuat',
    '/to-truong-ky-thuat/quan-ly-ky-thuat-vien',
    '/to-truong-ky-thuat/giam-sat-loi',
    '/to-truong-ky-thuat/phe-duyet-thay-the',
    '/to-truong-ky-thuat/lap-to-trinh',
    '/to-truong-ky-thuat/xac-nhan-bien-ban'
  ],
  
  // Routes dành cho Phòng Quản trị
  [UserRole.PHONG_QUAN_TRI]: [
    '/phong-quan-tri',
    '/phong-quan-tri/xu-ly-to-trinh',
    '/phong-quan-tri/kiem-tra-thuc-te',
    '/phong-quan-tri/lap-bien-ban',
    '/phong-quan-tri/gui-de-xuat'
  ],
  
  // Routes dành cho QTV Khoa
  [UserRole.QTV_KHOA]: [
    '/qtv-khoa',
    '/qtv-khoa/quan-ly-nguoi-dung',
    '/qtv-khoa/phe-duyet-cuoi-cung',
    '/qtv-khoa/thong-ke-bao-cao',
    '/qtv-khoa/giam-sat-he-thong'
  ]
}

// Routes chung cho tất cả người dùng đã đăng nhập
const commonProtectedRoutes = [
  '/dashboard',
  '/thong-tin-ca-nhan',
  '/doi-mat-khau',
  '/tra-cuu-thiet-bi'
]

// Routes công khai
const publicRoutes = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/public',
  '/images',
  '/'
]

// Routes xác thực (không cần đăng nhập)
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

// Routes admin chung (có thể truy cập bởi nhiều vai trò)
const adminRoutes = [
  '/admin'
]

/**
 * Kiểm tra xem user có quyền truy cập route không dựa trên vai trò hiện tại
 */
function hasAccessToRoute(userRole: UserRole, pathname: string): boolean {
  // Admin routes - có thể truy cập bởi tất cả vai trò đã đăng nhập
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    return true
  }
  
  // Common protected routes - tất cả user đã đăng nhập đều có thể truy cập
  if (commonProtectedRoutes.some(route => pathname.startsWith(route))) {
    return true
  }
  
  // Kiểm tra routes theo vai trò
  const userRoutes = roleBasedRoutes[userRole]
  if (userRoutes) {
    return userRoutes.some(route => pathname.startsWith(route))
  }
  
  return false
}

/**
 * Lấy default route theo vai trò
 */
function getDefaultRouteByRole(userRole: string): string {
  switch (userRole) {
    case UserRole.GIANG_VIEN:
      return '/giang-vien'
    case UserRole.KY_THUAT_VIEN:
      return '/ky-thuat-vien'
    case UserRole.TO_TRUONG_KY_THUAT:
      return '/to-truong-ky-thuat'
    case UserRole.PHONG_QUAN_TRI:
      return '/phong-quan-tri'
    case UserRole.QTV_KHOA:
      return '/qtv-khoa'
    default:
      return '/admin'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public routes and Next.js internals
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Lấy thông tin user từ cookie
  const authUser = request.cookies.get('repair_user')?.value
  let user = null
  
  if (authUser) {
    try {
      user = JSON.parse(authUser)
    } catch (error) {
      // Cookie không hợp lệ, xóa cookie
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('repair_user')
      return response
    }
  }

  const isAuthenticated = !!user
  const activeRole = user?.activeRole

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    const defaultRoute = getDefaultRouteByRole(activeRole)
    return NextResponse.redirect(new URL(defaultRoute, request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  const isProtectedRoute = [
    ...commonProtectedRoutes,
    ...adminRoutes,
    ...Object.values(roleBasedRoutes).flat()
  ].some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Kiểm tra quyền truy cập theo vai trò
  if (isAuthenticated && isProtectedRoute) {
    if (!hasAccessToRoute(activeRole, pathname)) {
      // User không có quyền truy cập, redirect về trang mặc định của họ
      const defaultRoute = getDefaultRouteByRole(activeRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }
  }

  // Default redirect to appropriate dashboard for root
  if (pathname === '/') {
    if (isAuthenticated) {
      const defaultRoute = getDefaultRouteByRole(activeRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - images (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
}
