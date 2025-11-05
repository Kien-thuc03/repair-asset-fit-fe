/**
 * Upload API - Gọi Backend để upload file lên Cloudinary
 */

import { api } from '../api';

export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  urls?: string[];
  publicIds?: string[];
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  result?: string;
  error?: string;
}

/**
 * Upload một file lên Cloudinary qua Backend
 * @param file - File cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns UploadResponse
 */
export async function uploadFile(
  file: File,
  folder: string = 'repair-asset'
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Use axios directly for FormData upload
    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Upload failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Upload nhiều files lên Cloudinary qua Backend
 * @param files - Mảng các files cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns MultipleUploadResponse
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = 'repair-asset'
): Promise<MultipleUploadResponse> {
  try {
    const formData = new FormData();
    
    // Append tất cả files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('folder', folder);

    // Use axios directly for FormData upload
    const response = await api.post<MultipleUploadResponse>(
      '/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Multiple upload error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Upload failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Xóa file từ Cloudinary qua Backend
 * @param publicId - Public ID của file cần xóa
 * @returns DeleteResponse
 */
export async function deleteFile(publicId: string): Promise<DeleteResponse> {
  try {
    const response = await api.delete<DeleteResponse>(`/upload?publicId=${encodeURIComponent(publicId)}`);

    return response.data;
  } catch (error) {
    console.error('Delete error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Delete failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Lấy public ID từ Cloudinary URL
 * @param url - URL của file trên Cloudinary
 * @returns Public ID
 */
export function getPublicIdFromUrl(url: string): string {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];

    // Nếu có folder, cần thêm folder vào public ID
    const folderIndex = parts.indexOf('upload') + 1;
    if (folderIndex < parts.length - 1) {
      const folders = parts.slice(folderIndex, -1).join('/');
      return `${folders}/${publicId}`;
    }

    return publicId;
  } catch (error) {
    console.error('Error getting public ID from URL:', error);
    throw new Error('Failed to extract public ID from URL');
  }
}
