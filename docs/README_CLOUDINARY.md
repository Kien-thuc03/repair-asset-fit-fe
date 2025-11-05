# Cloudinary Utility - Hướng dẫn sử dụng

## ⚠️ Giới hạn quan trọng

- **Kích thước file tối đa**: 5MB mỗi file
- **Áp dụng cho**: Tất cả các loại file (ảnh, tài liệu, video, etc.)
- **Xử lý lỗi**: Nếu file vượt quá 5MB, hệ thống sẽ throw error với thông báo rõ ràng

## Cấu hình

### 1. Tạo tài khoản Cloudinary

1. Truy cập [https://cloudinary.com/](https://cloudinary.com/)
2. Đăng ký tài khoản miễn phí
3. Lấy thông tin:
   - Cloud Name
   - API Key
   - API Secret

### 2. Cấu hình biến môi trường

Thêm các biến sau vào file `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Lưu ý**: `CLOUDINARY_API_SECRET` không nên expose ra client side, chỉ sử dụng trong server components hoặc API routes.

## Các hàm có sẵn

### 1. `uploadToCloudinary(file, folder?)`

Upload một file lên Cloudinary với kiểm tra kích thước tự động.

**Parameters:**
- `file`: File object hoặc base64 string
- `folder`: Tên thư mục lưu trữ (mặc định: 'repair-asset')

**Returns:** URL của file đã upload

**Throws:** Error nếu file vượt quá 5MB

**Ví dụ:**

```typescript
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

// Upload từ File input với error handling
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const url = await uploadToCloudinary(file, 'assets/images');
    console.log('Uploaded URL:', url);
  } catch (error) {
    if (error instanceof Error) {
      // Hiển thị thông báo lỗi cụ thể (VD: file quá lớn)
      alert(error.message);
    }
    console.error('Upload failed:', error);
  }
};

// Upload từ base64
const base64Image = 'data:image/png;base64,iVBORw0KG...';
const url = await uploadToCloudinary(base64Image, 'assets/avatars');
```

### 2. `uploadMultipleToCloudinary(files, folder?)`

Upload nhiều files cùng lúc.

**Parameters:**
- `files`: Mảng File objects hoặc base64 strings
- `folder`: Tên thư mục lưu trữ

**Returns:** Mảng URLs của các files đã upload

**Ví dụ:**

```typescript
import { uploadMultipleToCloudinary } from '@/lib/utils/cloudinary';

