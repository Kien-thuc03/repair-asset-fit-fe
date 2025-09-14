import { ReplacementComponent } from "@/types";

// Mock data cho các linh kiện từ báo cáo lỗi cần thay thế
// Đây là các linh kiện được trích xuất từ các báo cáo sửa chữa đã xác định cần thay thế
export const mockComponentsFromReports: ReplacementComponent[] = [
  {
    id: "comp-report-001",
    assetId: "ASSET101",
    assetCode: "PC-H101-01",
    assetName: "PC Dell OptiPlex 3080 - Máy 01",
    componentId: "comp-nic-001",
    componentName: "Card mạng",
    componentSpecs: "Gigabit Ethernet Realtek RTL8111",
    roomId: "room-h101",
    roomName: "H101",
    buildingName: "Tòa H",
    machineLabel: "01",
    reason:
      "Card mạng không hoạt động, mất kết nối mạng, không thể truy cập internet",
    quantity: 1,
  },
  {
    id: "comp-report-002",
    assetId: "ASSET102",
    assetCode: "PC-H102-05",
    assetName: "PC Dell OptiPlex 3080 - Máy 05",
    componentId: "comp-ram-002",
    componentName: "RAM DDR4",
    componentSpecs: "8GB DDR4-2666 Kingston",
    roomId: "room-h102",
    roomName: "H102",
    buildingName: "Tòa H",
    machineLabel: "05",
    reason: "RAM bị lỗi, máy không khởi động được, màn hình đen",
    quantity: 1,
  },
  {
    id: "comp-report-003",
    assetId: "ASSET103",
    assetCode: "PC-H704-08",
    assetName: "PC HP ProDesk 400 - Máy 08",
    componentId: "comp-ssd-003",
    componentName: "Ổ cứng SSD",
    componentSpecs: "256GB SATA Samsung",
    roomId: "room-h704",
    roomName: "H704",
    buildingName: "Tòa H",
    machineLabel: "08",
    reason:
      "Ổ cứng SSD bị bad sector nghiêm trọng, mất dữ liệu, không thể truy cập",
    quantity: 1,
  },
  {
    id: "comp-report-004",
    assetId: "ASSET104",
    assetCode: "PC-H508-11",
    assetName: "PC Lenovo ThinkCentre - Máy 11",
    componentId: "comp-gpu-004",
    componentName: "Card đồ họa",
    componentSpecs: "NVIDIA GTX 1050 2GB",
    roomId: "room-h508",
    roomName: "H508",
    buildingName: "Tòa H",
    machineLabel: "11",
    reason: "Card đồ họa bị lỗi chip, màn hình không hiển thị hình ảnh",
    quantity: 1,
  },
  {
    id: "comp-report-005",
    assetId: "ASSET105",
    assetCode: "PC-H109-22",
    assetName: "PC Dell Inspiron - Máy 22",
    componentId: "comp-cpu-005",
    componentName: "CPU",
    componentSpecs: "Intel i5-8400 6 cores",
    roomId: "room-h109",
    roomName: "H109",
    buildingName: "Tòa H",
    machineLabel: "22",
    reason: "CPU bị quá nhiệt, máy tự động tắt liên tục sau 5-10 phút sử dụng",
    quantity: 1,
  },
  {
    id: "comp-report-006",
    assetId: "ASSET106",
    assetCode: "PC-H203-07",
    assetName: "PC Dell OptiPlex 5080 - Máy 07",
    componentId: "comp-psu-006",
    componentName: "Nguồn điện",
    componentSpecs: "500W 80+ Bronze",
    roomId: "room-h203",
    roomName: "H203",
    buildingName: "Tòa H",
    machineLabel: "07",
    reason:
      "Nguồn cung cấp điện không ổn định, có tiếng kêu bất thường, điện áp không đều",
    quantity: 1,
  },
  {
    id: "comp-report-007",
    assetId: "ASSET107",
    assetCode: "PC-H301-12",
    assetName: "PC HP EliteDesk 800 - Máy 12",
    componentId: "comp-mb-007",
    componentName: "Bo mạch chủ",
    componentSpecs: "Intel B460 chipset ATX",
    roomId: "room-h301",
    roomName: "H301",
    buildingName: "Tòa H",
    machineLabel: "12",
    reason: "Bo mạch chủ bị chập cháy do sự cố điện, không thể khởi động",
    quantity: 1,
  },
  {
    id: "comp-report-008",
    assetId: "ASSET108",
    assetCode: "PC-H205-15",
    assetName: "PC Dell Vostro 3471 - Máy 15",
    componentId: "comp-hdd-008",
    componentName: "Ổ cứng HDD",
    componentSpecs: "1TB SATA WD Blue",
    roomId: "room-h205",
    roomName: "H205",
    buildingName: "Tòa H",
    machineLabel: "15",
    reason: "Ổ cứng HDD có bad sector, tốc độ đọc/ghi chậm, cần backup dữ liệu",
    quantity: 1,
  },
  {
    id: "comp-report-009",
    assetId: "ASSET301",
    assetCode: "PC-H301-01",
    assetName: "PC Dell OptiPlex 3070 - Máy 01",
    componentId: "comp-mb-009",
    componentName: "Bo mạch chủ",
    componentSpecs: "Intel H310 chipset ATX",
    roomId: "room-h301",
    roomName: "H301",
    buildingName: "Tòa H",
    machineLabel: "01",
    reason: "Bo mạch chủ bị hỏng, không thể khởi động máy",
    quantity: 1,
  },
  {
    id: "comp-report-010",
    assetId: "ASSET902",
    assetCode: "PC-H902-03",
    assetName: "PC Acer Veriton - Máy 03",
    componentId: "comp-cpu-010",
    componentName: "CPU",
    componentSpecs: "Intel i5-8400 6 cores",
    roomId: "room-h902",
    roomName: "H902",
    buildingName: "Tòa H",
    machineLabel: "03",
    reason: "CPU bị quá nhiệt, máy tự động tắt liên tục",
    quantity: 1,
  },
];

// Export cả interface cho việc sử dụng trong components khác
export interface ComponentFromReport extends ReplacementComponent {
  reportDate?: string;
  status?: string;
  errorType?: string;
}

// Mock data cho trang lập phiếu đề xuất với thêm thông tin báo cáo
export const mockComponentsFromReportsWithStatus: ComponentFromReport[] =
  mockComponentsFromReports.map((component, index) => ({
    ...component,
    reportDate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Các ngày khác nhau
    status: "Chờ xử lý",
    errorType: getErrorTypeFromReason(component.reason),
  }));

// Helper function để tạo error type từ reason
function getErrorTypeFromReason(reason: string): string {
  if (reason.includes("Card mạng")) return "Hỏng card mạng";
  if (reason.includes("RAM")) return "RAM lỗi";
  if (reason.includes("SSD")) return "Ổ cứng SSD hỏng";
  if (reason.includes("Card đồ họa")) return "Lỗi card đồ họa";
  if (reason.includes("CPU")) return "Lỗi CPU";
  if (reason.includes("Nguồn")) return "Nguồn không ổn định";
  if (reason.includes("Bo mạch chủ")) return "Lỗi bo mạch chủ";
  if (reason.includes("HDD")) return "Ổ cứng HDD lỗi";
  return "Lỗi khác";
}
