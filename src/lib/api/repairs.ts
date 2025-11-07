import { api } from "../api";
import {
  RepairRequest,
  RepairRequestWithDetails,
  RepairStatus,
  ErrorType,
  getErrorTypeLabel,
} from "@/types";

/**
 * Interface cho query parameters khi lấy danh sách yêu cầu sửa chữa
 */
export interface GetRepairsQueryParams {
  // Filtering
  computerAssetId?: string; // Lọc theo tài sản
  reporterId?: string; // Lọc theo người báo lỗi
  assignedTechnicianId?: string; // Lọc theo kỹ thuật viên
  status?: RepairStatus; // Lọc theo trạng thái
  errorType?: ErrorType; // ✅ Lọc theo loại lỗi (enum thay vì errorTypeId)
  search?: string; // Tìm kiếm theo mã yêu cầu hoặc mô tả
  fromDate?: string; // Lọc từ ngày (ISO string)
  toDate?: string; // Lọc đến ngày (ISO string)

  // Pagination
  page?: number; // Trang hiện tại (default: 1)
  limit?: number; // Số lượng items mỗi trang (default: 10)

  // Sorting
  sortBy?:
    | "createdAt"
    | "requestCode"
    | "status"
    | "acceptedAt"
    | "completedAt"; // Trường để sắp xếp
  sortOrder?: "ASC" | "DESC"; // Thứ tự sắp xếp (default: DESC)
}

/**
 * Interface cho response khi lấy danh sách yêu cầu sửa chữa (có phân trang)
 * Backend trả về flat structure thay vì nested meta
 */
export interface GetRepairsResponse {
  data: RepairRequest[]; // Danh sách yêu cầu sửa chữa
  total: number; // Tổng số yêu cầu
  page: number; // Trang hiện tại
  limit: number; // Số lượng items mỗi trang
  totalPages: number; // Tổng số trang
}

/**
 * Interface cho response khi lấy chi tiết một yêu cầu sửa chữa
 * Backend trả về trực tiếp object, không có wrapper
 */
export type GetRepairDetailResponse = RepairRequestWithDetails;

/**
 * Interface cho request tạo yêu cầu sửa chữa mới
 */
export interface CreateRepairRequest {
  computerAssetId: string; // ID tài sản máy tính
  errorType?: ErrorType; // ✅ Loại lỗi (ErrorType enum thay vì errorTypeId)
  description: string; // Mô tả chi tiết lỗi
  mediaUrls?: string[]; // Mảng URL ảnh/video minh họa (optional)
  componentIds?: string[]; // Danh sách ID linh kiện bị lỗi (optional)
  softwareIds?: string[]; // Danh sách ID phần mềm bị lỗi (optional)
}

/**
 * Interface cho API response (raw data từ backend)
 * Chứa nested objects và các quan hệ
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
  errorType?: ErrorType;
  
  // Nested objects
  computerAsset?: {
    id: string;
    ktCode: string;
    name: string;
    type: string;
    status: string;
    machineLabel?: string;
  };
  
  room?: {
    id: string;
    name: string;
    building: string;
    floor: string;
    roomNumber: string;
    unit?: {
      id: string;
      name: string;
      code: string;
    };
  };
  
  reporter?: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    roles?: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  };
  
  assignedTechnician?: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    roles?: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  };
  
  components?: Array<{
    id: string;
    name: string;
    type: string;
    specifications: string;
    status: string;
  }>;
}

/**
 * Transform API response sang RepairRequest format với computed fields
 * Gộp logic mapping từ repairMapper.ts vào đây
 */
const transformApiResponse = (apiData: ApiRepairResponse): RepairRequest => {
  // Component name: join tất cả components hoặc lấy phần tử đầu
  const componentName = apiData.components && apiData.components.length > 0
    ? apiData.components.length === 1
      ? apiData.components[0].name
      : apiData.components.map((c) => c.name).join(', ')
    : 'Chưa xác định';

  // Extract reporter role (lấy role đầu tiên hoặc default)
  const reporterRole = apiData.reporter?.roles && apiData.reporter.roles.length > 0
    ? apiData.reporter.roles[0].name
    : 'Giảng viên';

  // Extract unit name
  const unitName = apiData.room?.unit?.name || 'Chưa xác định';

  // Extract machine label
  const machineLabel = apiData.computerAsset?.machineLabel || 'N/A';

  return {
    // Direct fields từ API
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
    
    // Nested objects (giữ nguyên)
    computerAsset: apiData.computerAsset,
    room: apiData.room,
    reporter: apiData.reporter,
    assignedTechnician: apiData.assignedTechnician,
    components: apiData.components,
    
    // Computed fields từ nested objects
    assetCode: apiData.computerAsset?.ktCode || 'Chưa xác định',
    assetName: apiData.computerAsset?.name || 'Chưa xác định',
    reporterName: apiData.reporter?.fullName || 'Chưa xác định',
    assignedTechnicianName: apiData.assignedTechnician?.fullName,
    roomName: apiData.room?.name || 'Chưa xác định',
    buildingName: apiData.room?.building || 'Chưa xác định',
    componentName,
    
    // Error type fields
    errorType: apiData.errorType,
    errorTypeName: getErrorTypeLabel(apiData.errorType),
    
    // New fields từ nested objects
    reporterRole,
    machineLabel,
    unit: unitName,
  };
};

