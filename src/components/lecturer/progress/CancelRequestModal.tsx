"use client";

import { Trash2 } from "lucide-react";

interface CancelRequestModalProps {
  isOpen: boolean;
  requestCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelRequestModal({
  isOpen,
  requestCode,
  onClose,
  onConfirm,
}: CancelRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
            Xác nhận hủy yêu cầu
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn hủy yêu cầu sửa chữa này không? Hành động
              này không thể hoàn tác.
            </p>
            <p className="text-sm text-gray-700 font-medium mt-2">
              Mã yêu cầu: {requestCode}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
