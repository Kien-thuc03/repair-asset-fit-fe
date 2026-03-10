import {
  ReplacementProposalStatus,
  ReplacementRequestItem,
  ComponentFromRequest,
} from "@/types";

// Status configuration - Support both old and new enum
export const STATUS_CONFIG = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: {
    text: "Chờ tổ trưởng duyệt",
    color: "orange",
  },
  [ReplacementProposalStatus.CHỜ_XÁC_MINH]: {
    text: "Chờ xác minh",
    color: "blue",
  },
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: {
    text: "Đã xác minh",
    color: "cyan",
  },
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: {
    text: "Đã lập tờ trình",
    color: "geekblue",
  },
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: {
    text: "Đã duyệt",
    color: "green",
  },
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: {
    text: "Đã từ chối",
    color: "red",
  },
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: {
    text: "Khoa đã duyệt tờ trình",
    color: "lime",
  },
  [ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: {
    text: "Ban giám hiệu đã duyệt tờ trình",
    color: "green",
  },
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: {
    text: "Đã từ chối tờ trình",
    color: "volcano",
  },
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: {
    text: "Đã hoàn tất mua sắm",
    color: "purple",
  },
  // Add missing statuses from new enum
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: {
    text: "Đã gửi biên bản",
    color: "cyan",
  },
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: {
    text: "Đã ký biên bản",
    color: "geekblue",
  },
};

// Filter helpers
export const filterProposals = (
  requests: ReplacementRequestItem[],
  selectedStatus: string,
  searchTerm: string
) => {
  return requests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" ||
      selectedStatus === "" ||
      !selectedStatus ||
      request.status === selectedStatus ||
      (selectedStatus === "pending" &&
        (request.status === ReplacementProposalStatus.CHỜ_XÁC_MINH ||
          request.status === ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT)) ||
      (selectedStatus === "verified" &&
        request.status === ReplacementProposalStatus.ĐÃ_XÁC_MINH) ||
      (selectedStatus === "proposal_created" &&
        request.status === ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH) ||
      (selectedStatus === "approved" &&
        (request.status === ReplacementProposalStatus.ĐÃ_DUYỆT ||
          request.status === ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH ||
          request.status === ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH)) ||
      (selectedStatus === "rejected" &&
        (request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI ||
          request.status === ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH)) ||
      (selectedStatus === "completed" &&
        request.status === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM);

    const matchesSearch =
      searchTerm === "" ||
      request.proposalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.createdBy &&
        request.createdBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.components.some((comp: ComponentFromRequest) =>
        comp.componentName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });
};

// Sort helper
export const sortProposals = (
  proposals: ReplacementRequestItem[],
  sortField: string,
  sortDirection: "asc" | "desc"
) => {
  if (!sortField) return proposals;

  return [...proposals].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "proposalCode":
        aValue = a.proposalCode.toLowerCase();
        bValue = b.proposalCode.toLowerCase();
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "componentsCount":
        aValue = a.components.length;
        bValue = b.components.length;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};
