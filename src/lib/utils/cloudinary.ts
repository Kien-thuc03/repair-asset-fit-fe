import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
});

// Giới hạn kích thước file: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Kiểm tra kích thước file
 * @param file - File cần kiểm tra
 * @throws Error nếu file vượt quá giới hạn
 */
function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File "${file.name}" có kích thước ${fileSizeInMB}MB vượt quá giới hạn 5MB cho phép`
    );
  }
}

/**
 * Upload file lên Cloudinary
 * @param file - File hoặc base64 string cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns URL của file đã upload
 * @throws Error nếu file vượt quá 5MB
 */
export async function uploadToCloudinary(
  file: File | string,
  folder: string = 'repair-asset'
): Promise<string> {
  try {
    let fileData: string;

    // Nếu là File object, kiểm tra kích thước và convert sang base64
    if (file instanceof File) {
      validateFileSize(file);
      fileData = await convertFileToBase64(file);
    } else {
      fileData = file;
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(fileData, {
      folder: folder,
      resource_type: 'auto', // Tự động nhận diện loại file (image, video, raw)
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Upload nhiều files lên Cloudinary
 * @param files - Mảng các files cần upload
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns Mảng URLs của các files đã upload
 */
export async function uploadMultipleToCloudinary(
  files: File[] | string[],
  folder: string = 'repair-asset'
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw new Error('Failed to upload files to Cloudinary');
  }
}

/**
 * Xóa file từ Cloudinary
 * @param publicId - Public ID của file cần xóa
 * @returns Kết quả xóa
 */
export async function deleteFromCloudinary(publicId: string): Promise<{
  result: string;
}> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
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

/**
 * Convert File object sang base64 string
 * @param file - File cần convert
 * @returns Base64 string
 */
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
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
  return MAX_FILE_SIZE;
}

/**
 * Lấy giới hạn kích thước file tối đa dạng text
 * @returns Chuỗi mô tả giới hạn (VD: "5 MB")
 */
export function getMaxFileSizeText(): string {
  return formatFileSize(MAX_FILE_SIZE);
}

/**
 * Upload ảnh với resize options
 * @param file - File ảnh cần upload
 * @param options - Các options cho upload
 * @returns URL của ảnh đã upload
 * @throws Error nếu file vượt quá 5MB
 */
export async function uploadImageWithOptions(
  file: File | string,
  options: {
    folder?: string;
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  } = {}
): Promise<string> {
  try {
    let fileData: string;

    if (file instanceof File) {
      validateFileSize(file);
      fileData = await convertFileToBase64(file);
    } else {
      fileData = file;
    }

    const uploadOptions: {
      folder: string;
      resource_type: 'image' | 'video' | 'raw' | 'auto';
      width?: number;
      height?: number;
      crop?: string;
      quality?: number;
    } = {
      folder: options.folder || 'repair-asset',
      resource_type: 'image',
    };

    if (options.width) uploadOptions.width = options.width;
    if (options.height) uploadOptions.height = options.height;
    if (options.crop) uploadOptions.crop = options.crop;
    if (options.quality) uploadOptions.quality = options.quality;

    const result = await cloudinary.uploader.upload(fileData, uploadOptions);

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image with options:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export default cloudinary;
