// Export all mock data from a central location
export { errorTypes, type ErrorType } from "./errorTypes";
export { mockAssets, comprehensiveAssets } from "./assets";
export { mockRooms, mockSimpleRooms, type SimpleRoom } from "./rooms";
export { mockComponents } from "./components";
export { lecturerStats, type StatItem } from "./stats";
export {
  mockRepairRequests,
  repairRequestStatusConfig,
} from "./repairRequests";
export {
  mockAssetsLookup,
  mockRepairHistoryLookup,
  assetStatusConfig,
  categoryIcons,
} from "./assetsLookup";

// Export component types from the main types file for convenience
export { ComponentType, ComponentStatus } from "@/types";
export type { Component } from "@/types";

// Export room types
export { RoomStatus } from "@/types/unit";
export type { Room } from "@/types/unit";

// You can also export from other existing mock data files
export * from "./permissions";
export * from "./roles";
export * from "./roles_permissions";
export * from "./units";
export * from "./users";
export * from "./users_roles";
