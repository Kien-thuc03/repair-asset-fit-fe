"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, Card, Select, Spin, message, Tabs } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { RepairStatus, ReplacementProposalStatus } from "@/types/repair";
import { SoftwareProposalStatus } from "@/types/software";
import { ErrorType, ERROR_TYPE_LABELS } from "@/lib/constants/errorTypes";
import { Table, Collapse, Tag } from "antd";
import { apiClient } from "@/lib/api";
import ExcelExportButton from "@/components/common/ExcelExportButton";

const { Option } = Select;

// Interface cho dữ liệu thống kê
interface StatisticsData {
  repairRequests: {
    status: string;
    count: number;
  }[];
  replacementProposals: {
    status: string;
    count: number;
  }[];
  replacementProposalDetails: {
    status: string;
    proposalCount: number;
    totalItems: number;
  }[];
  softwareProposals: {
    status: string;
    count: number;
  }[];
  softwareProposalDetails: {
    status: string;
    proposalCount: number;
    totalItems: number;
  }[];
  errorTypes: {
    errorType: ErrorType;
    count: number;
  }[];
}

// Interface cho Room từ API
interface Room {
  id: string;
  name?: string; // Optional vì có thể không có trong response
  building: string;
  roomCode: string;
  floor: string;
  roomNumber: string;
  status: string;
}

// Interface cho thống kê theo phòng
interface RoomStatistics {
  roomId: string;
  roomName: string;
  roomCode: string;
  building: string;
  floor: string;
  roomNumber: string;
  totalComputers: number;
  components: {
    componentType: string;
    name: string;
    specs?: string;
    serialNumber?: string;
  }[];
  software: {
    id: string;
    name: string;
    version?: string;
    publisher?: string;
    installationDate?: string;
    licenseKey?: string;
  }[];
}

// Config cho trạng thái Repair Requests
const repairStatusConfig: Record<string, string> = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: "Chờ tiếp nhận",
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: "Đã tiếp nhận",
  [RepairStatus.ĐANG_XỬ_LÝ]: "Đang xử lý",
  [RepairStatus.CHỜ_THAY_THẾ]: "Chờ thay thế",
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: "Đã hoàn thành",
  [RepairStatus.ĐÃ_HỦY]: "Đã hủy",
};

// Màu cho từng trạng thái Repair Requests
const repairStatusColors: Record<string, string> = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: "#fbbf24", // Vàng
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: "#3b82f6", // Xanh dương
  [RepairStatus.ĐANG_XỬ_LÝ]: "#8b5cf6", // Tím
  [RepairStatus.CHỜ_THAY_THẾ]: "#f59e0b", // Cam
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: "#10b981", // Xanh lá
  [RepairStatus.ĐÃ_HỦY]: "#ef4444", // Đỏ
};

// Config cho trạng thái Replacement Proposals
const replacementStatusConfig: Record<string, string> = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "Chờ tổ trưởng duyệt",
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: "Đã duyệt",
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: "Đã từ chối",
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: "Đã lập tờ trình",
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: "Khoa đã duyệt tờ trình",
  [ReplacementProposalStatus.CHỜ_XÁC_MINH]: "Chờ xác minh",
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: "Đã xác minh",
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: "Đã gửi biên bản",
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: "Đã ký biên bản",
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: "Đã hoàn tất mua sắm",
};

// Màu cho từng trạng thái Replacement Proposals
const replacementStatusColors: Record<string, string> = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "#f59e0b", // Cam
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: "#10b981", // Xanh lá
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: "#ef4444", // Đỏ
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: "#3b82f6", // Xanh dương
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: "#06b6d4", // Cyan
   [ReplacementProposalStatus.CHỜ_XÁC_MINH]: "#6366f1", // Indigo
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: "#14b8a6", // Teal
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: "#a855f7", // Tím đậm
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: "#ec4899", // Hồng
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: "#22c55e", // Xanh lá đậm
};

// Config cho trạng thái Software Proposals
const softwareStatusConfig: Record<string, string> = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: "Chờ duyệt",
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: "Đã duyệt",
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: "Đã từ chối",
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: "Đang trang bị",
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: "Đã trang bị",
};

