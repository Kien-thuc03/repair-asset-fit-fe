"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { UserRole, RoleInfo } from "@/types/repair";
import {
  LayoutDashboard,
  Wrench,
  Menu,
  X,
  LogOut,
  Settings,
  ClipboardList,
  Users,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Shield,
  ChevronRight,
  ChevronLeft,
  Calendar,
} from "lucide-react";

// Navigation items
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Navigation items by role
const getNavigationByRole = (userRole: string): NavigationItem[] => {
  const navigationMap = {
    [UserRole.GIANG_VIEN]: [
      {
        name: "Dashboard",
        href: "/giang-vien",
        icon: LayoutDashboard,
      },
      {
        name: "Báo cáo lỗi",
        href: "/giang-vien/bao-cao-loi",
        icon: AlertTriangle,
      },
      {
        name: "Theo dõi tiến độ",
        href: "/giang-vien/theo-doi-tien-do",
        icon: ClipboardList,
      },
      {
        name: "Tra cứu thiết bị",
        href: "/giang-vien/tra-cuu-thiet-bi",
        icon: Settings,
      },
    ],
    [UserRole.KY_THUAT_VIEN]: [
      {
        name: "Dashboard",
        href: "/ky-thuat-vien",
        icon: LayoutDashboard,
      },
      {
        name: "Quản lý báo lỗi",
        href: "/ky-thuat-vien/quan-ly-bao-loi",
        icon: Wrench,
      },
      {
        name: "Đề xuất thay thế",
        href: "/ky-thuat-vien/de-xuat-thay-the",
        icon: FileText,
      },
      {
        name: "Quản lý tài sản",
        href: "/ky-thuat-vien/quan-ly-tai-san",
        icon: Settings,
      },
      {
        name: "Thống kê cá nhân",
        href: "/ky-thuat-vien/thong-ke-ca-nhan",
        icon: BarChart3,
      },
    ],
    [UserRole.TO_TRUONG_KY_THUAT]: [
      {
        name: "Dashboard",
        href: "/to-truong-ky-thuat",
        icon: LayoutDashboard,
      },
      {
        name: "Duyệt đề xuất",
        href: "/to-truong-ky-thuat/duyet-de-xuat",
        icon: CheckCircle,
      },
      {
        name: "Phân công khu vực",
        href: "/to-truong-ky-thuat/phan-cong",
        icon: Users,
      },
      {
        name: "Danh sách báo lỗi",
        href: "/to-truong-ky-thuat/danh-sach-bao-loi",
        icon: ClipboardList,
      },
      {
        name: "Lập tờ trình",
        href: "/to-truong-ky-thuat/lap-to-trinh",
        icon: FileText,
      },
      {
        name: "Tra cứu tài sản",
        href: "/to-truong-ky-thuat/tra-cuu-tai-san",
        icon: Settings,
      },
      {
        name: "Biên bản",
        href: "/to-truong-ky-thuat/bien-ban",
        icon: Calendar,
      },
      {
        name: "Thống kê báo cáo",
        href: "/to-truong-ky-thuat/thong-ke-bao-cao",
        icon: BarChart3,
      },
    ],
    [UserRole.PHONG_QUAN_TRI]: [
      {
        name: "Dashboard",
        href: "/phong-quan-tri",
        icon: LayoutDashboard,
      },
      {
        name: "Xử lý tờ trình",
        href: "/phong-quan-tri/xu-ly-to-trinh",
        icon: FileText,
      },
      {
        name: "Kiểm tra thực tế",
        href: "/phong-quan-tri/kiem-tra-thuc-te",
        icon: UserCheck,
      },
      {
        name: "Lập biên bản",
        href: "/phong-quan-tri/lap-bien-ban",
        icon: ClipboardList,
      },
    ],
    [UserRole.QTV_KHOA]: [
      {
        name: "Dashboard",
        href: "/qtv-khoa",
        icon: LayoutDashboard,
      },
      {
        name: "Quản lý người dùng",
        href: "/qtv-khoa/quan-ly-nguoi-dung",
        icon: Users,
      },
      {
        name: "Phê duyệt cuối cùng",
        href: "/qtv-khoa/phe-duyet-cuoi-cung",
        icon: Shield,
      },
      {
        name: "Thống kê báo cáo",
        href: "/qtv-khoa/thong-ke-bao-cao",
        icon: BarChart3,
      },
      {
        name: "Giám sát hệ thống",
        href: "/qtv-khoa/giam-sat-he-thong",
        icon: Settings,
      },
    ],
  };

  return navigationMap[userRole as UserRole] || [];
};

