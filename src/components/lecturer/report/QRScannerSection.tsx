import React from "react";
import { QrCode, Camera } from "lucide-react";

interface QRScannerSectionProps {
  isMobile: boolean;
  onQRScan: () => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({
  isMobile,
  onQRScan,
}) => {
  if (!isMobile) return null;

  return (
    <div className="bg-blue-50 shadow rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <QrCode className="w-5 h-5 mr-2 text-blue-600" />
          Quét mã QR thiết bị
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Quét mã QR trên thiết bị để tự động điền thông tin
        </p>
        <button
          type="button"
          onClick={onQRScan}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center">
          <Camera className="w-4 h-4 mr-2" />
          Mở máy ảnh quét QR
        </button>
      </div>
    </div>
  );
};

export default QRScannerSection;
