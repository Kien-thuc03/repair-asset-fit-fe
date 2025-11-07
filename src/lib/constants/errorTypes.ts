/**
 * Backend ErrorType enum - Matches backend exactly
 */
export enum ErrorType {
  MAY_KHONG_KHOI_DONG = "MAY_KHONG_KHOI_DONG",
  MAY_HU_PHAN_MEM = "MAY_HU_PHAN_MEM",
  MAY_HU_BAN_PHIM = "MAY_HU_BAN_PHIM",
  MAY_HU_CHUOT = "MAY_HU_CHUOT",
  MAY_KHONG_SU_DUNG_DUOC = "MAY_KHONG_SU_DUNG_DUOC",
  MAY_KHONG_KET_NOI_MANG = "MAY_KHONG_KET_NOI_MANG",
  MAY_HU_MAN_HINH = "MAY_HU_MAN_HINH",
  MAY_MAT_CHUOT = "MAY_MAT_CHUOT",
  MAY_MAT_BAN_PHIM = "MAY_MAT_BAN_PHIM",
  LOI_KHAC = "LOI_KHAC",
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
 * Error Type Display Info for UI
 */
export interface ErrorTypeInfo {
  key: ErrorType;
  name: string;
  description: string;
  category: "hardware" | "software";
  allowComponentSelection: boolean;
}

/**
 * Complete error type data from backend
 * Use this instead of mockData
 */
export const ERROR_TYPES: ErrorTypeInfo[] = [
  {
    key: ErrorType.MAY_KHONG_KHOI_DONG,
    name: "Máy không khởi động",
    description:
      "Máy tính không thể bật nguồn hoặc không có phản hồi khi nhấn nút nguồn",
    category: "hardware",
    allowComponentSelection: true,
  },
  {
    key: ErrorType.MAY_HU_PHAN_MEM,
    name: "Máy hư phần mềm",
    description: "Các lỗi liên quan đến hệ điều hành, ứng dụng không hoạt động",
    category: "software",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.MAY_HU_BAN_PHIM,
    name: "Máy hư bàn phím",
    description: "Bàn phím không hoạt động, một số phím bị liệt",
    category: "hardware",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.MAY_HU_CHUOT,
    name: "Máy hư chuột",
    description: "Chuột không di chuyển được con trỏ, không click được",
    category: "hardware",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.MAY_KHONG_SU_DUNG_DUOC,
    name: "Máy không sử dụng được",
    description: "Máy tính hoàn toàn không thể sử dụng do nhiều lỗi phức tạp",
    category: "hardware",
    allowComponentSelection: true,
  },
  {
    key: ErrorType.MAY_KHONG_KET_NOI_MANG,
    name: "Máy không kết nối mạng",
    description: "Máy tính mất kết nối internet, không thể truy cập mạng",
    category: "hardware",
    allowComponentSelection: true,
  },
  {
    key: ErrorType.MAY_HU_MAN_HINH,
    name: "Máy hư màn hình",
    description: "Màn hình không hiển thị hình ảnh, bị nhấp nháy",
    category: "hardware",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.MAY_MAT_CHUOT,
    name: "Máy mất chuột",
    description: "Chuột bị mất, thất lạc hoặc bị hỏng hoàn toàn",
    category: "hardware",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.MAY_MAT_BAN_PHIM,
    name: "Máy mất bàn phím",
    description: "Bàn phím bị mất, thất lạc hoặc bị hỏng hoàn toàn",
    category: "hardware",
    allowComponentSelection: false,
  },
  {
    key: ErrorType.LOI_KHAC,
    name: "Lỗi khác",
    description: "Các lỗi không thuộc các danh mục trên",
    category: "hardware",
    allowComponentSelection: false,
  },
];

/**
 * Get hardware error types only
 */
export const getHardwareErrorTypes = (): ErrorTypeInfo[] => {
  return ERROR_TYPES.filter((et) => et.category === "hardware");
};

/**
 * Get software error types only
 */
export const getSoftwareErrorTypes = (): ErrorTypeInfo[] => {
  return ERROR_TYPES.filter((et) => et.category === "software");
};

/**
 * Get error type by key
 */
export const getErrorTypeByKey = (
  key: ErrorType
): ErrorTypeInfo | undefined => {
  return ERROR_TYPES.find((et) => et.key === key);
};

/**
 * Check if error type allows component selection
 */
export const canSelectComponents = (key: ErrorType): boolean => {
  const errorType = getErrorTypeByKey(key);
  return errorType?.allowComponentSelection || false;
};

/**
 * Helper function để lấy label từ ErrorType enum
 * Compatible with old getErrorTypeLabel from @/types/errorType
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
 * Compatible with old getErrorTypeOptions from @/types/errorType
 */
export const getErrorTypeOptions = () => {
  return Object.values(ErrorType).map((type) => ({
    value: type,
    label: ERROR_TYPE_LABELS[type],
  }));
};
