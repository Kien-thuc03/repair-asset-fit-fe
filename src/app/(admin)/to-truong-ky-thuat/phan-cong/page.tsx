"use client";
import { useState, useEffect } from "react";
import { Technician } from "@/types";
import { Room } from "@/types/unit";
import { mockRooms as originalMockRooms } from "@/lib/mockData/rooms";
import { users } from "@/lib/mockData/users";
import { getTechnicianForArea } from "@/lib/mockData/technicianAssignments";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  AssignmentHeader,
  TabNavigation,
  SearchFilters,
  AreasTable,
  TechniciansGrid,
  ExportModals,
} from "@/components/leadTechnician/assignment";

export default function PhanCongPage() {
  // Create technicians from users data using technician assignments
  const mockTechnicians: Technician[] = users
    .filter((user) => user.id === "user-8" || user.id === "user-9")
    .map((user) => {
      const areaRanges = user.id === "user-8" ? ["Tầng 1-5"] : ["Tầng 6-9"];

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        status: "active" as const,
        assignedAreas: areaRanges,
        currentTask:
          user.id === "user-8"
            ? "Kiểm tra hệ thống mạng tầng 3"
            : "Bảo trì máy tính phòng H601",
      };
    });

  // Sử dụng rooms từ mockData và mapping lại assignedTechnician dựa trên technicianAssignments
  const mockRooms: Room[] = originalMockRooms.map((room) => {
    // Tìm kỹ thuật viên được phân công cho khu vực này
    const assignedTechnician = getTechnicianForArea(
      room.building || "Tòa H",
      room.floor || ""
    );

    return {
      ...room,
      assignedTechnician,
    };
  });

  const [technicians] = useState<Technician[]>(mockTechnicians);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [activeTab, setActiveTab] = useState<"areas" | "technicians">("areas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export states
  const [exportCount, setExportCount] = useState(0);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Reset mọi scrollbar styling để tránh xung đột */
      html, body {
        overflow: auto;
        scrollbar-gutter: auto;
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAssignTechnician = (roomId: string, technicianId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, assignedTechnician: technicianId || undefined }
          : room
      )
    );
    setEditingRoom(null);
    setSelectedTechnician("");
  };

  const getTechnicianName = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    return tech?.name || "Chưa phân công";
  };

  const filteredRooms = rooms.filter(
    (room) =>
      searchTerm === "" ||
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.building &&
        room.building.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.floor &&
        room.floor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sắp xếp rooms đã lọc
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (!sortField || sortDirection === "none") return 0;

    let aValue: string = "";
    let bValue: string = "";

    switch (sortField) {
      case "name":
        aValue = a.roomNumber;
        bValue = b.roomNumber;
        break;
      case "building":
        aValue = a.building || "";
        bValue = b.building || "";
        break;
      case "floors":
        aValue = a.floor || "";
        bValue = b.floor || "";
        break;
      case "technician":
        aValue = getTechnicianName(a.assignedTechnician || "");
        bValue = getTechnicianName(b.assignedTechnician || "");
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredTechnicians = technicians.filter(
    (tech) =>
      searchTerm === "" ||
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const getCurrentData = () => {
    if (activeTab === "areas") {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return sortedRooms.slice(startIndex, endIndex);
    } else {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredTechnicians.slice(startIndex, endIndex);
    }
  };

  const getCurrentTotal = () => {
    return activeTab === "areas"
      ? sortedRooms.length
      : filteredTechnicians.length;
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (activeTab === "areas") {
      setSelectedItems(checked ? sortedRooms.map((room) => room.id) : []);
    } else {
      setSelectedItems(
        checked ? filteredTechnicians.map((tech) => tech.id) : []
      );
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      setSelectAll(false);
    }
  };

  // Export handler
  const handleExportExcel = () => {
    const itemsToExport =
      activeTab === "areas"
        ? selectedItems.length > 0
          ? sortedRooms.filter((room) => selectedItems.includes(room.id))
          : sortedRooms
        : selectedItems.length > 0
        ? filteredTechnicians.filter((tech) => selectedItems.includes(tech.id))
        : filteredTechnicians;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Reset pagination when changing tabs or search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [activeTab, searchTerm]);

  const handleEditRoom = (roomId: string, technicianId: string) => {
    setEditingRoom(roomId);
    setSelectedTechnician(technicianId);
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setSelectedTechnician("");
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Phân công khu vực</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <AssignmentHeader
        selectedItemsCount={selectedItems.length}
        totalItems={getCurrentTotal()}
        onExportExcel={handleExportExcel}
      />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <SearchFilters
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {activeTab === "areas" ? (
        /* Areas Tab */
        <>
          <AreasTable
            rooms={getCurrentData() as Room[]}
            technicians={technicians}
            selectedItems={selectedItems}
            selectAll={selectAll}
            editingRoom={editingRoom}
            selectedTechnician={selectedTechnician}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onEditRoom={handleEditRoom}
            onAssignTechnician={handleAssignTechnician}
            onCancelEdit={handleCancelEdit}
            onSetSelectedTechnician={setSelectedTechnician}
          />

          {/* Pagination for Areas */}
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={getCurrentTotal()}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      ) : (
        /* Technicians Tab */
        <>
          <TechniciansGrid
            technicians={getCurrentData() as Technician[]}
            rooms={rooms}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
          />

          {/* Pagination for Technicians */}
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={getCurrentTotal()}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            className="mt-6"
          />
        </>
      )}

      {/* Export Modals */}
      <ExportModals
        showExportSuccessModal={showExportSuccessModal}
        showExportErrorModal={showExportErrorModal}
        exportCount={exportCount}
        onCloseSuccessModal={() => setShowExportSuccessModal(false)}
        onCloseErrorModal={() => setShowExportErrorModal(false)}
      />
    </div>
  );
}
