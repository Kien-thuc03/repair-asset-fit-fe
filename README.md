# Repair Asset Management - FIT IUH

Hệ thống Quản lý Sửa chữa Tài sản dành cho Khoa Công nghệ Thông tin - Đại học Công nghiệp TP.HCM.

## Tính năng

- Quản lý yêu cầu sửa chữa tài sản
- Phân công nhiệm vụ sửa chữa
- Theo dõi tiến độ sửa chữa
- Thống kê báo cáo

## Công nghệ

- Next.js 15
- React 19
- TypeScript
- TanStack Query
- Tailwind CSS 4
- React Hook Form
- Axios

## Cài đặt và Chạy dự án

### Yêu cầu

- Node.js 18.17.0 hoặc mới hơn
- npm 9.0.0 hoặc mới hơn

### Các bước cài đặt

1. Clone dự án:
   ```bash
   git clone https://github.com/Kien-thuc03/repair-asset-fit-fe.git
   cd repair-asset-fit-fe
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Chạy dự án ở chế độ phát triển:
   ```bash
   npm run dev
   ```

4. Truy cập ứng dụng tại: http://localhost:3003

### Xây dựng cho môi trường production

```bash
npm run build
npm start
```

## Sử dụng Docker

Dự án có thể được chạy trong Docker container:

```bash
docker-compose up -d
```

## Tích hợp với Asset Management

Dự án này được thiết kế để có thể tích hợp với hệ thống Asset Management của IUH.
