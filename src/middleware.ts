/**
 * Middleware để handle authentication và routing cho hệ thống sửa chữa tài sản
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/repair";

// Định nghĩa các route được bảo vệ theo vai trò
const roleBasedRoutes = {
  // Routes dành cho Admin - Có quyền truy cập tất cả
  [UserRole.ADMIN]: [
    "/qtv-khoa",
    "/qtv-khoa/quan-ly-nguoi-dung",
    "/qtv-khoa/phe-duyet-cuoi-cung",
    "/qtv-khoa/thong-ke-bao-cao",
    "/qtv-khoa/giam-sat-he-thong",
    "/phong-quan-tri",
    "/phong-quan-tri/xu-ly-to-trinh",
    "/phong-quan-tri/kiem-tra-thuc-te",
    "/phong-quan-tri/lap-bien-ban",
    "/phong-quan-tri/gui-de-xuat",
    "/to-truong-ky-thuat",
    "/to-truong-ky-thuat/quan-ly-ky-thuat-vien",
    "/to-truong-ky-thuat/giam-sat-loi",
    "/to-truong-ky-thuat/phe-duyet-thay-the",
    "/to-truong-ky-thuat/lap-to-trinh",
    "/to-truong-ky-thuat/xac-nhan-bien-ban",
    "/ky-thuat-vien",
    "/ky-thuat-vien/xu-ly-loi",
    "/ky-thuat-vien/de-xuat-thay-the",
    "/ky-thuat-vien/quan-ly-tai-san",
    "/ky-thuat-vien/thong-ke-ca-nhan",
    "/giang-vien",
    "/giang-vien/bao-cao-loi",
    "/giang-vien/theo-doi-tien-do",
    "/giang-vien/tra-cuu-thiet-bi",
    "/giang-vien/thong-tin-ca-nhan",
  ],

  // Routes dành cho Giảng viên
  [UserRole.GIANG_VIEN]: [
    "/giang-vien",
    "/giang-vien/bao-cao-loi",
    "/giang-vien/theo-doi-tien-do",
    "/giang-vien/tra-cuu-thiet-bi",
    "/giang-vien/thong-tin-ca-nhan",
  ],

  // Routes dành cho Kỹ thuật viên
  [UserRole.KY_THUAT_VIEN]: [
    "/ky-thuat-vien",
    "/ky-thuat-vien/xu-ly-loi",
    "/ky-thuat-vien/de-xuat-thay-the",
    "/ky-thuat-vien/quan-ly-tai-san",
    "/ky-thuat-vien/thong-ke-ca-nhan",
  ],

  // Routes dành cho Tổ trưởng Kỹ thuật
  [UserRole.TO_TRUONG_KY_THUAT]: [
    "/to-truong-ky-thuat",
    "/to-truong-ky-thuat/quan-ly-ky-thuat-vien",
    "/to-truong-ky-thuat/giam-sat-loi",
    "/to-truong-ky-thuat/phe-duyet-thay-the",
    "/to-truong-ky-thuat/lap-to-trinh",
    "/to-truong-ky-thuat/xac-nhan-bien-ban",
  ],

  // Routes dành cho Phòng Quản trị
  [UserRole.PHONG_QUAN_TRI]: [
    "/phong-quan-tri",
    "/phong-quan-tri/xu-ly-to-trinh",
    "/phong-quan-tri/kiem-tra-thuc-te",
    "/phong-quan-tri/lap-bien-ban",
    "/phong-quan-tri/gui-de-xuat",
  ],

  // Routes dành cho QTV Khoa
  [UserRole.QTV_KHOA]: [
    "/qtv-khoa",
    "/qtv-khoa/quan-ly-nguoi-dung",
    "/qtv-khoa/phe-duyet-cuoi-cung",
    "/qtv-khoa/thong-ke-bao-cao",
    "/qtv-khoa/giam-sat-he-thong",
  ],

  // Routes dành cho Ban Giám hiệu
  [UserRole.BAN_GIAM_HIEU]: [
    "/ban-giam-hieu",
    "/ban-giam-hieu/quan-ly-to-trinh",
  ],
};

// Routes chung cho tất cả người dùng đã đăng nhập
const commonProtectedRoutes = [
  "/dashboard",
  "/thong-tin-ca-nhan",
  "/doi-mat-khau",
  "/tra-cuu-thiet-bi",
  "/profile", // Trang xem thông tin cá nhân
  "/profile/edit", // Trang cập nhật thông tin cá nhân
];

// Routes công khai
const publicRoutes = ["/api", "/_next", "/favicon.ico", "/public", "/images"];

// Routes xác thực (không cần đăng nhập)
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Routes admin chung (có thể truy cập bởi nhiều vai trò)
const adminRoutes: string[] = [];

/**
 * Kiểm tra xem user có quyền truy cập route không dựa trên vai trò hiện tại
 */
