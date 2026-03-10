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

      // Wait for DOM element to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if element exists
      const element = document.getElementById(qrCodeRegionId);
      if (!element) {
        throw new Error(`Element with id "${qrCodeRegionId}" not found`);
      }

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
          try {
            // Try to parse JSON data from QR code
            const qrData = JSON.parse(decodedText);
            // Check if it's a valid repair request QR code
            // Only check type and computerId, ignore timestamp for permanent usage
            if (qrData.type === "REPAIR_REQUEST" && qrData.computerId) {
              // Validate computerId format
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (uuidRegex.test(qrData.computerId)) {
                message.success("Quét mã QR thiết bị thành công!");
                onScanSuccess(decodedText); // Pass original JSON text to callback
              } else {
                message.warning("Mã ID thiết bị không hợp lệ!");

                return;
              }
            } else {
              message.warning("Mã QR không phải của thiết bị trong hệ thống!");

              return;
            }
          } catch (error) {
            // If not JSON, treat as plain text (maybe old format)
            // Clean the text (remove whitespace, newlines)
            const cleanText = decodedText.trim();

            // Check if it looks like a UUID (computerId)
            const uuidRegex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (uuidRegex.test(cleanText)) {
              message.success("Quét mã QR thiết bị thành công!");
              // Create JSON format for plain UUID
              const jsonData = {
                type: "REPAIR_REQUEST",
                computerId: cleanText,
                timestamp: new Date().toISOString(),
              };
              onScanSuccess(JSON.stringify(jsonData));
            } else {
              message.warning(
                "Mã QR không hợp lệ! Vui lòng quét mã QR của thiết bị."
              );
              return; // Don't close scanner for invalid codes
            }
          }

          stopScanner();
          onClose();
        },
        (errorMessage) => {
          // Error callback - ignore common QR scan errors
          // These are normal when no QR code is in frame
        }
      );
    } catch (err) {
      console.error("❌ Failed to start scanner:", err);

      let errorMessage =
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera trong cài đặt trình duyệt.";

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes("Permission denied")) {
          errorMessage =
            "Bạn chưa cấp quyền camera. Vui lòng nhấn 'Cho phép' khi trình duyệt hỏi.";
        } else if (err.message.includes("NotFoundError")) {
          errorMessage =
            "Không tìm thấy camera. Vui lòng kết nối camera và thử lại.";
        } else if (err.message.includes("NotAllowedError")) {
          errorMessage =
            "Quyền camera bị từ chối. Vui lòng bật quyền camera trong cài đặt trình duyệt.";
        }
      }

      setErrorMsg(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        // Check if scanner is running before stopping
        const state = await scannerRef.current.getState();
        if (state === 2) {
          // SCANNING state
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        // Only log if it's not the common "not running" error
        const errorMessage = (err as Error)?.message || String(err);
        // Ignore common stop errors (scanner already stopped)
        // Still clean up even if stop failed
        scannerRef.current = null;
        setIsScanning(false);
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
      destroyOnHidden>
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
              <strong>Điện thoại:</strong> Vào Settings → Chrome/Safari → Camera
              → Allow
            </li>
            <li>Nếu đã từ chối, nhấn biểu tượng khóa trên thanh địa chỉ</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
