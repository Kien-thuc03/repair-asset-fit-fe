/**
 * Computer Types - Quản lý máy tính
 * Sync với backend: src/modules/computer/dto/get-computers-filter.dto.ts
 */

/**
 * Component Type enum - Synced with database
 * Enum: computer_components_componenttype_enum
 * 
 * Lưu ý:
 * - MAINBOARD (không phải MOTHERBOARD)
 * - STORAGE (thay vì HDD/SSD riêng)
 */
export enum ComponentType {
  CPU = "CPU",
  RAM = "RAM",
  MAINBOARD = "MAINBOARD",
  STORAGE = "STORAGE",
  GPU = "GPU",
  PSU = "PSU",
  CASE = "CASE",
  MONITOR = "MONITOR",
  KEYBOARD = "KEYBOARD",
  MOUSE = "MOUSE",
  NETWORK = "NETWORK",
  OPTICAL_DRIVE = "OPTICAL_DRIVE",
  COOLER = "COOLER",
  UPS = "UPS",
  OTHER = "OTHER",
  NETWORK_CARD = "NETWORK_CARD",
  SOUND_CARD = "SOUND_CARD",
  SPEAKER = "SPEAKER",
  WEBCAM = "WEBCAM",
}

/**
 * Component Status enum - Synced with database
 * Enum: computer_components_status_enum
 * 
 * Lưu ý:
 * - FAULTY (không phải DAMAGED)
 * - IN_STOCK (không phải REPLACED)
 */
export enum ComponentStatus {
  INSTALLED = "INSTALLED",
  FAULTY = "FAULTY",
  REMOVED = "REMOVED",
  IN_STOCK = "IN_STOCK",
}

/**
 * Component Type Labels - Vietnamese
 */
export const COMPONENT_TYPE_LABELS: Record<ComponentType, string> = {
  [ComponentType.CPU]: "CPU / Bộ vi xử lý",
  [ComponentType.RAM]: "RAM / Bộ nhớ",
  [ComponentType.MAINBOARD]: "Bo mạch chủ",
  [ComponentType.STORAGE]: "Ổ cứng",
  [ComponentType.GPU]: "Card đồ họa",
  [ComponentType.PSU]: "Nguồn",
  [ComponentType.CASE]: "Vỏ máy",
  [ComponentType.MONITOR]: "Màn hình",
  [ComponentType.KEYBOARD]: "Bàn phím",
  [ComponentType.MOUSE]: "Chuột",
  [ComponentType.NETWORK]: "Card mạng",
  [ComponentType.OPTICAL_DRIVE]: "Ổ đĩa quang",
  [ComponentType.COOLER]: "Quạt tản nhiệt",
  [ComponentType.UPS]: "Bộ lưu điện",
  [ComponentType.NETWORK_CARD]: "Card mạng",
  [ComponentType.SOUND_CARD]: "Card âm thanh",
  [ComponentType.SPEAKER]: "Loa",
  [ComponentType.WEBCAM]: "Webcam",
  [ComponentType.OTHER]: "Khác",
};

/**
 * Component Status Labels - Vietnamese
 */
export const COMPONENT_STATUS_LABELS: Record<ComponentStatus, string> = {
  [ComponentStatus.INSTALLED]: "Đã lắp đặt",
  [ComponentStatus.FAULTY]: "Hỏng",
  [ComponentStatus.REMOVED]: "Đã tháo",
  [ComponentStatus.IN_STOCK]: "Trong kho",
};

/**
 * Get component type label
 */
export const getComponentTypeLabel = (type: ComponentType | string): string => {
  return COMPONENT_TYPE_LABELS[type as ComponentType] || type;
};

/**
 * Get component status label
 */
export const getComponentStatusLabel = (status: ComponentStatus | string): string => {
  return COMPONENT_STATUS_LABELS[status as ComponentStatus] || status;
};

/**
 * Get component type options for select/dropdown
 */
export const getComponentTypeOptions = () => {
  return Object.entries(COMPONENT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
};

/**
 * Get component status options for select/dropdown
 */
export const getComponentStatusOptions = () => {
  return Object.entries(COMPONENT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
};

/**
 * Computer Component Interface
 */
export interface ComputerComponent {
  id: string;
  componentType: ComponentType | string;
  name: string;
  componentSpecs?: string;
  serialNumber?: string;
  status: ComponentStatus | string;
  installedAt: string;
}

/**
 * Computer Asset Information
 */
export interface ComputerAsset {
  id: string;
  ktCode: string;
  fixedCode: string;
  name: string;
  specs?: string;
  status: string;
  entrydate: string;
  origin?: string;
  categoryId: string;
  categoryName?: string;
}

/**
 * Computer Room Information
 */
export interface ComputerRoom {
  id: string;
  name: string;
  roomNumber: string;
  roomCode: string;
  building: string;
  floor: string;
}

/**
 * Computer Item từ API
 */
export interface Computer {
  id: string;
  machineLabel: string;
  notes?: string;
  asset: ComputerAsset;
  room?: ComputerRoom;
  components: ComputerComponent[];
  componentCount: number;
}

/**
 * Pagination Metadata
 */
export interface ComputerPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Summary Statistics
 */
export interface ComputerSummary {
  totalComputers: number;
  byStatus: Record<string, number>;
}

/**
 * Get Computers Response
 */
export interface GetComputersResponse {
  success: boolean;
  message: string;
  data: {
    computers: Computer[];
    pagination: ComputerPagination;
    summary: ComputerSummary;
  };
}

/**
 * Get Computers Query Parameters
 */
export interface GetComputersParams {
  // Filter parameters
  search?: string;
  status?: string[];
  building?: string;
  floor?: string;
  roomName?: string;
  roomId?: string;
  categoryName?: string;
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Sorting
  sortBy?: "machineLabel" | "assetName" | "status" | "entrydate" | "roomName";
  sortOrder?: "ASC" | "DESC";
}

/**
 * Asset for Device Grid (mapped từ Computer)
 */
export interface DeviceAsset {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  roomId: string;
  roomName: string;
  status: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  qrCode?: string;
  building?: string;
  floor?: string;
  machineLabel?: string;
  componentCount?: number;
}

