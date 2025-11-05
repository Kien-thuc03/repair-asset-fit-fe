/**
 * Client-side Cloudinary Upload Utility
 * Sử dụng API route thay vì gọi trực tiếp Cloudinary SDK
 */

export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload file lên Cloudinary thông qua API route
 * @param file - File cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns URL của file đã upload
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'repair-asset'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data: UploadResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.url!;
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
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file, folder)
  );
  return await Promise.all(uploadPromises);
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

/**
 * Xóa file từ Cloudinary
 * @param publicId - Public ID của file cần xóa
 * @returns Kết quả xóa
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; result?: string }> {
  const response = await fetch(
    `/api/upload/delete?publicId=${encodeURIComponent(publicId)}`,
    {
      method: 'DELETE',
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Delete failed');
  }

  return data;
}
