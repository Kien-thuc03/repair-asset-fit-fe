import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
