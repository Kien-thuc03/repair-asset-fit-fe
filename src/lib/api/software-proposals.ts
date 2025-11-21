import { api } from "../api";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types/software";

/**
 * Interface cho query parameters khi lấy danh sách đề xuất phần mềm
 */
export interface GetSoftwareProposalsQueryParams {
  // Filtering
  roomId?: string; // Lọc theo phòng
  proposerId?: string; // Lọc theo người đề xuất
  approverId?: string; // Lọc theo người duyệt
  status?: SoftwareProposalStatus; // Lọc theo trạng thái
  search?: string; // Tìm kiếm theo mã đề xuất, lý do hoặc phần mềm
  fromDate?: string; // Lọc từ ngày (ISO string)
  toDate?: string; // Lọc đến ngày (ISO string)

  // Pagination
  page?: number; // Trang hiện tại (default: 1)
  limit?: number; // Số lượng items mỗi trang (default: 10)

  // Sorting
  sortBy?: "createdAt" | "proposalCode" | "status"; // Trường để sắp xếp
  sortOrder?: "ASC" | "DESC"; // Thứ tự sắp xếp (default: DESC)
}

/**
 * Interface cho response khi lấy danh sách đề xuất phần mềm (có phân trang)
 * Backend trả về flat structure
 */
export interface GetSoftwareProposalsResponse {
  data: SoftwareProposal[]; // Danh sách đề xuất phần mềm
  total: number; // Tổng số đề xuất
  page: number; // Trang hiện tại
  limit: number; // Số lượng items mỗi trang
  totalPages: number; // Tổng số trang
}

/**
 * Interface cho response khi lấy chi tiết một đề xuất phần mềm
 * Backend trả về trực tiếp object, không có wrapper
 */
export type GetSoftwareProposalDetailResponse = SoftwareProposal;

/**
 * Lấy danh sách đề xuất phần mềm với lọc và phân trang
 * @param params Query parameters cho filtering, pagination, và sorting
 * @returns Promise với danh sách đề xuất phần mềm và metadata
 */
