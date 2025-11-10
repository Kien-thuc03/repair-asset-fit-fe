import { api } from "../api";
import {
  RepairRequest,
  RepairRequestWithDetails,
  RepairStatus,
  ErrorType,
  getErrorTypeLabel,
  GetRepairLogsResponse,
} from "@/types";
import { uploadMultipleFiles } from "./upload";

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
  mediaFiles?: File[]; // ✅ Mảng files cần upload (optional)
  componentIds?: string[]; // Danh sách ID linh kiện bị lỗi (optional)
  softwareIds?: string[]; // Danh sách ID phần mềm bị lỗi (optional)
}

/**
 * Interface cho request ghi nhận và xử lý lỗi trực tiếp tại hiện trường
 * Extends từ CreateRepairRequest và thêm các trường cho xử lý
 * 
 * ✅ Các trạng thái finalStatus:
 * - ĐÃ_HOÀN_THÀNH: Lỗi đã được sửa chữa thành công tại chỗ
 * - CHỜ_THAY_THẾ: Linh kiện không thể sửa, cần thay thế (status chuyển ngay lập tức)
 * - undefined: Chỉ ghi nhận lỗi, chưa xử lý (status = ĐANG_XỬ_LÝ)
 * 
 * 🔥 Flow khi cần thay thế:
 * 1. Set finalStatus = CHỜ_THAY_THẾ → Status ngay lập tức = CHỜ_THAY_THẾ
 * 2. Component status: FAULTY → PENDING_REPLACEMENT
 * 3. Lập phiếu đề xuất thay thế
 * 4. Sau khi thay thế xong → Update status sang ĐÃ_HOÀN_THÀN
 */
export interface CreateAndProcessRepairRequest extends CreateRepairRequest {
  resolutionNotes?: string; // Ghi chú chi tiết quá trình xử lý lỗi (BẮT BUỘC khi có finalStatus)
  finalStatus?: RepairStatus.ĐÃ_HOÀN_THÀNH | RepairStatus.CHỜ_THAY_THẾ; // Cho phép ĐÃ_HOÀN_THÀNH hoặc CHỜ_THAY_THẾ
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
  const componentName =
    apiData.components && apiData.components.length > 0
      ? apiData.components.length === 1
        ? apiData.components[0].name
        : apiData.components.map((c) => c.name).join(", ")
      : "Chưa xác định";

  // Extract reporter role (lấy role đầu tiên hoặc default)
  const reporterRole =
    apiData.reporter?.roles && apiData.reporter.roles.length > 0
      ? apiData.reporter.roles[0].name
      : "Giảng viên";

  // Extract unit name
  const unitName = apiData.room?.unit?.name || "Chưa xác định";

  // Extract machine label
  const machineLabel = apiData.computerAsset?.machineLabel || "N/A";

  return {
    // Direct fields từ API
    id: apiData.id,
    requestCode: apiData.requestCode,
    computerAssetId: apiData.computerAssetId,
    reporterId: apiData.reporterId,
    assignedTechnicianId: apiData.assignedTechnicianId,
    description: apiData.description,
    mediaUrls: apiData.mediaUrls || undefined,
    status: apiData.status as RepairRequest["status"],
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
    ktCode: apiData.computerAsset?.ktCode || "Chưa xác định",
    assetName: apiData.computerAsset?.name || "Chưa xác định",
    reporterName: apiData.reporter?.fullName || "Chưa xác định",
    assignedTechnicianName: apiData.assignedTechnician?.fullName,
    roomName: apiData.room?.name || "Chưa xác định",
    buildingName: apiData.room?.building || "Chưa xác định",
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
  mediaFiles?: File[]; // ✅ Files mới cần upload (optional)
  status?: RepairStatus; // Cập nhật trạng thái
  resolutionNotes?: string; // Ghi chú xử lý
  componentIds?: string[]; // Danh sách ID component bị lỗi (khi chuyển sang CHỜ_THAY_THẾ)
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
    const response = await api.get<{
      data: ApiRepairResponse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/v1/repairs", { params });

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
    // ✅ Step 1: Upload files lên Cloudinary nếu có
    let uploadedUrls: string[] = [];
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      const uploadResponse = await uploadMultipleFiles(
        data.mediaFiles,
        "repair-requests"
      );

      if (uploadResponse.success && uploadResponse.urls) {
        uploadedUrls = uploadResponse.urls;
      } else {
        throw new Error(uploadResponse.error || "Upload files thất bại");
      }
    }

    // ✅ Step 2: Merge uploaded URLs với existing mediaUrls (nếu có)
    const allMediaUrls = [...(data.mediaUrls || []), ...uploadedUrls];

    // ✅ Step 3: Tạo repair request với URLs từ Cloudinary
    const requestData = {
      computerAssetId: data.computerAssetId,
      errorType: data.errorType,
      description: data.description,
      mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : undefined,
      componentIds: data.componentIds,
      softwareIds: data.softwareIds,
    };

    const response = await api.post<ApiRepairResponse>(
      "/api/v1/repairs",
      requestData
    );

    // Transform response - cast to correct type
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    throw new Error(
      err.response?.data?.message || "Tạo yêu cầu sửa chữa thất bại."
    );
  }
};

