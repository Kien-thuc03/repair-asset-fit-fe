import { Signature } from "lucide-react";

interface ActionPanelProps {
  status: string;
  onSignReport: () => void;
  onGoBack: () => void;
}

export default function ActionPanel({
  status,
  onSignReport,
  onGoBack,
}: ActionPanelProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Thao tác</h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          {status === "pending" && (
            <button
              onClick={onSignReport}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <Signature className="h-4 w-4 mr-2 inline" />
              Ký xác nhận
            </button>
          )}
         
          <button
            onClick={onGoBack}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