const handleMultipleUpload = async (files: File[]) => {
  try {
    const urls = await uploadMultipleToCloudinary(files, 'assets/gallery');
    console.log('Uploaded URLs:', urls);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. `uploadImageWithOptions(file, options?)`

Upload ảnh với các tùy chọn resize, crop, quality và kiểm tra kích thước tự động.

**Parameters:**
- `file`: File object hoặc base64 string
- `options`:
  - `folder`: Thư mục lưu trữ
  - `width`: Chiều rộng ảnh
  - `height`: Chiều cao ảnh
  - `crop`: Kiểu crop ('fill', 'fit', 'scale', etc.)
  - `quality`: Chất lượng ảnh (0-100)

**Returns:** URL của ảnh đã upload

**Throws:** Error nếu file vượt quá 5MB

**Ví dụ:**

```typescript
import { uploadImageWithOptions } from '@/lib/utils/cloudinary';

try {
  const url = await uploadImageWithOptions(file, {
    folder: 'assets/thumbnails',
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 80,
  });
  console.log('Uploaded:', url);
} catch (error) {
  if (error instanceof Error) {
    alert(error.message);
  }
}
```

### 4. `formatFileSize(bytes)`

Format kích thước file sang định dạng dễ đọc.

**Parameters:**
- `bytes`: Kích thước file tính bằng bytes

**Returns:** Chuỗi định dạng (VD: "2.5 MB", "500 KB")

**Ví dụ:**

```typescript
import { formatFileSize } from '@/lib/utils/cloudinary';

const file = document.querySelector('input[type="file"]').files[0];
console.log(`File size: ${formatFileSize(file.size)}`);
// Output: "File size: 2.3 MB"
```

### 5. `getMaxFileSize()`

Lấy giới hạn kích thước file tối đa.

**Returns:** Kích thước tối đa tính bằng bytes (5242880 = 5MB)

**Ví dụ:**

```typescript
import { getMaxFileSize } from '@/lib/utils/cloudinary';

const maxSize = getMaxFileSize();
console.log(`Max allowed: ${maxSize} bytes`);
```

### 6. `getMaxFileSizeText()`

Lấy giới hạn kích thước file tối đa dạng text.

**Returns:** Chuỗi mô tả giới hạn (VD: "5 MB")

**Ví dụ:**

```typescript
import { getMaxFileSizeText } from '@/lib/utils/cloudinary';

const maxSizeText = getMaxFileSizeText();
// Hiển thị cho user: "Giới hạn: 5 MB"
```

### 7. `deleteFromCloudinary(publicId)`

### 7. `deleteFromCloudinary(publicId)`

Xóa file từ Cloudinary.

**Parameters:**
- `publicId`: Public ID của file cần xóa

**Returns:** Kết quả xóa

**Ví dụ:**

```typescript
import { deleteFromCloudinary, getPublicIdFromUrl } from '@/lib/utils/cloudinary';

const imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1234/assets/sample.jpg';
const publicId = getPublicIdFromUrl(imageUrl);

const result = await deleteFromCloudinary(publicId);
console.log('Delete result:', result);
```

### 8. `getPublicIdFromUrl(url)`

Lấy public ID từ Cloudinary URL.

**Parameters:**
- `url`: URL của file trên Cloudinary

**Returns:** Public ID của file

## Ví dụ sử dụng trong Component

### Upload Avatar với validation

```typescript
'use client';

import { useState } from 'react';
import {
  uploadToCloudinary,
  getMaxFileSizeText,
  formatFileSize,
} from '@/lib/utils/cloudinary';

export default function AvatarUpload() {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    
    try {
      const url = await uploadToCloudinary(file, 'users/avatars');
      setAvatarUrl(url);
      // Lưu URL vào database hoặc state
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Upload thất bại!';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Giới hạn: {getMaxFileSizeText()}
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Đang upload...</p>}
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
      {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
    </div>
  );
}
```

### Validation phía Client trước khi upload

```typescript
'use client';

import { useState } from 'react';
import {
  uploadToCloudinary,
  getMaxFileSize,
  formatFileSize,
} from '@/lib/utils/cloudinary';

export default function SmartUpload() {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước trước khi upload
    const maxSize = getMaxFileSize();
    if (file.size > maxSize) {
      alert(
        `File "${file.name}" (${formatFileSize(file.size)}) vượt quá giới hạn ${formatFileSize(maxSize)}`
      );
      return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      alert('Chỉ cho phép upload ảnh!');
      return;
    }

    try {
      const url = await uploadToCloudinary(file, 'uploads');
      console.log('Uploaded:', url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileSelect}
    />
  );
}
```

### Upload trong API Route (Server Side)

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const url = await uploadToCloudinary(file, 'uploads');

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

## Lưu ý bảo mật

1. **API Secret**: Không bao giờ expose `CLOUDINARY_API_SECRET` ra client side
2. **Upload preset**: Nên sử dụng unsigned upload preset cho client-side upload
3. **Validation**: Luôn validate file type và size trước khi upload
4. **Rate limiting**: Thiết lập rate limiting cho API upload endpoint
5. **Giới hạn kích thước**: Hệ thống tự động reject files > 5MB

## Best Practices

### 1. Kiểm tra kích thước trước khi upload

```typescript
import { getMaxFileSize, formatFileSize } from '@/lib/utils/cloudinary';

const validateFile = (file: File): boolean => {
  const maxSize = getMaxFileSize();
  
  if (file.size > maxSize) {
    alert(`File quá lớn! Tối đa ${formatFileSize(maxSize)}`);
    return false;
  }
  
  return true;
};
```

### 2. Hiển thị progress cho user

```typescript
const [progress, setProgress] = useState(0);

const handleUpload = async (file: File) => {
  setProgress(10); // Bắt đầu
  
  try {
    setProgress(50); // Đang upload
    const url = await uploadToCloudinary(file);
    setProgress(100); // Hoàn thành
    
    return url;
  } catch (error) {
    setProgress(0); // Reset khi lỗi
    throw error;
  }
};
```

### 3. Xử lý lỗi một cách user-friendly

```typescript
const handleUpload = async (file: File) => {
  try {
    const url = await uploadToCloudinary(file);
    return url;
  } catch (error) {
    if (error instanceof Error) {
      // Hiển thị thông báo lỗi cụ thể
      if (error.message.includes('vượt quá giới hạn')) {
        toast.error('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB');
      } else {
        toast.error('Upload thất bại. Vui lòng thử lại');
      }
    }
    return null;
  }
};
```

## Validation Utilities

### Sử dụng validation trước khi upload

```typescript
import {
  validateImageFile,
  validateDocumentFile,
  validateFile,
} from '@/lib/utils/cloudinary.validation';

// Validate ảnh
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateImageFile(file);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  // File hợp lệ, tiếp tục upload
  uploadToCloudinary(file);
};

// Validate document
const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateDocumentFile(file);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  uploadToCloudinary(file);
};

// Validate universal (tự động detect)
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateFile(file, 'all'); // 'image' | 'document' | 'all'
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  uploadToCloudinary(file);
};
```

### Sử dụng useFileValidation helper

```typescript
import { useFileValidation } from '@/lib/utils/cloudinary.validation';

export default function UploadComponent() {
  const {
    validateImageFile,
    maxFileSizeText,
    allowedImageTypes,
  } = useFileValidation();

  const handleUpload = (file: File) => {
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Upload file
  };

  return (
    <div>
      <p>Giới hạn: {maxFileSizeText}</p>
      <p>Định dạng: {allowedImageTypes.join(', ')}</p>
      {/* Upload UI */}
    </div>
  );
}
```

## Constants và Config

### Sử dụng CLOUDINARY_CONFIG

```typescript
import { CLOUDINARY_CONFIG } from '@/lib/utils/cloudinary.config';

// Sử dụng các constants
console.log('Max size:', CLOUDINARY_CONFIG.MAX_FILE_SIZE_MB, 'MB');
console.log('Folders:', CLOUDINARY_CONFIG.FOLDERS.AVATARS);

// Upload vào folder cụ thể
uploadToCloudinary(file, CLOUDINARY_CONFIG.FOLDERS.DOCUMENTS);
```

## Tài liệu tham khảo

- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Cloudinary Transformation](https://cloudinary.com/documentation/image_transformations)