function hasAccessToRoute(userRole: UserRole, pathname: string): boolean {
  // Admin routes - có thể truy cập bởi tất cả vai trò đã đăng nhập
  if (adminRoutes.some((route: string) => pathname.startsWith(route))) {
    return true;
  }

  // Common protected routes - tất cả user đã đăng nhập đều có thể truy cập
  if (
    commonProtectedRoutes.some((route: string) => pathname.startsWith(route))
  ) {
    return true;
  }

  // Kiểm tra routes theo vai trò
  // Sử dụng string comparison để đảm bảo hoạt động đúng với enum
  const roleKey = userRole as keyof typeof roleBasedRoutes;
  const userRoutes = roleBasedRoutes[roleKey];
  if (userRoutes) {
    return userRoutes.some((route: string) => pathname.startsWith(route));
  }

  return false;
}

/**
 * Lấy default route theo vai trò
 */
function getDefaultRouteByRole(userRole: string): string {
  // So sánh string với enum values để đảm bảo hoạt động đúng
  if (userRole === UserRole.ADMIN || userRole === "ADMIN") {
    return "/qtv-khoa"; // Admin mặc định vào QTV_KHOA
  }
  if (userRole === UserRole.GIANG_VIEN || userRole === "GIANG_VIEN") {
    return "/giang-vien";
  }
  if (userRole === UserRole.KY_THUAT_VIEN || userRole === "KY_THUAT_VIEN") {
    return "/ky-thuat-vien";
  }
  if (
    userRole === UserRole.TO_TRUONG_KY_THUAT ||
    userRole === "TO_TRUONG_KY_THUAT"
  ) {
    return "/to-truong-ky-thuat";
  }
  if (userRole === UserRole.PHONG_QUAN_TRI || userRole === "PHONG_QUAN_TRI") {
    return "/phong-quan-tri";
  }
  if (userRole === UserRole.QTV_KHOA || userRole === "QTV_KHOA") {
    return "/qtv-khoa";
  }
  if (userRole === UserRole.BAN_GIAM_HIEU || userRole === "BAN_GIAM_HIEU") {
    return "/ban-giam-hieu";
  }
  return "/login"; // Mặc định redirect về login nếu không xác định được vai trò
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and Next.js internals
  if (publicRoutes.some((route: string) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Lấy thông tin user từ cookie
  const authUser = request.cookies.get("repair_user")?.value;
  let user = null;

  if (authUser) {
    try {
      user = JSON.parse(decodeURIComponent(authUser));
    } catch (error) {
      console.error("❌ Middleware: Error parsing user cookie:", error);
      // Cookie không hợp lệ, xóa cookie
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("repair_user");
      return response;
    }
  }

  const isAuthenticated = !!user;
  // activeRole giờ là string trực tiếp, không phải object
  const activeRole = user?.activeRole || "";

  // Redirect authenticated users away from auth pages
  if (
    authRoutes.some((route: string) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    if (!activeRole) {
      // Nếu không có activeRole, không redirect để tránh vòng lặp
      return NextResponse.next();
    }
    const defaultRoute = getDefaultRouteByRole(activeRole);
    // Tránh redirect về chính nó
    if (pathname !== defaultRoute) {
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
  }

  // Redirect unauthenticated users to login for protected routes
  const isProtectedRoute = [
    ...commonProtectedRoutes,
    ...adminRoutes,
    ...Object.values(roleBasedRoutes).flat(),
  ].some((route: string) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kiểm tra quyền truy cập theo vai trò
  if (isAuthenticated && isProtectedRoute && activeRole) {
    const hasAccess = hasAccessToRoute(activeRole as UserRole, pathname);

    if (!hasAccess) {
      // User không có quyền truy cập, redirect về trang mặc định của họ
      const defaultRoute = getDefaultRouteByRole(activeRole);
      // Tránh redirect về chính nó để tránh vòng lặp
      if (pathname !== defaultRoute) {
        return NextResponse.redirect(new URL(defaultRoute, request.url));
      }
    }
  }

  // Default redirect to appropriate dashboard for root
  if (pathname === "/") {
    if (isAuthenticated && activeRole) {
      const defaultRoute = getDefaultRouteByRole(activeRole);
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};
