/**
 * Error Type Enum - Synchronized with Backend
 * File: repair-asset-fit-be/src/common/shared/ErrorType.ts
 */

export enum ErrorType {
  MAY_KHONG_KHOI_DONG = 'MAY_KHONG_KHOI_DONG',
  MAY_HU_PHAN_MEM = 'MAY_HU_PHAN_MEM',
  MAY_HU_BAN_PHIM = 'MAY_HU_BAN_PHIM',
  MAY_HU_CHUOT = 'MAY_HU_CHUOT',
  MAY_KHONG_SU_DUNG_DUOC = 'MAY_KHONG_SU_DUNG_DUOC',
  MAY_KHONG_KET_NOI_MANG = 'MAY_KHONG_KET_NOI_MANG',
  MAY_HU_MAN_HINH = 'MAY_HU_MAN_HINH',
  MAY_MAT_CHUOT = 'MAY_MAT_CHUOT',
  MAY_MAT_BAN_PHIM = 'MAY_MAT_BAN_PHIM',
  LOI_KHAC = 'LOI_KHAC',
}

/**
 * Mapping Error Type enum sang tên hiển thị tiếng Việt
 */
export const ERROR_TYPE_LABELS: Record<ErrorType, string> = {
  [ErrorType.MAY_MAT_CHUOT]: 'Máy mất chuột',
  [ErrorType.MAY_HU_CHUOT]: 'Máy hư chuột',
  [ErrorType.MAY_MAT_BAN_PHIM]: 'Máy mất bàn phím',
  [ErrorType.MAY_HU_BAN_PHIM]: 'Máy hư bàn phím',
  [ErrorType.MAY_HU_MAN_HINH]: 'Máy hư màn hình',
  [ErrorType.MAY_KHONG_KHOI_DONG]: 'Máy không khởi động',
  [ErrorType.MAY_KHONG_KET_NOI_MANG]: 'Máy không kết nối mạng',
  [ErrorType.MAY_HU_PHAN_MEM]: 'Máy hư phần mềm',
  [ErrorType.MAY_KHONG_SU_DUNG_DUOC]: 'Máy không sử dụng được',
  [ErrorType.LOI_KHAC]: 'Lỗi khác',
};

/**
 * Helper function để lấy label từ ErrorType enum
 */
export const getErrorTypeLabel = (errorType: ErrorType | string | undefined): string => {
  if (!errorType) return 'Chưa xác định';
  
  // If it's already a valid ErrorType enum value
  if (Object.values(ErrorType).includes(errorType as ErrorType)) {
    return ERROR_TYPE_LABELS[errorType as ErrorType];
  }
  
  // Fallback for unknown values
  return errorType;
};

/**
 * Get all error types as options for select dropdown
 */
export const getErrorTypeOptions = () => {
  return Object.values(ErrorType).map((type) => ({
    value: type,
    label: ERROR_TYPE_LABELS[type],
  }));
};
