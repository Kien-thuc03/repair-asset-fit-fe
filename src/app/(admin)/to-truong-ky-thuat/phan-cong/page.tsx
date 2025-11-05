"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Modal, Spin, message } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  AssignmentHeader,
  TabNavigation,
  SearchFilters,
  AreasTable,
  AreasMobileView,
  TechniciansGrid,
} from "@/components/leadTechnician/assignment";
import {
  getRoomsWithTechnicians,
  getTechniciansWithRooms,
  assignTechnicianToFloor,
} from "@/lib/api/technician-assignments";
import { Technician } from "@/types";
import { Room, RoomStatus } from "@/types/unit";

// Extended Room type to include assignmentId
interface RoomWithAssignment extends Room {
  assignmentId?: string | null;
}

export default function PhanCongPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [rooms, setRooms] = useState<RoomWithAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsApiData, techniciansData] = await Promise.all([
          getRoomsWithTechnicians(
            buildingFilter || undefined,
            floorFilter || undefined
          ),
          getTechniciansWithRooms(),
        ]);

        // Convert rooms data
        const convertedRooms: RoomWithAssignment[] = roomsApiData.map(
          (room) => ({
            id: room.id,
            roomNumber: room.roomCode,
            building: room.building,
            floor: `Tầng ${room.floor}`,
            status: room.status as RoomStatus,
            assignedTechnician: room.assignedTechnician?.id,
            assignmentId: room.assignmentId,
          })
        );

        // Convert technicians data
        const convertedTechnicians: Technician[] = techniciansData.map(
          (tech) => {
            const assignedAreas = tech.assignments.map(
              (assignment) =>
                `${assignment.building} - Tầng ${assignment.floor}`
            );

            const currentTask =
              tech.assignments.length > 0
                ? `Phụ trách ${tech.totalRooms} phòng`
                : "Chưa có phân công";

            return {
              id: tech.id,
              name: tech.fullName,
              email: tech.email,
              phone: tech.phoneNumber || "",
              status: "active" as const,
              assignedAreas,
              currentTask,
            };
          }
        );

        setRooms(convertedRooms);
        setTechnicians(convertedTechnicians);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingFilter, floorFilter]);

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

  const handleAssignTechnician = async (
    roomId: string,
    technicianId: string
  ) => {
    try {
      // Tìm room để lấy building và floor
      const room = rooms.find((r) => r.id === roomId);

      console.log("Assigning technician:", {
        roomId,
        room,
        technicianId,
      });

      if (!room) {
        message.error("Không tìm thấy thông tin phòng");
        return;
      }

      if (!room.building || !room.floor) {
        message.error("Thông tin tòa nhà hoặc tầng không hợp lệ");
        return;
      }

      if (!technicianId) {
        message.error("Vui lòng chọn kỹ thuật viên");
        return;
      }

      setUpdating(true);

      // Gọi API PATCH với building, floor, technicianId
      // Xóa "Tầng " prefix từ floor string
      const floorNumber = room.floor.replace("Tầng ", "");

      console.log("Calling API with:", {
        building: room.building,
        floor: floorNumber,
        technicianId: technicianId,
      });

      const result = await assignTechnicianToFloor(
        room.building,
        floorNumber,
        technicianId
      );

      console.log("API result:", result);

      message.success("Cập nhật kỹ thuật viên thành công!");

      // Refresh data sau khi update
      const [roomsApiData, techniciansData] = await Promise.all([
        getRoomsWithTechnicians(
          buildingFilter || undefined,
          floorFilter || undefined
        ),
        getTechniciansWithRooms(),
      ]);

      const convertedRooms: RoomWithAssignment[] = roomsApiData.map((room) => ({
        id: room.id,
        roomNumber: room.roomCode,
        building: room.building,
        floor: `Tầng ${room.floor}`,
        status: room.status as RoomStatus,
        assignedTechnician: room.assignedTechnician?.id,
        assignmentId: room.assignmentId,
      }));

      const convertedTechnicians: Technician[] = techniciansData.map((tech) => {
        const assignedAreas = tech.assignments.map(
          (assignment) => `${assignment.building} - Tầng ${assignment.floor}`
        );

        const currentTask =
          tech.assignments.length > 0
            ? `Phụ trách ${tech.totalRooms} phòng`
            : "Chưa có phân công";

        return {
          id: tech.id,
          name: tech.fullName,
          email: tech.email,
          phone: tech.phoneNumber || "",
          status: "active" as const,
          assignedAreas,
          currentTask,
        };
      });

      setRooms(convertedRooms);
      setTechnicians(convertedTechnicians);

      // Reset editing state
      setEditingRoom(null);
      setSelectedTechnician("");
    } catch (error: unknown) {
      console.error("Error updating technician:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật kỹ thuật viên";
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
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

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large">
            <div className="text-center mt-4">Đang tải dữ liệu...</div>
          </Spin>
        </div>
      ) : activeTab === "areas" ? (
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
            updating={updating}
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
