"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Technician } from "@/types";
import { Room } from "@/types/unit";
import { mockRooms as originalMockRooms } from "@/lib/mockData/rooms";
import { users } from "@/lib/mockData/users";
import {
  getPrimaryTechnicianForArea,
  getAssignmentsForTechnician,
  mockTechnicianAssignments,
} from "@/lib/mockData/technicianAssignments";
import { Modal } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  AssignmentHeader,
  TabNavigation,
  SearchFilters,
  AreasTable,
  AreasMobileView,
  TechniciansGrid,
} from "@/components/leadTechnician/assignment";

export default function PhanCongPage() {
  // Tạo danh sách technicians từ TechnicianAssignments và users data
  const mockTechnicians: Technician[] = users
    .filter((user) => {
      // Lọc users có trong mockTechnicianAssignments và là active
      return mockTechnicianAssignments.some(
        (assignment) =>
          assignment.technicianId === user.id && assignment.isActive
      );
    })
    .map((user) => {
      // Lấy tất cả assignments của technician này
      const assignments = getAssignmentsForTechnician(user.id);

      // Tạo assignedAreas từ assignments
      const assignedAreas = assignments.map(
        (assignment) =>
          `${assignment.building} - Tầng ${assignment.floors.join(", ")}`
      );

      // Tạo current task dựa trên assignments
      const currentTask =
        assignments.length > 0
          ? `Phụ trách ${assignments[0].building} ${
              assignments[0].floors.length > 1
                ? `tầng ${assignments[0].floors.join("-")}`
                : `tầng ${assignments[0].floors[0]}`
            }`
          : "Chưa có phân công";

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        status: "active" as const,
        assignedAreas,
        currentTask,
      };
    });

  // Sử dụng rooms từ mockData và mapping assignedTechnician dựa trên TechnicianAssignments
  const mockRooms: Room[] = originalMockRooms.map((room) => {
    // Chuyển đổi format tầng từ "Tầng 1" -> "1"
    const floorNumber = room.floor?.replace("Tầng ", "") || "1";

    // Tìm kỹ thuật viên được phân công cho khu vực này từ database
    const assignedTechnician = getPrimaryTechnicianForArea(
      room.building || "Tòa H",
      floorNumber
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

  // Filter states
  const [buildingFilter, setBuildingFilter] = useState<string>("");
  const [floorFilter, setFloorFilter] = useState<string>("");

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

  const filteredRooms = rooms.filter((room) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.building &&
        room.building.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.floor &&
        room.floor.toLowerCase().includes(searchTerm.toLowerCase()));

    // Building filter
    const matchesBuilding =
      buildingFilter === "" || room.building === buildingFilter;

    // Floor filter
    const matchesFloor = floorFilter === "" || room.floor === floorFilter;

    return matchesSearch && matchesBuilding && matchesFloor;
  });

  // Get unique buildings and floors for filter options
  const availableBuildings = Array.from(
    new Set(
      rooms
        .map((room) => room.building)
        .filter((building): building is string => !!building)
    )
  ).sort();

  const availableFloors = Array.from(
    new Set(
      rooms
        .map((room) => room.floor)
        .filter((floor): floor is string => !!floor)
    )
  ).sort();

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

  const filteredTechnicians = technicians; // No filtering needed for technicians tab

  // Pagination logic
  const getCurrentData = () => {
    if (activeTab === "areas") {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return sortedRooms.slice(startIndex, endIndex);
    } else {
      // Technicians tab không có pagination, trả về tất cả
      return filteredTechnicians;
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
  // Export handler - only for areas tab
  const handleExportExcel = async () => {
    // Only export if we're on areas tab
    if (activeTab !== "areas") {
      return;
    }

    const itemsToExport =
      selectedItems.length > 0
        ? sortedRooms.filter((room) => selectedItems.includes(room.id))
        : sortedRooms;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import("xlsx");

      // Export areas data
      const excelData = itemsToExport.map((room, index) => ({
        STT: index + 1,
        "Số phòng": room.roomNumber,
        "Tòa nhà": room.building || "",
        Tầng: room.floor || "",
        "Kỹ thuật viên phụ trách": getTechnicianName(
          room.assignedTechnician || ""
        ),
        "Trạng thái": room.status,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột
      ws["!cols"] = [
        { wch: 5 }, // STT
        { wch: 15 }, // Số phòng
        { wch: 15 }, // Tòa nhà
        { wch: 10 }, // Tầng
        { wch: 25 }, // Kỹ thuật viên
        { wch: 15 }, // Trạng thái
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Danh sách phòng");
      const fileName = `danh-sach-phan-cong-phong-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      setExportCount(itemsToExport.length);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Reset pagination when changing tabs or search/filters (only apply filters for areas tab)
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [activeTab, searchTerm, buildingFilter, floorFilter]);

  const handleEditRoom = (roomId: string, technicianId: string) => {
    setEditingRoom(roomId);
    setSelectedTechnician(technicianId);
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setSelectedTechnician("");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
      <AssignmentHeader
        selectedItemsCount={selectedItems.length}
        totalItems={getCurrentTotal()}
        onExportExcel={() => {}}
        activeTab="technicians"
      />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <SearchFilters
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        buildingFilter={buildingFilter}
        floorFilter={floorFilter}
        onBuildingChange={setBuildingFilter}
        onFloorChange={setFloorFilter}
        onExportExcel={handleExportExcel}
        selectedItemsCount={selectedItems.length}
        buildings={availableBuildings}
        floors={availableFloors}
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

          <AreasMobileView
            rooms={getCurrentData() as Room[]}
            technicians={technicians}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditRoom={handleEditRoom}
          />

          {/* Pagination for Areas */}
          <div className="mt-4 sm:mt-6">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={getCurrentTotal()}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
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

          {/* Không hiển thị pagination cho tab technicians */}
        </>
      )}

      {/* Export Modals */}
      <Modal
        open={showExportSuccessModal}
        onOk={() => setShowExportSuccessModal(false)}
        onCancel={() => setShowExportSuccessModal(false)}
        footer={null}
        closable={true}
        centered>
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <h3 className="text-lg font-semibold mb-2">Xuất Excel thành công!</h3>
          <p className="text-gray-600">Đã xuất {exportCount} phòng</p>
        </div>
      </Modal>

      <Modal
        open={showExportErrorModal}
        onOk={() => setShowExportErrorModal(false)}
        onCancel={() => setShowExportErrorModal(false)}
        footer={null}
        closable={true}
        centered>
        <div className="text-center">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-lg font-semibold mb-2">Không có dữ liệu</h3>
          <p className="text-gray-600">Không có dữ liệu để xuất Excel</p>
        </div>
      </Modal>
    </div>
  );
}
