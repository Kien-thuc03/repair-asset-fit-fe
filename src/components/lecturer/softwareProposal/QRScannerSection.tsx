import React from "react";
import { Button } from "antd";
import { QrCode, Smartphone } from "lucide-react";

interface QRScannerSectionProps {
  isMobile: boolean;
  onQRScan: () => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({
  isMobile,
  onQRScan,
}) => {
  return (
    <>
      {isMobile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  Quét mã QR trên máy tính
                </h3>
                <p className="text-sm text-blue-700">
                  Quét mã QR để tự động điền thông tin máy tính
                </p>
              </div>
            </div>
            <Button
              type="primary"
              icon={<Smartphone className="w-4 h-4" />}
              onClick={onQRScan}
              className="bg-blue-600 hover:bg-blue-700">
              Quét QR
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScannerSection;
