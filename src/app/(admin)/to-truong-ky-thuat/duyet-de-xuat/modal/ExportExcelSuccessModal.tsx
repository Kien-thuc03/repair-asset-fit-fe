"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, Download, FileSpreadsheet } from "lucide-react";

interface ExportExcelSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportCount: number;
  title?: string;
}

export default function ExportExcelSuccessModal({
  isOpen,
  onClose,
  exportCount,
  title = "Xuất Excel thành công!",
}: ExportExcelSuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 200);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}>
      <div
        className={`relative p-6 mx-4 w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              File Excel đã được tạo
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center mb-2">
              <Download className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-800">
                {exportCount} bản ghi
              </span>
            </div>
            <p className="text-xs text-blue-700">
              File đã được tải về thư mục Downloads của bạn
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Bạn có thể mở file Excel để xem chi tiết thông tin các đề xuất thay
            thế.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Đóng
          </button>
        </div>

        {/* Auto close indicator */}
        <div className="mt-4">
          <p className="text-xs text-center text-gray-400">
            Tự động đóng sau 4 giây...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-[4000ms] ease-linear"
              style={{
                width: isVisible ? "0%" : "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
