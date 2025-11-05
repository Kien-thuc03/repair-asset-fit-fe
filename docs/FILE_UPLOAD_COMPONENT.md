# 📤 Hướng dẫn sử dụng FileUpload Component

## 🎯 Component đã tạo sẵn

Component `FileUpload` tái sử dụng được cho nhiều mục đích upload file.

**Vị trí:** `src/components/common/FileUpload.tsx`

---

## 🚀 Cách sử dụng

### **1. Upload một ảnh đơn giản**

```typescript
import FileUpload from '@/components/common/FileUpload';

export default function MyForm() {
  const [imageUrl, setImageUrl] = useState('');

  const handleUploadSuccess = (urls: string[]) => {
    setImageUrl(urls[0]); // Lấy URL đầu tiên
    console.log('Uploaded:', urls[0]);
  };

  return (
    <FileUpload
      label="Upload ảnh"
      folder="repair-asset/my-folder"
      onUploadSuccess={handleUploadSuccess}
      showPreview={true}
    />
  );
}
```

---

### **2. Upload nhiều ảnh (Repair Request)**

```typescript
import FileUpload from '@/components/common/FileUpload';
import { createRepairRequest } from '@/lib/api/repairs';

export default function RepairRequestForm() {
  const [formData, setFormData] = useState({
    computerAssetId: '',
    description: '',
  });
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const handleUploadSuccess = (urls: string[]) => {
    setMediaUrls(urls);
  };

  const handleSubmit = async () => {
    // Tạo repair request với mediaUrls
    await createRepairRequest({
      ...formData,
      mediaUrls, // URLs từ Cloudinary
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
      
      <FileUpload
        multiple={true}
        maxFiles={5}
        label="Upload ảnh minh họa lỗi"
        folder="repair-asset/repairs"
        onUploadSuccess={handleUploadSuccess}
        acceptType="image"
        showPreview={true}
      />

      <button type="submit">Gửi yêu cầu</button>
    </form>
  );
}
```

---

### **3. Upload với URLs có sẵn (Edit mode)**

```typescript
import FileUpload from '@/components/common/FileUpload';

export default function EditForm() {
  const [existingUrls] = useState([
    'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
    'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
  ]);

  return (
    <FileUpload
      multiple={true}
      label="Ảnh tài sản"
      folder="repair-asset/assets"
      initialUrls={existingUrls}
      onUploadSuccess={(urls) => {
        console.log('All URLs:', urls);
      }}
    />
  );
}
```

---

### **4. Upload document (PDF, Word, Excel)**

```typescript
import FileUpload from '@/components/common/FileUpload';

export default function DocumentUpload() {
  return (
    <FileUpload
      label="Upload tài liệu"
      folder="repair-asset/documents"
      acceptType="document"
      onUploadSuccess={(urls) => {
        console.log('Document URLs:', urls);
      }}
    />
  );
}
```

---

## 📋 **Props của FileUpload**

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `multiple` | `boolean` | `false` | Cho phép upload nhiều files |
| `maxFiles` | `number` | `10` | Số lượng files tối đa (khi multiple=true) |
| `folder` | `string` | `'repair-asset'` | Thư mục lưu trên Cloudinary |
| `onUploadSuccess` | `(urls: string[]) => void` | - | Callback khi upload thành công |
| `onUploadError` | `(error: string) => void` | - | Callback khi có lỗi |
| `acceptType` | `'image' \| 'document' \| 'all'` | `'image'` | Loại file cho phép |
| `label` | `string` | `'Upload files'` | Label hiển thị |
| `showPreview` | `boolean` | `true` | Hiển thị preview ảnh |
| `initialUrls` | `string[]` | `[]` | URLs ảnh có sẵn |

---

## 🎨 **Tính năng**

✅ Upload single/multiple files
✅ Validation tự động (file size, file type)
✅ Preview ảnh sau khi upload
✅ Xóa ảnh đã upload
✅ Toast notifications
✅ Loading state
✅ Support image & document types
✅ Tái sử dụng được

---

## 💡 **Ví dụ thực tế: Repair Request Form**

```typescript
'use client';

import { useState } from 'react';
import FileUpload from '@/components/common/FileUpload';
import { createRepairRequest } from '@/lib/api/repairs';
import toast from 'react-hot-toast';

export default function RepairRequestPage() {
  const [formData, setFormData] = useState({
    computerAssetId: '',
    errorType: '',
    description: '',
  });
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.computerAssetId || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);

    try {
      await createRepairRequest({
        ...formData,
        mediaUrls, // Ảnh từ Cloudinary
      });

      toast.success('Tạo yêu cầu sửa chữa thành công!');
      
      // Reset form
      setFormData({
        computerAssetId: '',
        errorType: '',
        description: '',
      });
      setMediaUrls([]);

    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo yêu cầu sửa chữa</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Computer Asset */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Máy tính
          </label>
          <input
            type="text"
            value={formData.computerAssetId}
            onChange={(e) => setFormData({...formData, computerAssetId: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Chọn máy tính..."
          />
        </div>

        {/* Error Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Loại lỗi
          </label>
          <select
            value={formData.errorType}
            onChange={(e) => setFormData({...formData, errorType: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Chọn loại lỗi...</option>
            <option value="MAY_KHONG_KHOI_DONG">Máy không khởi động</option>
            <option value="MAY_HU_PHAN_MEM">Máy hư phần mềm</option>
            <option value="MAY_HU_PHAN_CUNG">Máy hư phần cứng</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
            placeholder="Mô tả tình trạng lỗi..."
          />
        </div>

        {/* File Upload */}
        <FileUpload
          multiple={true}
          maxFiles={5}
          label="Upload ảnh minh họa lỗi (tối đa 5 ảnh)"
          folder="repair-asset/repairs"
          onUploadSuccess={(urls) => setMediaUrls(urls)}
          acceptType="image"
          showPreview={true}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            font-medium"
        >
          {submitting ? 'Đang gửi...' : 'Tạo yêu cầu sửa chữa'}
        </button>
      </form>
    </div>
  );
}
```

---

## ✨ **Component sẵn sàng sử dụng!**

Bạn có thể import và dùng ngay `<FileUpload />` vào bất kỳ form nào cần upload file!
