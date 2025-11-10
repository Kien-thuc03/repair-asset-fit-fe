import { FileText, Calendar, MapPin, FileCheck } from "lucide-react";

interface InspectionInfoProps {
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  relatedReportUrl?: string; // URL tờ trình
  verificationReportUrl?: string; // URL biên bản
  inspectionDate: string;
  department: string;
}

export default function InspectionInfo({
  reportNumber,
  title,
  relatedReportTitle,
  relatedReportUrl,
  verificationReportUrl,
  inspectionDate,
  department,
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
              <a
                href={relatedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 bg-blue-50 px-3 py-2 rounded flex items-center justify-between group">
                <span className="truncate">
                  {getFileNameFromUrl(relatedReportUrl)}
                </span>
                <FileCheck className="h-4 w-4 ml-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
              </a>
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
              <a
                href={verificationReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-800 mt-1 bg-green-50 px-3 py-2 rounded flex items-center justify-between group">
                <span className="truncate">
                  {getFileNameFromUrl(verificationReportUrl)}
                </span>
                <FileCheck className="h-4 w-4 ml-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
              </a>
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
