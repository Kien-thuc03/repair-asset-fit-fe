import { api } from "../api";

/**
 * Enum cho trạng thái đề xuất thay thế
 */
export enum ReplacementProposalStatus {
  CHỜ_TỔ_TRƯỞNG_DUYỆT = "CHỜ_TỔ_TRƯỞNG_DUYỆT",
  ĐÃ_DUYỆT = "ĐÃ_DUYỆT",
  ĐÃ_TỪ_CHỐI = "ĐÃ_TỪ_CHỐI",
  ĐÃ_LẬP_TỜ_TRÌNH = "ĐÃ_LẬP_TỜ_TRÌNH",
  ĐÃ_DUYỆT_TỜ_TRÌNH = "ĐÃ_DUYỆT_TỜ_TRÌNH",
  ĐÃ_TỪ_CHỐI_TỜ_TRÌNH = "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH",
  CHỜ_XÁC_MINH = "CHỜ_XÁC_MINH",
  ĐÃ_XÁC_MINH = "ĐÃ_XÁC_MINH",
  ĐÃ_GỬI_BIÊN_BẢN = "ĐÃ_GỬI_BIÊN_BẢN",
  ĐÃ_KÝ_BIÊN_BẢN = "ĐÃ_KÝ_BIÊN_BẢN",
  ĐÃ_HOÀN_TẤT_MUA_SẮM = "ĐÃ_HOÀN_TẤT_MUA_SẮM",
}

/**
 * Interface cho user info
 */
export interface UserInfo {
  id: string;
  username: string;
  fullName: string;
  email?: string;
}

/**
 * Interface cho old component info
 */
export interface OldComponentInfo {
  id: string;
  componentType: string;
  name: string;
  componentSpecs?: string;
  status: string;
}

/**
 * Interface cho replacement item
 */
export interface ReplacementItem {
  id: string;
  proposalId: string;
  oldComponentId?: string;
  oldComponent?: OldComponentInfo;
  newItemName: string;
  newItemSpecs?: string;
  quantity: number;
  reason?: string;
  newlyPurchasedComponentId?: string;
  newlyPurchasedComponent?: OldComponentInfo;
}

/**
 * Interface cho replacement proposal
 */
export interface ReplacementProposal {
  id: string;
  title?: string;
  description?: string;
  proposalCode: string;
  proposerId: string;
  proposer?: UserInfo;
  teamLeadApproverId?: string;
  teamLeadApprover?: UserInfo;
  adminVerifierId?: string;
  adminVerifier?: UserInfo;
  status: ReplacementProposalStatus;
  submissionFormUrl?: string;
  verificationReportUrl?: string;
  createdAt: string;
  updatedAt: string;
  items?: ReplacementItem[];
  itemsCount?: number;
}

/**
 * Interface cho query parameters
 */
export interface GetReplacementProposalsQueryParams {
  // Filtering
  proposerId?: string;
  teamLeadApproverId?: string;
  adminVerifierId?: string;
  status?: ReplacementProposalStatus;
  search?: string;
  fromDate?: string;
  toDate?: string;

  // Pagination
  page?: number;
  limit?: number;

  // Sorting
  sortBy?: "createdAt" | "updatedAt" | "proposalCode" | "status";
  sortOrder?: "ASC" | "DESC";
}

/**
 * Interface cho response với phân trang
 */
export interface GetReplacementProposalsResponse {
  data: ReplacementProposal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface cho request tạo item
 */
export interface CreateReplacementItemRequest {
  oldComponentId?: string;
  newItemName: string;
  newItemSpecs?: string;
  quantity: number;
  reason?: string;
}

/**
 * Interface cho request tạo proposal
 */
export interface CreateReplacementProposalRequest {
  title?: string;
  description?: string;
  items: CreateReplacementItemRequest[];
}

/**
 * Interface cho request cập nhật status
 */
export interface UpdateReplacementProposalStatusRequest {
  status: ReplacementProposalStatus;
  teamLeadApproverId?: string;
  adminVerifierId?: string;
  submissionFormUrl?: string;
  verificationReportUrl?: string;
}

/**
 * Lấy danh sách đề xuất thay thế với lọc và phân trang
 */
export const getReplacementProposals = async (
  params?: GetReplacementProposalsQueryParams
): Promise<GetReplacementProposalsResponse> => {
  try {
    console.log("🌐 API Call: GET /api/v1/replacement-proposals", params);
    const response = await api.get<GetReplacementProposalsResponse>(
      "/api/v1/replacement-proposals",
      { params }
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get replacement proposals error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách đề xuất thay thế thất bại."
    );
  }
};

/**
 * Lấy chi tiết một đề xuất thay thế
 */
export const getReplacementProposalById = async (
  id: string
): Promise<ReplacementProposal> => {
  try {
    console.log(`🌐 API Call: GET /api/v1/replacement-proposals/${id}`);
    const response = await api.get<ReplacementProposal>(
      `/api/v1/replacement-proposals/${id}`
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get replacement proposal detail error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy chi tiết đề xuất thay thế thất bại."
    );
  }
};

/**
 * Tạo đề xuất thay thế mới
 */
export const createReplacementProposal = async (
  data: CreateReplacementProposalRequest
): Promise<ReplacementProposal> => {
  try {
    console.log("🌐 API Call: POST /api/v1/replacement-proposals", data);
    const response = await api.post<ReplacementProposal>(
      "/api/v1/replacement-proposals",
      data
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Create replacement proposal error:", error);
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

    throw new Error(errorMessage || "Tạo đề xuất thay thế thất bại.");
  }
};

/**
 * Cập nhật trạng thái đề xuất thay thế
 */
export const updateReplacementProposalStatus = async (
  id: string,
  data: UpdateReplacementProposalStatusRequest
): Promise<ReplacementProposal> => {
  try {
    console.log(
      `🌐 API Call: PUT /api/v1/replacement-proposals/${id}/status`,
      data
    );
    const response = await api.put<ReplacementProposal>(
      `/api/v1/replacement-proposals/${id}/status`,
      data
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Update replacement proposal status error:", error);
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

    throw new Error(errorMessage || "Cập nhật trạng thái đề xuất thất bại.");
  }
};

/**
 * Lấy danh sách đề xuất theo người đề xuất
 */
export const getReplacementProposalsByProposer = async (
  proposerId: string
): Promise<ReplacementProposal[]> => {
  try {
    console.log(
      `🌐 API Call: GET /api/v1/replacement-proposals/proposals/proposers/${proposerId}`
    );
    const response = await api.get<ReplacementProposal[]>(
      `/api/v1/replacement-proposals/proposals/proposers/${proposerId}`
    );
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get replacement proposals by proposer error:", error);
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
    };
    console.error("❌ Error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
    });
    throw new Error(
      err.response?.data?.message ||
        "Lấy danh sách đề xuất theo người đề xuất thất bại."
    );
  }
};
