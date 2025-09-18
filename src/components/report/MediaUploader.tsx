import React from "react";
import { Camera } from "lucide-react";

interface MediaUploaderProps {
  mediaFiles: File[];
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaFiles,
  onMediaChange,
  onRemoveFile,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bước 6: Đính kèm hình ảnh/video minh họa (tùy chọn)
      </label>
      <p className="mb-3 text-sm text-gray-500">
        Hình ảnh hoặc video sẽ giúp kỹ thuật viên hiểu rõ hơn về tình trạng lỗi
        và xử lý chính xác hơn
      </p>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click để upload</span> hoặc kéo
              thả
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, MP4 (MAX. 10MB mỗi file)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={onMediaChange}
            className="hidden"
          />
        </label>
      </div>

      {mediaFiles.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-3">
            Đã chọn {mediaFiles.length} file
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mediaFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              const fileUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  {/* Preview Content */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={() => URL.revokeObjectURL(fileUrl)}
                      />
                    ) : isVideo ? (
                      <video
                        src={fileUrl}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        onLoadedMetadata={() => URL.revokeObjectURL(fileUrl)}>
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-xs text-center">
                          File không hỗ trợ preview
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File Info & Remove Button */}
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(index)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Overlay for file type indicator */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isImage
                          ? "bg-green-100 text-green-800"
                          : isVideo
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {isImage ? "🖼️ Ảnh" : isVideo ? "🎥 Video" : "📄 File"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
