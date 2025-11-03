import { api } from "../api";
import {
  RepairRequest,
  RepairRequestWithDetails,
  RepairStatus,
} from "@/types/repair";

/**
 * Interface cho query parameters khi lấy danh sách yêu cầu sửa chữa
 */
export interface GetRepairsQueryParams {
  // Filtering
  computerAssetId?: string; // Lọc theo tài sản
  reporterId?: string; // Lọc theo người báo lỗi
  assignedTechnicianId?: string; // Lọc theo kỹ thuật viên
  status?: RepairStatus; // Lọc theo trạng thái
  errorTypeId?: string; // Lọc theo loại lỗi
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
 */
export interface GetRepairDetailResponse {
  data: RepairRequestWithDetails;
}

/**
 * Interface cho request tạo yêu cầu sửa chữa mới
 */
export interface CreateRepairRequest {
  computerAssetId: string; // ID tài sản máy tính
  reporterId: string; // ID người báo lỗi
  errorTypeId?: string; // ID loại lỗi (optional)
  description: string; // Mô tả chi tiết lỗi
  mediaUrls?: string[]; // Mảng URL ảnh/video minh họa (optional)
  componentIds?: string[]; // Danh sách ID linh kiện bị lỗi (optional)
}

/**
 * Interface cho request cập nhật yêu cầu sửa chữa
 */
export interface UpdateRepairRequest {
  assignedTechnicianId?: string; // Phân công kỹ thuật viên
  errorTypeId?: string; // Cập nhật loại lỗi
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
    const response = await api.get<GetRepairsResponse>("/v1/repairs", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get repairs error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách yêu cầu sửa chữa thất bại."
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
    const response = await api.get<GetRepairDetailResponse>(
      `/v1/repairs/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get repair detail error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy chi tiết yêu cầu sửa chữa thất bại."
    );
  }
};
