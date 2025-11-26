import { Signature, Clock } from "lucide-react";

interface SignatureInfoProps {
  leaderSignature?: string;
  leaderSignedAt?: string;
}

export default function SignatureInfo({
  leaderSignature,
  leaderSignedAt,
}: SignatureInfoProps) {
  if (!leaderSignature) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Signature className="h-5 w-5 mr-2" />
          Thông tin ký duyệt
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Người ký
            </label>
            <p className="text-sm text-gray-900 mt-1">{leaderSignature}</p>
          </div>
          {leaderSignedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thời gian ký
              </label>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {(() => {
                    const signedDate = new Date(leaderSignedAt);
                    const now = new Date();
                    // Lấy ngày tháng năm từ leaderSignedAt
                    const dateStr = signedDate.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                    // Lấy giờ phút giây từ thời gian thực tế (hiện tại)
                    const timeStr = now.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    return `${dateStr} ${timeStr}`;
                  })()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
