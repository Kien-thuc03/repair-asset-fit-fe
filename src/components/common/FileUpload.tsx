'use client';

import { useState } from 'react';
import { uploadToCloudinary, uploadMultipleToCloudinary, validateImageFile, validateMultipleFiles } from '@/lib/utils';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FileUploadProps {
  /** Cho phép upload nhiều files */
  multiple?: boolean;
  /** Số lượng files tối đa (chỉ khi multiple=true) */
  maxFiles?: number;
  /** Thư mục lưu trữ trên Cloudinary */
  folder?: string;
  /** Callback khi upload thành công với URLs */
  onUploadSuccess?: (urls: string[]) => void;
  /** Callback khi có lỗi */
  onUploadError?: (error: string) => void;
  /** Loại file cho phép: 'image' | 'document' | 'all' */
  acceptType?: 'image' | 'document' | 'all';
  /** Label cho input */
  label?: string;
  /** Show preview ảnh */
  showPreview?: boolean;
  /** URLs ảnh có sẵn (để hiển thị) */
  initialUrls?: string[];
}

export default function FileUpload({
  multiple = false,
  maxFiles = 10,
  folder = 'repair-asset',
  onUploadSuccess,
  onUploadError,
  acceptType = 'image',
  label = 'Upload files',
  showPreview = true,
  initialUrls = [],
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Xác định accept attribute
  const getAcceptAttribute = () => {
    if (acceptType === 'image') return 'image/*';
    if (acceptType === 'document') return '.pdf,.doc,.docx,.xls,.xlsx';
    return '*/*';
  };

  // Xử lý khi chọn file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Kiểm tra số lượng files
    if (multiple && files.length > maxFiles) {
      toast.error(`Chỉ được upload tối đa ${maxFiles} files`);
      return;
    }

    // Validate files
    const validation = multiple 
      ? validateMultipleFiles(files, acceptType === 'all' ? 'image' : acceptType)
      : validateImageFile(files[0]);

    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setSelectedFiles(files);
  };

  // Xử lý upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn file để upload');
      return;
    }

    setUploading(true);

    try {
      let urls: string[];

      if (multiple) {
        // Upload nhiều files
        urls = await uploadMultipleToCloudinary(selectedFiles, folder);
        toast.success(`Upload ${urls.length} file thành công!`);
      } else {
        // Upload 1 file
        const url = await uploadToCloudinary(selectedFiles[0], folder);
        urls = [url];
        toast.success('Upload thành công!');
      }

      setUploadedUrls([...uploadedUrls, ...urls]);
      setSelectedFiles([]);

      // Callback
      if (onUploadSuccess) {
        onUploadSuccess(urls);
      }

      // Reset input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  // Xóa ảnh đã upload
  const handleRemove = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(newUrls);
    
    if (onUploadSuccess) {
      onUploadSuccess(newUrls);
    }
  };

  // Xóa file đã chọn (chưa upload)
  const handleRemoveSelected = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* File Input */}
      <div className="flex gap-2">
        <input
          title='Chọn file để upload'
          id="file-upload"
          type="file"
          accept={getAcceptAttribute()}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              text-sm font-medium whitespace-nowrap"
          >
            {uploading ? 'Đang upload...' : 'Upload'}
          </button>
        )}
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500">
        {multiple ? `Tối đa ${maxFiles} files, ` : 'Tối đa 1 file, '}
        mỗi file không quá 5MB
      </p>

      {/* Preview files đã chọn (chưa upload) */}
      {selectedFiles.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            Đã chọn {selectedFiles.length} file:
          </p>
          <div className="space-y-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">{file.name}</span>
                <button
                  onClick={() => handleRemoveSelected(idx)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview ảnh đã upload */}
      {showPreview && uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Đã upload ({uploadedUrls.length}):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                {acceptType === 'image' || url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <Image
                    src={url}
                    alt={`Upload ${idx + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center px-2">
                      {url.split('/').pop()?.substring(0, 20)}...
                    </p>
                  </div>
                )}
                
                {/* Delete button */}
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                    opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
