import DeviceQRCodeGenerator from "@/components/qr/DeviceQRCodeGenerator";

export default function ToTruongMaQRThietBiPage() {
  return (
    <DeviceQRCodeGenerator
      homeHref="/to-truong-ky-thuat"
      homeLabel="Trang chủ"
      breadcrumbLabel="Mã QR thiết bị"
      pageTitle="Tạo mã QR cho thiết bị"
      pageSubtitle="Tạo mã QR để gắn lên thiết bị, hỗ trợ báo lỗi và tra cứu nhanh"
    />
  );
}

