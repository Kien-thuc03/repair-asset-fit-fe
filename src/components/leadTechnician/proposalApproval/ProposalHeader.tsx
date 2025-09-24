import { ExcelExportButton } from "@/components/common";

interface ProposalHeaderProps {
  totalCount: number;
  selectedCount: number;
  onExportExcel: () => void;
}

export default function ProposalHeader({
  totalCount,
  selectedCount,
  onExportExcel,
}: ProposalHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Duyệt đề xuất thay thế
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {totalCount} đề xuất
            {selectedCount > 0 && ` • Đã chọn: ${selectedCount}`}
          </p>
        </div>
        <ExcelExportButton
          totalCount={totalCount}
          selectedCount={selectedCount}
          onExport={onExportExcel}
          variant="primary"
          size="md"
        />
      </div>
    </div>
  );
}
