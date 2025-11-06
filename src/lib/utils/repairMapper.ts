import { RepairRequest } from '@/types/repair';

/**
 * Interface cho API response (raw data từ backend)
 */
interface ApiRepairResponse {
  id: string;
  requestCode: string;
  computerAssetId: string;
  reporterId: string;
  assignedTechnicianId?: string;
  description: string;
  mediaUrls?: string[] | null;
  status: string;
  resolutionNotes?: string | null;
  createdAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  errorType?: string;
  
  // Nested objects
  computerAsset?: {
    id: string;
    ktCode: string;
    name: string;
    type: string;
    status: string;
  };
  
  room?: {
    id: string;
    name: string;
    building: string;
    floor: string;
    roomNumber: string;
  };
  
  reporter?: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    roles?: string[];
  };
  
  assignedTechnician?: {
    id: string;
    fullName: string;
    email: string;
    username: string;
  };
  
  components?: Array<{
    id: string;
    name: string;
    type: string;
    specifications: string;
    status: string;
  }>;
  
  // Optional fields (có thể BE chưa implement)
  machineLabel?: string;
  unit?: string;
  errorTypeId?: string;
}

/**
 * Mapping Error Type enum sang tên hiển thị tiếng Việt
 */
export const ERROR_TYPE_MAPPING: Record<string, string> = {
  'MAY_MAT_CHUOT': 'Máy mất chuột',
  'MAY_HU_CHUOT': 'Máy hư chuột',
  'MAY_MAT_BAN_PHIM': 'Máy mất bàn phím',
  'MAY_HU_BAN_PHIM': 'Máy hư bàn phím',
  'MAY_HU_MAN_HINH': 'Máy hư màn hình',
  'MAY_KHONG_KHOI_DONG': 'Máy không khởi động',
  'MAY_KHONG_KET_NOI_MANG': 'Máy không kết nối mạng',
  'MAY_HU_PHAN_MEM': 'Máy hư phần mềm',
  'MAY_KHONG_SU_DUNG_DUOC': 'Máy không sử dụng được',
  'LOI_KHAC': 'Lỗi khác',
};

/**
 * Map error type enum sang tên hiển thị
 */
export const mapErrorTypeToName = (errorType: string | undefined): string => {
  if (!errorType) return 'Chưa xác định';
  return ERROR_TYPE_MAPPING[errorType] || errorType;
};

/**
 * Map API response sang RepairRequest format của frontend
 * Xử lý cả nested objects và computed fields
 */
export const mapApiResponseToRepairRequest = (apiData: ApiRepairResponse): RepairRequest => {
  // Xử lý component name: join tất cả components hoặc lấy phần tử đầu
  const componentName = apiData.components && apiData.components.length > 0
    ? apiData.components.length === 1
      ? apiData.components[0].name
      : apiData.components.map((c) => c.name).join(', ')
    : 'Chưa xác định';

  return {
    // ✅ Direct fields từ API
    id: apiData.id,
    requestCode: apiData.requestCode,
    computerAssetId: apiData.computerAssetId,
    reporterId: apiData.reporterId,
    assignedTechnicianId: apiData.assignedTechnicianId,
    description: apiData.description,
    mediaUrls: apiData.mediaUrls || undefined,
    status: apiData.status as RepairRequest['status'],
    resolutionNotes: apiData.resolutionNotes || undefined,
    createdAt: apiData.createdAt,
    acceptedAt: apiData.acceptedAt || undefined,
    completedAt: apiData.completedAt || undefined,
    
    // ✅ Nested objects từ API (giữ nguyên)
    computerAsset: apiData.computerAsset,
    room: apiData.room,
    reporter: apiData.reporter,
    assignedTechnician: apiData.assignedTechnician,
    components: apiData.components,
    
    // ✅ Computed fields - Map từ nested objects
    assetCode: apiData.computerAsset?.ktCode || 'Chưa xác định',
    assetName: apiData.computerAsset?.name || 'Chưa xác định',
    reporterName: apiData.reporter?.fullName || 'Chưa xác định',
    assignedTechnicianName: apiData.assignedTechnician?.fullName,
    roomName: apiData.room?.name || 'Chưa xác định',
    buildingName: apiData.room?.building || 'Chưa xác định',
    componentName,
    
    // ✅ Error type fields
    errorType: apiData.errorType,
    errorTypeName: mapErrorTypeToName(apiData.errorType),
    errorTypeId: apiData.errorTypeId,
    
    // ⚠️ Fields thiếu trong API - Cần BE bổ sung
    reporterRole: 'Giảng viên', // ⚠️ MISSING - Default là Giảng viên
    machineLabel: apiData.machineLabel || 'N/A', // ⚠️ MISSING - Backend cần thêm
    unit: apiData.unit || 'Chưa xác định', // ⚠️ MISSING - Backend cần thêm
  };
};

/**
 * Map array of API responses sang array of RepairRequest
 */
export const mapApiResponsesToRepairRequests = (apiDataArray: ApiRepairResponse[]): RepairRequest[] => {
  return apiDataArray.map(mapApiResponseToRepairRequest);
};

/**
 * Helper function để kiểm tra field nào còn thiếu trong API response
 * Dùng để debugging và tracking BE progress
 */
export const checkMissingFields = (apiData: ApiRepairResponse): string[] => {
  const missingFields: string[] = [];
  
  if (!apiData.machineLabel) {
    missingFields.push('machineLabel');
  }
  
  if (!apiData.unit) {
    missingFields.push('unit');
  }
  
  if (!apiData.errorTypeId) {
    missingFields.push('errorTypeId');
  }
  
  if (!apiData.reporter?.roles) {
    missingFields.push('reporter.roles');
  }
  
  return missingFields;
};
