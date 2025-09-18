"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Asset } from "@/types";
import { mockAssetsLookup } from "@/lib/mockData";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";
import AssetLookupHeader from "./AssetLookupHeader";
import AssetStatsCards from "./AssetStatsCards";
import AssetFilters from "./AssetFilters";
import AssetGrid from "./AssetGrid";

// Function to extract floor from room name (e.g., "A1.01" -> "Tầng 1")
const getFloorFromRoomName = (roomName: string): string => {
  // Extract floor number from room name pattern (A1.01, B2.05, etc.)
  const match = roomName.match(/^[A-Z](\d+)\./);
  if (match) {
    const floorNumber = match[1];
    return `Tầng ${floorNumber}`;
  }
  return "";
};

export default function AssetLookupContainer() {
  const router = useRouter();
  const [assets] = useState<Asset[]>(mockAssetsLookup);
  const [filteredAssets, setFilteredAssets] =
    useState<Asset[]>(mockAssetsLookup);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [isMobile, setIsMobile] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 12 items per page for grid layout
  const [paginatedAssets, setPaginatedAssets] = useState<Asset[]>([]);

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

  // Simulate QR scan for demo
  const simulateQRScan = () => {
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    router.push(`/giang-vien/tra-cuu-thiet-bi/chi-tiet/${randomAsset.id}`);
  };

  // Handle view detail
  const handleViewDetail = (assetId: string) => {
    router.push(`/giang-vien/tra-cuu-thiet-bi/chi-tiet/${assetId}`);
  };

  // Function to extract floor from room name
  const getFloorFromRoomName = (roomName: string): string => {
    // Extract floor information from room name
    // Examples: "H101" -> "Tầng 1", "H202" -> "Tầng 2", etc.
    const match = roomName.match(/H(\d)/);
    if (match) {
      const floorNumber = match[1];
      return `Tầng ${floorNumber}`;
    }
    return "Không xác định";
  };

  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    if (floorFilter !== "all") {
      filtered = filtered.filter((asset) => {
        const assetFloor = getFloorFromRoomName(asset.roomName);
        return assetFloor === floorFilter;
      });
    }

    setFilteredAssets(filtered);

    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [assets, searchTerm, statusFilter, floorFilter]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredAssets.slice(startIndex, endIndex);
    setPaginatedAssets(paginated);
  }, [filteredAssets, currentPage, pageSize]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  // Generate floors from assets using the getFloorFromRoomName function
  const floors = Array.from(
    new Set(
      assets
        .map((asset) => getFloorFromRoomName(asset.roomName))
        .filter((floor) => floor) // Remove empty floors
    )
  ).sort();

  return (
    <div className="space-y-6 main-content">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Tra cứu thiết bị</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <AssetLookupHeader isMobile={isMobile} onQRScan={simulateQRScan} />
      {/* Quick Stats */}
      <AssetStatsCards assets={assets} />
      {/* Filters */}
      <AssetFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        floorFilter={floorFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onFloorChange={setFloorFilter}
        floors={floors}
      />{" "}
      {/* Asset Grid */}
      <AssetGrid
        assets={paginatedAssets}
        totalAssets={filteredAssets.length}
        onViewDetail={handleViewDetail}
      />
      {/* Pagination */}
      {filteredAssets.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredAssets.length}
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
