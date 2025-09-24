import {
  ReplacementStatus,
  ReplacementRequestItem,
  ReplacementComponent,
} from "@/types";

// Status configuration
export const STATUS_CONFIG = {
  [ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: {
    text: "Chờ tổ trưởng duyệt",
    color: "orange",
  },
  [ReplacementStatus.CHỜ_XÁC_MINH]: {
    text: "Chờ admin xác nhận",
    color: "blue",
  },
  [ReplacementStatus.ĐÃ_DUYỆT]: {
    text: "Đã duyệt",
    color: "green",
  },
  [ReplacementStatus.ĐÃ_TỪ_CHỐI]: {
    text: "Đã từ chối",
    color: "red",
  },
  [ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: {
    text: "Đã hoàn tất mua sắm",
    color: "purple",
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
      (selectedStatus === "pending" &&
        (request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
          request.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT)) ||
      (selectedStatus === "approved" &&
        request.status === ReplacementStatus.ĐÃ_DUYỆT) ||
      (selectedStatus === "rejected" &&
        request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI);

    const matchesSearch =
      searchTerm === "" ||
      request.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.components.some((comp: ReplacementComponent) =>
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
      case "requestCode":
        aValue = a.requestCode.toLowerCase();
        bValue = b.requestCode.toLowerCase();
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
