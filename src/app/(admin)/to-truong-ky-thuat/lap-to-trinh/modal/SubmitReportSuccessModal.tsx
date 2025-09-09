"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, Send, FileText, Clock } from "lucide-react";

interface SubmitReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle?: string;
  title?: string;
}

export default function SubmitReportSuccessModal({
  isOpen,
  onClose,
  reportTitle = "Tờ trình thay thế thiết bị",
  title = "Nộp tờ trình thành công!",
}: SubmitReportSuccessModalProps) {
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
            <Send className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Tờ trình đã được gửi
            </span>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-800">
                {reportTitle}
              </span>
            </div>
            <div className="flex items-center justify-center text-xs text-green-700">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                Gửi lúc:{" "}
                {new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Tờ trình đã được gửi đến <strong>Phòng Quản trị</strong> để xem xét
            và phê duyệt. Bạn sẽ nhận được thông báo khi có phản hồi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            Hoàn thành
          </button>
        </div>

        {/* Auto close indicator */}
        <div className="mt-4">
          <p className="text-xs text-center text-gray-400">
            Tự động đóng sau 4 giây...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-green-600 h-1 rounded-full transition-all duration-[4000ms] ease-linear"
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
