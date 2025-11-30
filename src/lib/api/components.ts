import { api } from "../api";

/**
 * Component Type enum
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
 * Component Status enum
 */
export enum ComponentStatus {
  INSTALLED = "INSTALLED",
  REMOVED = "REMOVED",
  FAULTY = "FAULTY",
  MAINTENANCE = "MAINTENANCE",
}

/**
 * Component response DTO
 */
export interface ComponentResponseDto {
  id: string;
  componentType: ComponentType;
  name: string;
  componentSpecs?: string;
  serialNumber?: string;
  status: ComponentStatus;
  installedAt: string;
  removedAt?: string;
  notes?: string;
}

/**
 * Computer info in component response
 */
interface ComputerInfo {
  id: string;
  machineLabel: string;
  asset?: {
    id: string;
    name: string;
    ktCode: string;
    fixedCode: string;
    status: string;
  };
  room?: {
    id: string;
    name: string;
    roomCode: string;
  };
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Get components by computer response data
 */
interface GetComponentsByComputerData {
  computer: ComputerInfo;
  totalComponents: number;
  componentStats: Record<string, number>;
  components: ComponentResponseDto[];
}

/**
 * Get components by computer ID
 * @param computerId Computer ID (UUID)
 * @returns Promise with list of components for the computer
 */
export const getComponentsByComputerId = async (
  computerId: string
): Promise<ComponentResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/${computerId}/components`
    );

    // Extract components array from nested structure
    const components = response.data.data.components;

    return components;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách linh kiện thất bại."
    );
  }
};

/**
 * Get component statistics by computer ID
 * @param computerId Computer ID (UUID)
 * @returns Promise with component statistics
 */
export const getComponentStatsByComputerId = async (
  computerId: string
): Promise<{ computer: ComputerInfo; stats: Record<string, number> }> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/${computerId}/components`
    );

    return {
      computer: response.data.data.computer,
      stats: response.data.data.componentStats,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thống kê linh kiện thất bại."
    );
  }
};

/**
 * Get components by asset ID (for replacement selection)
 * @param assetId Asset ID (UUID)
 * @returns Promise with list of components for the asset
 */
export const getComponentsByAssetId = async (
  assetId: string
): Promise<ComponentResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/asset/${assetId}/components`
    );

    // Extract components array from nested structure
    const components = response.data.data.components;

    return components;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách linh kiện thất bại."
    );
  }
};

/**
 * Get components by asset ID with computer info
 * @param assetId Asset ID (UUID)
 * @returns Promise with components and computer info
 */
export const getComponentsByAssetIdWithComputer = async (
  assetId: string
): Promise<{ components: ComponentResponseDto[]; computer: ComputerInfo }> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/asset/${assetId}/components`
    );

    return {
      components: response.data.data.components,
      computer: response.data.data.computer,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách linh kiện thất bại."
    );
  }
};

/**
 * Interface cho request thêm linh kiện vào kho từ đề xuất (Bulk Action)
 */
export interface AddStockFromProposalRequest {
  proposalId: string;
  notes?: string;
}

/**
 * Interface cho chi tiết một item được xử lý
 */
export interface ProcessedItem {
  itemId: string;
  status: "SUCCESS" | "SKIPPED" | "ERROR";
  message?: string;
  newComponent?: {
    id: string;
    name: string;
    type: string;
  };
  componentId?: string; // Cho trường hợp SKIPPED
}

/**
 * Interface cho response thêm linh kiện vào kho từ đề xuất
 */
export interface AddStockFromProposalResponse {
  proposalId: string;
  totalItems: number;
  successCount: number;
  details: ProcessedItem[];
}

/**
 * Thêm linh kiện mới vào kho từ đề xuất thay thế (Bulk Action)
 * Xử lý tất cả các items trong đề xuất cùng lúc
 * @param data Dữ liệu chứa proposalId và notes
 * @returns Promise với kết quả xử lý từng item
 */
export const addStockFromProposal = async (
  data: AddStockFromProposalRequest
): Promise<AddStockFromProposalResponse> => {
  try {
    const response = await api.patch<ApiResponse<AddStockFromProposalResponse>>(
      `/computer/add-stock-component`,
      data
    );

    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Nhập kho linh kiện từ đề xuất thất bại."
    );
  }
};

