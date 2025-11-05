# Upload File với Cloudinary - Hướng dẫn đầy đủ

## ✅ Đã thiết lập xong

Hệ thống upload file đã được thiết lập hoàn chỉnh với kiến trúc **Backend xử lý upload**.

### **Luồng hoạt động:**
```
Frontend (React/Next.js) 
    ↓ (gửi file qua FormData)
Backend (NestJS)
    ↓ (upload lên Cloudinary)
Cloudinary Cloud Storage
    ↓ (trả về URL)
Backend → Frontend
```

---

## 📦 **Backend Setup**

### **1. Packages đã cài đặt:**
- ✅ `cloudinary@2.8.0` - SDK Cloudinary
- ✅ `streamifier@0.1.1` - Xử lý buffer stream
- ✅ `@types/streamifier` - TypeScript types

### **2. Cấu hình môi trường (.env):**
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**⚠️ QUAN TRỌNG:** Bạn cần lấy thông tin này từ tài khoản Cloudinary của mình:
1. Đăng nhập vào [https://cloudinary.com/](https://cloudinary.com/)
2. Vào Dashboard
3. Copy các giá trị: Cloud Name, API Key, API Secret
4. Paste vào file `.env` của Backend

### **3. Module Structure:**
```
src/modules/upload/
├── dto/
│   └── upload-response.dto.ts      # Response DTOs
├── interfaces/
│   └── cloudinary.interface.ts     # TypeScript interfaces
├── upload.controller.ts            # REST API endpoints
├── upload.service.ts               # Upload logic
└── upload.module.ts                # NestJS module
```

### **4. API Endpoints:**

#### **POST /upload** - Upload một file
```typescript
// Request: multipart/form-data
{
  file: File,           // Required
  folder: "repair-asset/repairs" // Optional
}

// Response:
{
  success: true,
  url: "https://res.cloudinary.com/...",
  publicId: "repair-asset/repairs/abc123"
}
```

#### **POST /upload/multiple** - Upload nhiều files
```typescript
// Request: multipart/form-data
{
  files: File[],        // Required (max 10 files)
  folder: "repair-asset/repairs" // Optional
}

// Response:
{
  success: true,
  urls: ["https://...", "https://..."],
  publicIds: ["repair-asset/...", "repair-asset/..."]
}
```

#### **DELETE /upload?publicId=xxx** - Xóa file
```typescript
// Request: Query parameter
?publicId=repair-asset/repairs/abc123

// Response:
{
  success: true,
  result: "ok"
}
```

---

## 💻 **Frontend Setup**

### **1. API Helper (`src/lib/api/upload.ts`):**

Functions đã được tạo sẵn:
- `uploadFile(file, folder)` - Upload một file
- `uploadMultipleFiles(files, folder)` - Upload nhiều files
- `deleteFile(publicId)` - Xóa file
- `getPublicIdFromUrl(url)` - Extract public ID từ URL

### **2. Cloudinary Utils (`src/lib/utils/cloudinary.client.ts`):**

Wrapper functions tiện dụng:
- `uploadToCloudinary(file, folder)` - Upload và trả về URL
- `uploadMultipleToCloudinary(files, folder)` - Upload nhiều và trả về URLs
- `deleteFromCloudinary(publicId)` - Xóa file
- `getPublicIdFromUrl(url)` - Get public ID
- `formatFileSize(bytes)` - Format file size
- `getMaxFileSize()` - Get max size (5MB)
- `getMaxFileSizeText()` - Get "5 MB" text

### **3. Validation Utils (`src/lib/utils/cloudinary.validation.ts`):**

- `validateImageFile(file)` - Validate file ảnh
- `validateDocumentFile(file)` - Validate file tài liệu
- `validateFile(file, type)` - Validate universal
- `validateMultipleFiles(files, type)` - Validate nhiều files
- `useFileValidation()` - React hook helper

### **4. Config Constants (`src/lib/utils/cloudinary.config.ts`):**

```typescript
CLOUDINARY_CONFIG.MAX_FILE_SIZE        // 5MB in bytes
CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES  // JPG, PNG, GIF, WebP, SVG
CLOUDINARY_CONFIG.ALLOWED_DOCUMENT_TYPES // PDF, DOC, DOCX, XLS, XLSX
CLOUDINARY_CONFIG.FOLDERS.REPAIRS      // "repair-asset/repairs"
CLOUDINARY_CONFIG.FOLDERS.ASSETS       // "repair-asset/assets"
```

---

## 🚀 **Cách sử dụng trong Frontend**

### **Example 1: Upload ảnh đơn giản**

```typescript
'use client';

import { useState } from 'react';
import { uploadToCloudinary, validateImageFile } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SimpleUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file trước
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'repair-asset/repairs');
      setImageUrl(url);
      toast.success('Upload thành công!');
      
      // TODO: Lưu URL vào database qua API
      console.log('Uploaded URL:', url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Đang upload...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### **Example 2: Upload nhiều ảnh**

```typescript
'use client';

import { useState } from 'react';
import { uploadMultipleToCloudinary, validateMultipleFiles } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MultipleUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate tất cả files
    const validation = validateMultipleFiles(files, 'image');
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadMultipleToCloudinary(files, 'repair-asset/repairs');
      setImageUrls(urls);
      toast.success(`Upload ${urls.length} ảnh thành công!`);
      
      // TODO: Lưu URLs vào database
      console.log('Uploaded URLs:', urls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Đang upload {imageUrls.length} files...</p>}
      <div className="grid grid-cols-3 gap-2">
        {imageUrls.map((url, idx) => (
          <img key={idx} src={url} alt={`Image ${idx}`} />
        ))}
      </div>
    </div>
  );
}
```

### **Example 3: Tích hợp với Repair Request Form**

```typescript
'use client';

