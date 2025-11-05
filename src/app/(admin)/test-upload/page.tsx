'use client';

import { useState } from 'react';
import FileUpload from '@/components/common/FileUpload';
import { getMaxFileSizeText } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TestUploadPage() {
  const [singleImageUrls, setSingleImageUrls] = useState<string[]>([]);
  const [multipleImageUrls, setMultipleImageUrls] = useState<string[]>([]);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [mixedUrls, setMixedUrls] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Test Upload Cloudinary</h1>
        <p className="text-gray-600">
          Test đầy đủ các tính năng upload file với component FileUpload
        </p>
      </div>

      {/* Upload Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📋</span>
          Thông tin hệ thống Upload
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <strong className="text-gray-800">Backend URL:</strong>
                <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                  http://localhost:3001/upload
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <strong className="text-gray-800">Max file size:</strong>
                <span className="ml-2 text-blue-700">{getMaxFileSizeText()}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <strong className="text-gray-800">Max files:</strong>
                <span className="ml-2 text-blue-700">10 files/lần</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <strong className="text-gray-800">Image types:</strong>
                <span className="ml-2 text-blue-700">JPG, PNG, GIF, WebP, SVG</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <strong className="text-gray-800">Document types:</strong>
                <span className="ml-2 text-blue-700">PDF, DOC, DOCX, XLS, XLSX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* 1. Single Image Upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🖼️</span>
            <div>
              <h2 className="text-lg font-semibold">Test 1: Upload một ảnh</h2>
              <p className="text-sm text-gray-600">Single image upload với preview</p>
            </div>
          </div>
          
          <FileUpload
            multiple={false}
            label="Chọn một ảnh để upload"
            folder="repair-asset/test/single"
            onUploadSuccess={(urls) => {
              setSingleImageUrls(urls);
              console.log('Single image URL:', urls[0]);
            }}
            onUploadError={(error) => {
              console.error('Upload error:', error);
            }}
            acceptType="image"
            showPreview={true}
          />

          {singleImageUrls.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800 font-medium mb-1">✅ Upload thành công!</p>
              <p className="text-xs text-gray-600 break-all">{singleImageUrls[0]}</p>
            </div>
          )}
        </div>

        {/* 2. Multiple Images Upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📸</span>
            <div>
              <h2 className="text-lg font-semibold">Test 2: Upload nhiều ảnh</h2>
              <p className="text-sm text-gray-600">Multiple images (max 5 ảnh)</p>
            </div>
          </div>
          
          <FileUpload
            multiple={true}
            maxFiles={5}
            label="Chọn nhiều ảnh (tối đa 5)"
            folder="repair-asset/test/multiple"
            onUploadSuccess={(urls) => {
              setMultipleImageUrls(urls);
              console.log('Multiple image URLs:', urls);
              toast.success(`Upload ${urls.length} ảnh thành công!`);
            }}
            acceptType="image"
            showPreview={true}
          />

          {multipleImageUrls.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800 font-medium">
                ✅ Đã upload {multipleImageUrls.length} ảnh
              </p>
            </div>
          )}
        </div>

        {/* 3. Document Upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📄</span>
            <div>
              <h2 className="text-lg font-semibold">Test 3: Upload tài liệu</h2>
              <p className="text-sm text-gray-600">PDF, Word, Excel files</p>
            </div>
          </div>
          
          <FileUpload
            multiple={true}
            maxFiles={3}
            label="Chọn tài liệu (PDF, DOC, XLS)"
            folder="repair-asset/test/documents"
            onUploadSuccess={(urls) => {
              setDocumentUrls(urls);
              console.log('Document URLs:', urls);
              toast.success(`Upload ${urls.length} tài liệu thành công!`);
            }}
            acceptType="document"
            showPreview={false}
          />

          {documentUrls.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-green-800 font-medium">
                ✅ Đã upload {documentUrls.length} tài liệu:
              </p>
              {documentUrls.map((url, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded text-xs break-all">
                  {idx + 1}. {url.split('/').pop()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Mixed Files Upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📦</span>
            <div>
              <h2 className="text-lg font-semibold">Test 4: Upload tất cả loại file</h2>
              <p className="text-sm text-gray-600">Images + Documents</p>
            </div>
          </div>
          
          <FileUpload
            multiple={true}
            maxFiles={10}
            label="Chọn bất kỳ file nào (ảnh hoặc tài liệu)"
            folder="repair-asset/test/mixed"
            onUploadSuccess={(urls) => {
              setMixedUrls(urls);
              console.log('Mixed file URLs:', urls);
              toast.success(`Upload ${urls.length} file thành công!`);
            }}
            acceptType="all"
            showPreview={true}
          />

          {mixedUrls.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800 font-medium">
                ✅ Đã upload {mixedUrls.length} file
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📝</span>
          Hướng dẫn test
        </h3>
        <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
          <li>
            <strong>Khởi động Backend:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
              cd repair-asset-fit-be && pnpm run start:dev
            </code>
          </li>
          <li>
            <strong>Kiểm tra Cloudinary credentials</strong> trong BE <code className="bg-white px-2 py-1 rounded">.env</code>:
            <ul className="ml-6 mt-1 space-y-1 list-disc">
              <li><code>CLOUDINARY_CLOUD_NAME</code> - Tên cloud từ dashboard</li>
              <li><code>CLOUDINARY_API_KEY</code> - API key</li>
              <li><code>CLOUDINARY_API_SECRET</code> - API secret</li>
            </ul>
          </li>
          <li>Chọn file để upload (chú ý giới hạn 5MB/file)</li>
          <li>Nhấn nút <strong>&quot;Upload&quot;</strong> và đợi kết quả</li>
          <li>Kiểm tra preview ảnh và có thể xóa bằng nút <strong>&quot;Xóa&quot;</strong></li>
          <li>Mở <strong>Console</strong> (F12) để xem URLs đầy đủ</li>
          <li>Kiểm tra Cloudinary Dashboard để xem file đã upload</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          Nếu gặp lỗi
        </h3>
        <ul className="text-sm text-red-800 space-y-2">
          <li>
            <strong>401 Unauthorized:</strong> Kiểm tra lại Cloudinary credentials trong BE <code>.env</code>
          </li>
          <li>
            <strong>File too large:</strong> Giảm kích thước file xuống dưới 5MB
          </li>
          <li>
            <strong>Network error:</strong> Đảm bảo Backend đang chạy tại <code>http://localhost:3001</code>
          </li>
          <li>
            <strong>CORS error:</strong> Kiểm tra cấu hình CORS trong Backend
          </li>
        </ul>
        <div className="mt-3 p-3 bg-white rounded border border-red-300">
          <p className="text-xs font-mono text-gray-700">
            📚 Xem hướng dẫn chi tiết: <code>docs/FIX_CLOUDINARY_ERROR.md</code>
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {(singleImageUrls.length > 0 || multipleImageUrls.length > 0 || documentUrls.length > 0 || mixedUrls.length > 0) && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Thống kê Upload
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded border border-green-200">
              <div className="text-2xl font-bold text-blue-600">{singleImageUrls.length}</div>
              <div className="text-xs text-gray-600">Single Image</div>
            </div>
            <div className="p-3 bg-white rounded border border-green-200">
              <div className="text-2xl font-bold text-purple-600">{multipleImageUrls.length}</div>
              <div className="text-xs text-gray-600">Multiple Images</div>
            </div>
            <div className="p-3 bg-white rounded border border-green-200">
              <div className="text-2xl font-bold text-orange-600">{documentUrls.length}</div>
              <div className="text-xs text-gray-600">Documents</div>
            </div>
            <div className="p-3 bg-white rounded border border-green-200">
              <div className="text-2xl font-bold text-green-600">{mixedUrls.length}</div>
              <div className="text-xs text-gray-600">Mixed Files</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-green-300">
            <div className="text-center">
              <span className="text-lg font-bold text-green-700">
                {singleImageUrls.length + multipleImageUrls.length + documentUrls.length + mixedUrls.length}
              </span>
              <span className="text-sm text-gray-600 ml-2">tổng số file đã upload thành công</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
