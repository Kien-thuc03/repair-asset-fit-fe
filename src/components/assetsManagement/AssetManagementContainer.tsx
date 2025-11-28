"use client";
import { useState, useEffect, useMemo } from "react";
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
import { getAssignedFloors, AssignedFloor } from "@/lib/api/repairs";
import type { Computer, DeviceAsset } from "@/types/computer";

/**
 * Helper function to convert Computer to DeviceAsset
 * Maps backend Computer structure to frontend Asset display format
 */
const convertComputerToDeviceAsset = (computer: Computer): DeviceAsset => {
  return {
    id: computer.asset.id,
    ktCode: computer.asset.ktCode,
    name: computer.asset.name,
    category: computer.asset.categoryName || "Máy tính",
    specs: computer.asset.specs || "Không có thông số",
    fixedCode: computer.asset.fixedCode,
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

  // State for technician assignments (only for technicians)
  const [assignedFloors, setAssignedFloors] = useState<AssignedFloor[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Check if current user is a technician (not team lead)
  const isTechnician = pathname.includes("/ky-thuat-vien/") && !pathname.includes("/to-truong-ky-thuat/");
  const isTeamLead = pathname.includes("/to-truong-ky-thuat/");
  const hasAssignments = isTechnician && assignedFloors.length > 0;

  const technicianRooms = useMemo(() => {
    if (!hasAssignments) return [];
    return rooms.filter((room) =>
      assignedFloors.some(
        (assigned) =>
          assigned.building === room.building && assigned.floor === room.floor
      )
    );
  }, [rooms, assignedFloors, hasAssignments]);

  // Convert computers to device assets for display
  const allDeviceAssets: DeviceAsset[] = computers.map(convertComputerToDeviceAsset);

  // Filter device assets based on technician assignments (only for technicians)
  const filteredDeviceAssets: DeviceAsset[] = hasAssignments
    ? allDeviceAssets.filter((asset) => {
        // Check if asset's building/floor is in assigned floors
        return assignedFloors.some(
          (assigned) =>
            assigned.building === asset.building &&
            assigned.floor === asset.floor
        );
      })
    : allDeviceAssets;

  // Calculate pagination for filtered results (for technicians with assignments)
  // For team leads, use API pagination
  const totalFiltered = hasAssignments 
    ? filteredDeviceAssets.length 
    : (pagination?.total || 0);

  // Apply frontend pagination for technicians (since we filter after fetching)
  const startIndex = hasAssignments 
    ? (currentPage - 1) * pageSize 
    : 0;
  const endIndex = hasAssignments
    ? startIndex + pageSize
    : filteredDeviceAssets.length;

  const deviceAssets: DeviceAsset[] = hasAssignments
    ? filteredDeviceAssets.slice(startIndex, endIndex)
    : filteredDeviceAssets;

  // Calculate pagination info for display
  const displayPagination = hasAssignments
    ? {
        total: totalFiltered,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(totalFiltered / pageSize),
      }
    : pagination;

  const hasActiveFilters =
    !!searchTerm.trim() ||
    !!statusFilter ||
    !!buildingFilter ||
    !!floorFilter ||
    !!roomFilter;

  const statsAssets = hasAssignments ? filteredDeviceAssets : deviceAssets;
  const statsSummary = !hasAssignments && !hasActiveFilters ? summary : null;

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

  // Reset invalid filters when technician assignments change
  useEffect(() => {
    if (!hasAssignments) return;

    if (
      buildingFilter &&
      !assignedFloors.some((af) => af.building === buildingFilter)
    ) {
      setBuildingFilter("");
      setFloorFilter("");
      setRoomFilter("");
      setFilteredFloors([]);
      setFilteredRooms([]);
      setCurrentPage(1);
      return;
    }

    if (
      floorFilter &&
      !assignedFloors.some(
        (af) => af.building === buildingFilter && af.floor === floorFilter
      )
    ) {
      setFloorFilter("");
      setRoomFilter("");
      setFilteredRooms([]);
      setCurrentPage(1);
    }
  }, [assignedFloors, hasAssignments, buildingFilter, floorFilter]);

  // Fetch assigned floors for technicians (only if user is a technician)
  useEffect(() => {
    if (!isTechnician) {
      // Team lead can see all devices, no need to fetch assignments
      setAssignedFloors([]);
      return;
    }

    const fetchAssignedFloors = async () => {
      try {
        setLoadingAssignments(true);
        const response = await getAssignedFloors();
        setAssignedFloors(response.assignedFloors || []);
      } catch (err) {
        console.error("Error fetching assigned floors:", err);
        // Don't show error message, just log it
        // If assignment fetch fails, technician will see no devices (which is correct behavior)
        setAssignedFloors([]);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignedFloors();
  }, [isTechnician]);

  // Fetch computers when filters or pagination change
  // For technicians with assigned floors, we fetch a larger dataset and filter/paginate in frontend
  // For team leads, use normal API pagination
  useEffect(() => {
    // Skip fetch if technician is still loading assignments
    if (isTechnician && loadingAssignments) {
      return;
    }

    // For technicians with assigned floors, fetch larger dataset (we'll filter and paginate in frontend)
    // For team leads or technicians without assignments, use normal pagination
    const shouldFetchAll = isTechnician && assignedFloors.length > 0;
    const effectivePageSize = shouldFetchAll ? 1000 : pageSize; // Fetch up to 1000 items for technicians
    const effectivePage = shouldFetchAll ? 1 : currentPage;

    const params: {
      page: number;
      limit: number;
      search?: string;
      status?: string[];
      building?: string;
      floor?: string;
      roomName?: string;
    } = {
      page: effectivePage,
      limit: effectivePageSize,
    };

    // Add search filter (only if not empty)
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }

    // Add status filter (only if not empty)
    if (statusFilter && statusFilter.trim()) {
      params.status = [statusFilter];
    }

    // For technicians with assigned floors, don't add building/floor filters here
    // We'll filter by assigned floors in frontend
    // For team leads, use normal filters
    if (!shouldFetchAll) {
      // Add building filter (only if not empty)
      if (buildingFilter && buildingFilter.trim()) {
        params.building = buildingFilter;
      }

      // Add floor filter (only if not empty)
      if (floorFilter && floorFilter.trim()) {
        params.floor = floorFilter;
      }
    }

    // Add room filter (only if not empty)
    if (roomFilter && roomFilter.trim()) {
      params.roomName = roomFilter;
    }

    fetchComputers(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, floorFilter, buildingFilter, roomFilter, currentPage, pageSize, isTechnician, assignedFloors.length, loadingAssignments]);

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
      const sourceRooms = hasAssignments ? technicianRooms : rooms;
      const floorsInBuilding = hasAssignments
        ? Array.from(
            new Set(
              assignedFloors
                .filter((floor) => floor.building === value)
                .map((floor) => floor.floor)
                .filter(Boolean)
            )
          ).sort()
        : Array.from(
            new Set(
              sourceRooms
                .filter((room) => room.building === value)
                .map((room) => room.floor)
                .filter(Boolean)
            )
          ).sort();
      setFilteredFloors(floorsInBuilding);
      const roomsInBuilding = sourceRooms.filter(
        (room) => room.building === value
      );
      setFilteredRooms(roomsInBuilding);
    } else {
      setFilteredFloors([]);
      setFilteredRooms([]);
    }
  };

  // Handle floor change - cascade filter
  const handleFloorChange = (value: string) => {
    setFloorFilter(value);
    setRoomFilter("");
    setCurrentPage(1);

    if (value && buildingFilter) {
      const sourceRooms = hasAssignments ? technicianRooms : rooms;
      const roomsInFloor = sourceRooms.filter(
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
  const buildings = hasAssignments
    ? Array.from(
        new Set(assignedFloors.map((floor) => floor.building).filter(Boolean))
      ).sort()
    : Array.from(
        new Set(rooms.map((room) => room.building).filter(Boolean))
      ).sort();

  // Use filteredFloors if building is selected, otherwise show all unique floors
  const floors =
    filteredFloors.length > 0
      ? filteredFloors
      : hasAssignments
      ? Array.from(
          new Set(assignedFloors.map((floor) => floor.floor).filter(Boolean))
        ).sort()
      : Array.from(
          new Set(rooms.map((room) => room.floor).filter(Boolean))
        ).sort();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
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

      {/* Quick Stats */}
      <DeviceStatsCards 
        assets={statsAssets} 
        summary={statsSummary}
        loading={loading || loadingAssignments}
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
      {(loading || loadingAssignments) && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && !loadingAssignments && (
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

      {/* Info message for technicians when no assigned floors */}
      {isTechnician && !loadingAssignments && assignedFloors.length === 0 && !loading && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Bạn chưa được phân công quản lý tầng nào. Vui lòng liên hệ tổ trưởng kỹ thuật để được phân công.
          </p>
        </div>
      )}

      {/* Device Grid */}
      {!loading && !loadingAssignments && !error && (
        <DeviceGrid assets={deviceAssets} onViewDetail={handleViewDetail} />
      )}

      {/* Pagination */}
      {!loading && !loadingAssignments && !error && displayPagination && displayPagination.total > 0 && (
        <div className="bg-white shadow rounded-lg">
          <Pagination
            currentPage={displayPagination.page}
            pageSize={displayPagination.limit}
            total={displayPagination.total}
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
