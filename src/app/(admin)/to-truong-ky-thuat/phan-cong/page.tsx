"use client";
import { useState, useEffect } from "react";
import { Spin, message } from "antd";
import {
  ExportExcelSuccessModal,
  ExportExcelErrorModal,
} from "@/components/modal";
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
import { useProfile } from "@/hooks";

// Extended Room type to include assignmentId
interface RoomWithAssignment extends Room {
  assignmentId?: string | null;
}

export default function PhanCongPage() {
  const { userDetails } = useProfile();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [rooms, setRooms] = useState<RoomWithAssignment[]>([]);
  const [allRooms, setAllRooms] = useState<RoomWithAssignment[]>([]); // Lưu ALL data không filter
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
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);

  // Fetch data from API - LUÔN lấy ALL data, không filter ở API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsApiData, techniciansData] = await Promise.all([
          getRoomsWithTechnicians(), // Không truyền building/floor = lấy tất cả
          getTechniciansWithRooms(),
        ]);

        // Convert rooms data
        const convertedRooms: RoomWithAssignment[] = roomsApiData.map(
          (room) => ({
            id: room.id,
            roomNumber: room.roomCode,
            building: room.building,
            floor: room.floor,
            status: room.status as RoomStatus,
            assignedTechnician: room.assignedTechnician?.id,
            assignmentId: room.assignmentId,
          })
        );

        // Convert technicians data
        const convertedTechnicians: Technician[] = techniciansData.map(
          (tech) => {
            const assignedAreas = tech.assignments.map(
              (assignment) => `${assignment.building} -  ${assignment.floor}`
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

        setAllRooms(convertedRooms); // Lưu ALL data
        setRooms(convertedRooms); // Cũng set vào rooms để hiển thị ban đầu
        setTechnicians(convertedTechnicians);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ fetch 1 lần khi component mount

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

      // Xóa "Tầng " prefix từ floor string
      const floorNumber = room.floor.replace("Tầng ", "");

      // LUÔN dùng API /assign vì backend logic giống nhau
      // API sẽ tự động xóa assignment cũ và tạo mới
      await assignTechnicianToFloor(room.building, floorNumber, technicianId);

      message.success("Cập nhật kỹ thuật viên thành công!");

      // Refresh data sau khi update - lấy ALL data
      const [roomsApiData, techniciansData] = await Promise.all([
        getRoomsWithTechnicians(), // Không filter, lấy tất cả
        getTechniciansWithRooms(),
      ]);

      const convertedRooms: RoomWithAssignment[] = roomsApiData.map((room) => ({
        id: room.id,
        roomNumber: room.roomCode,
        building: room.building,
        floor: room.floor,
        status: room.status as RoomStatus,
        assignedTechnician: room.assignedTechnician?.id,
        assignmentId: room.assignmentId,
      }));

      const convertedTechnicians: Technician[] = techniciansData.map((tech) => {
        const assignedAreas = tech.assignments.map(
          (assignment) => `${assignment.building} - ${assignment.floor}`
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

      setAllRooms(convertedRooms); // Cập nhật ALL data
      setRooms(convertedRooms); // Cập nhật rooms hiển thị
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

  // Get unique buildings and floors for filter options - DÙNG allRooms để có đầy đủ options
  const availableBuildings = Array.from(
    new Set(
      allRooms
        .map((room) => room.building)
        .filter((building): building is string => !!building)
    )
  ).sort();

  const availableFloors = Array.from(
    new Set(
      allRooms
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
      setExportError("Vui lòng chọn ít nhất một phòng để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách phân công phòng");

      // Tạo dữ liệu Excel
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

      const columnHeaders = [
        "STT",
        "Số phòng",
        "Tòa nhà",
        "Tầng",
        "Kỹ thuật viên phụ trách",
        "Trạng thái",
      ];

      // Tạo footer
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dateStr = `Ngày ${day} Tháng ${
        month < 10 ? "0" + month : month
      } Năm ${year}`;

      const footerRow: string[] = new Array(columnHeaders.length).fill("");
      footerRow[0] = "Người lập biểu";
      footerRow[Math.floor(columnHeaders.length / 4)] = "Thư ký";
      footerRow[Math.floor((columnHeaders.length * 2) / 4)] =
        "Trưởng nhóm kiểm kê";
      footerRow[columnHeaders.length - 1] = "Đại diện ĐV sử dụng";

      let currentRow = 1;

      // Hàng 1: TRƯỜNG ĐẠI HỌC...
      const row1 = worksheet.getRow(currentRow);
      const cell1 = row1.getCell(1);
      cell1.value = "TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH";
      cell1.font = { name: "Arial", size: 9 };
      cell1.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 2: Địa chỉ
      const row2 = worksheet.getRow(currentRow);
      const cell2 = row2.getCell(1);
      cell2.value =
        "Địa chỉ : 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP Hồ Chí Minh";
      cell2.font = { name: "Arial", size: 9 };
      cell2.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 3: Dòng trống
      currentRow++;

      // Hàng 4: Tiêu đề sheet - màu đỏ
      const row4 = worksheet.getRow(currentRow);
      const cell4 = row4.getCell(1);
      cell4.value = "DANH SÁCH PHÂN CÔNG PHÒNG";
      cell4.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FFFF0000" },
      };
      cell4.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 5: KHOA CÔNG NGHỆ THÔNG TIN
      const row5 = worksheet.getRow(currentRow);
      const cell5 = row5.getCell(1);
      cell5.value = "KHOA CÔNG NGHỆ THÔNG TIN";
      cell5.font = { name: "Arial", size: 9 };
      cell5.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 6: NĂM
      const row6 = worksheet.getRow(currentRow);
      const cell6 = row6.getCell(1);
      cell6.value = `NĂM ${new Date().getFullYear()}`;
      cell6.font = { name: "Arial", size: 9 };
      cell6.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 7: Dòng trống
      currentRow++;

      // Hàng 8: Người lập và thời gian xuất
      const now = new Date();
      const infoRow = worksheet.getRow(currentRow);
      const infoCell = infoRow.getCell(1);
      infoCell.value = `Người lập: ${
        userDetails?.fullName || "N/A"
      } | Thời gian xuất: ${now.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
      infoCell.font = { name: "Arial", size: 9 };
      infoCell.alignment = { horizontal: "left", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 9: Dòng trống
      currentRow++;

      // Header của bảng - in hoa và màu vàng
      const headerRow = worksheet.getRow(currentRow);
      columnHeaders.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header.toUpperCase();
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };
      });
      currentRow++;

      // Data rows
      excelData.forEach((rowData) => {
        const row = worksheet.getRow(currentRow);

        columnHeaders.forEach((header, index) => {
          const cell = row.getCell(index + 1);
          cell.value = rowData[header as keyof typeof rowData] ?? "";
          cell.font = { name: "Arial", size: 9 };
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;
      });

      // Dòng trống
      currentRow++;

      // Hàng ngày tháng
      const dateRow = worksheet.getRow(currentRow);
      const dateCell = dateRow.getCell(columnHeaders.length);
      dateCell.value = dateStr;
      dateCell.font = { name: "Arial", size: 9 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;

      // Footer row
      const footerRowExcel = worksheet.getRow(currentRow);
      footerRow.forEach((value, index) => {
        const cell = footerRowExcel.getCell(index + 1);
        cell.value = value;
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Set column widths
      columnHeaders.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 20;
      });

      // Xuất file
      const fileName = `Danh_sach_phan_cong_phong_${
        new Date().toISOString().split("T")[0]
      }_${itemsToExport.length}_ban_ghi.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      // Hiển thị thông báo thành công
      setExportCount(itemsToExport.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
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
        onBuildingChange={(value) => setBuildingFilter(value || "")}
        onFloorChange={(value) => setFloorFilter(value || "")}
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
      <ExportExcelSuccessModal
        isOpen={showExportSuccessModal}
        onClose={() => setShowExportSuccessModal(false)}
        fileName={exportFileName}
        recordCount={exportCount}
      />

      <ExportExcelErrorModal
        isOpen={showExportErrorModal}
        onClose={() => setShowExportErrorModal(false)}
        errorMessage={exportError}
      />
    </div>
  );
}
