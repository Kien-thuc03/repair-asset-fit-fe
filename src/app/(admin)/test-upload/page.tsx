'use client';

import { useState } from 'react';
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  validateImageFile,
  validateMultipleFiles,
  getMaxFileSizeText,
} from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [singleUrl, setSingleUrl] = useState('');
  const [multipleUrls, setMultipleUrls] = useState<string[]>([]);

  // Single file upload
  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'repair-asset/test');
      setSingleUrl(url);
      toast.success('Upload thành công!');
      console.log('Uploaded URL:', url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Multiple files upload
  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate
    const validation = validateMultipleFiles(files, 'image');
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadMultipleToCloudinary(files, 'repair-asset/test');
      setMultipleUrls(urls);
      toast.success(`Upload ${urls.length} ảnh thành công!`);
      console.log('Uploaded URLs:', urls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (url: string) => {
    try {
      const publicId = getPublicIdFromUrl(url);
      await deleteFromCloudinary(publicId);
      
      // Remove from state
      if (url === singleUrl) {
        setSingleUrl('');
      } else {
        setMultipleUrls(multipleUrls.filter(u => u !== url));
      }
      
      toast.success('Xóa ảnh thành công!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Test Upload Cloudinary</h1>

      {/* Upload Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8">
        <h2 className="font-semibold text-blue-900 mb-2">📋 Thông tin:</h2>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Backend: http://localhost:3001/upload</li>
          <li>✅ Max file size: {getMaxFileSizeText()}</li>
          <li>✅ Max files: 10 files</li>
          <li>✅ Allowed types: JPG, PNG, GIF, WebP, SVG</li>
        </ul>
      </div>

      {/* Single Upload */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Upload một ảnh</h2>
        
        <label className="block">
          <span className="sr-only">Chọn ảnh để upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleSingleUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
        </label>

        {uploading && (
          <p className="mt-2 text-sm text-gray-600">Đang upload...</p>
        )}

        {singleUrl && (
          <div className="mt-4">
            <p className="text-sm text-green-600 mb-2">✅ Upload thành công!</p>
            <div className="relative group">
              <Image
                src={singleUrl}
                alt="Uploaded"
                width={500}
                height={300}
                className="max-w-md rounded border"
              />
              <button
                onClick={() => handleDelete(singleUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm
                  opacity-0 group-hover:opacity-100 transition"
              >
                Xóa
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 break-all">{singleUrl}</p>
          </div>
        )}
      </div>

      {/* Multiple Upload */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">2. Upload nhiều ảnh (max 10)</h2>
        
        <label className="block">
          <span className="sr-only">Chọn nhiều ảnh để upload</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
              disabled:opacity-50"
          />
        </label>

        {uploading && (
          <p className="mt-2 text-sm text-gray-600">Đang upload...</p>
        )}

        {multipleUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-green-600 mb-3">
              ✅ Upload {multipleUrls.length} ảnh thành công!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {multipleUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <Image
                    src={url}
                    alt={`Image ${idx + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded border"
                  />
                  <button
                    onClick={() => handleDelete(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs
                      opacity-0 group-hover:opacity-100 transition"
                  >
                    Xóa
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {url.split('/').pop()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">📝 Hướng dẫn test:</h3>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Đảm bảo Backend đang chạy: <code>pnpm run start:dev</code></li>
          <li>Đã cấu hình Cloudinary credentials trong BE <code>.env</code></li>
          <li>Chọn ảnh để upload (max 5MB)</li>
          <li>Kiểm tra ảnh hiển thị và có thể xóa</li>
          <li>Mở Console để xem URLs</li>
        </ol>
      </div>
    </div>
  );
}
