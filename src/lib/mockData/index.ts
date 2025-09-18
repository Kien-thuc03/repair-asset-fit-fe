// Export all mock data from a central location - Synchronized with database-sync.json
export { errorTypes, type ErrorType } from "./errorTypes";
export { mockAssets, comprehensiveAssets } from "./assets";
export { mockComputers, type Computer } from "./computers";
export { mockRooms, mockSimpleRooms, type SimpleRoom } from "./rooms";
export { mockComponents } from "./components";
export {
  mockRepairRequests,
  repairRequestStatusConfig,
} from "./repairRequests";

// Export new data from database-sync.json
export { categories, type Category } from "./categories";

// Export replacement proposals for to-truong-ky-thuat
export {
  mockReplacementProposals,
  mockReplacementItems,
  replacementProposalStatusConfig,
  type ReplacementProposal,
  type ReplacementItem,
} from "./replacementProposals";

// Export software data
export {
  mockSoftware,
  mockAssetSoftware,
  getSoftwareByAssetId,
  getAssetSoftwareDetails,
} from "./software";

// Export software proposals
export {
  mockSoftwareProposals,
  getSoftwareProposalsByStatus,
  getSoftwareProposalsByProposer,
  getSoftwareProposalsByTechnician,
  getSoftwareProposalById,
  getSoftwareProposalStats,
} from "./softwareProposals";

// Export component types from the main types file for convenience
export { ComponentType, ComponentStatus } from "@/types";
export type { Component } from "@/types";

// Export room types
export { RoomStatus } from "@/types/unit";
export type { Room } from "@/types/unit";

// Export from other existing mock data files - Synchronized with database-sync.json
export * from "./permissions";
export * from "./roles";
export * from "./roles_permissions";
export * from "./units";
export * from "./users";
export * from "./users_roles";