/**
 * Ghi nhận và xử lý lỗi trực tiếp tại hiện trường
 * Endpoint dành cho kỹ thuật viên để ghi nhận lỗi VÀ xử lý ngay tại chỗ trong một lần submit
 * 
 * @param data Dữ liệu yêu cầu sửa chữa và xử lý
 * @returns Promise với thông tin yêu cầu sửa chữa đã tạo và xử lý
 * 
 * @example
 * // Lỗi phần mềm - đã sửa được
 * await createAndProcessRepair({
 *   computerAssetId: "asset-123",
 *   errorType: ErrorType.MAY_HU_PHAN_MEM,
 *   description: "Máy bị lỗi phần mềm Office",
 *   softwareIds: ["software-1", "software-2"],
 *   resolutionNotes: "Đã cài đặt lại Office 2021",
 *   finalStatus: RepairStatus.ĐÃ_HOÀN_THÀNH
 * });
 */
export const createAndProcessRepair = async (
  data: CreateAndProcessRepairRequest
): Promise<GetRepairDetailResponse> => {
  try {
    // ✅ Step 1: Upload files lên Cloudinary nếu có
    let uploadedUrls: string[] = [];
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      const uploadResponse = await uploadMultipleFiles(
        data.mediaFiles,
        "repair-requests"
      );

      if (uploadResponse.success && uploadResponse.urls) {
        uploadedUrls = uploadResponse.urls;
      } else {
        throw new Error(uploadResponse.error || "Upload files thất bại");
      }
    }

    // ✅ Step 2: Merge uploaded URLs với existing mediaUrls (nếu có)
    const allMediaUrls = [...(data.mediaUrls || []), ...uploadedUrls];

    // ✅ Step 3: Tạo request body cho API
    const requestData = {
      computerAssetId: data.computerAssetId,
      errorType: data.errorType,
      description: data.description,
      mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : undefined,
      componentIds: data.componentIds,
      softwareIds: data.softwareIds,
      resolutionNotes: data.resolutionNotes,
      finalStatus: data.finalStatus,
    };

    // ✅ Step 4: Call API endpoint process-onsite
    const response = await api.post<ApiRepairResponse>(
      "/api/v1/repairs/process-onsite",
      requestData
    );

    // Transform response
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    throw new Error(
      err.response?.data?.message || "Ghi nhận và xử lý lỗi thất bại."
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
    const response = await api.get<ApiRepairResponse>(`/api/v1/repairs/${id}`);

    // Transform response
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
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
    // ✅ Step 1: Upload files lên Cloudinary nếu có
    let uploadedUrls: string[] = [];
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      const uploadResponse = await uploadMultipleFiles(
        data.mediaFiles,
        "repair-requests"
      );

      if (uploadResponse.success && uploadResponse.urls) {
        uploadedUrls = uploadResponse.urls;
      } else {
        throw new Error(uploadResponse.error || "Upload files thất bại");
      }
    }

    // ✅ Step 2: Merge uploaded URLs với existing mediaUrls (nếu có)
    const allMediaUrls = [...(data.mediaUrls || []), ...uploadedUrls];

    // ✅ Step 3: Cập nhật repair request với URLs từ Cloudinary
    const requestData = {
      assignedTechnicianId: data.assignedTechnicianId,
      errorType: data.errorType,
      description: data.description,
      mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : data.mediaUrls,
      status: data.status,
      resolutionNotes: data.resolutionNotes,
      componentIds: data.componentIds,
    };

    const response = await api.put<ApiRepairResponse>(
      `/api/v1/repairs/${id}`,
      requestData
    );

    // Transform response
    return transformApiResponse(response.data) as RepairRequestWithDetails;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
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
 * @param componentIds Danh sách ID component bị lỗi (optional, khi chuyển sang CHỜ_THAY_THẾ)
 * @returns Promise với thông tin yêu cầu sửa chữa đã cập nhật
 */
export const updateRepairStatus = async (
  id: string,
  status: RepairStatus,
  resolutionNotes?: string,
  componentIds?: string[]
): Promise<GetRepairDetailResponse> => {
  return updateRepair(id, { status, resolutionNotes, componentIds });
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
    const response = await api.get<ApiRepairResponse[]>(
      `/api/v1/repairs/repair-requests/reporters/${reporterId}`
    );
    // Transform responses
    return response.data.map(transformApiResponse);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
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
    const response = await api.get<ApiRepairResponse[]>(
      `/api/v1/repairs/repair-requests/technicians/${technicianId}`
    );
    // Transform responses
    return response.data.map(transformApiResponse);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách yêu cầu sửa chữa theo kỹ thuật viên thất bại."
    );
  }
};

