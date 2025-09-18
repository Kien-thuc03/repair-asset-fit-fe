"use client";

import { FileText } from "lucide-react";

interface ResolutionNotesProps {
  resolutionNotes?: string;
}

export default function ResolutionNotes({
  resolutionNotes,
}: ResolutionNotesProps) {
  // Don't render if no resolution notes
  if (!resolutionNotes || resolutionNotes.trim() === "") {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Ghi chú xử lý</h3>
      </div>
      <div className="p-6">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-gray-900">{resolutionNotes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