import { useState } from 'react';
import { createRepairRequest } from '@/lib/api/repairs';
import { uploadMultipleToCloudinary, validateMultipleFiles } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RepairRequestForm() {
  const [formData, setFormData] = useState({
    computerAssetId: '',
    description: '',
    errorType: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validation = validateMultipleFiles(files, 'image');
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }
    
    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload ảnh lên Cloudinary
      let mediaUrls: string[] = [];
      if (selectedFiles.length > 0) {
        toast.loading('Đang upload ảnh...');
        mediaUrls = await uploadMultipleToCloudinary(
          selectedFiles,
          'repair-asset/repairs'
        );
        toast.dismiss();
      }

      // 2. Tạo repair request với URLs
      await createRepairRequest({
        ...formData,
        mediaUrls, // Gửi URLs đã upload
      });

      toast.success('Tạo yêu cầu sửa chữa thành công!');
      // Reset form...
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
      
      <div>
        <label>Upload ảnh minh họa</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        <p className="text-sm text-gray-500">
          Tối đa 10 ảnh, mỗi ảnh không quá 5MB
        </p>
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Đang xử lý...' : 'Tạo yêu cầu'}
      </button>
    </form>
  );
}
```

### **Example 4: Xóa ảnh**

```typescript
import { deleteFromCloudinary, getPublicIdFromUrl } from '@/lib/utils';

async function handleDeleteImage(imageUrl: string) {
  try {
    const publicId = getPublicIdFromUrl(imageUrl);
    await deleteFromCloudinary(publicId);
    
    toast.success('Xóa ảnh thành công!');
    // TODO: Xóa URL khỏi database
  } catch (error) {
    toast.error('Xóa ảnh thất bại!');
  }
}
```

---

## 📋 **Checklist trước khi test**

### **Backend:**
- [x] Đã cài đặt packages: `cloudinary`, `streamifier`
- [ ] **ĐÃ CẤU HÌNH** Cloudinary credentials trong `.env`
- [x] Upload module đã được import vào `AppModule`
- [x] Backend đang chạy trên port 3001

### **Frontend:**
- [x] API helper đã được tạo
- [x] Utils đã được cập nhật để gọi BE
- [ ] Frontend đang chạy trên port 3003

### **Test Upload:**
1. Mở Swagger: http://localhost:3001/api/docs
2. Tìm section "Upload"
3. Test endpoint POST /upload với một file ảnh
4. Kiểm tra response trả về URL Cloudinary

---

## 🔧 **Troubleshooting**

### **Lỗi: "CLOUDINARY_CLOUD_NAME is not defined"**
→ Chưa cấu hình Cloudinary trong `.env` của Backend

### **Lỗi: "File vượt quá giới hạn 5MB"**
→ File quá lớn, cần resize hoặc compress trước khi upload

### **Lỗi: "Upload failed" từ Frontend**
→ Kiểm tra:
- Backend có đang chạy không?
- API endpoint có đúng không? (http://localhost:3001/upload)
- CORS đã được cấu hình cho port 3003 chưa?

### **Lỗi: "No file provided"**
→ FormData không được gửi đúng, kiểm tra input field name="file"

---

## 📚 **API Documentation**

Sau khi Backend chạy, truy cập Swagger để xem full API docs:
**http://localhost:3001/api/docs**

Tìm section **"Upload"** để test trực tiếp các endpoints.

---

## ✨ **Next Steps**

1. **Cấu hình Cloudinary credentials** trong Backend `.env`
2. **Khởi động Backend**: `cd repair-asset-fit-be && pnpm run start:dev`
3. **Test upload** qua Swagger UI
4. **Tích hợp** vào các forms trong Frontend (Repairs, Assets, etc.)
5. **Thêm preview** ảnh trước khi upload
6. **Thêm progress bar** cho upload

---

**🎉 Setup hoàn tất! Bắt đầu upload file lên Cloudinary thôi!**
