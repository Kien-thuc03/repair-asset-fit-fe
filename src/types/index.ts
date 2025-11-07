export * from "./repair";
export * from "./user";
export * from "./unit";
export * from "./software";
// ErrorType exports moved to @/lib/constants/errorTypes
export { 
  ErrorType, 
  ERROR_TYPE_LABELS,
  getErrorTypeLabel, 
  getErrorTypeOptions 
} from "@/lib/constants/errorTypes";

// Common interfaces
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