// Fallback navigation for admin route
const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Quản lý sửa chữa",
    href: "/admin/repairs",
    icon: Wrench,
  },
  {
    name: "Danh sách thiết bị",
    href: "/admin/assets",
    icon: ClipboardList,
  },
  {
    name: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Báo cáo",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Sidebar User Section

// Sidebar Navigation
function SidebarNavigation({
  navigation,
  pathname,
  isMobile,
  setIsMobileSidebarOpen,
  isCollapsed,
}: {
  navigation: NavigationItem[];
  pathname: string;
  isMobile?: boolean;
  setIsMobileSidebarOpen?: (v: boolean) => void;
  isCollapsed?: boolean;
}) {
  const handleNavClick = () => {
    if (isMobile && setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <nav className={`flex-1 py-6 space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}>
      {navigation.map((item: NavigationItem) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center ${
              isCollapsed ? "px-2" : "px-4"
            } py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "text-blue-200 hover:text-white hover:bg-blue-700"
            } ${isCollapsed ? "justify-center" : ""}`}
            onClick={handleNavClick}
            title={isCollapsed ? item.name : undefined}>
            <item.icon
              className={`${isCollapsed ? "" : "mr-3"} h-5 w-5 ${
                isActive ? "text-white" : "text-blue-300 group-hover:text-white"
              }`}
            />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

// Topbar
function Topbar({
  onLogout,
  isDesktopSidebarCollapsed,
  setIsDesktopSidebarCollapsed,
}: {
  onLogout: () => void;
  isDesktopSidebarCollapsed: boolean;
  setIsDesktopSidebarCollapsed: (collapsed: boolean) => void;
}) {
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="user-menu"]')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isUserMenuOpen]);

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <button
        className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden hover:bg-gray-50 hover:text-gray-600 transition-all"
        onClick={() => {
          const event = new CustomEvent("openMobileSidebar");
          window.dispatchEvent(event);
        }}
        aria-label="Mở menu">
        <Menu className="h-5 w-5" />
      </button>

      {/* Header với logo và tên trường */}
      <div className="flex-1 px-2 sm:px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Nút toggle sidebar cho desktop - chỉ hiện trên desktop */}
          <button
            className="hidden md:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() =>
              setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
            }
            title={
              isDesktopSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
            }
            aria-label={
              isDesktopSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
            }>
            {isDesktopSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          {/* Logo và tên trường */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Image
              src="/images/Logo_IUH.webp"
              alt="Logo"
              width={60}
              height={24}
              className="rounded-lg sm:w-[80px] sm:h-[32px] lg:w-[100px] lg:h-[40px]"
            />
            {/* Ẩn text trên mobile nhỏ, hiện trên sm và lớn hơn */}
            <div className="hidden sm:block">
              <h1 className="text-[10px] sm:text-[12px] lg:text-[14px] font-semibold text-gray-500 leading-tight">
                ĐẠI HỌC CÔNG NGHIỆP TP.HCM
              </h1>
              <p className="text-[8px] sm:text-[10px] lg:text-[12px] text-gray-400 font-medium leading-tight">
                KHOA CÔNG NGHỆ THÔNG TIN
              </p>
            </div>
          </div>
        </div>

        {/* User info và controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Role Switcher - ẩn trên mobile nhỏ */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Notifications */}
          <button
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Thông báo"
            aria-label="Thông báo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell-icon lucide-bell sm:w-6 sm:h-6">
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
          </button>

          {/* User dropdown menu */}
          <div className="relative" data-dropdown="user-menu">
            <button
              type="button"
              className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu">
              {/* User info - chỉ hiện trên tablet và desktop */}
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] lg:max-w-none">
                  {user?.fullName || "Nguyễn Kiến Thức"}
                </p>
                <p className="text-xs text-green-600 truncate">
                  {user && user.roles.length > 1
                    ? `${RoleInfo[user.activeRole]?.name || user.activeRole}`
                    : "Sinh viên"}
                </p>
              </div>
              {/* Avatar */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-white">
                  {user?.fullName?.charAt(0) || "N"}
                </span>
              </div>
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User info for mobile - chỉ hiện trên mobile */}
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName || "Nguyễn Kiến Thức"}
                  </p>
                  <p className="text-xs text-green-600 truncate">
                    {user && user.roles.length > 1
                      ? `${RoleInfo[user.activeRole]?.name || user.activeRole}`
                      : "Sinh viên"}
                  </p>
                </div>

                {/* Role Switcher for mobile - chỉ hiện trên mobile */}
                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <RoleSwitcher />
                </div>

                {/* Menu items */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    // Handle password update
                  }}>
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Cập nhật mật khẩu</span>
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    // Handle profile info
                  }}>
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Thông tin cá nhân</span>
                </button>

                <div className="border-t border-gray-100 mt-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}>
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  // Get navigation based on user active role
  const userNavigation = user?.activeRole
    ? getNavigationByRole(user.activeRole)
    : navigation;

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Listen for openMobileSidebar event
    const openSidebar = () => setIsMobileSidebarOpen(true);
    window.addEventListener("openMobileSidebar", openSidebar);
    return () => window.removeEventListener("openMobileSidebar", openSidebar);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="user-menu"]')) {
        // This will be handled by the Topbar component
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác thực tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-blue-900 shadow-lg z-40 transform transition-all duration-300 ease-in-out md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Mobile Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo-IUH-ngang-trang-300x131-1.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <span className="text-white font-semibold text-sm">
                HỆ THỐNG SỬA CHỮA
              </span>
              <p className="text-blue-200 text-xs">QUẢN LÝ THIẾT BỊ</p>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Đóng menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Mobile Navigation & user section */}
        <SidebarNavigation
          navigation={userNavigation}
          pathname={pathname}
          isMobile
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          isCollapsed={false}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div
          className={`flex flex-col transition-all duration-300 ${
            isDesktopSidebarCollapsed ? "w-16" : "w-64"
          }`}>
          <div className="flex flex-col flex-grow bg-blue-900 overflow-y-auto">
            {/* Desktop Header */}
            <div
              className={`flex flex-col items-center flex-shrink-0 px-6 py-2 bg-blue-900 ${
                isDesktopSidebarCollapsed ? "px-2" : "px-6"
              }`}>
              {!isDesktopSidebarCollapsed && (
                <>
                  <Image
                    src="/images/logo-IUH-ngang-trang-300x131-1.png"
                    alt="Logo"
                    width={100}
                    height={45}
                    className="rounded-lg mb-4"
                  />
                  <div>
                    <div className="text-[#8cb9de] font-medium text-[16px] text-center">
                      DANH MỤC QUẢN LÝ
                    </div>
                    <div className="text-gray-100 font-medium text-xs mt-1 text-center">
                      SỬA CHỮA THIẾT BỊ
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <SidebarNavigation
              navigation={userNavigation}
              pathname={pathname}
              isCollapsed={isDesktopSidebarCollapsed}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <Topbar
          onLogout={handleLogout}
          isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
          setIsDesktopSidebarCollapsed={setIsDesktopSidebarCollapsed}
        />
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
