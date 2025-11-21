import { api } from "../api";
import { ReplacementProposalStatus } from "@/types/repair";



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
  roomLocation?: string;
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
 * Interface cho repair request info trong proposal
 */
export interface RepairRequestInfo {
  id: string;
  requestCode: string;
  description?: string;
  status: string;
  createdAt: string;
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
  facultyAdminApproverId?: string;
  facultyAdminApprover?: UserInfo;
  principalApproverId?: string;
  principalApprover?: UserInfo;
  status: ReplacementProposalStatus;
  submissionFormUrl?: string;
  verificationReportUrl?: string;
  createdAt: string;
  updatedAt: string;
  items?: ReplacementItem[];
  itemsCount?: number;
  repairRequests?: RepairRequestInfo[]; // 🔥 MỚI: Danh sách repair requests liên quan
  repairRequestsCount?: number; // 🔥 MỚI: Số lượng repair requests
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
  repairRequestIds?: string[]; // 🔥 MỚI: Danh sách ID repair requests liên quan
}

/**
 * Interface cho component từ repair request
 */
export interface ComponentFromRepair {
  componentId: string;
  componentName: string;
  componentType?: string;
  componentSpecs?: string;
  componentStatus?: string;
  installedAt?: string;
  assetId?: string;
  assetName?: string;
  ktCode?: string;
  roomName?: string;
  buildingName?: string;
  floor?: string;
  machineLabel?: string;
  repairRequestId?: string;
  requestCode?: string;
  repairStatus?: string;
  repairDescription?: string;
  repairCreatedAt?: string;
  // Fields for UI only (not from API)
  quantity?: number; // Mặc định 1, có thể edit
  reason?: string; // Dùng repairDescription làm default
}

/**
 * Interface cho request cập nhật status
 */
export interface UpdateReplacementProposalStatusRequest {
  status: ReplacementProposalStatus;
  teamLeadApproverId?: string;
  adminVerifierId?: string;
  facultyAdminApproverId?: string;
  principalApproverId?: string;
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

