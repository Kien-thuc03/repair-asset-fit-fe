"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Breadcrumb, message } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  DeviceManagementHeader,
  DeviceStatsCards,
  DeviceFilters,
  DeviceGrid,
} from "@/components/assetsManagement";
import { useComputers } from "@/hooks";
import { getRoomsApi, RoomResponseDto } from "@/lib/api/rooms";
import type { Computer, DeviceAsset } from "@/types/computer";

/**
 * Helper function to convert Computer to DeviceAsset
 * Maps backend Computer structure to frontend Asset display format
 */
const convertComputerToDeviceAsset = (computer: Computer): DeviceAsset => {
  return {
    id: computer.asset.id,
    assetCode: computer.asset.ktCode,
    name: computer.asset.name,
    category: computer.asset.categoryName || "Máy tính",
    model: computer.asset.specs || "Không có thông số",
    serialNumber: computer.asset.fixedCode,
    roomId: computer.room?.id || "",
    roomName: computer.room?.name || "Không xác định",
    status: computer.asset.status,
    purchaseDate: computer.asset.entrydate,
    warrantyExpiry: "2025-12-31", // Default warranty - có thể tính từ entrydate
    qrCode: `QR_${computer.asset.ktCode}`,
    building: computer.room?.building,
    floor: computer.room?.floor,
    machineLabel: computer.machineLabel,
    componentCount: computer.componentCount,
  };
};

export default function TechnicianDeviceManagementContainer() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract role from pathname to create dynamic links
  const getRoleFromPath = () => {
    if (pathname.includes("/ky-thuat-vien/")) return "/ky-thuat-vien";
    if (pathname.includes("/to-truong-ky-thuat/")) return "/to-truong-ky-thuat";
    return "/ky-thuat-vien"; // default fallback
  };

  const rolePath = getRoleFromPath();

  // Use computers hook to fetch data from API
  const { computers, pagination, summary, loading, error, fetchComputers } =
    useComputers();

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [buildingFilter, setBuildingFilter] = useState<string>("");
  const [floorFilter, setFloorFilter] = useState<string>("");
  const [roomFilter, setRoomFilter] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  // Pagination state (managed by API)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 12 items per page for grid layout

  // State for rooms data and cascade filtering
  const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
  const [filteredFloors, setFilteredFloors] = useState<string[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomResponseDto[]>([]);

  // Convert computers to device assets for display
  const deviceAssets: DeviceAsset[] = computers.map(convertComputerToDeviceAsset);

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-y: auto;
      }
      
      body {
        min-height: 100vh;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch rooms from API for cascade filtering
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRoomsApi();
        setRooms(roomsData);
      } catch {
        message.error("Không thể tải danh sách phòng. Vui lòng thử lại.");
      }
    };
    fetchRooms();
  }, []);

  // Fetch computers when filters or pagination change
  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      status?: string[];
      building?: string;
      floor?: string;
      roomName?: string;
    } = {
      page: currentPage,
      limit: pageSize,
    };

    // Add search filter (only if not empty)
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }

    // Add status filter (only if not empty)
    if (statusFilter && statusFilter.trim()) {
      params.status = [statusFilter];
    }

    // Add building filter (only if not empty)
    if (buildingFilter && buildingFilter.trim()) {
      params.building = buildingFilter;
    }

    // Add floor filter (only if not empty)
    if (floorFilter && floorFilter.trim()) {
      params.floor = floorFilter;
    }

    // Add room filter (only if not empty)
    if (roomFilter && roomFilter.trim()) {
      params.roomName = roomFilter;
    }

    // Always fetch when dependencies change (including when filters are cleared)
    fetchComputers(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, floorFilter, buildingFilter, roomFilter, currentPage, pageSize]);

  // Show error message if API call fails
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Simulate QR scan for demo
  const simulateQRScan = () => {
    if (deviceAssets.length > 0) {
      const randomAsset = deviceAssets[Math.floor(Math.random() * deviceAssets.length)];
      router.push(`${rolePath}/quan-ly-thiet-bi/chi-tiet/${randomAsset.id}`);
    } else {
      message.info("Chưa có thiết bị nào");
    }
  };

  // Handle view detail
  const handleViewDetail = (assetId: string) => {
    router.push(`${rolePath}/quan-ly-thiet-bi/chi-tiet/${assetId}`);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  // Handle filter changes - reset to page 1
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Handle building change - cascade filter
  const handleBuildingChange = (value: string) => {
    setBuildingFilter(value);
    setFloorFilter("");
    setRoomFilter("");
    setCurrentPage(1);

    if (value) {
      // Filter floors by building
      const floorsInBuilding = Array.from(
        new Set(
          rooms
            .filter((room) => room.building === value)
            .map((room) => room.floor)
            .filter(Boolean)
        )
      ).sort();
      setFilteredFloors(floorsInBuilding);
    } else {
      setFilteredFloors([]);
    }
    setFilteredRooms([]);
  };

  // Handle floor change - cascade filter
  const handleFloorChange = (value: string) => {
    setFloorFilter(value);
    setRoomFilter("");
    setCurrentPage(1);

    if (value && buildingFilter) {
      // Filter rooms by building and floor
      const roomsInFloor = rooms.filter(
        (room) => room.building === buildingFilter && room.floor === value
      );
      setFilteredRooms(roomsInFloor);
    } else {
      setFilteredRooms([]);
    }
  };

  // Handle room change
  const handleRoomChange = (value: string) => {
    setRoomFilter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setBuildingFilter("");
    setFloorFilter("");
    setRoomFilter("");
    setFilteredFloors([]);
    setFilteredRooms([]);
    setCurrentPage(1);
  };

  // Extract unique buildings from rooms
  const buildings = Array.from(
    new Set(rooms.map((room) => room.building).filter(Boolean))
  ).sort();

  // Use filteredFloors if building is selected, otherwise show all unique floors
  const floors = filteredFloors.length > 0 ? filteredFloors : Array.from(
    new Set(rooms.map((room) => room.floor).filter(Boolean))
  ).sort();

  return (
    <div className="space-y-6 main-content">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: rolePath,
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Quản lý thiết bị</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <DeviceManagementHeader isMobile={isMobile} onQRScan={simulateQRScan} />

      {/* Quick Stats - Use summary from API */}
      <DeviceStatsCards 
        assets={deviceAssets} 
        summary={summary}
        loading={loading}
      />

      {/* Filters */}
      <DeviceFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        buildingFilter={buildingFilter}
        floorFilter={floorFilter}
        roomFilter={roomFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onBuildingChange={handleBuildingChange}
        onFloorChange={handleFloorChange}
        onRoomChange={handleRoomChange}
        onClearAll={clearAllFilters}
        buildings={buildings}
        floors={floors}
        rooms={filteredRooms}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchComputers({ page: currentPage, limit: pageSize })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Device Grid */}
      {!loading && !error && (
        <DeviceGrid assets={deviceAssets} onViewDetail={handleViewDetail} />
      )}

      {/* Pagination */}
      {!loading && !error && pagination && pagination.total > 0 && (
        <div className="bg-white shadow rounded-lg">
          <Pagination
            currentPage={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={true}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </div>
      )}
    </div>
  );
}
