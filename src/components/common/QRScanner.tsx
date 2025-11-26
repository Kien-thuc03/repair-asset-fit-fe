"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, Button, message } from "antd";
import { CloseOutlined, CameraOutlined } from "@ant-design/icons";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({
  open,
  onClose,
  onScanSuccess,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    if (open && !isScanning) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startScanner = async () => {
    try {
      setErrorMsg("");
      setIsScanning(true);

      // Initialize scanner
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      // Request camera permission and start scanning
      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera on mobile
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // QR box size
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback when QR code is scanned
          console.log("✅ QR Code scanned:", decodedText);
          message.success("Quét mã QR thành công!");
          onScanSuccess(decodedText);
          stopScanner();
          onClose();
        },
        () => {
          // Error callback (can be ignored for common errors during scanning)
        }
      );
    } catch (err) {
      console.error("❌ Failed to start scanner:", err);
      setErrorMsg(
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera trong cài đặt trình duyệt."
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("❌ Failed to stop scanner:", err);
      }
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CameraOutlined className="text-blue-500" />
          <span>Quét mã QR trên thiết bị</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="close" icon={<CloseOutlined />} onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      width={400}
      centered
      destroyOnClose>
      <div className="py-4">
        {/* Scanner Region */}
        <div
          id={qrCodeRegionId}
          className="w-full border-2 border-dashed border-blue-300 rounded-lg overflow-hidden bg-black"
          style={{ minHeight: "300px" }}
        />

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            📱 Hướng dẫn quét QR:
          </p>
          <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>Đưa camera vào mã QR trên thiết bị</li>
            <li>Giữ camera ổn định và tránh rung lắc</li>
            <li>Đảm bảo ánh sáng đủ để quét mã</li>
            <li>Mã QR sẽ tự động được nhận diện</li>
          </ul>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">⚠️ {errorMsg}</p>
            <Button
              type="link"
              size="small"
              onClick={startScanner}
              className="p-0 mt-2 text-blue-600">
              Thử lại
            </Button>
          </div>
        )}

        {/* Camera Access Guide */}
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>🔐 Cấp quyền camera:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>
              <strong>Laptop:</strong> Nhấn &quot;Cho phép&quot; khi trình duyệt
              hỏi
            </li>
            <li>
              <strong>Điện thoại:</strong> Vào Settings → Chrome/Safari →
              Camera → Allow
            </li>
            <li>Nếu đã từ chối, nhấn biểu tượng khóa trên thanh địa chỉ</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
