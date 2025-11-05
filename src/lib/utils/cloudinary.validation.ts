/**
 * Validation Utilities cho Upload
 * Các hàm helper để validate files trước khi upload
 */

import {
  getMaxFileSize,
  formatFileSize,
} from './cloudinary.client';
import {
  CLOUDINARY_CONFIG,
  isValidImageType,
  isValidDocumentType,
} from './cloudinary.config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): ValidationResult {
  const maxSize = getMaxFileSize();

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File "${file.name}" có kích thước ${formatFileSize(
        file.size
      )} vượt quá giới hạn ${formatFileSize(maxSize)}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ValidationResult {
  // Kiểm tra size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  // Kiểm tra type
  if (!isValidImageType(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" không phải là định dạng ảnh hợp lệ. Chỉ chấp nhận: JPG, PNG, GIF, WebP, SVG`,
    };
  }

  return { isValid: true };
}

/**
 * Validate document file
 */
export function validateDocumentFile(file: File): ValidationResult {
  // Kiểm tra size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  // Kiểm tra type
  if (!isValidDocumentType(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" không phải là định dạng tài liệu hợp lệ. Chỉ chấp nhận: PDF, DOC, DOCX, XLS, XLSX`,
    };
  }

  return { isValid: true };
}

/**
 * Validate multiple files
 */
export function validateMultipleFiles(
  files: File[],
  type: 'image' | 'document' = 'image'
): ValidationResult {
  for (const file of files) {
    const validation =
      type === 'image'
        ? validateImageFile(file)
        : validateDocumentFile(file);

    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true };
}

/**
 * Validate file trước khi upload - Universal
 * Tự động detect loại file và validate
 */
export function validateFile(
  file: File,
  allowedTypes: 'image' | 'document' | 'all' = 'all'
): ValidationResult {
  // Luôn kiểm tra size trước
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  // Kiểm tra type nếu được chỉ định
  if (allowedTypes === 'image') {
    return validateImageFile(file);
  }

  if (allowedTypes === 'document') {
    return validateDocumentFile(file);
  }

  // Nếu là 'all', chấp nhận cả image và document
  const isImage = isValidImageType(file.type);
  const isDocument = isValidDocumentType(file.type);

  if (!isImage && !isDocument) {
    return {
      isValid: false,
      error: `File "${file.name}" không phải là định dạng được hỗ trợ`,
    };
  }

  return { isValid: true };
}

/**
 * Hook-like helper cho React components
 */
export function useFileValidation() {
  return {
    validateImageFile,
    validateDocumentFile,
    validateFile,
    validateMultipleFiles,
    maxFileSize: getMaxFileSize(),
    maxFileSizeText: formatFileSize(getMaxFileSize()),
    allowedImageTypes: CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES,
    allowedDocumentTypes: CLOUDINARY_CONFIG.ALLOWED_DOCUMENT_TYPES,
  };
}