/**
 * Interface for available components query params
 */
export interface GetAvailableComponentsQueryParams {
  requestCode?: string;
  componentType?: string[];
  search?: string;
  building?: string;
  floor?: string;
  roomName?: string;
  excludeInProposal?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Interface for available component data
 */
export interface AvailableComponentDto {
  repairRequestId: string;
  requestCode: string;
  repairStatus: string;
  repairDescription: string;
  repairCreatedAt?: string;
  componentId: string;
  componentName: string;
  componentType?: string;
  componentSpecs?: string;
  componentStatus?: string; // 🔥 MỚI: Trạng thái component (FAULTY, PENDING_REPLACEMENT, etc)
  installedAt?: string;
  assetId: string;
  assetName: string;
  ktCode?: string;
  roomName?: string;
  buildingName?: string;
  floor?: string;
  machineLabel?: string;
  createdAt: Date;
}

/**
 * Interface for available components response
 */
export interface GetAvailableComponentsResponse {
  data: AvailableComponentDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get available components from repair requests for creating replacement proposals
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with available components data
 */
export const getAvailableComponents = async (
  params?: GetAvailableComponentsQueryParams
): Promise<GetAvailableComponentsResponse> => {
  try {
    console.log("🌐 API Call: GET /computer/current-user/available-components", params);
    const response = await api.get<GetAvailableComponentsResponse>(
      "/computer/current-user/available-components",
      { params }
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get available components error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách linh kiện khả dụng thất bại."
    );
  }
};

/**
 * Get repair logs (history) for a specific repair request
 * Endpoint: GET /api/v1/repairs/:id/logs
 *
 * @param repairRequestId - ID của yêu cầu sửa chữa
 * @returns Promise with repair logs
 *
 * @example
 * ```typescript
 * const logs = await getRepairLogs('uuid-repair-request-id');
 * console.log(logs.data); // Array of RepairLog
 * ```
 */
export const getRepairLogs = async (
  repairRequestId: string
): Promise<GetRepairLogsResponse> => {
  try {
    console.log(`🔍 Fetching repair logs for request: ${repairRequestId}`);
    
    const response = await api.get<GetRepairLogsResponse>(
      `/api/v1/repairs/${repairRequestId}/logs`
    );
    
    console.log(`✅ Fetched ${response.data.data.length} repair logs successfully`);
    
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get repair logs error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message || "Lấy lịch sử repair logs thất bại."
    );
  }
};