/**
 * Legacy interface cho backward compatibility (DEPRECATED)
 * @deprecated Sử dụng AddStockFromProposalRequest thay thế
 */
export interface AddStockComponentRequest {
  oldComponentId: string;
  serialNumber?: string;
  notes?: string;
}

/**
 * Legacy interface cho backward compatibility (DEPRECATED)
 * @deprecated Sử dụng AddStockFromProposalResponse thay thế
 */
export interface AddStockComponentResponse {
  newComponent: ComponentResponseDto;
  oldComponent: ComponentResponseDto;
  replacementInfo: {
    proposalCode: string;
    proposalId: string;
    replacementItemId: string;
    message: string;
    autoUpdated: boolean;
  };
}

/**
 * Legacy function cho backward compatibility (DEPRECATED)
 * @deprecated Sử dụng addStockFromProposal() thay thế
 * Thêm linh kiện mới vào kho (dựa trên đề xuất thay thế)
 * @param data Dữ liệu thêm linh kiện
 * @returns Promise với thông tin linh kiện mới và cũ
 */
export const addStockComponent = async (
  data: AddStockComponentRequest
): Promise<AddStockComponentResponse> => {
  try {
    const response = await api.patch<ApiResponse<AddStockComponentResponse>>(
      `/computer/add-stock-component-legacy`,
      data
    );

    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Thêm linh kiện vào kho thất bại."
    );
  }
};

/**
 * Interface cho request thay thế linh kiện
 */
export interface ReplaceComponentRequest {
  oldComponentId: string;
  newItemName: string;
  newItemSpecs: string;
  serialNumber?: string;
  notes?: string;
  newlyPurchasedComponentId?: string;
}

/**
 * Interface cho response thay thế linh kiện
 */
export interface ReplaceComponentResponse {
  computer: {
    id: string;
    machineLabel: string;
    assetName: string;
  };
  oldComponent: {
    id: string;
    name: string;
    componentType: string;
    componentSpecs: string;
    status: string;
    removedAt: string;
  };
  newComponent: ComponentResponseDto;
}

/**
 * Thay thế một linh kiện trong máy tính
 * @param computerId Computer ID (UUID) - KHÔNG PHẢI Asset ID
 * @param data Dữ liệu thay thế linh kiện
 * @returns Promise với thông tin linh kiện cũ và mới
 */
export const replaceComponent = async (
  computerId: string,
  data: ReplaceComponentRequest
): Promise<ReplaceComponentResponse> => {
  try {
    const response = await api.patch<ApiResponse<ReplaceComponentResponse>>(
      `/computer/${computerId}/replace-component`,
      data
    );

    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Thay thế linh kiện thất bại."
    );
  }
};

/**
 * Interface cho response khi lấy component detail
 */
interface GetComponentDetailData {
  component: ComponentResponseDto;
  computer: ComputerInfo;
}

/**
 * Lấy chi tiết một linh kiện theo ID
 * @param componentId Component ID (UUID)
 * @returns Promise với thông tin component và computer
 */
export const getComponentById = async (
  componentId: string
): Promise<{ component: ComponentResponseDto; computer: ComputerInfo }> => {
  try {
    const response = await api.get<ApiResponse<GetComponentDetailData>>(
      `/computer/component/${componentId}`
    );

    return {
      component: response.data.data.component,
      computer: response.data.data.computer,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy chi tiết linh kiện thất bại."
    );
  }
};

/**
 * Lấy computerId từ componentId bằng cách tìm trong danh sách components của asset
 * @param componentId Component ID (UUID)
 * @param assetId Asset ID (UUID) - từ repairRequests
 * @returns Promise với computerId
 */
export const getComputerIdFromComponent = async (
  componentId: string,
  assetId: string
): Promise<string> => {
  try {
    // Lấy danh sách components của asset
    const { computer } = await getComponentsByAssetIdWithComputer(assetId);
    return computer.id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thông tin máy tính thất bại."
    );
  }
};
