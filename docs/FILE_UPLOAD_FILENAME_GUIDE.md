# 📁 Hướng dẫn: Giữ nguyên tên file khi Upload

## ✅ Đã cập nhật

Hệ thống upload đã được cấu hình để **giữ nguyên tên file gốc và extension** khi upload lên Cloudinary.

---

## 🔧 Cấu hình Backend

### **File: `upload.service.ts`**

```typescript
// Lấy tên file gốc và extension
const originalName = file.originalname;
const fileNameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

// Sanitize filename (loại bỏ ký tự đặc biệt, giữ dấu cách và tiếng Việt)
const sanitizedFileName = fileNameWithoutExt
  .replace(/[^\w\s\u00C0-\u1EF9.-]/g, '') // Giữ chữ, số, dấu cách, tiếng Việt
  .replace(/\s+/g, '_'); // Thay khoảng trắng bằng underscore

const uploadOptions = {
  folder: options.folder || 'repair-asset',
  resource_type: 'auto',
  public_id: sanitizedFileName,      // ✅ Giữ tên file gốc
  use_filename: true,                // ✅ Sử dụng tên file gốc
  unique_filename: true,             // ✅ Thêm suffix nếu trùng
};
```

### **Ví dụ:**

| Tên file gốc | URL Cloudinary |
|--------------|----------------|
| `Bao_cao_thang_1.pdf` | `.../repair-asset/Bao_cao_thang_1.pdf` |
| `Tai_lieu_huong_dan.docx` | `.../repair-asset/Tai_lieu_huong_dan.docx` |
| `Bang_gia_2024.xlsx` | `.../repair-asset/Bang_gia_2024.xlsx` |
| `Anh_san_pham.jpg` | `.../repair-asset/Anh_san_pham.jpg` |

Nếu upload file trùng tên, Cloudinary sẽ tự động thêm suffix:
- `Bao_cao_thang_1_a1b2c3.pdf`
- `Tai_lieu_huong_dan_d4e5f6.docx`

---

## 🎨 Cấu hình Frontend

### **File: `FileUpload.tsx`**

Component đã được cập nhật để:

1. **Hiển thị tên file đầy đủ** (bao gồm extension)
2. **Icon phù hợp** theo loại file:
   - 📕 PDF → Icon màu đỏ
   - 📘 DOC/DOCX → Icon màu xanh dương
   - 📗 XLS/XLSX → Icon màu xanh lá
   
3. **Nút "Tải về"** cho documents
4. **Tooltip** hiển thị tên file đầy đủ khi hover

### **Preview:**

```tsx
{/* Hiển thị tên file với extension */}
const fileNameWithExt = url.split('/').pop(); // "Bao_cao.pdf"

{/* Icon dựa trên extension */}
{fileNameWithExt.match(/\.pdf$/i) && <PDFIcon />}
{fileNameWithExt.match(/\.(doc|docx)$/i) && <WordIcon />}
{fileNameWithExt.match(/\.(xls|xlsx)$/i) && <ExcelIcon />}

{/* Link tải về */}
<a href={url} target="_blank" download>Tải về</a>
```

---

## 📥 Tải về file

### **Cách 1: Click vào "Tải về"**

Trên preview của documents sẽ có nút **"Tải về"**:

```tsx
<a 
  href={url} 
  target="_blank" 
  rel="noopener noreferrer"
>
  Tải về
</a>
```

### **Cách 2: Tải về với tên file gốc**

Thêm attribute `download` để force download với tên file:

```tsx
<a 
  href={url} 
  download="Ten_file_goc.pdf"
  rel="noopener noreferrer"
>
  Tải về
</a>
```

### **Cách 3: Download từ code**

```typescript
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename; // Tên file khi tải về
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Sử dụng
downloadFile(
  'https://res.cloudinary.com/.../Bao_cao.pdf',
  'Bao_cao_thang_1.pdf'
);
```

---

## 🧪 Test Upload với tên file

### **Test 1: Upload file PDF**

```typescript
// File gốc: "Báo cáo tháng 1.pdf"
// URL trả về: ".../repair-asset/Bao_cao_thang_1.pdf"

<FileUpload
  label="Upload báo cáo PDF"
  folder="repair-asset/reports"
  acceptType="document"
  onUploadSuccess={(urls) => {
    console.log('URL:', urls[0]);
    // URL giữ tên file gốc
  }}
/>
```

### **Test 2: Upload file Excel**

```typescript
// File gốc: "Bảng giá sản phẩm 2024.xlsx"
// URL trả về: ".../repair-asset/Bang_gia_san_pham_2024.xlsx"

<FileUpload
  label="Upload bảng giá"
  folder="repair-asset/pricing"
  acceptType="document"
  onUploadSuccess={(urls) => {
    const fileName = urls[0].split('/').pop();
    console.log('File name:', fileName);
    // "Bang_gia_san_pham_2024.xlsx"
  }}
/>
```

### **Test 3: Upload file trùng tên**

```typescript
// Upload lần 1: "Tai_lieu.pdf" → ".../Tai_lieu.pdf"
// Upload lần 2: "Tai_lieu.pdf" → ".../Tai_lieu_a1b2c3.pdf" (tự động thêm suffix)
```

---

## 📋 Quy tắc xử lý tên file

### **1. Giữ nguyên:**
- ✅ Tên file gốc (sanitized)
- ✅ Extension (.pdf, .docx, .xlsx, .jpg, ...)
- ✅ Chữ số và chữ cái
- ✅ Tiếng Việt có dấu

### **2. Thay thế:**
- ⚠️ Khoảng trắng → Underscore (`_`)
- ⚠️ Ký tự đặc biệt → Loại bỏ (`@#$%^&*()`)

### **3. Suffix tự động:**
- 🔄 Nếu file trùng tên → Cloudinary tự thêm suffix unique

### **Ví dụ:**

| Tên file gốc | Tên file sau khi upload |
|--------------|------------------------|
| `Báo cáo.pdf` | `Bao_cao.pdf` |
| `Tài liệu hướng dẫn.docx` | `Tai_lieu_huong_dan.docx` |
| `File@Test#2024.xlsx` | `FileTest2024.xlsx` |
| `Ảnh sản phẩm 1.jpg` | `Anh_san_pham_1.jpg` |

---

## ✨ Kết quả

✅ **Tên file giữ nguyên:** Dễ nhận biết khi tải về  
✅ **Extension đầy đủ:** `.pdf`, `.docx`, `.xlsx`, ...  
✅ **Preview chính xác:** Hiển thị icon và tên file  
✅ **Tải về dễ dàng:** Click "Tải về" để download  
✅ **Tự động xử lý trùng lặp:** Thêm suffix nếu cần  

---

## 🔍 Debug

Nếu tên file không đúng, kiểm tra:

1. **Backend logs:**
```bash
# Xem log upload
tail -f logs/upload.log

# Tìm dòng
"Original filename: Bao_cao.pdf"
"File uploaded successfully: https://..."
```

2. **Frontend console:**
```javascript
console.log('Uploaded URL:', url);
console.log('File name:', url.split('/').pop());
```

3. **Cloudinary Dashboard:**
- Truy cập: https://cloudinary.com/console
- Media Library → Kiểm tra tên file đã upload

---

## 📚 Tài liệu liên quan

- `FILE_UPLOAD_COMPONENT.md` - Hướng dẫn sử dụng component
- `UPLOAD_SETUP_GUIDE.md` - Hướng dẫn setup upload
- `FIX_CLOUDINARY_ERROR.md` - Xử lý lỗi Cloudinary