// Màu cho từng trạng thái Software Proposals
const softwareStatusColors: Record<string, string> = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: "#fbbf24", // Vàng
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: "#10b981", // Xanh lá
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: "#ef4444", // Đỏ
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: "#3b82f6", // Xanh dương
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: "#8b5cf6", // Tím
};

export default function ThongKeBaoCaoPage() {
  const [loading, setLoading] = useState(true);
  const [roomStatisticsLoading, setRoomStatisticsLoading] = useState(false);
  const [statistics, setStatistics] = useState<StatisticsData>({
    repairRequests: [],
    replacementProposals: [],
    replacementProposalDetails: [],
    softwareProposals: [],
    softwareProposalDetails: [],
    errorTypes: [],
  });
  const [roomStatistics, setRoomStatistics] = useState<RoomStatistics[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Filter states
  const [repairStatusFilter, setRepairStatusFilter] = useState<string>("all");
  const [replacementStatusFilter, setReplacementStatusFilter] =
    useState<string>("all");
  const [softwareStatusFilter, setSoftwareStatusFilter] =
    useState<string>("all");

  // Room filter states
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");

  // Fetch statistics data from API
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<StatisticsData>("/api/v1/statistics");

        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        message.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch rooms data from API để populate filters
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        const data = await apiClient.get<Room[]>("/api/v1/rooms");
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        message.error("Không thể tải danh sách phòng");
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Fetch room statistics data from API với filters
  const fetchRoomStatistics = async () => {
    setRoomStatisticsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (buildingFilter !== "all") {
        params.building = buildingFilter;
      }
      if (floorFilter !== "all") {
        params.floor = floorFilter;
      }
      if (roomFilter !== "all") {
        params.roomId = roomFilter;
      }

      const data = await apiClient.get<RoomStatistics[]>(
        "/api/v1/statistics/rooms",
        params
      );
      setRoomStatistics(data);
    } catch (error) {
      console.error("Error fetching room statistics:", error);
      message.error("Không thể tải dữ liệu thống kê theo phòng");
    } finally {
      setRoomStatisticsLoading(false);
    }
  };

  // Filter data based on selected status
  const getFilteredRepairData = () => {
    if (repairStatusFilter === "all") {
      return statistics.repairRequests;
    }
    return statistics.repairRequests.filter(
      (item) => item.status === repairStatusFilter
    );
  };

  const getFilteredReplacementData = () => {
    if (replacementStatusFilter === "all") {
      return statistics.replacementProposals;
    }
    return statistics.replacementProposals.filter(
      (item) => item.status === replacementStatusFilter
    );
  };

  const getFilteredSoftwareData = () => {
    if (softwareStatusFilter === "all") {
      return statistics.softwareProposals;
    }
    return statistics.softwareProposals.filter(
      (item) => item.status === softwareStatusFilter
    );
  };

  // Format data for charts (bao gồm status để map màu)
  const formatRepairData = () => {
    return getFilteredRepairData().map((item) => ({
      name: repairStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  const formatReplacementData = () => {
    return getFilteredReplacementData().map((item) => ({
      name: replacementStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  const formatSoftwareData = () => {
    return getFilteredSoftwareData().map((item) => ({
      name: softwareStatusConfig[item.status] || item.status,
      status: item.status,
      "Số lượng": item.count,
    }));
  };

  // Config cho loại linh kiện
  const componentTypeLabels: Record<string, string> = {
    CPU: "CPU",
    RAM: "RAM",
    MAINBOARD: "Mainboard",
    STORAGE: "Ổ cứng",
    GPU: "Card đồ họa",
    PSU: "Nguồn",
    CASE: "Case",
    MONITOR: "Màn hình",
    KEYBOARD: "Bàn phím",
    MOUSE: "Chuột",
    NETWORK: "Mạng",
    OPTICAL_DRIVE: "Ổ đĩa quang",
    COOLER: "Tản nhiệt",
    UPS: "UPS",
    OTHER: "Khác",
    NETWORK_CARD: "Card mạng",
    SOUND_CARD: "Card âm thanh",
    SPEAKER: "Loa",
    WEBCAM: "Webcam",
  };

  // Lấy danh sách unique values cho filter từ rooms API
  const getUniqueBuildings = () => {
    const buildings = Array.from(
      new Set(rooms.map((room) => room.building))
    ).sort();
    return buildings;
  };

  const getUniqueFloors = () => {
    let filteredRooms = rooms;
    if (buildingFilter !== "all") {
      filteredRooms = rooms.filter((room) => room.building === buildingFilter);
    }
    const floors = Array.from(
      new Set(filteredRooms.map((room) => room.floor))
    ).sort();
    return floors;
  };

  const getUniqueRooms = () => {
    let filteredRooms = rooms;
    if (buildingFilter !== "all") {
      filteredRooms = filteredRooms.filter(
        (room) => room.building === buildingFilter
      );
    }
    if (floorFilter !== "all") {
      filteredRooms = filteredRooms.filter(
        (room) => room.floor === floorFilter
      );
    }
    return filteredRooms.map((room) => ({
      value: room.id,
      label: `${room.name || room.roomCode} (${room.roomCode})`,
      building: room.building,
      floor: room.floor,
    }));
  };

  // Filter room statistics
  const getFilteredRoomStatistics = () => {
    let filtered = roomStatistics;

    if (buildingFilter !== "all") {
      filtered = filtered.filter((room) => room.building === buildingFilter);
    }

    if (floorFilter !== "all") {
      filtered = filtered.filter((room) => room.floor === floorFilter);
    }

    if (roomFilter !== "all") {
      filtered = filtered.filter((room) => room.roomId === roomFilter);
    }

    return filtered;
  };

  // Reset filters khi building thay đổi
  useEffect(() => {
    if (buildingFilter === "all") {
      setFloorFilter("all");
      setRoomFilter("all");
    } else {
      setFloorFilter("all");
      setRoomFilter("all");
    }
  }, [buildingFilter]);

  // Reset room filter khi floor thay đổi
  useEffect(() => {
    if (floorFilter === "all") {
      setRoomFilter("all");
    } else {
      setRoomFilter("all");
    }
  }, [floorFilter]);

  // Auto fetch khi có dữ liệu và filter thay đổi
  useEffect(() => {
    if (roomStatistics.length > 0) {
      fetchRoomStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingFilter, floorFilter, roomFilter]);

  // Helper function để tạo footer cho Excel sheet
  const createExcelFooter = (columnCount: number) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const dateStr = `Ngày ${day} Tháng ${
      month < 10 ? "0" + month : month
    } Năm ${year}`;

    const footerRow: string[] = new Array(columnCount).fill("");
    footerRow[0] = "Người lập biểu";
    footerRow[Math.floor(columnCount / 4)] = "Thư ký";
    footerRow[Math.floor((columnCount * 2) / 4)] = "Trưởng nhóm kiểm kê";
    footerRow[columnCount - 1] = "Đại diện ĐV sử dụng";

    return { footerRow, dateStr };
  };

  // Helper function để tạo worksheet với header và footer có styling bằng ExcelJS
  const createFormattedWorksheet = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    worksheet: any,
    data: Record<string, string | number>[],
    sheetTitle: string,
    columnHeaders: string[]
  ) => {
    const { footerRow, dateStr } = createExcelFooter(columnHeaders.length);

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
    cell4.value = sheetTitle;
    cell4.font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FFFF0000" },
    }; // Màu đỏ
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

    // Header của bảng - in hoa và màu vàng
    const headerRow = worksheet.getRow(currentRow);
    columnHeaders.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header.toUpperCase(); // In hoa
      cell.font = { name: "Arial", size: 9, bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true, // Wrap text cho header nếu dài
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
        fgColor: { argb: "FFFFFF00" }, // Màu vàng
      };
    });
    headerRow.height = undefined; // Auto height để wrap text
    currentRow++;

    // Data rows - đổi màu theo phòng
    let currentRoom: string | null = null;
    let roomColorIndex = 0; // 0 = trắng, 1 = xanh (hàng đầu tiên luôn trắng)
    const whiteColor = { argb: "FFFFFFFF" }; // Trắng
    const blueColor = { argb: "FFD9E1F2" }; // Dark blue text 2 lighter 80%
    let isFirstRow = true;

    data.forEach((rowData) => {
      // Xác định phòng hiện tại (ưu tiên "Tên phòng", nếu không có thì dùng "Mã phòng")
      const roomName = String(rowData["Tên phòng"] ?? "");
      const roomCode = String(rowData["Mã phòng"] ?? "");
      const roomIdentifier = roomName || roomCode;

      // Nếu có thông tin phòng mới (không rỗng), đổi màu
      if (roomIdentifier && roomIdentifier !== currentRoom) {
        currentRoom = roomIdentifier;
        if (!isFirstRow) {
          // Chỉ đổi màu nếu không phải hàng đầu tiên
          roomColorIndex = (roomColorIndex + 1) % 2; // Đổi màu xen kẽ
        }
        isFirstRow = false;
      }

      const row = worksheet.getRow(currentRow);
      const rowColor = roomColorIndex === 0 ? whiteColor : blueColor;

      columnHeaders.forEach((header, index) => {
        const cell = row.getCell(index + 1);
        const cellValue = String(rowData[header] ?? "");
        cell.value = cellValue;
        cell.font = { name: "Arial", size: 9 };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true, // Wrap text cho nội dung dài
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
          fgColor: rowColor,
        };
      });
      row.height = undefined; // Auto height để wrap text
      currentRow++;
    });

    // Dòng trống
    currentRow++;

    // Hàng ngày tháng (trước footer, ở cột cuối - cùng cột với "Đại diện ĐV sử dụng")
    const dateRow = worksheet.getRow(currentRow);
    const dateCell = dateRow.getCell(columnHeaders.length);
    dateCell.value = dateStr;
    dateCell.font = { name: "Arial", size: 9 };
    dateCell.alignment = { horizontal: "center", vertical: "middle" };
    currentRow++;

    // Footer row - in đậm 4 cột
    const footerRowExcel = worksheet.getRow(currentRow);
    footerRow.forEach((value, index) => {
      const cell = footerRowExcel.getCell(index + 1);
      cell.value = value;
      cell.font = { name: "Arial", size: 9, bold: true }; // In đậm
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Set column widths
    columnHeaders.forEach((_, index) => {
      worksheet.getColumn(index + 1).width = 20;
    });
  };

  // Hàm xuất Excel cho thống kê theo phòng
  const handleExportRoomStatisticsExcel = async () => {
    if (roomStatistics.length === 0) {
      message.warning(
        "Chưa có dữ liệu để xuất Excel. Vui lòng tải dữ liệu trước."
      );
      return;
    }

    try {
      // Sử dụng ExcelJS để có styling đầy đủ
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();

      // Sheet 1: Tổng quan các phòng
      const summaryData = roomStatistics.map((room, index) => ({
        STT: index + 1,
        "Tên phòng": room.roomName,
        "Mã phòng": room.roomCode,
        "Tòa nhà": room.building,
        Tầng: room.floor,
        "Số phòng": room.roomNumber,
        "Tổng số máy": room.totalComputers,
        "Số linh kiện": room.components.length,
        "Số phần mềm": room.software.length,
      }));

      const summaryHeaders = [
        "STT",
        "Tên phòng",
        "Mã phòng",
        "Tòa nhà",
        "Tầng",
        "Số phòng",
        "Tổng số máy",
        "Số linh kiện",
        "Số phần mềm",
      ];
      const wsSummary = workbook.addWorksheet("Tổng quan phòng");
      createFormattedWorksheet(
        wsSummary,
        summaryData,
        "DANH MỤC THỐNG KÊ THEO PHÒNG",
        summaryHeaders
      );

      // Sheet 2: Chi tiết cấu hình máy tính theo phòng
      const componentsData: Array<{
        "Tên phòng": string;
        "Mã phòng": string;
        "Tòa nhà": string;
        Tầng: string;
        "Loại linh kiện": string;
        "Tên/Model": string;
        "Thông số kỹ thuật": string;
        "Số serial": string;
      }> = [];
      roomStatistics.forEach((room) => {
        if (room.components.length > 0) {
          room.components.forEach((comp, compIndex) => {
            componentsData.push({
              "Tên phòng": compIndex === 0 ? room.roomName : "",
              "Mã phòng": compIndex === 0 ? room.roomCode : "",
              "Tòa nhà": compIndex === 0 ? room.building : "",
              Tầng: compIndex === 0 ? room.floor : "",
              "Loại linh kiện":
                componentTypeLabels[comp.componentType] || comp.componentType,
              "Tên/Model": comp.name,
              "Thông số kỹ thuật": comp.specs || "",
              "Số serial": comp.serialNumber || "",
            });
          });
        } else {
          componentsData.push({
            "Tên phòng": room.roomName,
            "Mã phòng": room.roomCode,
            "Tòa nhà": room.building,
            Tầng: room.floor,
            "Loại linh kiện": "Chưa có thông tin",
            "Tên/Model": "",
            "Thông số kỹ thuật": "",
            "Số serial": "",
          });
        }
      });

      const componentsHeaders = [
        "Tên phòng",
        "Mã phòng",
        "Tòa nhà",
        "Tầng",
        "Loại linh kiện",
        "Tên/Model",
        "Thông số kỹ thuật",
        "Số serial",
      ];
      const wsComponents = workbook.addWorksheet("Cấu hình máy tính");
      createFormattedWorksheet(
        wsComponents,
        componentsData,
        "DANH MỤC CẤU HÌNH MÁY TÍNH",
        componentsHeaders
      );

      // Sheet 3: Chi tiết phần mềm theo phòng
      const softwareData: Array<{
        "Tên phòng": string;
        "Mã phòng": string;
        "Tòa nhà": string;
        Tầng: string;
        "Tên phần mềm": string;
        "Phiên bản": string;
        "Nhà sản xuất": string;
        "Ngày cài đặt": string;
        "License Key": string;
      }> = [];
      roomStatistics.forEach((room) => {
        if (room.software.length > 0) {
          room.software.forEach((soft, softIndex) => {
            softwareData.push({
              "Tên phòng": softIndex === 0 ? room.roomName : "",
              "Mã phòng": softIndex === 0 ? room.roomCode : "",
              "Tòa nhà": softIndex === 0 ? room.building : "",
              Tầng: softIndex === 0 ? room.floor : "",
              "Tên phần mềm": soft.name,
              "Phiên bản": soft.version || "",
              "Nhà sản xuất": soft.publisher || "",
              "Ngày cài đặt": soft.installationDate
                ? new Date(soft.installationDate).toLocaleDateString("vi-VN")
                : "",
              "License Key": soft.licenseKey || "",
            });
          });
        } else {
          softwareData.push({
            "Tên phòng": room.roomName,
            "Mã phòng": room.roomCode,
            "Tòa nhà": room.building,
            Tầng: room.floor,
            "Tên phần mềm": "Chưa có phần mềm nào",
            "Phiên bản": "",
            "Nhà sản xuất": "",
            "Ngày cài đặt": "",
            "License Key": "",
          });
        }
      });

      const softwareHeaders = [
        "Tên phòng",
        "Mã phòng",
        "Tòa nhà",
        "Tầng",
        "Tên phần mềm",
        "Phiên bản",
        "Nhà sản xuất",
        "Ngày cài đặt",
        "License Key",
      ];
      const wsSoftware = workbook.addWorksheet("Phần mềm đã cài đặt");
      createFormattedWorksheet(
        wsSoftware,
        softwareData,
        "DANH MỤC PHẦN MỀM ĐÃ CÀI ĐẶT",
        softwareHeaders
      );

      // Xuất file
      const fileName = `thong-ke-theo-phong-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
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

      message.success("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      message.error("Có lỗi xảy ra khi xuất file Excel");
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/to-truong-ky-thuat",
            title: <span>Trang chủ</span>,
          },
          {
            title: <span>Thống kê báo cáo</span>,
          },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spin size="large" />
        </div>
      ) : (
        <Card>
          <Tabs
            defaultActiveKey="repair"
            items={[
              {
                key: "repair",
                label: "Báo lỗi",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê báo lỗi
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các yêu cầu sửa chữa
                        (Repair Requests)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={repairStatusFilter}
                        onChange={setRepairStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(repairStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatRepairData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatRepairData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                repairStatusColors[entry.status] || "#3b82f6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo loại lỗi */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo loại lỗi
                      </h4>
                      <Table
                        dataSource={statistics.errorTypes.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            errorType: item.errorType,
                            errorTypeName:
                              ERROR_TYPE_LABELS[item.errorType] ||
                              item.errorType,
                            count: item.count,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Loại lỗi",
                            dataIndex: "errorTypeName",
                            key: "errorTypeName",
                          },
                          {
                            title: "Số lượng",
                            dataIndex: "count",
                            key: "count",
                            width: 120,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "replacement",
                label: "Đề xuất thay thế",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê đề xuất thay thế
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các đề xuất thay thế linh
                        kiện (Replacement Proposals)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={replacementStatusFilter}
                        onChange={setReplacementStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(replacementStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatReplacementData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={120}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatReplacementData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                replacementStatusColors[entry.status] ||
                                "#10b981"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo trạng thái */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo trạng thái
                      </h4>
                      <Table
                        dataSource={statistics.replacementProposalDetails.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            status: item.status,
                            statusName:
                              replacementStatusConfig[item.status] ||
                              item.status,
                            proposalCount: item.proposalCount,
                            totalItems: item.totalItems,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Trạng thái",
                            dataIndex: "statusName",
                            key: "statusName",
                          },
                          {
                            title: "Số lượng đề xuất",
                            dataIndex: "proposalCount",
                            key: "proposalCount",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                          {
                            title: "Tổng số linh kiện",
                            dataIndex: "totalItems",
                            key: "totalItems",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-green-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "software",
                label: "Đề xuất phần mềm",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê đề xuất phần mềm
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê theo trạng thái của các đề xuất cài đặt phần
                        mềm (Software Proposals)
                      </p>
                    </div>
                    <div className="flex justify-end mb-4">
                      <Select
                        value={softwareStatusFilter}
                        onChange={setSoftwareStatusFilter}
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái">
                        <Option value="all">Tất cả trạng thái</Option>
                        {Object.entries(softwareStatusConfig).map(
                          ([value, label]) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={formatSoftwareData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng">
                          {formatSoftwareData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                softwareStatusColors[entry.status] || "#f59e0b"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Bảng chi tiết thống kê theo trạng thái */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Chi tiết thống kê theo trạng thái
                      </h4>
                      <Table
                        dataSource={statistics.softwareProposalDetails.map(
                          (item, index) => ({
                            key: index,
                            stt: index + 1,
                            status: item.status,
                            statusName:
                              softwareStatusConfig[item.status] || item.status,
                            proposalCount: item.proposalCount,
                            totalItems: item.totalItems,
                          })
                        )}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "stt",
                            key: "stt",
                            width: 60,
                            align: "center",
                          },
                          {
                            title: "Trạng thái",
                            dataIndex: "statusName",
                            key: "statusName",
                          },
                          {
                            title: "Số lượng đề xuất",
                            dataIndex: "proposalCount",
                            key: "proposalCount",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-blue-600">
                                {count}
                              </span>
                            ),
                          },
                          {
                            title: "Tổng số phần mềm",
                            dataIndex: "totalItems",
                            key: "totalItems",
                            width: 150,
                            align: "center",
                            render: (count: number) => (
                              <span className="font-semibold text-green-600">
                                {count}
                              </span>
                            ),
                          },
                        ]}
                        pagination={false}
                        size="middle"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "rooms",
                label: "Thống kê theo phòng",
                children: (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Thống kê theo phòng
                      </h3>
                      <p className="text-sm text-gray-600">
                        Thống kê cấu hình máy tính và phần mềm đã cài đặt theo
                        từng phòng. Tất cả máy trong một phòng có cấu hình và
                        phần mềm giống nhau.
                      </p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-4">
                        <Select
                          value={buildingFilter}
                          onChange={setBuildingFilter}
                          style={{ width: 200 }}
                          placeholder="Lọc theo tòa nhà"
                          loading={roomsLoading}
                          disabled={roomsLoading}>
                          <Option value="all">Tất cả tòa nhà</Option>
                          {getUniqueBuildings().map((building) => (
                            <Option key={building} value={building}>
                              {building}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          value={floorFilter}
                          onChange={setFloorFilter}
                          style={{ width: 200 }}
                          placeholder="Lọc theo tầng"
                          disabled={buildingFilter === "all" || roomsLoading}
                          loading={roomsLoading}>
                          <Option value="all">Tất cả tầng</Option>
                          {getUniqueFloors().map((floor) => (
                            <Option key={floor} value={floor}>
                              {floor}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          value={roomFilter}
                          onChange={setRoomFilter}
                          style={{ width: 250 }}
                          placeholder="Lọc theo phòng"
                          disabled={
                            (buildingFilter === "all" &&
                              floorFilter === "all") ||
                            roomsLoading
                          }
                          loading={roomsLoading}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }>
                          <Option value="all">Tất cả phòng</Option>
                          {getUniqueRooms().map((room) => (
                            <Option key={room.value} value={room.value}>
                              {room.label}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <ExcelExportButton
                          totalCount={roomStatistics.length}
                          selectedCount={roomStatistics.length}
                          onExport={handleExportRoomStatisticsExcel}
                          disabled={
                            roomStatisticsLoading || roomStatistics.length === 0
                          }
                          variant="primary"
                          size="md"
                        />
                        <button
                          onClick={fetchRoomStatistics}
                          disabled={roomStatisticsLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                          {roomStatisticsLoading
                            ? "Đang tải..."
                            : "Tải dữ liệu"}
                        </button>
                      </div>
                    </div>
                    {roomStatisticsLoading ? (
                      <div className="flex items-center justify-center min-h-[400px]">
                        <Spin size="large" />
                      </div>
                    ) : roomStatistics.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Chưa có dữ liệu. Vui lòng nhấn &quot;Tải dữ liệu&quot;
                        để xem thống kê.
                      </div>
                    ) : getFilteredRoomStatistics().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Không tìm thấy phòng nào phù hợp với bộ lọc đã chọn.
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 text-sm text-gray-600">
                          Hiển thị {getFilteredRoomStatistics().length} /{" "}
                          {roomStatistics.length} phòng
                        </div>
                        <Collapse
                          accordion
                          items={getFilteredRoomStatistics().map((room) => ({
                            key: room.roomId,
                            label: (
                              <div className="flex items-center justify-between w-full pr-4">
                                <div>
                                  <span className="font-semibold text-lg">
                                    {room.roomName}
                                  </span>
                                  <span className="ml-2 text-gray-500">
                                    ({room.roomCode})
                                  </span>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                  <span>
                                    <strong>Tòa:</strong> {room.building}
                                  </span>
                                  <span>
                                    <strong>Tầng:</strong> {room.floor}
                                  </span>
                                  <span>
                                    <strong>Số máy:</strong>{" "}
                                    <Tag color="blue">
                                      {room.totalComputers}
                                    </Tag>
                                  </span>
                                </div>
                              </div>
                            ),
                            children: (
                              <div className="space-y-6">
                                {/* Thông tin phòng */}
                                <div>
                                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                                    Thông tin phòng
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                                    <div>
                                      <span className="text-gray-600">
                                        Tên phòng:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {room.roomName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Mã phòng:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {room.roomCode}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Tòa nhà:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {room.building}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Tầng:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {room.floor}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Số phòng:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {room.roomNumber}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        Tổng số máy:
                                      </span>{" "}
                                      <Tag color="blue" className="ml-2">
                                        {room.totalComputers} máy
                                      </Tag>
                                    </div>
                                  </div>
                                </div>

                                {/* Cấu hình máy tính */}
                                <div>
                                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                                    Cấu hình máy tính
                                  </h4>
                                  {room.components.length === 0 ? (
                                    <div className="text-gray-500 italic">
                                      Chưa có thông tin cấu hình
                                    </div>
                                  ) : (
                                    <Table
                                      dataSource={room.components.map(
                                        (comp, idx) => ({
                                          key: idx,
                                          ...comp,
                                        })
                                      )}
                                      columns={[
                                        {
                                          title: "STT",
                                          key: "stt",
                                          width: 60,
                                          align: "center",
                                          render: (_, __, index) => index + 1,
                                        },
                                        {
                                          title: "Loại linh kiện",
                                          dataIndex: "componentType",
                                          key: "componentType",
                                          width: 150,
                                          render: (type: string) => (
                                            <Tag color="blue">
                                              {componentTypeLabels[type] ||
                                                type}
                                            </Tag>
                                          ),
                                        },
                                        {
                                          title: "Tên/Model",
                                          dataIndex: "name",
                                          key: "name",
                                        },
                                        {
                                          title: "Thông số kỹ thuật",
                                          dataIndex: "specs",
                                          key: "specs",
                                          render: (specs: string) =>
                                            specs || (
                                              <span className="text-gray-400 italic">
                                                Không có
                                              </span>
                                            ),
                                        },
                                        {
                                          title: "Số serial",
                                          dataIndex: "serialNumber",
                                          key: "serialNumber",
                                          width: 200,
                                          render: (serial: string) =>
                                            serial || (
                                              <span className="text-gray-400 italic">
                                                Không có
                                              </span>
                                            ),
                                        },
                                      ]}
                                      pagination={false}
                                      size="middle"
                                    />
                                  )}
                                </div>

                                {/* Phần mềm đã cài đặt */}
                                <div>
                                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                                    Phần mềm đã cài đặt
                                  </h4>
                                  {room.software.length === 0 ? (
                                    <div className="text-gray-500 italic">
                                      Chưa có phần mềm nào được cài đặt
                                    </div>
                                  ) : (
                                    <Table
                                      dataSource={room.software.map(
                                        (soft, idx) => ({
                                          key: idx,
                                          ...soft,
                                        })
                                      )}
                                      columns={[
                                        {
                                          title: "STT",
                                          dataIndex: "key",
                                          key: "key",
                                          width: 60,
                                          align: "center",
                                          render: (_, __, index) => index + 1,
                                        },
                                        {
                                          title: "Tên phần mềm",
                                          dataIndex: "name",
                                          key: "name",
                                        },
                                        {
                                          title: "Phiên bản",
                                          dataIndex: "version",
                                          key: "version",
                                          width: 120,
                                          render: (version: string) =>
                                            version || (
                                              <span className="text-gray-400 italic">
                                                -
                                              </span>
                                            ),
                                        },
                                        {
                                          title: "Nhà sản xuất",
                                          dataIndex: "publisher",
                                          key: "publisher",
                                          width: 150,
                                          render: (publisher: string) =>
                                            publisher || (
                                              <span className="text-gray-400 italic">
                                                -
                                              </span>
                                            ),
                                        },
                                        {
                                          title: "Ngày cài đặt",
                                          dataIndex: "installationDate",
                                          key: "installationDate",
                                          width: 150,
                                          render: (date: string) =>
                                            date ? (
                                              new Date(date).toLocaleDateString(
                                                "vi-VN"
                                              )
                                            ) : (
                                              <span className="text-gray-400 italic">
                                                -
                                              </span>
                                            ),
                                        },
                                        {
                                          title: "License Key",
                                          dataIndex: "licenseKey",
                                          key: "licenseKey",
                                          width: 200,
                                          render: (key: string) =>
                                            key ? (
                                              <span className="font-mono text-xs">
                                                {key}
                                              </span>
                                            ) : (
                                              <span className="text-gray-400 italic">
                                                -
                                              </span>
                                            ),
                                        },
                                      ]}
                                      pagination={false}
                                      size="middle"
                                    />
                                  )}
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
