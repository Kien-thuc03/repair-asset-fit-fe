"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, FileSpreadsheet } from "lucide-react";

interface ExportExcelErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ExportExcelErrorModal({
  isOpen,
  onClose,
  title = "Không thể xuất Excel",
  message = "Không có dữ liệu để xuất ra file Excel.",
}: ExportExcelErrorModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 200);
      }, 3000);
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

        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Xuất Excel thất bại
            </span>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-orange-800">{message}</p>
          </div>

          <p className="text-sm text-gray-600">
            Vui lòng thử lại sau khi có dữ liệu hoặc kiểm tra lại bộ lọc tìm
            kiếm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
            Đóng
          </button>
        </div>

        {/* Auto close indicator */}
        <div className="mt-4">
          <p className="text-xs text-center text-gray-400">
            Tự động đóng sau 3 giây...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-orange-600 h-1 rounded-full transition-all duration-[3000ms] ease-linear"
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
