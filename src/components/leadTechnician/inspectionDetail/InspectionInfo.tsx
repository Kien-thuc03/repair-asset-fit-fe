import { FileText, Calendar, MapPin, Download, Eye } from "lucide-react";

interface InspectionInfoProps {
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  relatedReportUrl?: string; // URL tờ trình
  verificationReportUrl?: string; // URL biên bản
  inspectionDate: string;
  department: string;
  onPreviewSubmission?: () => void; // Callback để mở modal preview tờ trình
  onPreviewInspection?: () => void; // Callback để mở modal preview biên bản
}

export default function InspectionInfo({
  reportNumber,
  title,
  relatedReportTitle,
  relatedReportUrl,
  verificationReportUrl,
  inspectionDate,
  department,
  onPreviewSubmission,
  onPreviewInspection,
}: InspectionInfoProps) {
  // Helper function to extract filename from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      // Decode URL encoding (e.g., %20 to space)
      return decodeURIComponent(filename);
    } catch {
      return url;
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetch the file from URL
      const response = await fetch(url);
      const blob = await response.blob();

      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Thông tin biên bản
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số biên bản
            </label>
            <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-3 py-2 rounded">
              {reportNumber}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề biên bản
            </label>
            <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
              {title}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Tờ trình liên quan
            </label>
            {relatedReportUrl ? (
              <div className="mt-1 bg-blue-50 px-3 py-2 rounded flex items-center justify-between group">
                <span className="text-sm text-blue-600 truncate">
                  {getFileNameFromUrl(relatedReportUrl)}
                </span>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      handleDownload(
                        relatedReportUrl,
                        getFileNameFromUrl(relatedReportUrl)
                      )
                    }
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Tải xuống">
                    <Download className="h-4 w-4 text-blue-600" />
                  </button>
                  {onPreviewSubmission && (
                    <button
                      onClick={onPreviewSubmission}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Xem trước">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
                {relatedReportTitle}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Biên bản liên quan
            </label>
            {verificationReportUrl ? (
              <div className="mt-1 bg-green-50 px-3 py-2 rounded flex items-center justify-between group">
                <span className="text-sm text-green-600 truncate">
                  {getFileNameFromUrl(verificationReportUrl)}
                </span>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      handleDownload(
                        verificationReportUrl,
                        getFileNameFromUrl(verificationReportUrl)
                      )
                    }
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Tải xuống">
                    <Download className="h-4 w-4 text-green-600" />
                  </button>
                  {onPreviewInspection && (
                    <button
                      onClick={onPreviewInspection}
                      className="p-1 hover:bg-green-100 rounded transition-colors"
                      title="Xem trước">
                      <Eye className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1 bg-gray-50 px-3 py-2 rounded italic">
                Chưa có biên bản
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kiểm tra
            </label>
            <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">
                {new Date(inspectionDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phòng ban
            </label>
            <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{department}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
