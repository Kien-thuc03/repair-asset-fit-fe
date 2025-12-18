"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
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
  Shield,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Search,
  FileCheck,
  MapPin,
  FolderCode,
  TriangleAlert,
  TimerReset,
  ClipboardEdit,
  CheckCircle,
  Package,
  QrCode,
  Monitor,
} from "lucide-react";

// Navigation items
interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
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
        name: "Báo hỏng thiết bị",
        href: "/giang-vien/bao-cao-loi",
        icon: TriangleAlert,
      },
      {
        name: "Đề xuất phần mềm",
        href: "/giang-vien/de-xuat-phan-mem",
        icon: FolderCode,
      },
      {
        name: "Quản lý tiến độ",
        icon: TimerReset,
        children: [
          {
            name: "Danh sách báo hỏng thiết bị",
            href: "/giang-vien/danh-sach-yeu-cau-sua-chua",
            icon: Clock,
          },
          {
            name: "Danh sách đề xuất phần mềm",
            href: "/giang-vien/danh-sach-de-xuat-phan-mem",
            icon: FileText,
          },
        ],
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
        icon: Wrench,
        children: [
          {
            name: "Ghi nhận và xử lý lỗi",
            href: "/ky-thuat-vien/quan-ly-bao-loi/ghi-nhan-xu-ly-loi",
            icon: ClipboardList,
          },
          {
            name: "Danh sách báo lỗi",
            href: "/ky-thuat-vien/quan-ly-bao-loi",
            icon: FileText,
          },
        ],
      },
      {
        name: "Quản lý thay thế linh kiện",
        icon: FileText,
        children: [
          {
            name: "Kho linh kiện",
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/kho-linh-kien",
            icon: Package,
          },
          {
            name: "Lập phiếu đề xuất linh kiện",
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat",
            icon: ClipboardList,
          },
          {
            name: "Danh sách đề xuất",
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien",
            icon: FileText,
          },
        ],
      },
      {
        name: "Quản lý đề xuất phần mềm",
        href: "/ky-thuat-vien/quan-ly-de-xuat-phan-mem",
        icon: FileText,
      },
      {
        name: "Quản lý thiết bị",
        href: "/ky-thuat-vien/quan-ly-thiet-bi",
        icon: Settings,
      },
      // {
      //   name: "Thống kê cá nhân",
      //   href: "/ky-thuat-vien/thong-ke-ca-nhan",
      //   icon: BarChart3,
      // },
    ],
    [UserRole.TO_TRUONG_KY_THUAT]: [
      {
        name: "Dashboard",
        href: "/to-truong-ky-thuat",
        icon: LayoutDashboard,
      },
      {
        name: "Quản lý đề xuất",
        icon: FileCheck,
        children: [
          {
            name: "Danh sách đề xuất",
            href: "/to-truong-ky-thuat/duyet-de-xuat",
            icon: ClipboardEdit,
          },
          {
            name: "Danh sách tờ trình",
            href: "/to-truong-ky-thuat/lap-to-trinh",
            icon: FileText,
          },
          {
            name: "Danh sách biên bản",
            href: "/to-truong-ky-thuat/bien-ban",
            icon: Calendar,
          },
          {
            name: "Danh sách đề xuất phần mềm",
            href: "/to-truong-ky-thuat/danh-sach-de-xuat-phan-mem",
            icon: CheckCircle,
          },
        ],
      },
      {
        name: "Quản lý khu vực",
        href: "/to-truong-ky-thuat/phan-cong",
        icon: MapPin,
      },
      {
        name: "Quản lý báo hỏng thiết bị",
        href: "/to-truong-ky-thuat/danh-sach-bao-loi",
        icon: ClipboardList,
      },
      {
        name: "Quản lý thiết bị",
        icon: Monitor,
        children: [
          {
            name: "Danh sách thiết bị",
            href: "/to-truong-ky-thuat/quan-ly-thiet-bi",
            icon: Search,
          },
          {
            name: "Mã QR thiết bị",
            href: "/to-truong-ky-thuat/quan-ly-thiet-bi/ma-qr-thiet-bi",
            icon: QrCode,
          },
        ],
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
        name: "Quản lý tờ trình",
        href: "/phong-quan-tri/xu-ly-to-trinh",
        icon: FileText,
      },
      {
        name: "Quản lý biên bản",
        href: "/phong-quan-tri/lap-bien-ban",
        icon: ClipboardList,
      },
      {
        name: "Danh sách mua sắm thiết bị",
        href: "/phong-quan-tri/gui-de-xuat-thay-the",
        icon: FileCheck,
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
        name: "Quản lý đề xuất",
        icon: Shield,
        children: [
          {
            name: "Danh sách đề xuất linh kiện",
            href: "/qtv-khoa/duyet-to-trinh",
            icon: ClipboardList,
          },
          {
            name: "Danh sách đề xuất phần mềm",
            href: "/qtv-khoa/quan-ly-de-xuat-phan-mem",
            icon: FolderCode,
          },
        ],
      },
      // {
      //   name: "Duyệt tờ trình",
      //   href: "/qtv-khoa/duyet-to-trinh",
      //   icon: ClipboardList
      // }
    ],
  };

  return (
    (navigationMap[
      userRole as keyof typeof navigationMap
    ] as NavigationItem[]) || []
  );
};

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
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleNavClick = () => {
    if (isMobile && setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prev: string[]) =>
      prev.includes(itemName)
        ? prev.filter((name: string) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Check if any child is active
  const isChildActive = useCallback(
    (children: NavigationItem[]) => {
      return children.some((child) => pathname === child.href);
    },
    [pathname]
  );

  // Auto-open dropdown if child is active
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        setOpenDropdowns((prev: string[]) =>
          prev.includes(item.name) ? prev : [...prev, item.name]
        );
      }
    });
  }, [pathname, navigation, isChildActive]);

  return (
    <nav className={`flex-1 py-6 space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}>
      {navigation.map((item: NavigationItem) => {
        // If item has children (dropdown)
        if (item.children) {
          const isDropdownOpen = openDropdowns.includes(item.name);
          const hasActiveChild = isChildActive(item.children);

          return (
            <div key={item.name} className="space-y-1">
              {/* Parent item */}
              <button
                className={`group flex items-center justify-between w-full ${
                  isCollapsed ? "px-2" : "px-4"
                } py-3 text-sm font-medium rounded-lg transition-colors ${
                  hasActiveChild
                    ? "bg-blue-700 text-white"
                    : "text-blue-200 hover:text-white hover:bg-blue-700"
                }`}
                onClick={() => !isCollapsed && toggleDropdown(item.name)}
                title={isCollapsed ? item.name : undefined}>
                <div className="flex items-center">
                  <item.icon
                    className={`${isCollapsed ? "" : "mr-3"} h-5 w-5 ${
                      hasActiveChild
                        ? "text-white"
                        : "text-blue-300 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight
                    className={`h-4 w-4 transform transition-transform ${
                      isDropdownOpen ? "rotate-90" : ""
                    } ${
                      hasActiveChild
                        ? "text-white"
                        : "text-blue-300 group-hover:text-white"
                    }`}
                  />
                )}
              </button>

              {/* Children items */}
              {!isCollapsed && isDropdownOpen && (
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => {
                    const isChildItemActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href!}
                        className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isChildItemActive
                            ? "bg-blue-600 text-white"
                            : "text-blue-200 hover:text-white hover:bg-blue-600"
                        }`}
                        onClick={handleNavClick}>
                        <child.icon
                          className={`mr-3 h-4 w-4 ${
                            isChildItemActive
                              ? "text-white"
                              : "text-blue-300 group-hover:text-white"
                          }`}
                        />
                        <span>{child.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Regular item without children
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href!}
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
  router,
}: {
  onLogout: () => void;
  isDesktopSidebarCollapsed: boolean;
  setIsDesktopSidebarCollapsed: (collapsed: boolean) => void;
  router: AppRouterInstance;
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
              src="/images/Logo-rut-gon.png"
              alt="Logo"
              width={36}
              height={24}
              className="rounded-lg sm:h-[32px] lg:h-[40px]"
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
                  {user && user.roles.length >= 1
                    ? `${
                        user.activeRole?.name ||
                        (user.activeRole?.code &&
                          RoleInfo[user.activeRole.code as UserRole]?.name) ||
                        "Chưa có vai trò"
                      }`
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
                      ? `${
                          user.activeRole?.name ||
                          (user.activeRole?.code &&
                            RoleInfo[user.activeRole.code as UserRole]?.name) ||
                          "Chưa có vai trò"
                        }`
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
                    router.push("/profile/edit");
                  }}>
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Cập nhật thông tin cá nhân</span>
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/profile");
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
  const userNavigation = user?.activeRole?.code
    ? getNavigationByRole(user.activeRole.code)
    : [];

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
              src="/images/Logo-new-light.png"
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
            isDesktopSidebarCollapsed ? "w-20" : "w-72"
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
                    src="/images/Logo-new-light.png"
                    alt="Logo"
                    width={150}
                    height={45}
                    className="rounded-lg mb-2"
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
          router={router}
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
