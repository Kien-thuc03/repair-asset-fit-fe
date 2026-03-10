/**
 * Helper functions để xử lý Cloudinary URLs
 */

/**
 * Lấy tên file từ Cloudinary URL (bao gồm extension)
 */
export function getFileNameFromUrl(url: string): string {
  try {
    // URL format: https://res.cloudinary.com/cloud/resource_type/upload/version/folder/filename.ext
    const parts = url.split('/');
    
    // Lấy phần cuối cùng (filename có thể có hoặc không có extension)
    const lastPart = parts[parts.length - 1];
    
    // Nếu đã có extension, trả về nguyên
    if (lastPart.includes('.')) {
      return lastPart;
    }
    
    // Nếu chưa có extension, thử lấy từ format trong URL
    // Cloudinary raw files: .../upload/v123/folder/filename (không có extension trong URL)
    // Cần detect resource type từ URL
    const isRawResource = url.includes('/raw/upload/');
    
    if (isRawResource) {
      // Thử detect extension từ resource type hoặc metadata
      // Fallback: trả về tên file gốc
      return lastPart;
    }
    
    return lastPart;
  } catch (error) {
    console.error('Error getting filename from URL:', error);
    return 'unknown_file';
  }
}

/**
 * Detect extension từ Cloudinary URL hoặc file type
 */
export function getExtensionFromUrl(url: string): string {
  try {
    // Kiểm tra xem URL có extension không
    const fileName = url.split('/').pop() || '';
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
    
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    
    // Nếu không có extension, detect từ resource type
    if (url.includes('/raw/upload/')) {
      // Raw resource - có thể là PDF, DOC, XLSX, etc.
      // Không thể detect chính xác, cần lưu metadata
      return 'file';
    }
    
    if (url.includes('/image/upload/')) {
      return 'jpg'; // Default cho image
    }
    
    if (url.includes('/video/upload/')) {
      return 'mp4';
    }
    
    return '';
  } catch (error) {
    console.error('Error getting extension from URL:', error);
    return '';
  }
}

/**
 * Kiểm tra file có phải là image không
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const extension = getExtensionFromUrl(url);
  return imageExtensions.includes(extension.toLowerCase()) || url.includes('/image/upload/');
}

/**
 * Kiểm tra file có phải là document không
 */
export function isDocumentUrl(url: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];
  const extension = getExtensionFromUrl(url);
  return documentExtensions.includes(extension.toLowerCase()) || url.includes('/raw/upload/');
}

/**
 * Tạo URL download với tên file cụ thể
 */
export function createDownloadUrl(url: string, filename?: string): string {
  try {
    // Cloudinary download URL format:
    // https://res.cloudinary.com/cloud/raw/upload/fl_attachment:filename/path
    
    const actualFilename = filename || getFileNameFromUrl(url);
    
    // Parse URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Tìm vị trí 'upload'
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex >= 0) {
      // Thêm transformation flag để force download
      pathParts.splice(uploadIndex + 1, 0, `fl_attachment:${actualFilename}`);
      
      urlObj.pathname = pathParts.join('/');
      return urlObj.toString();
    }
    
    return url;
  } catch (error) {
    console.error('Error creating download URL:', error);
    return url;
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
