/**
 * Client-side Cloudinary Upload Utility
 * Sử dụng Backend API để upload file lên Cloudinary
 */

import {
  uploadFile as uploadFileAPI,
  uploadMultipleFiles as uploadMultipleFilesAPI,
  deleteFile as deleteFileAPI,
  getPublicIdFromUrl as getPublicIdFromUrlAPI,
} from '../api/upload';

export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload file lên Cloudinary thông qua Backend API
 * @param file - File cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns URL của file đã upload
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'repair-asset'
): Promise<string> {
  const response = await uploadFileAPI(file, folder);

  if (!response.success) {
    throw new Error(response.error || 'Upload failed');
  }

  return response.url!;
}

/**
 * Upload nhiều files lên Cloudinary
 * @param files - Mảng các files cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns Mảng URLs của các files đã upload
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = 'repair-asset'
): Promise<string[]> {
  const response = await uploadMultipleFilesAPI(files, folder);

  if (!response.success) {
    throw new Error(response.error || 'Upload failed');
  }

  return response.urls!;
}

/**
 * Format kích thước file sang định dạng dễ đọc
 * @param bytes - Kích thước file tính bằng bytes
 * @returns Chuỗi định dạng (VD: "2.5 MB", "500 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Lấy giới hạn kích thước file tối đa
 * @returns Kích thước tối đa tính bằng bytes
 */
export function getMaxFileSize(): number {
  return 5 * 1024 * 1024; // 5MB
}

/**
 * Lấy giới hạn kích thước file tối đa dạng text
 * @returns Chuỗi mô tả giới hạn (VD: "5 MB")
 */
export function getMaxFileSizeText(): string {
  return formatFileSize(getMaxFileSize());
}

/**
 * Lấy public ID từ Cloudinary URL
 * @param url - URL của file trên Cloudinary
 * @returns Public ID
 */
export function getPublicIdFromUrl(url: string): string {
  return getPublicIdFromUrlAPI(url);
}

/**
 * Xóa file từ Cloudinary
 * @param publicId - Public ID của file cần xóa
 * @returns Kết quả xóa
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; result?: string }> {
  const response = await deleteFileAPI(publicId);

  if (!response.success) {
    throw new Error(response.error || 'Delete failed');
  }

  return {
    success: true,
    result: response.result,
  };
}
