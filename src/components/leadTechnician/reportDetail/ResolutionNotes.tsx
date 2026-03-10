import { Edit3 } from "lucide-react";
import { RepairRequest } from "@/types";

interface ResolutionNotesProps {
  request: RepairRequest;
}

export default function ResolutionNotes({ request }: ResolutionNotesProps) {
  if (!request.resolutionNotes) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Edit3 className="h-5 w-5 mr-2" />
          Ghi chú xử lý
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-900 leading-relaxed">
            {request.resolutionNotes}
          </p>
        </div>
      </div>
    </div>
  );
}
