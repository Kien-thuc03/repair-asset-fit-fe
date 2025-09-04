"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
      }
    ],
    [UserRole.KY_THUAT_VIEN]: [
      {
        name: "Dashboard",
        href: "/ky-thuat-vien",
        icon: LayoutDashboard,
      },
      {
        name: "Xử lý lỗi",
        href: "/ky-thuat-vien/xu-ly-loi",
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
      }
    ],
    [UserRole.TO_TRUONG_KY_THUAT]: [
      {
        name: "Dashboard",
        href: "/to-truong-ky-thuat",
        icon: LayoutDashboard,
      },
      {
        name: "Quản lý KTV",
        href: "/to-truong-ky-thuat/quan-ly-ky-thuat-vien",
        icon: Users,
      },
      {
        name: "Giám sát lỗi",
        href: "/to-truong-ky-thuat/giam-sat-loi",
        icon: ClipboardList,
      },
      {
        name: "Phê duyệt thay thế",
        href: "/to-truong-ky-thuat/phe-duyet-thay-the",
        icon: CheckCircle,
      },
      {
        name: "Lập tờ trình",
        href: "/to-truong-ky-thuat/lap-to-trinh",
        icon: FileText,
      }
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
      }
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
      }
    ]
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
function SidebarUserSection({ handleLogout }: { handleLogout: () => void }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{RoleInfo[user.activeRole]?.name || user.activeRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Sidebar Navigation
function SidebarNavigation({
  navigation,
  pathname,
  isMobile,
  setIsMobileSidebarOpen,
}: {
  navigation: NavigationItem[];
  pathname: string;
  isMobile?: boolean;
  setIsMobileSidebarOpen?: (v: boolean) => void;
}) {
  const handleNavClick = () => {
    if (isMobile && setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {navigation.map((item: NavigationItem) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleNavClick}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-500"
              }`}
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Topbar
function Topbar() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 13) return "Chào buổi trưa";
    if (hour >= 13 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <button
        className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden hover:bg-gray-50 hover:text-gray-600 transition-all"
        onClick={() => {
          const event = new CustomEvent("openMobileSidebar");
          window.dispatchEvent(event);
        }}
        aria-label="Mở menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <span>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Role Switcher */}
          <RoleSwitcher />
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-right">
                {getGreeting()} {user?.name.split(' ').pop()}
              </h1>
              <p className="text-xs text-gray-500 font-normal mt-0.5 text-right">
                {user && user.roles.length > 1 ? `Vai trò: ${RoleInfo[user.activeRole]?.name || user.activeRole}` : 'Chúc bạn có một ngày tuyệt vời!'}
              </p>
            </div>
            <div className="relative p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-100/50">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
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
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  // Get navigation based on user active role
  const userNavigation = user?.activeRole ? getNavigationByRole(user.activeRole) : navigation;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    // Listen for openMobileSidebar event
    const openSidebar = () => setIsMobileSidebarOpen(true);
    window.addEventListener("openMobileSidebar", openSidebar);
    return () => window.removeEventListener("openMobileSidebar", openSidebar);
  }, [pathname]);

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
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-all duration-300 ease-in-out md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">
                Repair Asset
              </span>
              <p className="text-xs text-gray-500 font-medium">
                Khoa CNTT - IUH
              </p>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Mobile Navigation & user section */}
        <SidebarNavigation
          navigation={userNavigation}
          pathname={pathname}
          isMobile
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <SidebarUserSection handleLogout={handleLogout} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
            {/* Desktop Header */}
            <div className="flex items-center flex-shrink-0 px-6 py-5 bg-white border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900">
                  Repair Asset
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  {user?.activeRole && RoleInfo[user.activeRole]?.name || 'Khoa CNTT - IUH'}
                </p>
              </div>
            </div>
            {/* Navigation */}
            <SidebarNavigation
              navigation={userNavigation}
              pathname={pathname}
            />
            {/* Desktop user section */}
            <SidebarUserSection handleLogout={handleLogout} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <Topbar />
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
