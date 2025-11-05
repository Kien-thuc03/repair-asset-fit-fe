/**
 * Cloudinary Utils - Central Export
 * Export tất cả các functions và configs liên quan đến Cloudinary
 */

// Export client-side functions (safe for browser)
export {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  formatFileSize,
  getMaxFileSize,
  getMaxFileSizeText,
  getPublicIdFromUrl,
  deleteFromCloudinary,
} from './cloudinary.client';

// Export config và helpers
export {
  CLOUDINARY_CONFIG,
  isValidImageType,
  isValidDocumentType,
  getAllowedImageExtensions,
  getAllowedDocumentExtensions,
  getImageAcceptTypes,
  getDocumentAcceptTypes,
} from './cloudinary.config';

// Export validation utilities
export {
  validateImageFile,
  validateDocumentFile,
  validateFile,
  validateMultipleFiles,
  useFileValidation,
} from './cloudinary.validation';

// NOTE: cloudinary.ts (server-side SDK) is NOT exported here
// It should only be used in API routes or server components
// For client-side uploads, use the functions from cloudinary.client.ts above