/**
 * Interface cho request cập nhật yêu cầu sửa chữa
 */
export interface UpdateRepairRequest {
  assignedTechnicianId?: string; // Phân công kỹ thuật viên
  errorType?: ErrorType; // ✅ Cập nhật loại lỗi (ErrorType enum thay vì errorTypeId)
  description?: string; // Cập nhật mô tả
  mediaUrls?: string[]; // Cập nhật ảnh/video
  status?: RepairStatus; // Cập nhật trạng thái
  resolutionNotes?: string; // Ghi chú xử lý
}

/**
 * Lấy danh sách yêu cầu sửa chữa với lọc và phân trang
 * @param params Query parameters cho filtering, pagination, và sorting
 * @returns Promise với danh sách yêu cầu sửa chữa và metadata
 */
export const getRepairs = async (
  params?: GetRepairsQueryParams
): Promise<GetRepairsResponse> => {
  try {
    const response = await api.get<{ data: ApiRepairResponse[]; total: number; page: number; limit: number; totalPages: number }>(
      "/api/v1/repairs",
      { params }
    );
    
    // Transform API responses
    const transformedData = response.data.data.map(transformApiResponse);
    
    return {
      data: transformedData,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
    };
  } catch (error: unknown) {
    console.error("❌ Get repairs error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách yêu cầu sửa chữa thất bại."
    );
  }
};

/**
 * Tạo yêu cầu sửa chữa mới
 * @param data Dữ liệu yêu cầu sửa chữa mới
 * @returns Promise với thông tin yêu cầu sửa chữa đã tạo
 */
export const createRepair = async (
  data: CreateRepairRequest
): Promise<GetRepairDetailResponse> => {
  try {
    console.log("🌐 API Call: POST /api/v1/repairs", data);
    const response = await api.post<ApiRepairResponse>("/api/v1/repairs", data);
    console.log("✅ API Response:", response.data);
    
    // Transform response - cast to correct type
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    console.error("❌ Create repair error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message || "Tạo yêu cầu sửa chữa thất bại."
    );
  }
};

/**
 * Lấy chi tiết một yêu cầu sửa chữa theo ID
 * @param id ID của yêu cầu sửa chữa
 * @returns Promise với thông tin chi tiết yêu cầu sửa chữa
 */
export const getRepairById = async (
  id: string
): Promise<GetRepairDetailResponse> => {
  try {
    console.log("🌐 API Call: GET /api/v1/repairs/" + id);
    const response = await api.get<ApiRepairResponse>(`/api/v1/repairs/${id}`);
    console.log("✅ API Response:", response.data);
    
    // Transform response
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    console.error("❌ Get repair detail error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message || "Lấy chi tiết yêu cầu sửa chữa thất bại."
    );
  }
};

