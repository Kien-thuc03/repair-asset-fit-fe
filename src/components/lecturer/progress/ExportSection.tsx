"use client";

import ExcelExportButton from "@/components/common/ExcelExportButton";

interface ExportSectionProps {
  totalCount: number;
  selectedCount: number;
  onExport: () => void;
}

export default function ExportSection({
  totalCount,
  selectedCount,
  onExport,
}: ExportSectionProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">
        Danh sách yêu cầu ({totalCount} tổng)
      </h3>

      <ExcelExportButton
        totalCount={totalCount}
        selectedCount={selectedCount}
        onExport={onExport}
      />
    </div>
  );
}
