"use client";

import { useState, useEffect } from "react";
import { XCircle, X, RefreshCw } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export default function ErrorModal({
  isOpen,
  onClose,
  onRetry,
  title = "Có lỗi xảy ra!",
  message = "Đã xảy ra lỗi trong quá trình gửi báo cáo. Vui lòng thử lại sau.",
  showRetry = true,
}: ErrorModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Delay để animation có thể chạy
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleRetry = () => {
    handleClose();
    if (onRetry) {
      onRetry();
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

        {/* Error Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-center text-gray-600 mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Đóng
          </button>
          {showRetry && (
            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