/**
 * Cập nhật yêu cầu sửa chữa (bao gồm cập nhật trạng thái)
 * @param id ID của yêu cầu sửa chữa
 * @param data Dữ liệu cập nhật
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const updateRepair = async (
  id: string,
  data: UpdateRepairRequest
): Promise<GetRepairDetailResponse> => {
  try {
    console.log("🌐 API Call: PUT /api/v1/repairs/" + id, data);
    const response = await api.put<ApiRepairResponse>(`/api/v1/repairs/${id}`, data);
    console.log("✅ API Response:", response.data);
    
    // Transform response
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    console.error("❌ Update repair error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message || "Cập nhật yêu cầu sửa chữa thất bại."
    );
  }
};

/**
 * Cập nhật trạng thái yêu cầu sửa chữa
 * @param id ID của yêu cầu sửa chữa
 * @param status Trạng thái mới
 * @param resolutionNotes Ghi chú xử lý (optional)
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const updateRepairStatus = async (
  id: string,
  status: RepairStatus,
  resolutionNotes?: string
): Promise<GetRepairDetailResponse> => {
  return updateRepair(id, { status, resolutionNotes });
};

/**
 * Tiếp nhận yêu cầu sửa chữa (Kỹ thuật viên)
 * CHỜ_TIẾP_NHẬN → ĐÃ_TIẾP_NHẬN
 * @param id ID của yêu cầu sửa chữa
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const acceptRepair = async (
  id: string
): Promise<GetRepairDetailResponse> => {
  return updateRepairStatus(id, RepairStatus.ĐÃ_TIẾP_NHẬN);
};

/**
 * Bắt đầu xử lý yêu cầu sửa chữa
 * ĐÃ_TIẾP_NHẬN → ĐANG_XỬ_LÝ
 * @param id ID của yêu cầu sửa chữa
 * @param resolutionNotes Ghi chú xử lý (optional)
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const startProcessingRepair = async (
  id: string,
  resolutionNotes?: string
): Promise<GetRepairDetailResponse> => {
  return updateRepairStatus(id, RepairStatus.ĐANG_XỬ_LÝ, resolutionNotes);
};

/**
 * Đánh dấu yêu cầu chờ thay thế linh kiện
 * ĐANG_XỬ_LÝ → CHỜ_THAY_THẾ
 * @param id ID của yêu cầu sửa chữa
 * @param resolutionNotes Ghi chú về linh kiện cần thay thế
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const markWaitingForReplacement = async (
  id: string,
  resolutionNotes: string
): Promise<GetRepairDetailResponse> => {
  return updateRepairStatus(id, RepairStatus.CHỜ_THAY_THẾ, resolutionNotes);
};

/**
 * Hoàn thành yêu cầu sửa chữa
 * ĐANG_XỬ_LÝ hoặc CHỜ_THAY_THẾ → ĐÃ_HOÀN_THÀNH
 * @param id ID của yêu cầu sửa chữa
 * @param resolutionNotes Ghi chú kết quả xử lý
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const completeRepair = async (
  id: string,
  resolutionNotes: string
): Promise<GetRepairDetailResponse> => {
  return updateRepairStatus(id, RepairStatus.ĐÃ_HOÀN_THÀNH, resolutionNotes);
};

/**
 * Hủy yêu cầu sửa chữa
 * Bất kỳ trạng thái nào → ĐÃ_HỦY
 * @param id ID của yêu cầu sửa chữa
 * @param resolutionNotes Lý do hủy
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const cancelRepair = async (
  id: string,
  resolutionNotes: string
): Promise<GetRepairDetailResponse> => {
  return updateRepairStatus(id, RepairStatus.ĐÃ_HỦY, resolutionNotes);
};

/**
 * Lấy danh sách yêu cầu sửa chữa theo người báo lỗi (reporter)
 * @param reporterId ID của người báo lỗi
 * @returns Promise với danh sách yêu cầu sửa chữa của người báo lỗi
 */
export const getRepairsByReporter = async (
  reporterId: string
): Promise<RepairRequest[]> => {
  try {
    console.log(
      `🌐 API Call: GET /api/v1/repairs/repair-requests/reporters/${reporterId}`
    );
    const response = await api.get<ApiRepairResponse[]>(
      `/api/v1/repairs/repair-requests/reporters/${reporterId}`
    );
    console.log("✅ API Response:", response.data);
    
    // Transform responses
    return response.data.map(transformApiResponse);
  } catch (error: unknown) {
    console.error("❌ Get repairs by reporter error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách yêu cầu sửa chữa theo người báo lỗi thất bại."
    );
  }
};

/**
 * Lấy danh sách yêu cầu sửa chữa theo kỹ thuật viên (technician)
 * @param technicianId ID của kỹ thuật viên
 * @returns Promise với danh sách yêu cầu sửa chữa được phân công cho kỹ thuật viên
 */
export const getRepairsByTechnician = async (
  technicianId: string
): Promise<RepairRequest[]> => {
  try {
    console.log(
      `🌐 API Call: GET /api/v1/repairs/repair-requests/technicians/${technicianId}`
    );
    const response = await api.get<ApiRepairResponse[]>(
      `/api/v1/repairs/repair-requests/technicians/${technicianId}`
    );
    console.log("✅ API Response:", response.data);
    
    // Transform responses
    return response.data.map(transformApiResponse);
  } catch (error: unknown) {
    console.error("❌ Get repairs by technician error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách yêu cầu sửa chữa theo kỹ thuật viên thất bại."
    );
  }
};

