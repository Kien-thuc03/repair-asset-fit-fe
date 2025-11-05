/**
 * Cloudinary Configuration Constants
 * Các hằng số cấu hình cho Cloudinary upload
 */

// Giới hạn kích thước file
export const CLOUDINARY_CONFIG = {
  // Kích thước tối đa: 5MB
  MAX_FILE_SIZE: 5 * 1024 * 1024, // bytes
  MAX_FILE_SIZE_MB: 5, // MB

  // Định dạng file được phép
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],

  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],

  // Folder mặc định
  DEFAULT_FOLDER: 'repair-asset',

  // Thư mục cho từng loại file
  FOLDERS: {
    AVATARS: 'repair-asset/avatars',
    DOCUMENTS: 'repair-asset/documents',
    IMAGES: 'repair-asset/images',
    ASSETS: 'repair-asset/assets',
    REPAIRS: 'repair-asset/repairs',
    PROPOSALS: 'repair-asset/proposals',
  },
} as const;

/**
 * Kiểm tra file type có hợp lệ không
 */
export function isValidImageType(fileType: string): boolean {
  return (CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
    fileType
  );
}

/**
 * Kiểm tra file document có hợp lệ không
 */
export function isValidDocumentType(fileType: string): boolean {
  return (
    CLOUDINARY_CONFIG.ALLOWED_DOCUMENT_TYPES as readonly string[]
  ).includes(fileType);
}

/**
 * Lấy danh sách extension được phép cho image
 */
export function getAllowedImageExtensions(): string {
  return '.jpg,.jpeg,.png,.gif,.webp,.svg';
}

/**
 * Lấy danh sách extension được phép cho document
 */
export function getAllowedDocumentExtensions(): string {
  return '.pdf,.doc,.docx,.xls,.xlsx';
}

/**
 * Lấy MIME types cho accept attribute
 */
export function getImageAcceptTypes(): string {
  return CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES.join(',');
}

/**
 * Lấy MIME types cho document accept attribute
 */
export function getDocumentAcceptTypes(): string {
  return CLOUDINARY_CONFIG.ALLOWED_DOCUMENT_TYPES.join(',');
}
