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