export const getSoftwareProposals = async (
  params?: GetSoftwareProposalsQueryParams
): Promise<GetSoftwareProposalsResponse> => {
  try {
    const response = await api.get<GetSoftwareProposalsResponse>(
      "/api/v1/software-proposals",
      {
        params,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get software proposals error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách đề xuất phần mềm thất bại."
    );
  }
};

/**
 * Lấy chi tiết một đề xuất phần mềm theo ID
 * @param id ID của đề xuất phần mềm
 * @returns Promise với chi tiết đề xuất phần mềm
 */
export const getSoftwareProposalById = async (
  id: string
): Promise<GetSoftwareProposalDetailResponse> => {
  try {
    const response = await api.get<GetSoftwareProposalDetailResponse>(
      `/api/v1/software-proposals/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get software proposal detail error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy chi tiết đề xuất phần mềm thất bại."
    );
  }
};

/**
 * Lấy danh sách đề xuất phần mềm theo người đề xuất (proposer)
 * @param proposerId ID của người đề xuất
 * @returns Promise với danh sách đề xuất phần mềm của người đề xuất
 */
export const getSoftwareProposalsByProposer = async (
  proposerId: string
): Promise<SoftwareProposal[]> => {
  try {
    console.log(
      `🌐 API Call: GET /api/v1/software-proposals/proposals/proposers/${proposerId}`
    );
    const response = await api.get<SoftwareProposal[]>(
      `/api/v1/software-proposals/proposals/proposers/${proposerId}`
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get software proposals by proposer error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách đề xuất phần mềm theo người đề xuất thất bại."
    );
  }
};

/**
 * Lấy danh sách đề xuất phần mềm theo kỹ thuật viên được phân công
 * @param technicianId ID của kỹ thuật viên
 * @returns Promise với danh sách đề xuất phần mềm của kỹ thuật viên
 */
export const getSoftwareProposalsByTechnician = async (
  technicianId: string
): Promise<SoftwareProposal[]> => {
  try {
    console.log(
      `🌐 API Call: GET /api/v1/software-proposals/technicians/${technicianId}`
    );
    const response = await api.get<SoftwareProposal[]>(
      `/api/v1/software-proposals/technicians/${technicianId}`
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get software proposals by technician error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách đề xuất phần mềm theo kỹ thuật viên thất bại."
    );
  }
};

/**
 * Interface cho request body khi tạo đề xuất phần mềm mới
 */
export interface CreateSoftwareProposalRequest {
  roomId: string;
  reason: string;
  items: {
    softwareName: string;
    version: string;
  }[];
}

/**
 * Tạo đề xuất phần mềm mới
 * @param data Thông tin đề xuất phần mềm
 * @returns Promise với đề xuất phần mềm đã tạo
 */
export const createSoftwareProposal = async (
  data: CreateSoftwareProposalRequest
): Promise<SoftwareProposal> => {
  try {
    console.log("🌐 API Call: POST /api/v1/software-proposals", data);
    const response = await api.post<SoftwareProposal>(
      "/api/v1/software-proposals",
      data
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Create software proposal error:", error);
    const err = error as {
      response?: { data?: { message?: string | string[] }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });

    // Handle array of error messages
    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(", ")
      : err.response?.data?.message;

    throw new Error(errorMessage || "Tạo đề xuất phần mềm thất bại.");
  }
};

/**
 * Interface cho request cập nhật status
 */
export interface UpdateSoftwareProposalStatusRequest {
  status: SoftwareProposalStatus;
  approverId?: string;
  technicianId?: string;
}

/**
 * Interface cho thông tin phần mềm khi hoàn thành đề xuất
 */
export interface SoftwareInfoRequest {
  itemId: string;
  name?: string;
  version?: string;
  publisher?: string;
}

/**
 * Interface cho request hoàn thành đề xuất
 */
export interface CompleteSoftwareProposalRequest {
  softwareInfo: SoftwareInfoRequest[];
  completionNotes?: string;
}

/**
 * Cập nhật trạng thái đề xuất phần mềm
 * @param id ID của đề xuất phần mềm
 * @param data Thông tin cập nhật trạng thái
 * @returns Promise với đề xuất phần mềm đã cập nhật
 *
 * **Quyền hạn theo role:**
 * - Người tạo đề xuất: Có thể cập nhật khi CHỜ_DUYỆT (thông tin phòng, lý do)
 * - Kỹ thuật viên: Có thể cập nhật trạng thái (duyệt, từ chối, đánh dấu đã trang bị)
 * - Admin: Có thể cập nhật bất kỳ lúc nào
 *
 * **Quy trình chuyển trạng thái:**
 * - CHỜ_DUYỆT → ĐÃ_DUYỆT (Kỹ thuật viên duyệt đề xuất)
 * - CHỜ_DUYỆT → ĐÃ_TỪ_CHỐI (Kỹ thuật viên từ chối)
 * - ĐÃ_DUYỆT → ĐÃ_TRANG_BỊ (Kỹ thuật viên đánh dấu đã cài đặt xong)
 * - ĐÃ_TỪ_CHỐI → CHỜ_DUYỆT (Có thể gửi lại đề xuất)
 *
 * **Lưu ý:**
 * - Khi cập nhật status thành ĐÃ_DUYỆT, ĐÃ_TỪ_CHỐI, hoặc ĐÃ_TRANG_BỊ, approverId sẽ tự động được set
 * - Không thể cập nhật danh sách items qua endpoint này
 */
export const updateSoftwareProposalStatus = async (
  id: string,
  data: UpdateSoftwareProposalStatusRequest
): Promise<SoftwareProposal> => {
  try {
    console.log(
      `🌐 API Call: PUT /api/v1/software-proposals/${id}`,
      data
    );
    const response = await api.put<SoftwareProposal>(
      `/api/v1/software-proposals/${id}`,
      data
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Update software proposal status error:", error);
    const err = error as {
      response?: { data?: { message?: string | string[] }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });

    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(", ")
      : err.response?.data?.message;

    throw new Error(
      errorMessage || "Cập nhật trạng thái đề xuất phần mềm thất bại."
    );
  }
};

/**
 * Hoàn thành đề xuất phần mềm và cập nhật phần mềm cho các máy tính
 * @param id ID của đề xuất phần mềm
 * @param data Thông tin hoàn thành đề xuất
 * @returns Promise với đề xuất phần mềm đã hoàn thành
 */
export const completeSoftwareProposal = async (
  id: string,
  data: CompleteSoftwareProposalRequest
): Promise<SoftwareProposal> => {
  try {
    console.log(
      `🌐 API Call: PUT /api/v1/software-proposals/${id}/complete`,
      data
    );
    const response = await api.put<SoftwareProposal>(
      `/api/v1/software-proposals/${id}/complete`,
      data
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Complete software proposal error:", error);
    const err = error as {
      response?: { data?: { message?: string | string[] }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });

    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(", ")
      : err.response?.data?.message;

    throw new Error(
      errorMessage || "Hoàn thành đề xuất phần mềm thất bại."
    );
  }
};
